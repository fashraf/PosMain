
# Fix: Role and Branch Save for User Management

## Root Cause

There are two interrelated problems:

1. **Chicken-and-egg RLS deadlock**: The `user_roles` table is empty. The RLS policy on `user_roles` requires `is_admin(auth.uid())` for writes. Since nobody has a role, `is_admin()` returns false for everyone, so nobody can insert roles -- including making someone an admin. Previous data-insert attempts have not persisted.

2. **Silent failures in edit code**: The `UsersEdit.tsx` save handler (lines 109-119) performs delete+insert on `user_roles` and `user_branches` using the client-side connection (which enforces RLS), but **never checks for errors** on these operations. The profile update succeeds, but role and branch changes are silently rejected.

## Solution

### 1. Database Migration: Seed Admin Role
Use a schema migration (which runs with elevated privileges) to insert the admin role assignment. This breaks the chicken-and-egg cycle.

```sql
INSERT INTO user_roles (user_id, role_id)
VALUES (
  '222d0e7a-8f79-4b75-a858-676b59886c25',
  'ce3de3f2-aa33-480f-81f3-634583cdb3f0'
)
ON CONFLICT ON CONSTRAINT user_roles_user_role_unique DO NOTHING;
```

### 2. New Edge Function: `update-user`
Create a new backend function at `supabase/functions/update-user/index.ts` that mirrors the existing `create-user` pattern:
- Validates the caller is an admin (using service_role to check `user_roles`)
- Accepts `user_id`, profile fields, `role_id`, and `branch_ids`
- Uses service_role key to bypass RLS for updating `profiles`, `user_roles`, and `user_branches`
- Returns success/error response

This follows the same architecture as `create-user` and `reset-password`.

### 3. Update `UsersEdit.tsx`
Replace the direct Supabase client calls (lines 88-120) with a single call to the new `update-user` edge function:

```typescript
const { data: result, error } = await supabase.functions.invoke("update-user", {
  body: {
    user_id: userId,
    full_name: data.full_name,
    phone: data.phone || null,
    role_id: data.role_id,
    branch_ids: data.branch_ids,
    // ...all other profile fields
  },
});
```

This ensures role and branch saves go through the service_role path and errors are properly surfaced.

## Files to Create/Modify

| File | Action |
|------|--------|
| Database migration | Seed admin role for user 222d0e7a |
| `supabase/functions/update-user/index.ts` | New backend function for user updates |
| `src/pages/UsersEdit.tsx` | Replace direct DB calls with edge function call |

## Why Previous Fixes Failed

The "Change data" operations inserted rows, but those inserts did not persist because they ran through a read-only or session-scoped connection. A **schema migration** runs with superuser privileges and will persist the data correctly.
