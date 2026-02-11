

# Branch Form UI Polish & Fixes

## Changes Summary

### 1. Remove "Hybrid" from Pricing Mode
Remove the third "Hybrid" option -- only keep **Tax Inclusive** and **Tax Exclusive**.

### 2. Remove "Apply On" column from Tax Row
Simplify the `BranchTaxRow` component by removing the "Apply On" dropdown. Each tax row will only have: Tax Name, Tax Type, Value, Active toggle, and Delete button.

### 3. "Add Tax" button font size to 16px
Update the "Add Tax" button text to use `text-base` (16px) instead of `text-sm`.

### 4. Upgrade all labels to `text-lg font-medium`
Replace the current `text-sm font-medium` on all `Label` elements across the branch form and tax row with `text-lg font-medium` for better readability.

### 5. DashedSectionCard header redesign
Update the `DashedSectionCard` component header to use a **gradient background** that fades from light grey on the edges to white at the center, with black text -- matching the reference screenshot. This replaces the current colored header backgrounds (purple-50, green-50, etc.).

### 6. Confirmation Modal -- show full details instead of summary counts
Redesign the `BranchSaveConfirmModal` to display actual branch details instead of just counts:
- Branch Name, Branch Code, Currency
- List of selected Sales Channel names (resolved from IDs)
- Each tax rule with name, type, and value
- Pricing Mode and Status
- Rounding Rule

The modal will accept the full form data and channel options to render rich details.

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/shared/DashedSectionCard.tsx` | Replace colored headers with gradient grey-to-white background, black text |
| `src/components/branches/BranchFormPage.tsx` | Remove "Hybrid" from PRICING_MODES, upgrade labels to `text-lg`, "Add Tax" button to `text-base`, pass full data to confirmation modal |
| `src/components/branches/BranchTaxRow.tsx` | Remove "Apply On" column, upgrade labels to `text-lg`, redistribute grid columns |
| `src/components/branches/BranchSaveConfirmModal.tsx` | Accept full form data + channel names, show detailed breakdown instead of counts |

### DashedSectionCard Header Style
The header will use:
```
background: linear-gradient(to right, #e5e7eb, white 40%, white 60%, #e5e7eb)
```
With `text-base font-semibold text-foreground` for the title, centered.

### Tax Row Grid (after removing Apply On)
- Tax Name: `col-span-4`
- Tax Type: `col-span-3`
- Value: `col-span-3`
- Active + Delete: `col-span-2`

