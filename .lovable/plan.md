
# Merge Ingredient/Item Headers and Enhance Delete Confirmation

## What Changes

### 1. Remove separate headers from IngredientTable and ItemTable
Both tables currently have their own header bars with title + "Add" button. These will be removed. Instead, the parent `DashedSectionCard` wrappers in `ItemsAdd.tsx` and `ItemsEdit.tsx` will be replaced with a single unified section card that has both "Add Ingredient" and "Add Item" buttons in its header.

### 2. Unified Mapping Section
Replace the two separate `DashedSectionCard` wrappers (one for Ingredients, one for Items) with a single section that:
- Has a single header with title "Mapping" (or similar)
- Shows "Add Ingredient" and "Add Item" (if combo) buttons in the top-right
- Renders both `IngredientTable` and `ItemTable` stacked inside

### 3. Remove internal headers from IngredientTable and ItemTable
- `IngredientTable`: Remove the header bar (icon + title + "Add" button) at lines 181-200. Keep only the `<table>` content.
- `ItemTable`: Remove the header bar at lines 267-286 (and the non-combo placeholder at 248-263). Keep only the `<table>` content. The `onAdd` prop can be removed from both.

### 4. Delete confirmation mentions replacements
Update `RemoveConfirmModal` to accept an optional `replacementCount` prop. When deleting an item that has replacements, the confirmation message will include a note like: "This will also remove X replacement(s) associated with this item."

## Technical Details

### Files Modified

| File | Change |
|------|--------|
| `src/components/item-mapping/IngredientTable.tsx` | Remove header div (lines 181-200), remove `onAdd` from props, render only the table directly inside the border container |
| `src/components/item-mapping/ItemTable.tsx` | Remove header div (lines 267-286) and non-combo placeholder (lines 248-263), remove `onAdd` from props, render only the table. When `!isCombo`, render nothing (or just a disabled message without header) |
| `src/components/item-mapping/RemoveConfirmModal.tsx` | Add optional `replacementCount?: number` prop. When > 0, append warning text about replacements being deleted |
| `src/pages/ItemsAdd.tsx` | Replace two separate `DashedSectionCard` wrappers (ingredients + items) with one unified section. Move "Add Ingredient" and "Add Item" buttons into the section header. Pass replacement count to RemoveConfirmModal |
| `src/pages/ItemsEdit.tsx` | Same changes as ItemsAdd.tsx -- unified section with both buttons in header, pass replacement count to RemoveConfirmModal |
| `src/pages/ItemIngredientMappingEdit.tsx` | Same pattern -- unified section header with action buttons |

### Unified Section Layout

```text
+--------------------------------------------------+
| [Carrot] Mapping    [+ Add Ingredient] [+ Add Item] |
+--------------------------------------------------+
| Ingredients Table (drag, name, qty, etc.)         |
|--------------------------------------------------|
| Items Table (drag, name, replacement, qty, etc.)  |
| (only shown when is_combo = true)                 |
+--------------------------------------------------+
```

### RemoveConfirmModal Enhancement

When `itemType === "item"` and `replacementCount > 0`:
- Show additional warning: "This will also remove {count} replacement(s) associated with this item."

The replacement count is derived from the mapping's `replacements?.length` when calling `handleRequestRemove`.
