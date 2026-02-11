

# Print Template Improvements

## Overview

Several enhancements to the Print Template form, preview, save modal, and database schema. The template becomes a standalone entity (no branch dropdown on the form -- branches will reference templates instead). Layout changes to 6/6 column split at 65% container width. Receipt preview shown in both the form page and the save confirmation modal. Customization section added to preview. Multilingual restaurant name support.

---

## 1. Database Changes

### Modify `print_templates` table

- **Add columns:**
  - `logo_width` (integer, default 80) -- logo width in px for the receipt
  - `logo_height` (integer, default 40) -- logo height in px for the receipt
  - `show_customization` (boolean, default true) -- show item customizations (+/- with cost)
  - `restaurant_name_en` (text, nullable) -- restaurant name in English
  - `restaurant_name_ar` (text, nullable) -- restaurant name in Arabic
  - `restaurant_name_ur` (text, nullable) -- restaurant name in Urdu
  - `cr_number` (text, nullable) -- actual CR number value
  - `vat_number` (text, nullable) -- actual VAT number value

- **Make `branch_id` nullable** -- template is no longer tied to a branch at creation time; branches will reference templates. Drop the unique constraint on `(name, branch_id)` and add a unique constraint on just `name`.

### Future: Branch-template linking

The plan is to assign templates from the Branch form. This can be done later by adding a `print_template_ids` (uuid array) column to the `branches` table, or a junction table. For now, we just remove the branch requirement from the template form.

---

## 2. File Changes

### `src/components/print-templates/ReceiptPreview.tsx`

- **Update `PrintTemplateData` interface** to add: `logo_width`, `logo_height`, `show_customization`, `restaurant_name_en`, `restaurant_name_ar`, `restaurant_name_ur`, `cr_number`, `vat_number`
- **Restaurant name display**: Show the first non-empty value from `restaurant_name_en` / `restaurant_name_ar` / `restaurant_name_ur` (fallback chain). Use bold, larger font.
- **Logo size**: Apply `logo_width` and `logo_height` (in px) to the logo image/placeholder instead of a fixed `h-10`.
- **CR/VAT values**: When `show_cr_number` is true, display `CR# {cr_number}` (or placeholder if empty). Same for VAT.
- **Customization section**: Add demo customization data below each item row:
  ```
  Chicken Shawarma   x2   15.00   30.00
    + Extra Cheese         +2.00
    - No Onion
  ```
  Only shown when `show_customization` is true. Use green text for additions (+cost), red/muted for removals.
- **Container width**: Keep `max-w-[280px]` for the receipt itself (thermal printer mock).

### `src/components/print-templates/PrintTemplateFormPage.tsx`

- **Remove branch dropdown** from Template Info section. Remove `branchId` state, `branches` fetch, and branch validation.
- **Layout**: Change from `grid-cols-12` with `col-span-8` / `col-span-4` to `col-span-6` / `col-span-6`, wrapped in a container with `max-w-[65%] mx-auto` (or `w-[65%]`).
- **Template Info section**: Replace 3-column grid with:
  - Row 1: Restaurant Name (multilingual -- 3 inputs for EN/AR/UR using `CompactMultiLanguageInput`)
  - Row 2: Template Name (text input) + Active toggle
- **Header section**: Add CR Number input field (text, shown when `show_cr_number` is checked) and VAT Number input field (text, shown when `show_vat_number` is checked). When the user checks "CR Number", a text input appears to enter the actual CR number. Same for VAT.
- **Logo sub-section**: Add Width and Height number inputs (in px) next to the position selector. Small numeric inputs with labels "W" and "H" (default 80x40).
- **Body section**: Add `show_customization` checkbox labeled "Show Customization (+/- items)"
- **Save modal call**: Remove `branchName` prop.

### `src/components/print-templates/PrintTemplateSaveModal.tsx`

- **Remove branch display** from the summary.
- **Add receipt preview**: Embed a scaled-down `ReceiptPreview` component inside the modal (below the pill summary), so the user sees both the configuration summary AND the actual receipt before confirming. Use a smaller scale wrapper.
- **Modal width**: Increase to `max-w-2xl` to accommodate the preview alongside the summary. Use a 2-column layout inside: left = pill summary, right = receipt preview.

### `src/components/print-templates/PrintTemplateFormPage.tsx` (defaults update)

Update `defaultData` to include:
```typescript
logo_width: 80,
logo_height: 40,
show_customization: true,
restaurant_name_en: "Sample Restaurant",
restaurant_name_ar: "",
restaurant_name_ur: "",
cr_number: "",
vat_number: "",
```

### `src/pages/maintenance/PrintTemplates.tsx` (list page)

- Remove the "Branch" column and branch filter since templates are no longer branch-specific.
- Add a "Restaurant Name" column showing the first non-empty language value.

---

## 3. Receipt Preview Demo Data Updates

Add customization data to demo items:

```typescript
const DEMO_ITEMS = [
  { 
    name: "Chicken Shawarma", qty: 2, price: 15.0, total: 32.0,
    customizations: [
      { type: "add", name: "Extra Cheese", cost: 2.00 },
      { type: "remove", name: "No Onion", cost: 0 }
    ]
  },
  { 
    name: "Arabic Coffee", qty: 3, price: 5.0, total: 15.0,
    customizations: []
  },
  { 
    name: "Kunafa", qty: 1, price: 12.0, total: 13.50,
    customizations: [
      { type: "add", name: "Extra Cream", cost: 1.50 }
    ]
  },
];
```

Customization rows render indented below each item with:
- `+` prefix in green for additions, showing `+{cost}` on the right
- `-` prefix in muted/red for removals

---

## 4. Summary of Field Additions to Form

| Section | New Field | Type | Notes |
|---------|-----------|------|-------|
| Template Info | Restaurant Name EN/AR/UR | CompactMultiLanguageInput | Shows first non-empty in preview |
| Header | CR Number (value) | Text input | Appears when "CR Number" checkbox is checked |
| Header | VAT Number (value) | Text input | Appears when "VAT Number" checkbox is checked |
| Header / Logo | Logo Width | Number input (px) | Default 80 |
| Header / Logo | Logo Height | Number input (px) | Default 40 |
| Body | Show Customization | Checkbox | Shows +/- items with cost in preview |

---

## 5. No Changes To

- Branch form (template assignment to branches is a future task)
- POS or order flow
- Existing routes (same 3 routes)
- Database RLS policies (same admin-only write, authenticated read)

