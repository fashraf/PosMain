

# Fix Edit Modal Pre-fill and Item Replacement Grid

## Problems

1. **Ingredient/Item dropdowns don't pre-fill on Edit**: When clicking "Edit" on a mapped ingredient or item, the modal opens but the dropdown shows "Select..." instead of the current ingredient/item. This happens because the modals initialize state inside `handleOpenChange`, which is the Dialog's internal callback -- but the parent sets `open={true}` directly via the prop, so `handleOpenChange` never fires on open.

2. **Item Replacement grid not visible on Edit page**: The `ItemTable` (combo sub-items) section only renders when `formData.is_combo` is true, which works. However, there is no database query to load existing sub-item mappings, so the grid always appears empty. (There is currently no `item_sub_items` table in the database -- sub-items are local-only state.)

## Changes

### 1. Fix AddIngredientModal Pre-fill

**File**: `src/components/item-mapping/AddIngredientModal.tsx`

Add a `useEffect` that watches `open` and `editData` props. When both are truthy, initialize the local state (selectedIngredient, quantity, extraCost, canAddExtra, canRemove). Remove the initialization logic from `handleOpenChange` to avoid duplication.

```typescript
useEffect(() => {
  if (open && editData) {
    const ing = ingredients.find(i => i.id === editData.ingredientId);
    setSelectedIngredient(ing || null);
    setQuantity(editData.quantity);
    setExtraCost(editData.extraCost);
    setCanAddExtra(editData.canAddExtra);
    setCanRemove(editData.canRemove);
  }
}, [open, editData, ingredients]);
```

### 2. Fix AddItemModal Pre-fill

**File**: `src/components/item-mapping/AddItemModal.tsx`

Same fix -- add a `useEffect` on `open` + `editData` to initialize selectedItem, quantity, extraCost, canAddExtra, canRemove.

### 3. Ensure Replacement Grid Shows in ItemsEdit

**File**: `src/pages/ItemsEdit.tsx`

The combo sub-items section is already conditionally rendered. However, there is no database table to persist sub-item mappings yet, so the grid will be empty on edit. For now, the grid will display correctly (with drag-and-drop, replacement badges, etc.) for any items added during the current session. A future migration would be needed to persist combo sub-items.

No code changes needed for this file -- the grid already renders when `is_combo` is true.

## Files Modified

| File | Change |
|------|--------|
| `src/components/item-mapping/AddIngredientModal.tsx` | Add `useEffect` for edit data pre-fill, remove duplicate logic from `handleOpenChange` |
| `src/components/item-mapping/AddItemModal.tsx` | Add `useEffect` for edit data pre-fill, remove duplicate logic from `handleOpenChange` |

