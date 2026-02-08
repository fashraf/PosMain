

# Resize Modals & Rearrange Quantity/Rules Layout

## Changes

### 1. Increase Modal Size to 65% Screen Width

Both `AddIngredientModal.tsx` and `AddItemModal.tsx` will change from `sm:max-w-[600px]` to `sm:max-w-[65vw]` to fill 65% of the screen.

### 2. Rename "Default Quantity" to "Quantity"

The label currently reads `t("itemMapping.defaultQuantity") || "Default Quantity"`. It will be changed to just `t("itemMapping.quantity") || "Quantity"` in both modals.

### 3. Rearrange Section 2 to a Single Row (4 columns)

Currently, Section 2 uses `grid-cols-2` placing fields in a 2x2 grid. The new layout will use `grid-cols-4` to place all four fields in one row:

| Col 1 | Col 2 | Col 3 | Col 4 |
|-------|-------|-------|-------|
| Quantity | Can Add Extra | Extra Cost | Can Remove |

This applies to both modals.

## Technical Details

### Files Modified

| File | Changes |
|------|---------|
| `src/components/item-mapping/AddIngredientModal.tsx` | Modal width to `sm:max-w-[65vw]`, Section 2 grid to `grid-cols-4`, label "Quantity" |
| `src/components/item-mapping/AddItemModal.tsx` | Modal width to `sm:max-w-[65vw]`, Section 2 grid to `grid-cols-4`, label "Quantity" |

### Specific Edits per File

**AddIngredientModal.tsx** (3 changes):
- Line 129: `sm:max-w-[600px]` becomes `sm:max-w-[65vw]`
- Line 230: `grid-cols-2` becomes `grid-cols-4`
- Line 234: Label changes from "Default Quantity" to "Quantity"

**AddItemModal.tsx** (3 changes):
- Line 145: `sm:max-w-[600px]` becomes `sm:max-w-[65vw]`
- Line 235: `grid-cols-2` becomes `grid-cols-4`
- Line 239: Label changes from "Default Quantity" to "Quantity"
