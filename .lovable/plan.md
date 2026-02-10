

# Compact UI Overhaul: Role & User Form Pages

## Overview

Make both the Role and User form pages compact, add dotted-border section styling, integrate the working `ImageUploadHero` component, add save confirmation modals, improve tooltips/warnings, and fix the sticky footer so it doesn't overlap the sidebar/menu.

---

## 1. Role Form Page (`RoleFormPage.tsx`) -- Compact + Confirmation Modal

### Layout Changes
- Remove `space-y-6` spacing, use `space-y-3` throughout
- Replace `Card` wrappers with `DashedSectionCard` (dotted borders, color-coded headers)
  - Role Details section: `variant="purple"`
  - Permission Matrix section: `variant="blue"`
- Reduce padding inside sections (use `p-3` instead of `p-4/p-5`)
- Header: reduce title size from `text-3xl` to `text-xl`, tighten gaps
- Color picker: smaller swatches (`h-6 w-6` instead of `h-8 w-8`)

### Sticky Footer Fix
- Change from `fixed bottom-0 inset-x-0` to a proper sticky footer that respects sidebar width
- Use `left-[16rem]` explicitly (matching sidebar) and `right-0` instead of `inset-x-0`
- Reduce padding to `p-3`, use smaller buttons
- Add `z-30` to sit above content but below modals

### Save Confirmation Modal
- Add `ConfirmActionModal` before save
- On "Save Role" click: open confirmation modal with message "Are you sure you want to save this role? Permission changes will affect all assigned users immediately."
- On confirm: call `onSubmit(form)`

### Tooltips
- Add tooltip on Role Name field: "Used to identify this role across the system"
- Add tooltip on Status toggle: "Inactive roles cannot be assigned to new users"
- Add tooltip on Color picker: "Color is used to visually distinguish this role in badges"

### Warning Alert
- Keep the existing edit-mode warning but make it more compact (smaller padding, `py-2`)

---

## 2. User Form Page (`UserFormPage.tsx`) -- Col-8/Col-4 + Compact + Image Upload

### Layout Restructure
- Change from `flex gap-6` with `flex-1` / `w-[340px]` to a proper `grid grid-cols-12 gap-4`
  - Left column: `col-span-8` (Profile, Identification, Employment, Security, Status)
  - Right column: `col-span-4` (Role selection + Role Preview Panel combined)
- Reduce all `space-y-6` to `space-y-3`

### Section Styling
- Replace all `Card` wrappers with `DashedSectionCard`:
  - Profile Information: `variant="purple"`
  - Identification: `variant="amber"`
  - Employment & Access: `variant="blue"`
  - Security: `variant="muted"`
  - Status: `variant="green"`
- Remove CardHeader/CardContent, use DashedSectionCard's built-in header

### Image Upload Fix
- Replace the non-functional avatar placeholder with the existing `ImageUploadHero` component
- Add `profile_image` field to `UserFormData` interface (string | null)
- Wire `ImageUploadHero` with `value={form.profile_image}` and `onChange` to update form state
- Save the URL to profiles table via the `onSubmit` handler
- Pass `profile_image` through to `UsersAdd.tsx` and `UsersEdit.tsx` for persistence

### Right Column (Col-4) -- Role + Preview Combined
- Move the Role dropdown and Branch selection into the right column
- Keep Employee Type and Default Language in left column under Employment
- Role Preview Panel renders directly below the role dropdown in the same column
- Remove separate `rolePreviewPanel` prop -- embed it inline

### Sticky Footer Fix
- Same fix as Role page: use `left-[16rem] right-0` instead of `inset-x-0`
- Compact: `p-3`, smaller gaps

### Save Confirmation Modal
- Add `ConfirmActionModal` triggered by "Save User" button
- Message for Add: "Are you sure you want to create this user? They will be able to log in with the provided credentials."
- Message for Edit: "Are you sure you want to save changes? Updates will apply immediately across all assigned branches."

### Tooltips (Additional)
- Age field: "Used for compliance reporting"
- National ID: "Iqama number for Saudi-based employees"
- Passport: "Required for non-Saudi employees"
- Force password change: "User will be required to set a new password on their next login"
- Status inactive: "Inactive users cannot log in but historical data remains intact"
- Default Language: "Sets the default UI language for this user"

### Warning Alerts
- Identification section: Keep existing expiry reminder, make it compact
- Security section (edit mode): Keep existing password reset warning

---

## 3. Role Preview Panel (`RolePreviewPanel.tsx`) -- Compact

- Reduce padding throughout (`p-3` instead of `p-4`)
- Smaller text: `text-xs` for user count
- Make the permission list more compact (reduce `py-2.5` to `py-1.5` in PermissionMatrix when `disabled`)
- Add dotted border styling to match design system (`border-2 border-dashed`)

---

## 4. Database + Persistence for Profile Image

- Add `profile_image` column to `profiles` table (text, nullable) via migration
- Update `UsersAdd.tsx`: include `profile_image` in the `create-user` edge function body
- Update `UsersEdit.tsx`: include `profile_image` in the profile update query
- Update `create-user` edge function: accept and store `profile_image`
- Load existing `profile_image` in `UsersEdit.tsx` from profile data

---

## 5. Permission Matrix (`PermissionMatrix.tsx`) -- Minor Compacting

- Reduce group header padding from `px-4 py-3` to `px-3 py-2`
- Reduce individual permission row padding from `px-4 py-2.5` to `px-3 py-1.5`
- When `disabled` prop is true, use even tighter spacing for the preview panel

Please remove margins and make the forms compact and appealing to look at 
---

## 6. Files Summary

| File | Action |
|------|--------|
| **Database** | Migration: add `profile_image text` to `profiles` |
| `src/components/roles/RoleFormPage.tsx` | Rewrite: compact layout, DashedSectionCard, confirmation modal, tooltips, footer fix |
| `src/components/users/UserFormPage.tsx` | Rewrite: col-8/col-4 grid, DashedSectionCard, ImageUploadHero, inline role preview, confirmation modal, tooltips, footer fix |
| `src/components/users/RolePreviewPanel.tsx` | Update: compact, dotted border |
| `src/components/roles/PermissionMatrix.tsx` | Update: tighter spacing |
| `src/pages/UsersAdd.tsx` | Update: pass `profile_image` to edge function, remove separate rolePreviewPanel wiring |
| `src/pages/UsersEdit.tsx` | Update: load/save `profile_image`, remove separate rolePreviewPanel wiring |
| `src/pages/RolesAdd.tsx` | Minor: confirmation modal state |
| `src/pages/RolesEdit.tsx` | Minor: confirmation modal state |
| `supabase/functions/create-user/index.ts` | Update: accept `profile_image` field |

