

# User Management Grid + Form Save Fixes

## Problems Found

### Critical: No Admin Role Assigned
The database has **zero rows** in `user_roles`. The previous migration to assign the Admin role did not persist. Without Admin access, all writes to `user_roles` and `user_branches` are blocked by security policies. This must be fixed first.

### Grid Issues
1. **Profile image not showing**: The grid reads `avatar_url` (which is null), but images are stored in `profile_image`
2. **Missing columns**: Nationality and Employee Type not displayed
3. **No branch indicator**: Need a hover icon showing assigned branches
4. **Too much padding**: `p-6` in the page wrapper adds unnecessary margins
5. **No clear filters button**: Filters cannot be reset easily
6. **Grid header lacks icons and gradient**: Plain header style

### Save Issues (Add/Edit)
The role and branch saves fail silently because:
- RLS blocks writes to `user_roles` and `user_branches` without Admin access
- The error display in UsersEdit uses `String(error)` which produces `[object Object]`
- The `user_roles` query in UsersEdit line 35 has no `.eq("user_id", ...)` filter

---

## Changes

### 1. Database: Assign Admin Role (Migration)
```sql
INSERT INTO user_roles (user_id, role_id)
SELECT '222d0e7a-8f79-4b75-a858-676b59886c25', id FROM roles WHERE name = 'Admin'
ON CONFLICT DO NOTHING;
```

### 2. UserTable.tsx -- Major Grid Upgrade

**Add new data fields to UserData interface**:
- `profile_image: string | null` (for showing uploaded images)
- `emp_type_name: string | null` (resolved employee type name)
- `branch_names: string[]` (resolved branch names for tooltip)

**New columns** (replace Employee Code with Nationality, add Employee Type and Branches icon):
| # | User | Mobile | Nationality | Emp Type | Role | Branches | Status | Last Login | Actions |

**Grid header upgrade**:
- Light grey gradient background: `bg-gradient-to-r from-gray-100 via-white to-gray-100`
- Add small icons next to each column header (User, Phone, Globe, Briefcase, Shield, GitBranch, etc.)

**Profile image**: Use `profile_image` field (falling back to `avatar_url`) to show the user's photo in the name column

**Branch indicator column**: Show a `GitBranch` icon with the count. On hover, display a tooltip listing all branch names.

**Clear filters button**: Add an "X Clear" button that appears when any filter is active, resetting search, role, and status filters.

**Remove outer padding**: Change `p-6` to `p-2` in Users.tsx

### 3. Users.tsx -- Fetch Additional Data

**Resolve branch names**: Join `user_branches` with `branches` to get branch names per user.

**Resolve emp_type names**: Join profiles with `maintenance_emp_types` to get employee type names.

**Map `profile_image`**: Pass the `profile_image` field from profiles to the grid data.

### 4. UsersEdit.tsx -- Fix Save

**Fix user_roles query**: The query on line 35 fetches ALL user_roles without filtering. After loading the profile and getting `user_id`, filter the results properly. The current approach already filters in JS (line 52-54) but the query itself selects `role_id` without `user_id` column, so the `.find()` on line 52 checking `ur.user_id` always fails since `user_id` is not in the select.

Fix: Change line 35 from:
```typescript
supabase.from("user_roles").select("role_id")
```
to:
```typescript
supabase.from("user_roles").select("user_id, role_id")
```

**Fix error display**: Update catch block to extract `.message` from error objects.

### 5. UI Polish for UserFormPage.tsx

Minor improvements to make the form more appealing:
- Add subtle card shadows to section cards
- Improve the sticky footer with a slightly more prominent save button

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Users.tsx` | Reduce padding to `p-2`, fetch branch names and emp_type names, pass `profile_image` to UserData |
| `src/components/users/UserTable.tsx` | Add Nationality, Emp Type, Branches columns; gradient header with icons; profile image display; clear filters button; branch hover tooltip |
| `src/pages/UsersEdit.tsx` | Fix `user_roles` select to include `user_id`, fix error message extraction |

### Database Migration
Assign Admin role to the current user account so that save operations for roles and branches work.

### Grid Header Design
Each column header will have a small icon (14px) in muted color, followed by the label text. The header row uses a subtle gradient from light gray through white and back to light gray, matching the premium grid standards.

### Branch Tooltip
The Branches column shows a `GitBranch` icon with a count badge. On hover, a tooltip lists all assigned branch names in a vertical list.

