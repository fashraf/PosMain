

# Fix Customize Modal: Ingredients, Sub-Items, and Layout

## Issues Found

1. **Ingredient Remove/Extra toggles not showing**: The `IngredientRow` component decides whether to show the "Extra" toggle by checking `extra_price > 0`. However, Tomato has `can_add_extra: true` but `extra_cost: null` (meaning extra is free). The `can_add_extra` flag from the database is never passed through to the POS ingredient type, so the toggle never appears. Similarly, the "Remove" toggle only shows when `is_removable` is true -- Tomato has `can_remove: false`, which is correct, but the Extra toggle is broken.

2. **Replacement sub-items not showing**: Checking the database, only Mango Bite (default) is saved as a sub-item for Chicken Biryani. Pepsi was never persisted. The Items save logic needs to be verified, and the data re-saved. The Customize Modal also needs to render sub-items in a separate "Items" card.

3. **Modal height**: Currently 85vh, needs to be 75vh per user request.

4. **Two-card layout**: Ingredients and Items (sub-items/replacements) should be in two separate bordered cards side by side (col-6 each).

## Changes

### 1. Add `can_add_extra` flag to POS types and hook

**File: `src/lib/pos/types.ts`**
- Add `can_add_extra: boolean` to `POSItemIngredient` interface

**File: `src/hooks/pos/usePOSItems.ts`**
- Map `can_add_extra` from `item_ingredients` data into the POS ingredient object (currently only `can_remove` is mapped to `is_removable`)

### 2. Fix IngredientRow toggle logic

**File: `src/components/pos/modals/IngredientRow.tsx`**
- Change `canExtra` from `ingredient.extra_price > 0` to `ingredient.can_add_extra` (the new flag)
- The Extra toggle should show whenever the ingredient allows extras, regardless of whether there is an extra cost

### 3. Fix sub-item save logic

**File: `src/pages/ItemsAdd.tsx`** and **`src/pages/ItemsEdit.tsx`**
- Verify the sub-item save code actually inserts all sub-items (not just the first one). The current data shows only 1 sub-item was saved for Chicken Biryani, suggesting the save might be dropping items or the user only added one.

### 4. Redesign CustomizeModal layout

**File: `src/components/pos/modals/CustomizeModal.tsx`**
- Change `max-h-[85vh]` to `max-h-[75vh]`
- Replace the current flat grid layout with two separate bordered cards:
  - **Left card (col-6)**: "Ingredients" header + ingredient rows with Remove/Extra toggles
  - **Right card (col-6)**: "Items" header + replacement pills/sub-item options
- Both cards should have a border, rounded corners, and their own scroll area if content overflows
- Always show both cards even if one section is empty (show "No ingredients" or "No items" placeholder)

## Technical Details

| File | Change |
|---|---|
| `src/lib/pos/types.ts` | Add `can_add_extra: boolean` to `POSItemIngredient` |
| `src/hooks/pos/usePOSItems.ts` | Map `can_add_extra` from database field in `usePOSItemDetails` |
| `src/components/pos/modals/IngredientRow.tsx` | Use `ingredient.can_add_extra` instead of `extra_price > 0` for showing Extra toggle |
| `src/components/pos/modals/CustomizeModal.tsx` | Change height to 75vh; wrap Ingredients and Items sections in separate bordered cards with col-6 layout |
| `src/pages/ItemsAdd.tsx` | Verify sub-item insert logic handles all mappings |
| `src/pages/ItemsEdit.tsx` | Verify sub-item load and re-save logic |

No database changes needed -- the `item_sub_items` table and `item_ingredients` table already have the correct columns. The Pepsi sub-item just needs to be re-added via the Items Edit page after the save logic is verified.
