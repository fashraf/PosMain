

# Clean Up Ingredient & Item Grids + Remove Replacement from Item Modal

## Changes Overview

### 1. IngredientTable -- Add "Actions" Column Header + Make Edit Modal-Only

**File**: `src/components/item-mapping/IngredientTable.tsx`

- Add "Actions" label to the currently empty `<th>` column header (line 68)
- Remove the inline `QuantityControl` from the Quantity column -- display quantity as read-only text instead (editing happens only via the modal)
- Remove the cost footer (`<tfoot>` block, lines 172-184) -- no cost details at the bottom
- Remove `onQuantityChange` from the props interface since quantity is no longer editable inline
- Remove `totalCost` from props since footer is removed

### 2. AddItemModal -- Remove Replacement Rule Section

**File**: `src/components/item-mapping/AddItemModal.tsx`

- Delete Section 3 ("Replacement Rule") entirely (lines 302-361) -- the replacement item dropdown, validation error, and section header
- Remove `replacementItem` state, `replacementDropdownOpen` state, `replacementItems` memo, and `replacementError` logic
- Update `onConfirm` signature to remove the `replacementItem` parameter
- Update `handleConfirm` to not pass `replacementItem`
- Update `isValid` to remove `replacementError` check
- Clean up `handleClose` to remove replacement state resets
- Remove `editData.replacementItemId` handling from `handleOpenChange`

### 3. ItemTable -- Redesign to Match IngredientTable Style

**File**: `src/components/item-mapping/ItemTable.tsx`

Complete redesign to use the same clean table structure as IngredientTable with:

| Column | Align | Content |
|--------|-------|---------|
| Name | Left | Item name (text) |
| Replacement | Center | Replacement item name or "--" |
| Quantity | Center | Read-only quantity display (no inline edit) |
| Combo Price | Right | SAR value |
| Actual Cost | Right | SAR value |
| Can Add | Center | Green pill badge (Yes) or dash |
| Can Remove | Center | Blue pill badge (Yes) or dash |
| Actions | Center | Edit (pencil, opens modal) + Delete (trash, confirmation) |

- Remove `onQuantityChange` from props (no inline editing)
- Remove replacement sub-rows (no longer needed since replacement is just a column value)
- Remove `onReplacement`, `onRemoveReplacement`, `onViewReplacement` props
- Remove footer with cost totals (`totalCost`, `totalComboPrice` props removed)
- Same visual styling as IngredientTable: zebra striping, hover effects, pill badges, animation

### 4. Update Parent Pages (ItemsAdd + ItemsEdit)

**Files**: `src/pages/ItemsAdd.tsx`, `src/pages/ItemsEdit.tsx`

- Remove `onQuantityChange` prop from `IngredientTable` usage
- Remove `totalCost` prop from `IngredientTable` usage
- Remove `onQuantityChange`, `totalCost`, `totalComboPrice`, `onReplacement`, `onRemoveReplacement`, `onViewReplacement` props from `ItemTable` usage
- Update `AddItemModal` `onConfirm` handler to remove `replacementItem` parameter

## Files Modified

| File | Action |
|------|--------|
| `src/components/item-mapping/IngredientTable.tsx` | Add Actions header, remove inline quantity editing, remove cost footer |
| `src/components/item-mapping/AddItemModal.tsx` | Remove Section 3 (Replacement Rule) and all replacement-related state/logic |
| `src/components/item-mapping/ItemTable.tsx` | Rewrite to match IngredientTable style with specified columns |
| `src/pages/ItemsAdd.tsx` | Update props passed to grids and modal |
| `src/pages/ItemsEdit.tsx` | Same prop updates |
