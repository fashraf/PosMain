

# Fix: Branch and Role Not Displayed on User Edit

## Root Cause

The `user_roles` table is **empty** — no admin role has been assigned despite previous migration attempts. This causes a chain of failures:

1. RLS on `user_roles` only allows admins or the user themselves to read rows
2. RLS on `user_branches` has the same restriction
3. When loading the edit form, queries for roles and branches return empty results
4. When saving, writes to these tables are also blocked

## Fix

### 1. Database Migration (Critical)
Insert the Admin role for user `222d0e7a-8f79-4b75-a858-676b59886c25` with role ID `ce3de3f2-aa33-480f-81f3-634583cdb3f0`:

```sql
INSERT INTO user_roles (user_id, role_id)
VALUES ('222d0e7a-8f79-4b75-a858-676b59886c25', 'ce3de3f2-aa33-480f-81f3-634583cdb3f0');
```

This is the same fix attempted before. If it fails silently due to a constraint, we will verify immediately after and investigate.

### 2. Add Verification Step
After the migration, query `user_roles` to confirm the row exists. If it doesn't, we may need to check for unique constraints or triggers that could be silently rejecting the insert.

### 3. No Code Changes Needed
The code in `UsersEdit.tsx` already correctly:
- Queries `user_roles` with `user_id` and `role_id` (line 35)
- Filters by `profile.user_id` in JS (line 52-54)
- Sets `role_id` and `branch_ids` into `initialData` (lines 70-71)

The only issue is the empty data returned due to missing admin permissions.

## Summary
| Step | Action |
|------|--------|
| 1 | Run migration to insert admin role assignment |
| 2 | Verify the row persisted in `user_roles` |
| 3 | Test: reload the edit page and confirm role/branches appear |

