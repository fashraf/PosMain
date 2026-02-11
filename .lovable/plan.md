

# Print Template Layout Restructure

## Overview

Change the form to full-width with an 8/4 column split. Move Template Name to the top as a standalone row. Add a new Telephone Number field. Restructure the "Template Info" card to show Restaurant Name, Tel #, CR #, and VAT # in a clean 2x2 grid (col-6 each). Remove CR/VAT from the Header toggles section (they become always-visible text fields in Template Info).

---

## 1. Database Change

Add a `telephone` column to `print_templates`:
- `telephone` (text, nullable) -- restaurant/branch telephone number

---

## 2. Data Model Updates

### `PrintTemplateData` interface (in ReceiptPreview.tsx)

Add:
```typescript
telephone: string;
```

### `defaultData` (in PrintTemplateFormPage.tsx)

Add:
```typescript
telephone: "",
```

Remove `cr_number` and `vat_number` from being conditional on checkboxes -- they are now always-visible inputs.

---

## 3. PrintTemplateFormPage.tsx -- Layout Changes

### Remove `max-w-[65%] mx-auto` wrapper

The grid becomes full-width within the page content area.

### Change column split from 6/6 to 8/4

```
col-span-8 = Form sections
col-span-4 = Receipt Preview (sticky)
```

### Template Name row at the very top (before sections)

A standalone row above all DashedSectionCards:
```
Template Name *  [___________________]     Active [toggle]
```

### Restructured "Template Info" card

Replace the current content with a 2x2 grid:

```
Row 1:  Restaurant Name (multilingual)  |  Tel #  [___________]
Row 2:  CR #  [___________]             |  VAT #  [___________]
```

- Restaurant Name uses `CompactMultiLanguageInput` (col-span-6)
- Tel #, CR #, VAT # are simple text inputs (col-span-6 each)
- These are always visible -- not behind checkboxes
- The `show_cr_number` and `show_vat_number` checkboxes remain in the Header section but only control receipt visibility (no inline text input there anymore)

### Header section cleanup

Remove the inline CR/VAT text inputs from the Header checkbox list. Keep the checkboxes for toggling visibility on the receipt only. The actual values are entered in Template Info above.

---

## 4. ReceiptPreview.tsx

- Show telephone number below branch mobile: `Tel: {data.telephone || "+966 12 345 6789"}`
- The telephone is shown when it has a value (or a placeholder in preview)

---

## 5. Save payload

Add `telephone` to the save payload and edit-load mapping.

---

## 6. Files Changed

| File | Change |
|------|--------|
| Database migration | Add `telephone` column |
| `ReceiptPreview.tsx` | Add `telephone` to interface, show in preview |
| `PrintTemplateFormPage.tsx` | Full-width 8/4 layout, template name at top, 2x2 info grid with Tel/CR/VAT, remove inline CR/VAT from header toggles |
| `PrintTemplateSaveModal.tsx` | Include telephone in summary |

