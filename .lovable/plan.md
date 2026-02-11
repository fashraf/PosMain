

# Shift Management Module

## Overview

Create a standalone Shift Definition module under **Maintenance** for defining reusable shift templates (e.g., "Weekend Evening Shift"). This is separate from the existing user-shift assignment in User Management.

## 1. Database: New `shifts` Table

Create a new `shifts` table to store shift definitions:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Required, shift name |
| is_active | boolean | Default true |
| effective_from | date | Required |
| effective_to | date | Required |
| days_of_week | text[] | Array of day names |
| start_time | time | Required |
| end_time | time | Required |
| allow_overnight | boolean | Default false |
| allow_early_clock_in | boolean | Default false |
| early_tolerance_minutes | integer | Default 15 |
| allow_late_clock_out | boolean | Default false |
| force_close_after_hours | integer | Nullable |
| require_fingerprint | boolean | Default false |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

RLS policies: Admin full access, authenticated users can view.

Add a unique constraint on `(name, start_time, end_time, effective_from, effective_to)` to prevent duplicate shifts.

## 2. New Files

### Pages
- **`src/pages/maintenance/Shifts.tsx`** -- Shift List page following the standard maintenance table pattern (search, status filter, pagination, add/edit/delete actions)
- **`src/pages/maintenance/ShiftsAdd.tsx`** -- Thin wrapper calling `ShiftFormPage`
- **`src/pages/maintenance/ShiftsEdit.tsx`** -- Thin wrapper calling `ShiftFormPage` with loaded data

### Components
- **`src/components/shifts/ShiftFormPage.tsx`** -- Full-page form with four `DashedSectionCard` sections:
  1. **Shift Information**: Name input + Active toggle
  2. **Effective Period**: From/To date pickers + weekday toggle buttons with Select All / Clear All
  3. **Shift Timing**: Start/End time inputs + Allow Overnight toggle + auto-calculated duration badge (with overnight detection prompt)
  4. **Operational Rules**: Four toggle fields (early clock-in with tolerance input, late clock-out, force close with hours input, fingerprint)

### Form Layout Details
- Uses `DashedSectionCard` with gradient headers matching existing design
- Fixed footer with Cancel / Save Shift buttons (left-[16rem] offset)
- Touch-friendly 48px minimum tap targets
- Inline validation (no alert dialogs)
- Save disabled until all required fields are valid
- `ConfirmActionModal` before final save

## 3. Modified Files

| File | Change |
|------|--------|
| `src/App.tsx` | Add 3 routes: `/maintenance/shifts`, `/maintenance/shifts/add`, `/maintenance/shifts/:id/edit` |
| `src/components/AppSidebar.tsx` | Add "Shift Management" entry to `maintenanceSubItems` array |
| `src/lib/i18n/translations.ts` | Add shift-related translation keys in EN/AR/UR |
| `src/pages/maintenance/index.ts` | Export the new ShiftsPage |

## 4. Navigation

Sidebar entry added to the Maintenance collapsible menu:
- Label: "Shift Management"
- Route: `/maintenance/shifts`
- Position: After Employee Types (last item in maintenance list)

## 5. Key Behaviors

- **Overnight detection**: When end time is earlier than start time, show an inline warning with an "Enable" button to toggle `allow_overnight`
- **Duration auto-calc**: Displayed as a read-only badge (e.g., "8h 00m"), accounts for overnight wrapping
- **Weekday toggles**: Styled as pill buttons matching the existing `ShiftRow` pattern, with "Select All" and "Clear All" helper buttons
- **Date pickers**: Using Shadcn Popover + Calendar component with `pointer-events-auto`
- **Validation**: From Date must be <= To Date, at least one weekday selected, duration > 0, name required
- **Duplicate prevention**: Enforced via DB unique constraint; caught and displayed as inline error on save

## 6. No Changes To

- Existing `user_shifts` table or user assignment flow
- POS module, order flow, or pricing
- Database schema of any existing tables
- UI layout system or design language

