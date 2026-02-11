

# User Form Page - Layout & Save Fixes

## Overview
Restructure the User Add/Edit form to match the reference design, fix save issues, and clean up the right column layout.

---

## Changes

### 1. Remove "Sections" navigation panel (right column)
Delete the sticky section navigation box (lines 496-514) that shows Profile / Identification / Employment / Role & Branches with checkmark indicators.

### 2. Remove "Changes will apply immediately" warning
Delete the amber Alert banner shown in edit mode (lines 210-217).

### 3. Restructure Right Column: Branch above Role (separate DashedSectionCards)

**Branch section** (its own DashedSectionCard):
- Title: "Branch"
- Replace the checkbox list with `SearchableMultiSelect` component (already exists)
- Maps branches to `{ id, label }` options
- Shows selected branches as dismissible badge tags with search

**Role section** (its own DashedSectionCard, below Branch):
- Title: "Role"
- Keep the existing Role dropdown (Select)
- Keep RoleBadge display and "Edit Role" link
- Keep RolePreviewPanel below

### 4. Employment & Access section - match reference layout

Restructure to a **3-column grid** matching the screenshot:
- Column 1: Employee Type (dropdown, unchanged)
- Column 2: Default Language (change from radio buttons to a **Select dropdown** with EN/AR/UR options)
- Column 3: Security sub-section inline -- show Lock icon + "SECURITY" label, "force change at next login" checkbox, and "Reset Password Now" button all in a compact horizontal layout

### 5. Fix profile_image not saving on Edit

In `UsersEdit.tsx` `handleSubmit`, the update object is missing `profile_image`. Add it:
```typescript
profile_image: data.profile_image || null,
```

### 6. Fix user_roles query missing filter

In `UsersEdit.tsx`, the `user_roles` query at line 35 has no `.eq("user_id", ...)` filter (it fetches ALL user_roles). This needs to be fixed to filter by the current user's `user_id`. Since we don't know `user_id` before loading the profile, we'll filter in JS (current approach at line 52-54), but should add the filter to the query for efficiency.

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/users/UserFormPage.tsx` | Remove Sections nav, remove edit warning, split Branch/Role into separate cards with Branch above Role, Branch uses SearchableMultiSelect, Default Language becomes dropdown, Employment layout to 3-col |
| `src/pages/UsersEdit.tsx` | Add `profile_image` to update payload, add user_id filter to user_roles query |

### Branch SearchableMultiSelect usage
```tsx
<SearchableMultiSelect
  value={form.branch_ids}
  onChange={(ids) => updateField("branch_ids", ids)}
  options={branches.map(b => ({ id: b.id, label: b.name }))}
  placeholder="Select branches"
  searchPlaceholder="Search branches..."
/>
```

### Default Language Dropdown
Replace the 3 radio buttons with:
```tsx
<Select value={form.default_language} onValueChange={(v) => updateField("default_language", v)}>
  <SelectTrigger className="h-9 text-sm">
    <SelectValue placeholder="Select language" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="en">English</SelectItem>
    <SelectItem value="ar">Arabic</SelectItem>
    <SelectItem value="ur">Urdu</SelectItem>
  </SelectContent>
</Select>
```

### Employment & Access 3-column layout
```
| Employee Type (dropdown) | Default Language (dropdown) | Security (checkbox + button) |
```
All in one row using `grid-cols-3 gap-3`.
