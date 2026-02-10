
# Phase 1: RBAC Overhaul -- Employee Types, Dynamic Roles with Permissions, Enhanced User Master

## Overview

A complete restructuring of the user management system to support dynamic roles with granular permissions, a new Employee Type maintenance table, and an enhanced User Master with additional fields. This replaces the current hardcoded enum-based role system.

---

## A. Database Changes

### A1. New Table: `maintenance_emp_types`
Standard maintenance table following existing patterns (Categories, Allergens, etc.).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | default gen_random_uuid() |
| name_en | text NOT NULL | e.g. FullTime, PartTime, Intern |
| name_ar | text | nullable |
| name_ur | text | nullable |
| description | text | nullable |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

RLS: Same pattern as other maintenance tables (admin manage, authenticated view).

### A2. New Table: `roles`
Replaces the hardcoded `app_role` enum. Stores dynamic role definitions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | default gen_random_uuid() |
| name | text NOT NULL UNIQUE | e.g. "Admin", "Waiter" |
| description | text | nullable |
| color | text | e.g. "#EF4444" for color coding |
| is_system | boolean | default false -- prevents deletion of pre-seeded roles |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

Pre-seeded with 5 default roles: Admin, Waiter, Cashier, Logistics In-Charge, Chef/Kitchen (all with `is_system = true`).

RLS: Admin manage, authenticated view.

### A3. New Table: `permissions`
Master list of all system permissions, grouped by feature area.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| code | text NOT NULL UNIQUE | e.g. "orders.create", "orders.view_own" |
| name | text NOT NULL | Display name |
| description | text | Tooltip text |
| group_name | text NOT NULL | e.g. "Orders", "Payments", "Items & Ingredients" |
| sort_order | integer | default 0 |

Pre-seeded with permissions from the spec:
- **Orders**: create, view_own, view_all, close_own, close_all, cancel, reopen
- **Payments**: view_bills, close_payment, void_payment
- **Items & Ingredients**: add, update, view_pricing, update_pricing
- **Inventory**: adjustments, transfers, stock_issue
- **Printing**: print_kot, print_receipt, print_bill
- **User Management**: view_users, create_users, manage_roles, manage_permissions
- **Kitchen**: view_kitchen, close_items, close_order, reopen_order

RLS: Admin manage, authenticated view.

### A4. New Table: `role_permissions`
Junction table linking roles to permissions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| role_id | uuid FK -> roles.id ON DELETE CASCADE | |
| permission_id | uuid FK -> permissions.id ON DELETE CASCADE | |
| UNIQUE(role_id, permission_id) | | |

Pre-seeded: Admin gets ALL permissions. Other roles get permissions per spec.

RLS: Admin manage, authenticated view.

### A5. Modify `user_roles` Table
Currently uses `app_role` enum. Needs to reference the new `roles` table instead.

Strategy:
1. Add new column `role_id uuid` referencing `roles.id`
2. Migrate existing data: look up role name from enum value, find matching `roles.id`, populate `role_id`
3. Drop old `role` column
4. Rename `role_id` to be the primary role reference
5. Keep the existing `is_admin()` and `has_role()` functions working by rewriting them to query the new structure

### A6. Extend `profiles` Table
Add new fields for the enhanced User Master:

| New Column | Type | Notes |
|------------|------|-------|
| age | integer | nullable |
| nationality | text | nullable |
| national_id | text | nullable (Iqama) |
| national_id_expiry | date | nullable |
| passport_number | text | nullable |
| passport_expiry | date | nullable |
| emp_type_id | uuid FK -> maintenance_emp_types.id | nullable |
| default_language | text | default 'en' |
| force_password_change | boolean | default false |

### A7. Update Database Functions
Rewrite `is_admin()` and `has_role()` to work with the new `roles` table instead of the enum:

```sql
-- is_admin now checks roles table
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id AND r.name = 'Admin'
  )
$$;
```

Update `assign_first_user_admin` trigger to insert using the new `roles` table lookup.

---

## B. New Pages & Components

### B1. Employee Type Maintenance Page
**Route:** `/maintenance/employee-types`
**File:** `src/pages/maintenance/EmployeeTypes.tsx`

Follows exact same pattern as `Categories.tsx` maintenance page:
- Grid with search + status filter
- Add/Edit dialog with multilingual name input
- Toggle active/inactive
- Save/Delete confirmation modals

Add to sidebar under Maintenance collapsible and to App.tsx routes.

### B2. Role Master Page
**Route:** `/roles`
**File:** `src/pages/Roles.tsx`

**Layout:**
- Header: "Role Master" + "Add Role" button
- Table listing all roles with columns: Name, Description, Color badge, User Count, Status, Actions (View/Edit)
- System roles show a lock icon and cannot be deleted

**Add/Edit Role Dialog** (`src/components/roles/RoleDialog.tsx`):
- Role Name (text input)
- Description (textarea)
- Color picker (preset color swatches)
- **Permission Matrix** -- the core feature:
  - Grouped by category (Orders, Payments, Items, Inventory, Printing, User Management, Kitchen)
  - Each group is a collapsible section with a "Select All" toggle
  - Individual permissions shown as switch toggles with tooltip descriptions
  - Warning banner: "Changing role permissions will immediately affect all assigned users."
- Status toggle
- Save confirmation modal

**Supporting Components:**
- `src/components/roles/RoleTable.tsx` -- grid with filters
- `src/components/roles/PermissionMatrix.tsx` -- grouped toggles for permission assignment
- `src/components/roles/RoleBadge.tsx` -- replaces `UserRoleBadge.tsx`, reads color from role data

### B3. Enhanced User Master Page
**Route:** `/users` (same route, rebuilt page)
**File:** `src/pages/Users.tsx` (rewrite)

**User Creation -- Stepper Modal** (`src/components/users/UserStepperDialog.tsx`):
Three steps with progress indicator:

**Step 1 -- Basic Info:**
- Full Name (required)
- Mobile Number (required, unique -- used as login ID)
- Email (optional)
- Age
- Nationality
- Profile Image (camera/upload placeholder)
- National ID / Iqama (optional)
- Iqama Expiry (date picker, optional)
- Passport Number (optional)
- Passport Expiry (date picker, optional)

**Step 2 -- Role & Branch:**
- Employee Type (dropdown from `maintenance_emp_types`)
- Associated Role (dropdown from `roles` table)
- Branches (multi-select from `branches`)
- Tooltips on each field

**Step 3 -- Security & Preferences:**
- Default Password: pre-filled with "123456abc"
- Checkbox: "Force Change Password at First Login"
- Default Language (EN / AR / UR radio)
- Status toggle (Active/Deactivated)
- Tooltip: "User will be forced to change password on first login"
- Tooltip: "Deactivated users cannot log in but historical data remains intact"

**Validations:**
- Duplicate mobile number check
- At least one branch selected
- Role must be assigned
- Success toast: "User created successfully"

**User Table Enhancements:**
- Role column now shows dynamic RoleBadge with color from roles table
- Employee Type column added
- Mobile Number column replaces/supplements Email

### B4. Login Page Enhancement
**File:** `src/pages/Login.tsx`

- Add a toggle or smart detection: "Login with Email" / "Login with Mobile"
- Mobile login: input field accepts phone number, uses email-based auth under the hood by looking up the user's email from their phone number via an edge function
- Keep existing email login working as-is

**New Edge Function:** `supabase/functions/login-by-mobile/index.ts`
- Accepts mobile number
- Looks up email from `profiles` table using service role
- Returns email so the client can call `signInWithPassword` with it

---

## C. Edge Function Updates

### C1. Update `create-user` Edge Function
- Accept new fields: `age`, `nationality`, `national_id`, `national_id_expiry`, `passport_number`, `passport_expiry`, `emp_type_id`, `default_language`, `force_password_change`, `branch_ids` (array)
- Use new `roles` table: accept `role_id` instead of enum string
- Insert multiple branches from `branch_ids` array
- Set `force_password_change` on profile

### C2. New Edge Function: `login-by-mobile`
- Input: `{ mobile: string }`
- Query `profiles` table for matching phone number
- Return the associated `user_id` so client can look up email
- Security: rate-limited, only returns minimal info

---

## D. Sidebar & Routing Updates

### D1. Sidebar Changes (`src/components/AppSidebar.tsx`)
- Add "Employee Types" under Maintenance collapsible
- Add "Role Master" as a top-level nav item (with Shield icon) near Users

### D2. Route Changes (`src/App.tsx`)
- Add `/maintenance/employee-types` route
- Add `/roles` route

---

## E. System Safety Guards

- At least one active Admin must exist: validated in the `create-user` edge function and role-change logic
- System roles (`is_system = true`) cannot be deleted, only edited
- Warning modal when changing permissions on a role that has assigned users
- Deactivation (not deletion) for users -- historical data preserved

---

## F. Migration Sequence (Order Matters)

1. Create `maintenance_emp_types` table + RLS
2. Create `roles` table + seed 5 default roles
3. Create `permissions` table + seed all permissions
4. Create `role_permissions` table + seed default mappings
5. Add `role_id` column to `user_roles`, migrate data from enum, drop old column
6. Add new columns to `profiles` table
7. Update `is_admin()`, `has_role()`, `assign_first_user_admin()` functions
8. Update `create-user` edge function
9. Create `login-by-mobile` edge function
10. Build UI: Employee Types page, Role Master page, Enhanced User Master, Login updates
11. Update sidebar and routes

---

## G. Files Summary

| File | Action |
|------|--------|
| **Database** | Migration with 7 DDL operations |
| `src/pages/maintenance/EmployeeTypes.tsx` | New -- maintenance CRUD page |
| `src/pages/Roles.tsx` | New -- Role Master page |
| `src/components/roles/RoleTable.tsx` | New -- role grid |
| `src/components/roles/RoleDialog.tsx` | New -- add/edit role with permission matrix |
| `src/components/roles/PermissionMatrix.tsx` | New -- grouped permission toggles |
| `src/components/roles/RoleBadge.tsx` | New -- dynamic color badge |
| `src/components/users/UserStepperDialog.tsx` | New -- 3-step user creation wizard |
| `src/pages/Users.tsx` | Rewrite -- use new role/emp_type system |
| `src/components/users/UserTable.tsx` | Update -- new columns, dynamic role badge |
| `src/components/users/UserDialog.tsx` | Replace with stepper dialog |
| `src/pages/Login.tsx` | Update -- add mobile login option |
| `src/components/AppSidebar.tsx` | Update -- add Employee Types, Role Master nav |
| `src/App.tsx` | Update -- add new routes |
| `supabase/functions/create-user/index.ts` | Update -- new fields, dynamic roles |
| `supabase/functions/login-by-mobile/index.ts` | New -- mobile number lookup |
| `src/pages/maintenance/index.ts` | Update -- export EmployeeTypes |
| `src/hooks/useAuth.tsx` | Minor -- add force_password_change redirect |
