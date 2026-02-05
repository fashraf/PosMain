

# Fix: Maintenance Tables Not Saving Data

## Problem Identified

The user `fhd.ashraf@gmail.com` has **no admin role** in the `user_roles` table, causing all maintenance table updates to fail silently.

### Root Cause Analysis

The network logs show:
- **PATCH request**: Sent `{"name_en":"Vegetarian1",...}` - returned **204 (success)**
- **GET after PATCH**: Data still shows `"name_en":"Vegetarian"` - unchanged!

This happens because:

1. **RLS Policy Issue**: All 9 maintenance tables use `is_admin(auth.uid())` for write operations
2. **Empty `user_roles` table**: Query returned `[]` - no users have any roles assigned
3. **Signup Flow Bug**: When signing up, the code tries to insert into `user_roles`:
   ```javascript
   await supabase.from('user_roles').insert({ user_id: data.user.id, role: 'admin' });
   ```
   But the RLS policy on `user_roles` requires `is_admin(auth.uid())` for INSERT - creating a **chicken-and-egg problem**:
   - You need to be admin to insert into `user_roles`
   - You need a row in `user_roles` to be admin

4. **Silent Failure**: The role insert error is only logged to console, never shown to the user

### Affected Tables (All 9 Maintenance Tables)

| Table | Status |
|-------|--------|
| `maintenance_categories` | Cannot INSERT/UPDATE/DELETE |
| `maintenance_subcategories` | Cannot INSERT/UPDATE/DELETE |
| `serving_times` | Cannot INSERT/UPDATE/DELETE |
| `allergens` | Cannot INSERT/UPDATE/DELETE |
| `item_types` | Cannot INSERT/UPDATE/DELETE |
| `classification_types` | Cannot INSERT/UPDATE/DELETE |
| `units` | Cannot INSERT/UPDATE/DELETE |
| `storage_types` | Cannot INSERT/UPDATE/DELETE |
| `ingredient_groups` | Cannot INSERT/UPDATE/DELETE |

---

## Solution

### Fix 1: Assign Admin Role to Existing User (Immediate Data Fix)

Run a database migration to insert the admin role for the existing user:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('222d0e7a-8f79-4b75-a858-676b59886c25', 'admin')
ON CONFLICT DO NOTHING;
```

### Fix 2: Update RLS Policy for First User Signup

The `user_roles` table needs a policy that allows the **first user** to self-assign admin, or uses a database trigger instead of client-side code.

**Option A - Database Trigger (Recommended)**:
Create a trigger on `auth.users` that automatically assigns admin role to the first user:

```sql
CREATE OR REPLACE FUNCTION public.assign_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first user (no existing roles)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles LIMIT 1) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_first_user_admin();
```

**Option B - Permissive First User Policy**:
Add a temporary RLS policy that allows insert when no admins exist:

```sql
CREATE POLICY "First user can self-assign admin"
ON public.user_roles
FOR INSERT
WITH CHECK (
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  AND user_id = auth.uid()
  AND role = 'admin'
);
```

### Fix 3: Better Error Handling in Signup

Update `Login.tsx` to show error to user instead of just console.log:

```typescript
if (roleError) {
  console.error('Role assignment error:', roleError);
  toast({
    title: "Role Assignment Failed",
    description: "Could not assign admin role. Please contact support.",
    variant: "destructive",
  });
}
```

---

## Implementation Steps

1. **Database Migration**: 
   - Insert admin role for existing user `222d0e7a-8f79-4b75-a858-676b59886c25`
   - Create trigger for automatic first-user admin assignment

2. **Code Update**:
   - Remove client-side role assignment from `Login.tsx` (handled by trigger)
   - Add proper error messaging for edge cases

3. **Verification**:
   - Confirm user has admin role
   - Test category update flow
   - Test all 9 maintenance pages

---

## Files to Modify

| File | Changes |
|------|---------|
| New migration | Insert admin role + create trigger |
| `src/pages/Login.tsx` | Remove client-side role insert (now handled by trigger), improve error messaging |

---

## Technical Details

### Why Supabase Returns 204 Without Actually Updating

PostgreSQL with RLS enabled will:
1. Apply the policy filter to the UPDATE statement
2. If policy evaluates to `false`, the WHERE clause matches 0 rows
3. UPDATE affects 0 rows - no error, just "nothing updated"
4. Supabase returns 204 (success with no content)

This is "working as designed" from Postgres perspective but misleading from UX perspective.

### Verification Query

After fix, run:
```sql
SELECT ur.user_id, p.full_name, ur.role 
FROM user_roles ur 
JOIN profiles p ON ur.user_id = p.user_id;
```

Expected result:
```
user_id                              | full_name     | role
222d0e7a-8f79-4b75-a858-676b59886c25 | Fahad Ashraf  | admin
```

