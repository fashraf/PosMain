

# User Form UI Polish — Match Branch Form Design

## Overview
Apply the same typography and styling updates from the Branch form to the User Add/Edit form, ensuring consistent enterprise-grade appearance across all forms.

## Changes

### 1. Upgrade all labels from `text-xs` to `text-lg font-medium`
Every `Label` in UserFormPage.tsx currently uses `text-xs`. Update all to `text-lg font-medium` to match the Branch form standard.

Affected labels: Full Name, Mobile, Email, Age, Nationality, Status, National ID / Iqama, Iqama Expiry, Passport Number, Passport Expiry, Employee Type, Default Language, Password, Role, Branch -- all labels in the form.

### 2. Increase input heights from `h-7` to `h-9`
Inputs at `h-7` look too small with `text-lg` labels. Bump to `h-9` for visual balance.

### 3. Increase input font from `text-xs` to `text-sm` (14px)
Match the Branch form's 14px input standard.

### 4. Increase spacing
- Section inner spacing: `space-y-1.5` to `space-y-3`
- Grid gaps: `gap-1.5` to `gap-3`
- Field spacing: `space-y-0.5` to `space-y-1`

### 5. DashedSectionCard header (already done)
The gradient header (`linear-gradient(to right, #e5e7eb, white 40%, white 60%, #e5e7eb)`) with black text is already applied globally via the shared component. No changes needed here.

---

## Technical Details

### File to Modify

| File | Changes |
|------|---------|
| `src/components/users/UserFormPage.tsx` | Replace all `text-xs` on Labels with `text-lg font-medium`, increase input heights to `h-9`, input text to `text-sm`, increase gaps and spacing throughout |

### Scope
- Only the UserFormPage component is affected
- The DashedSectionCard header is already correct (shared component)
- No database changes needed
- No new files needed

