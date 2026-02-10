

# Redesign: Full-Page Add/Edit for Users and Roles (No Modals)

## Overview

Replace all modal-based dialogs for User and Role management with dedicated full pages. The User pages get a two-column layout with a contextual Role Preview panel. The Role pages become full pages with the permission matrix inline.

---

## 1. New Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/users/add` | `UsersAdd.tsx` | Add new user (full page) |
| `/users/:id/edit` | `UsersEdit.tsx` | Edit user (full page) |
| `/roles/add` | `RolesAdd.tsx` | Add new role (full page) |
| `/roles/:id/edit` | `RolesEdit.tsx` | Edit role (full page) |

---

## 2. User Add/Edit Page Layout

### Structure
- **Header**: "Add New User" / "Edit User -- {Name}" with sticky [Cancel] + [Save User] buttons
- **Subtitle**: "Create a new system user and assign role & branch access"
- **Edit Warning Banner**: "Changes will apply immediately across all assigned branches"
- **Two-column layout**: 70% left form / 30% right Role Preview panel

### Left Column -- User Form

**Section: Profile Information**
- User Image placeholder with [Upload Photo] / [Take Photo] buttons (edit mode shows [Replace Photo] / [Remove])
- Full Name (required)
- Mobile Number (required, unique, tooltip: "Used as login ID")
- Age
- Nationality (dropdown)
- Tooltip under Nationality: "Used for compliance and document validation"

**Section: Identification (Optional)**
- National ID / Iqama
- Iqama Expiry (date picker)
- Passport Number
- Passport Expiry (date picker)
- Inline warning: "Expiry reminders will be generated automatically if dates are provided"

**Section: Employment & Access**
- Employee Type (dropdown from maintenance_emp_types)
- Role (required dropdown with color badges)
  - Info icon: "View full permissions" -- clicking opens/refreshes the right-side Role Preview panel
- Branches (multi-select checklist, at least one required)
  - Tooltip: "User can only operate within selected branches"
- Default Language (radio: English / Arabic / Urdu)

**Section: Security**
- Default Password: "123456abc" (read-only, auto-generated) -- for Add mode
- Edit mode: [Reset Password Now] button + "Reset password & force change at next login" checkbox
- Checkbox: "Force change at first login"
- Warning on reset: "Resetting password will immediately invalidate the current credentials"

**Section: Status**
- Radio: Active / Inactive
- Helper: "Inactive users cannot log in but historical data remains intact"

### Right Column -- Role Preview Panel

- Hidden by default, slides in when a role is selected or user clicks "View full permissions"
- Shows:
  - Role name with color badge
  - "Assigned to N users"
  - [Edit Role] button (navigates to `/roles/:id/edit`)
  - Read-only permission list grouped by category with checkmarks
  - [Assign this role] / [Close] buttons at bottom

### Sticky Footer
- [Cancel] on left, [Save User] on right
- Uses the existing `PageFormLayout` footer pattern (fixed bottom, offset for sidebar)

---

## 3. Role Add/Edit Page Layout

### Structure
- **Header**: "Add Role" / "Edit Role -- {Name}" with sticky [Cancel] + [Save Role]
- **Warning banner** (edit mode): "Permission changes will affect all assigned users immediately"
- **System role indicator**: badge if `is_system = true`

### Form Sections

**Section: Role Details**
- Role Name (required, disabled for system roles)
- Description (textarea)
- Color Picker (preset swatches)
- Status toggle (Active / Inactive)

**Section: Permission Matrix**
- Full-width, grouped by category (Orders, Payments, Items & Pricing, Inventory, Kitchen, Printing, User Management)
- Each group: collapsible with "Select All" toggle
- Individual permissions: Switch toggles with tooltip descriptions
- Tooltip on section: "Controls what actions users with this role can perform across all branches"

### Sticky Footer
- [Cancel] + [Save Role]

---

## 4. Files to Create

| File | Description |
|------|-------------|
| `src/pages/UsersAdd.tsx` | Full-page Add User with two-column layout |
| `src/pages/UsersEdit.tsx` | Full-page Edit User (loads user data, same layout) |
| `src/components/users/UserFormPage.tsx` | Shared form component used by both Add and Edit |
| `src/components/users/RolePreviewPanel.tsx` | Right-side contextual panel showing role permissions |
| `src/pages/RolesAdd.tsx` | Full-page Add Role |
| `src/pages/RolesEdit.tsx` | Full-page Edit Role (loads role data) |
| `src/components/roles/RoleFormPage.tsx` | Shared form component for role add/edit |

## 5. Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add 4 new routes: `/users/add`, `/users/:id/edit`, `/roles/add`, `/roles/:id/edit` |
| `src/pages/Users.tsx` | Change `onAdd` to navigate to `/users/add`, `onEdit` to navigate to `/users/:id/edit`; remove `UserStepperDialog` and `PasswordResetModal` imports |
| `src/pages/Roles.tsx` | Change `onAdd` to navigate to `/roles/add`, `onEdit` to navigate to `/roles/:id/edit`; remove `RoleDialog` |
| `src/components/users/UserTable.tsx` | View action navigates to edit page in read-only mode (or a separate view route) |
| `src/components/roles/RoleTable.tsx` | View/Edit actions navigate to page routes instead of opening modals |

## 6. Components to Keep (Reused)

- `PermissionMatrix` -- reused in both RoleFormPage and RolePreviewPanel (read-only mode)
- `RoleBadge` -- reused everywhere
- `PasswordResetModal` -- kept as a small modal triggered from the Edit User page's "Reset Password Now" button (this is a quick action, not a full form)
- `LoadingOverlay` -- reused for save operations
- `PageFormLayout` pattern -- sticky footer with sidebar offset

## 7. Components to Deprecate

- `UserStepperDialog` -- replaced by full-page `UserFormPage`
- `RoleDialog` -- replaced by full-page `RoleFormPage`

---

## 8. Technical Notes

- **Data Loading**: `UsersEdit.tsx` and `RolesEdit.tsx` will fetch their data by ID from URL params using `useParams()` + direct Supabase queries
- **Role Preview Panel**: Fetches permissions for the selected role via `role_permissions` join when the role dropdown changes
- **Navigation**: Uses `useNavigate()` for Cancel (go back) and post-save redirect
- **Validation**: Same rules as current stepper -- required fields, unique mobile, at least one branch
- **The PasswordResetModal stays as a modal** since it's a quick confirmation action, not a full form page

