

# Fix Ingredient Grid: Replace Card Layout with Table + Add Edit Action

## Problem

The ItemsAdd and ItemsEdit pages currently render `IngredientMappingList` (a drag-and-drop card-based component without column headers or an Edit button) instead of the redesigned `IngredientTable` (which has proper table headers, badges, and Edit/Delete actions).

## Changes

### 1. Clean Up IngredientTable Columns

**File**: `src/components/item-mapping/IngredientTable.tsx`

Remove the "Cost" column (the last data column showing `SAR {(quantity * 5).toFixed(2)}`) since it is not in the spec. The final columns will be:

| Name | Quantity | Can Add | Extra Cost | Can Remove | Actions |

- Remove the `<th>` for "Cost" (line 60-62)
- Remove the `<td>` for cost (line 116-118)
- Update `colSpan` on empty state row from 7 to 6

### 2. Replace IngredientMappingList with IngredientTable in ItemsAdd

**File**: `src/pages/ItemsAdd.tsx`

- Replace `<IngredientMappingList>` (lines 952-956) with `<IngredientTable>` passing:
  - `mappings={ingredientMappings}`
  - `onRemove={handleIngredientRemove}`
  - `onAdd={() => setShowAddIngredientModal(true)}`
  - `onEdit={handleEditIngredient}`
- Remove the "Add Ingredient" button from the `DashedSectionCard`'s `rightBadge` prop (since `IngredientTable` has its own Add button in the header)
- Remove the cost footer block (lines 958-965)
- Update imports: add `IngredientTable` from `@/components/item-mapping`, remove `IngredientMappingList` import if no longer used

### 3. Replace IngredientMappingList with IngredientTable in ItemsEdit

**File**: `src/pages/ItemsEdit.tsx`

Same changes as ItemsAdd:
- Replace `<IngredientMappingList>` with `<IngredientTable>`
- Remove duplicate Add button from `rightBadge`
- Remove cost footer
- Update imports

### 4. Replace IngredientMappingList with IngredientTable in ItemIngredientMappingEdit

**File**: `src/pages/ItemIngredientMappingEdit.tsx`

- Already uses `IngredientTable` but does not pass `onEdit` -- add `onEdit` prop and wire up an edit handler

## Files Modified

| File | Changes |
|------|---------|
| `src/components/item-mapping/IngredientTable.tsx` | Remove "Cost" column, update colSpan |
| `src/pages/ItemsAdd.tsx` | Replace IngredientMappingList with IngredientTable, remove duplicate Add button and cost footer |
| `src/pages/ItemsEdit.tsx` | Same as ItemsAdd |
| `src/pages/ItemIngredientMappingEdit.tsx` | Add onEdit prop to IngredientTable |

