

# Print Template Form Fixes

## Overview

Several quick fixes to the Print Template form: simplify Restaurant Name to a plain text input, remove "Branch Name" references, fix the sticky footer overlap with sidebar, hide logo placeholder in preview when no image uploaded, and add field validation with focus-on-error.

---

## Changes

### 1. PrintTemplateFormPage.tsx

**Restaurant Name -- plain text input (remove multilingual tabs)**
- Replace `CompactMultiLanguageInput` with a simple `Input` for Restaurant Name
- Remove the `restaurant_name_ar` and `restaurant_name_ur` state fields from `defaultData` and save payload
- Use a single `restaurant_name_en` field mapped to a simple text input labeled "Restaurant Name"
- Remove the `CompactMultiLanguageInput` import

**Header checkboxes -- rename "Branch Name" to "Restaurant Name"**
- Change the label from `"Branch Name"` to `"Restaurant Name"` in the header checkbox list (line 286)
- Keep the key as `show_branch_name` (no DB change needed, just a label rename)

**Fix sticky footer overlapping sidebar**
- The footer currently uses `ps-[16rem]` but the buttons appear to overlap the sidebar area
- Change to use `left-[16rem]` instead of `inset-x-0` so the footer starts after the sidebar:
  ```
  "fixed bottom-0 right-0 left-[16rem] bg-background border-t p-4 z-30 flex items-center gap-3"
  ```
- Remove the `ps-[16rem] pe-4` / `pe-[16rem] ps-4` padding logic since the positioning handles it

**Add validation with focus-on-error**
- Validate before opening save modal:
  - Template Name is required (non-empty after trim)
  - Restaurant Name is required (non-empty after trim)
- On validation failure: show toast error, scroll to and focus the first invalid field using `data-field` attributes
- Add `data-field="name"` and `data-field="restaurant_name"` attributes to the respective inputs

### 2. ReceiptPreview.tsx

**Hide logo placeholder when no image uploaded**
- Currently when `show_logo` is true but `logo_url` is null, a "LOGO" placeholder box is shown
- Change: only show the logo section when `show_logo && data.logo_url` (has an actual image)
- This means the placeholder box disappears -- the logo area only appears when a real image is uploaded

**Remove branch name references in preview**
- The preview shows "Al Riyadh Main Branch" when `show_branch_name` is true
- Rename this to show the restaurant name value (already handled by the restaurant name display above it)
- Actually, `show_branch_name` now means "Restaurant Name" so the preview should show the `restaurant_name_en` value when `show_branch_name` is checked, falling back to "Sample Restaurant"

### 3. PrintTemplateSaveModal.tsx

- Update the "Branch Name" pill label to "Restaurant Name"

---

## Technical Details

### Fields simplified
- `restaurant_name_en` stays as the single restaurant name field (plain Input, no tabs)
- `restaurant_name_ar` and `restaurant_name_ur` set to empty strings in payload (kept in DB for backward compat, just not shown in form)

### Validation rules
| Field | Rule | Error message |
|-------|------|--------------|
| Template Name | Required, non-empty after trim | "Template name is required" |
| Restaurant Name | Required, non-empty after trim | "Restaurant name is required" |

### Footer fix
```
Before: "fixed bottom-0 inset-x-0 ... ps-[16rem]"
After:  "fixed bottom-0 right-0 left-[16rem] ... px-4"
```

### Files changed
- `src/components/print-templates/PrintTemplateFormPage.tsx`
- `src/components/print-templates/ReceiptPreview.tsx`
- `src/components/print-templates/PrintTemplateSaveModal.tsx`

