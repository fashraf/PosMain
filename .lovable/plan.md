
# User Management Module - Implementation Plan

## Overview

Create a complete **User Management module** with CRUD operations for users, role assignment, and shift scheduling. The module will follow existing project patterns (maintenance pages design, modal-based dialogs, Premium Grid standards) while adding restaurant-specific features like shift scheduling with cross-midnight support.

---

## Architecture Decision

| Component | Approach |
|-----------|----------|
| **User List** | Single-table view with search, filters, pagination (15 rows/page) |
| **Add/Edit User** | Modal-based dialog (modal-lg) following MaintenanceDialog pattern |
| **Shift Management** | Tabbed section within user modal or separate expandable card |
| **Authentication** | Uses Supabase Auth for secure password hashing |
| **Role Storage** | Existing `user_roles` table (NEVER in profiles/users) |

---

## Database Schema Updates

### 1. Extend `app_role` Enum
Current: `'admin' | 'manager' | 'cashier'`
New: `'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'kiosk'`

### 2. Extend `profiles` Table
Add columns:
- `phone` (text, nullable)
- `is_active` (boolean, default true)
- `last_login_at` (timestamp, nullable)
- `employee_code` (text, nullable, unique)

### 3. New `user_shifts` Table

```text
user_shifts
├── id (uuid, PK)
├── user_id (uuid, FK -> auth.users)
├── branch_id (uuid, FK -> branches, nullable)
├── start_datetime (timestamptz)
├── end_datetime (timestamptz)
├── is_recurring (boolean, default false)
├── recurring_days (text[], nullable) -- e.g., ['monday', 'tuesday']
├── created_at (timestamptz)
├── updated_at (timestamptz)
├── created_by (uuid, FK -> auth.users, nullable)
```

### 4. New `user_activity_log` Table (Audit Trail)

```text
user_activity_log
├── id (uuid, PK)
├── target_user_id (uuid, FK -> auth.users)
├── action (text) -- 'created', 'updated', 'role_changed', 'status_changed', 'password_reset'
├── performed_by (uuid, FK -> auth.users)
├── details (jsonb, nullable)
├── created_at (timestamptz)
```

---

## Role Definitions & Colors

| Role | Color | Badge Class | Description |
|------|-------|-------------|-------------|
| Admin | Purple | `bg-purple-100 text-purple-800` | Full system access |
| Manager | Blue | `bg-blue-100 text-blue-800` | Branch management, reports |
| Cashier | Green | `bg-green-100 text-green-800` | POS & payments |
| Waiter | Orange | `bg-orange-100 text-orange-800` | Order taking |
| Kitchen | Yellow | `bg-yellow-100 text-yellow-800` | Kitchen display |
| Kiosk | Gray | `bg-gray-100 text-gray-800` | Self-service terminal |

---

## Component Structure

### Files to Create

```text
src/pages/
├── Users.tsx                    # User list page
├── UsersAdd.tsx                 # Add user page (optional, can use modal)
└── UsersEdit.tsx                # Edit user page (optional, can use modal)

src/components/users/
├── UserDialog.tsx               # Add/Edit modal (modal-lg)
├── UserTable.tsx                # Users table with Premium Grid styling
├── UserRoleBadge.tsx            # Colored role badge component
├── UserShiftSection.tsx         # Shift management section
├── ShiftRow.tsx                 # Individual shift row with time pickers
├── ShiftCalendarView.tsx        # Weekly calendar/timeline view
├── PasswordResetModal.tsx       # Password reset confirmation
├── UserDeleteModal.tsx          # Delete confirmation with warning
└── index.ts                     # Exports
```

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add routes: `/users`, `/users/add`, `/users/:id/edit` |
| `src/components/AppSidebar.tsx` | Add "Users" menu item with `Users` icon |
| `src/lib/i18n/translations.ts` | Add user management translation keys |
| Database migrations | Create tables, extend enum, add RLS policies |

---

## UI Specifications

### 1. Users List Page (`/users`)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ User Management                                        [+ Add New User]  │
├─────────────────────────────────────────────────────────────────────────┤
│ 🔍 Search by name or email...   [Role Filter ▼]  [Status Filter ▼]       │
├────┬────────────────┬─────────────────────┬──────────┬─────────┬────────┤
│ #  │ User           │ Email               │ Role     │ Status  │Actions │
├────┼────────────────┼─────────────────────┼──────────┼─────────┼────────┤
│ 1  │ 👤 Fahad Ashraf│ fhd.ashraf@gmail... │ 🟣 Admin │ 🟢 Active│ 👁 ✏ 🔑│
│ 2  │ 👤 John Smith  │ john@example.com    │ 🟢Cashier│ 🟢 Active│ 👁 ✏ 🔑│
│ 3  │ 👤 Sara Ali    │ sara@kitchen.com    │ 🟠Kitchen│ ⚪Inactiv│ 👁 ✏ 🔑│
├────┴────────────────┴─────────────────────┴──────────┴─────────┴────────┤
│                            ← 1 2 3 ... →  (15 per page)                  │
└─────────────────────────────────────────────────────────────────────────┘

Actions:
- 👁 View (opens view modal)
- ✏ Edit (opens edit modal)
- 🔑 Reset Password (opens confirmation)
```

### 2. Add/Edit User Modal

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ ╭╴Add New User╶╮                                             [✕ Close] │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │  ┌──────────┐                                                       │ │
│ │  │  Avatar  │   120px circle, click to upload (optional)            │ │
│ │  │ Placeholder│                                                     │ │
│ │  └──────────┘                                                       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────┐  ┌─────────────────────────┐               │
│ │ Full Name *             │  │ Employee Code           │               │
│ │ [Fahad Ashraf________]  │  │ [EMP-001______________] │               │
│ └─────────────────────────┘  └─────────────────────────┘               │
│                                                                         │
│ ┌─────────────────────────┐  ┌─────────────────────────┐               │
│ │ Email *                 │  │ Phone                   │               │
│ │ [fhd.ashraf@gmail.com]  │  │ [+966 50 123 4567_____] │               │
│ └─────────────────────────┘  └─────────────────────────┘               │
│                                                                         │
│ ┌─────────────────────────┐  ┌─────────────────────────┐               │
│ │ Password *              │  │ Confirm Password *      │               │
│ │ [••••••••••••] 👁       │  │ [••••••••••••] 👁       │               │
│ └─────────────────────────┘  └─────────────────────────┘               │
│ ⚠️ Min 8 chars, 1 uppercase, 1 number                                   │
│                                                                         │
│ ┌─────────────────────────┐  ┌─────────────────────────┐               │
│ │ Role *                  │  │ Branch                  │               │
│ │ [🟣 Admin           ▼]  │  │ [Main Branch        ▼]  │               │
│ └─────────────────────────┘  └─────────────────────────┘               │
│                                                                         │
│ ℹ️ Admin: Full access | Cashier: POS & payments | Waiter: Order taking  │
│    Kitchen: Kitchen display | Kiosk: Self-service                       │
│                                                                         │
│ ────────────────────────────────────────────────────────────────────── │
│ 📅 Shift Assignments (Optional)                           [+ Add Shift] │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Date/Days          │ Start      │ End        │ Branch    │ Remove   │ │
│ ├────────────────────┼────────────┼────────────┼───────────┼──────────┤ │
│ │ ☑ Mon ☑ Tue ☐ Wed  │ 10:00 PM   │ 01:00 AM   │ Main      │   🗑     │ │
│ │                    │            │ (next day) │           │          │ │
│ ├────────────────────┼────────────┼────────────┼───────────┼──────────┤ │
│ │ [📅 2026-02-10___] │ 09:00 AM   │ 05:00 PM   │ Downtown  │   🗑     │ │
│ │                    │            │ (8h shift) │           │          │ │
│ └────────────────────┴────────────┴────────────┴───────────┴──────────┘ │
│ 💡 Cross-midnight shifts are fully supported!                           │
│                                                                         │
│ ────────────────────────────────────────────────────────────────────── │
│ 🔮 Future Features (Placeholders)                                       │
│ ☐ Enable Fingerprint Attendance   [View Attendance Logs →]              │
│                                                                         │
│ Status        [🟢 Active ○────● ]                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                            [Cancel]  [Save User]        │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3. Shift Row Component

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ ☐ Recurring Weekly                                                      │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [☑ Mon] [☑ Tue] [☐ Wed] [☐ Thu] [☐ Fri] [☐ Sat] [☐ Sun]             │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│ OR                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 📅 Specific Date: [2026-02-10]                                      │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐         │
│ │ Start Time   │  │ End Time     │  │ Duration               │         │
│ │ [10:00 PM ▼] │  │ [01:00 AM ▼] │  │ 3h 0m                  │         │
│ └──────────────┘  └──────────────┘  │ 🌙 Ends next day       │         │
│                                     └────────────────────────┘         │
│ ┌───────────────────────────────┐                                      │
│ │ Branch                        │                    [🗑 Remove]       │
│ │ [Main Branch              ▼]  │                                      │
│ └───────────────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## User Creation Flow (via Supabase)

```text
1. Admin fills form in modal
2. Validate all fields (email format, password strength, required fields)
3. Show confirmation modal: "Ready to add Fahad Ashraf as Admin?"
4. On confirm:
   a. Call supabase.auth.admin.createUser() via Edge Function
   b. Create profile record in profiles table
   c. Assign role in user_roles table
   d. Create user_branches record if branch selected
   e. Create user_shifts records if shifts defined
   f. Log activity in user_activity_log
5. Show success toast
6. Refresh user list
```

### Edge Function Required: `create-user`

Since Supabase client-side auth cannot create users with custom passwords (without sending verification emails), we need an edge function:

```typescript
// supabase/functions/create-user/index.ts
// Uses service_role key to create user with specific password
// Returns user ID for profile/role creation
```

---

## RLS Policies

### `profiles` Table (Extended)
- SELECT: Users can view their own profile, Admins can view all
- UPDATE: Users can update their own profile (except is_active), Admins can update all
- INSERT: Handled by trigger on auth.users creation
- DELETE: Not allowed (soft delete via is_active)

### `user_shifts` Table
- SELECT: Users can view their own shifts, Admins/Managers can view all
- INSERT: Admins only
- UPDATE: Admins only
- DELETE: Admins only

### `user_activity_log` Table
- SELECT: Admins only
- INSERT: System/trigger only
- UPDATE: Not allowed
- DELETE: Not allowed

---

## Translation Keys to Add

```typescript
users: {
  title: "User Management",
  addUser: "Add New User",
  editUser: "Edit User",
  fullName: "Full Name",
  email: "Email",
  phone: "Phone",
  employeeCode: "Employee Code",
  password: "Password",
  confirmPassword: "Confirm Password",
  passwordMismatch: "Passwords do not match",
  passwordRequirements: "Min 8 characters, 1 uppercase, 1 number",
  role: "Role",
  branch: "Branch",
  lastLogin: "Last Login",
  neverLoggedIn: "Never",
  resetPassword: "Reset Password",
  resetPasswordConfirm: "Send password reset email to this user?",
  deleteUser: "Delete User",
  deleteUserConfirm: "Remove {{name}}? This cannot be undone.",
  userCreated: "User created successfully",
  userUpdated: "User updated successfully",
  noUsers: "No users found",
  addFirstUser: "Add your first user to get started",
  // Roles
  roleAdmin: "Admin",
  roleManager: "Manager",
  roleCashier: "Cashier",
  roleWaiter: "Waiter",
  roleKitchen: "Kitchen",
  roleKiosk: "Kiosk",
  roleDescription: "Admin: Full access | Cashier: POS & payments | Waiter: Order taking | Kitchen: Kitchen display | Kiosk: Self-service",
  // Shifts
  shifts: "Shifts",
  addShift: "Add Shift",
  shiftDate: "Date",
  shiftStartTime: "Start Time",
  shiftEndTime: "End Time",
  recurringWeekly: "Recurring Weekly",
  crossMidnight: "Ends next day",
  shiftDuration: "Duration",
  noShifts: "No shifts assigned",
  crossMidnightTooltip: "Cross-midnight shifts are fully supported!",
  // Future features
  enableFingerprint: "Enable Fingerprint Attendance",
  viewAttendanceLogs: "View Attendance Logs",
  // Audit
  lastUpdatedBy: "Last updated by {{name}} on {{date}}",
}
```

---

## Implementation Order

### Phase 1: Database & Infrastructure
1. Create database migration:
   - Extend `app_role` enum with new roles
   - Add columns to `profiles` table
   - Create `user_shifts` table
   - Create `user_activity_log` table
   - Add RLS policies
2. Create `create-user` edge function
3. Create `reset-password` edge function

### Phase 2: Core Components
1. Create `UserRoleBadge.tsx` component
2. Create `UserTable.tsx` component
3. Create `UserDialog.tsx` modal
4. Create `PasswordResetModal.tsx`
5. Create `UserDeleteModal.tsx`

### Phase 3: User List Page
1. Create `Users.tsx` page
2. Add route to `App.tsx`
3. Add sidebar navigation
4. Add translation keys

### Phase 4: Shift Management
1. Create `ShiftRow.tsx` component
2. Create `UserShiftSection.tsx` section
3. Add shift CRUD operations
4. Create `ShiftCalendarView.tsx` (optional timeline view)

### Phase 5: Integration & Demo User
1. Create demo admin user (Fahad Ashraf)
2. Test all CRUD operations
3. Test shift scheduling with cross-midnight
4. Verify RLS policies work correctly

---

## Security Considerations

| Concern | Solution |
|---------|----------|
| Password storage | Handled by Supabase Auth (bcrypt) |
| Role verification | Server-side via `is_admin()` function, never client-side |
| Email uniqueness | Enforced by Supabase Auth + DB constraint |
| Rate limiting | Supabase Auth built-in rate limiting |
| Audit trail | All changes logged to `user_activity_log` |
| Soft deletes | Users are deactivated, not deleted |

---

## Future Extension Points

| Feature | Placeholder |
|---------|-------------|
| Fingerprint attendance | Toggle + tooltip: "Enable Fingerprint Attendance" |
| Attendance logs | Link: "View Attendance Logs" (disabled for now) |
| Password reset email | Button triggers `reset-password` edge function |
| Biometric integration | Field in modal for device ID |
| Shift reports | Can extend `ShiftCalendarView` component |

---

## Technical Notes

### Cross-Midnight Shift Calculation

```typescript
// If end_time < start_time, shift crosses midnight
const calculateShiftDuration = (start: string, end: string) => {
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);
  
  if (endMinutes < startMinutes) {
    // Crosses midnight: add 24 hours to end
    return (endMinutes + 1440) - startMinutes;
  }
  return endMinutes - startMinutes;
};

const crossesMidnight = (start: string, end: string) => {
  return parseTimeToMinutes(end) < parseTimeToMinutes(start);
};
```

### User Creation via Edge Function

Required because:
- Client-side `supabase.auth.signUp()` requires email verification
- Admin should be able to set initial password
- Edge function uses service_role key for admin operations
