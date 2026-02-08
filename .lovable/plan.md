

# Three Fixes: Independent Slot Replacements, Column Layout, Remove Subtotal

## Issue 1: Slot replacements are not independent

**Problem**: The CustomizeModal stores `selectedReplacement` as a single object. When you pick Pepsi in the "Mango Bite" slot, it overwrites the state, so "Curd" slot also loses its selection (or vice versa). Each slot group should work independently.

**Fix**: Change `selectedReplacement` from a single object to a **Map keyed by group name**. Each slot group maintains its own selection independently.

### Files changed:

**`src/components/pos/modals/CustomizeModal.tsx`**
- Change state from `useState<{...} | null>` to `useState<Map<string, {...}>>(new Map())`
- `handleReplacementSelect(rep)` updates only the specific group key in the map
- `isDirty` checks `selectedReplacements.size > 0`
- `calculateLivePrice` sums price diffs across all selected replacements
- `buildCustomizationData` passes all replacements (or the first non-default one for backward compatibility with the single `replacement` field in `CustomizationData`)

**`src/lib/pos/types.ts`**
- Change `CustomizationData.replacement` from single object to `replacements: Array<{id, group, name, priceDiff}>` (or keep backward-compatible by storing multiple)

**`src/lib/pos/priceCalculations.ts`**
- Update `calculateLivePrice` to accept a Map of replacements and sum all price diffs
- Update `buildCustomizationData` to accept the Map and produce the customization data
- Update `calculateCustomizedPrice` to handle multiple replacements

**`src/lib/pos/cartUtils.ts`**
- Update `hasCustomization` to check the new replacements structure

**`src/components/pos/cart/CartItem.tsx`**
- Update rendering to show multiple replacements if present

## Issue 2: Column layout -- Ingredients col-4, Combo Replacements col-8

**Problem**: Current layout is `grid grid-cols-2` (50/50 split).

**Fix in `CustomizeModal.tsx`**: Change to `grid grid-cols-12`, Ingredients card gets `col-span-4`, Combo Replacements card gets `col-span-8`.

## Issue 3: Remove subtotal from cart header

**Fix in `CartHeader.tsx`**: Remove the subtotal display section (lines 28-38). Remove `subtotal` from props.

**Fix in `CartPanel.tsx`**: Stop passing `subtotal` prop to CartHeader.

