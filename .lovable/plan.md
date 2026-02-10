

# Fix Branches, Font Size, Layout & Compact Spacing

## Issues Identified

1. **Branches pages use mock/hardcoded data** -- `Branches.tsx`, `BranchesAdd.tsx`, and `BranchesEdit.tsx` all use local arrays instead of querying the database. The `branches` table in the database has columns: `id`, `name`, `address`, `is_active`, `created_at`, `updated_at`. The mock data uses a completely different schema (name_en/ar/ur, code, currency, VAT, etc.) that doesn't exist in the database.
2. **User form branch fetching** works correctly (`supabase.from("branches").select("id, name")`) but the branches table is empty because add/edit never saves to the database.
3. **Role form layout** needs Role Name (col-3), Description (col-5), and Active/Inactive (col-3) on one row, same height.
4. **Font size** needs to be 12px across all form labels, inputs, and text in both Role and User forms.
5. **Margins/padding** still too large in wrapper pages (`p-6`, `p-4`).

---

## Plan

### 1. Fix Branch Add/Edit to use the Database

**`src/pages/BranchesAdd.tsx`** -- Rewrite to save to the actual `branches` table via Supabase instead of mock `setTimeout`. Simplify form to match the real schema (`name`, `address`, `is_active`). Remove all mock currency/VAT/rounding fields that don't exist in the DB.

**`src/pages/BranchesEdit.tsx`** -- Rewrite to load branch by ID from Supabase, update via Supabase. Same simplified form.

**`src/pages/Branches.tsx`** -- Rewrite to fetch from Supabase (`branches` table) instead of using `initialBranches` array. Toggle status via Supabase update.

### 2. Role Form Layout -- Inline Row

**`src/components/roles/RoleFormPage.tsx`**:
- Put Role Name, Description, and Status on a single row using `grid grid-cols-12`:
  - Role Name: `col-span-3`
  - Description: `col-span-6` (use `Input` instead of `Textarea` so they're the same height)
  - Active/Inactive toggle: `col-span-3`
- All labels and inputs at `text-[12px]` / `text-xs` (12px)
- Color picker stays on its own row below
- Reduce all spacing: `space-y-1.5`, `gap-1`
- Page wrapper padding: `p-1` max

### 3. Font Size 12px Everywhere

**`src/components/roles/RoleFormPage.tsx`** and **`src/components/users/UserFormPage.tsx`**:
- Change all `text-xs` (which is already 12px in Tailwind) -- verify consistency
- Change any `text-[11px]`, `text-[10px]` labels to `text-xs` (12px)
- Input heights stay at `h-7` or `h-8` with `text-xs`

### 4. Remove Extra Margins

- `src/pages/RolesAdd.tsx`: Change `p-6` to `p-1`
- `src/pages/RolesEdit.tsx`: Change `p-6` to `p-1`  
- `src/pages/UsersAdd.tsx`: Change `p-4` to `p-1`
- `src/pages/UsersEdit.tsx`: Change `p-4` to `p-1`
- `RoleFormPage.tsx`: Change `space-y-3` to `space-y-1.5`, `pb-20` to `pb-12`
- `UserFormPage.tsx`: Verify `space-y-1.5` is consistent, reduce any remaining `gap-2` to `gap-1`

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Branches.tsx` | Rewrite: fetch from Supabase, toggle status via DB update |
| `src/pages/BranchesAdd.tsx` | Rewrite: save to `branches` table (name, address, is_active) |
| `src/pages/BranchesEdit.tsx` | Rewrite: load/update from `branches` table |
| `src/components/roles/RoleFormPage.tsx` | Inline row layout (col-3/col-6/col-3), font 12px, compact spacing |
| `src/components/users/UserFormPage.tsx` | Font 12px consistency, reduce remaining margins |
| `src/pages/RolesAdd.tsx` | Reduce padding to `p-1` |
| `src/pages/RolesEdit.tsx` | Reduce padding to `p-1` |
| `src/pages/UsersAdd.tsx` | Reduce padding to `p-1` |
| `src/pages/UsersEdit.tsx` | Reduce padding to `p-1` |

