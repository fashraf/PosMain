

# Fix Combo Sub-Item Persistence, Customization Logic, and Modal Redesign

## Issues Identified

### 1. `is_customizable` Flag Bug
Both `ItemsAdd.tsx` and `ItemsEdit.tsx` set `is_customizable: ingredientMappings.length > 0`. This means a combo item with sub-items but no ingredients won't get the "Customize" button in POS. Fix: also consider `subItemMappings.length > 0`.

### 2. Missing Pepsi Sub-Item
Only Mango Bite is in `item_sub_items`. The save logic itself is correct -- the user likely only added one sub-item. After fixing `is_customizable`, the user can re-edit Chicken Biryani, add Pepsi, and save successfully.

### 3. CustomizeModal Needs Full Redesign
The current modal uses a flat two-column grid. Per the user's detailed ASCII reference, it needs:

**Header**: Show item name, Base price, and live Current price
```
Customize Chicken Biryani Combo    Base 228.00 SAR  |  Current 233.00 SAR
```

**Body**: Two bordered cards side-by-side (col-6 each)
- Left card: "INGREDIENTS" -- each ingredient as a card with Remove and Extra toggle switches + extra price label
- Right card: "COMBO REPLACEMENTS" -- grouped by slot (e.g., "Drink Slot"), radio-style selection showing price and [default] tag

**Footer**: Changes summary + price breakdown + Cancel / Add to Cart buttons
- Lists applied changes (extras added, replacements selected)
- Price breakdown: Base, Extras, Replacement Difference, Final Total
- Two buttons: Cancel and Add to Cart with total price

**Height**: 75vh (currently 85vh)

## Technical Changes

| File | Change |
|---|---|
| `src/pages/ItemsAdd.tsx` (line 590) | Change `is_customizable` to `ingredientMappings.length > 0 \|\| subItemMappings.length > 0` |
| `src/pages/ItemsEdit.tsx` (line 660) | Same `is_customizable` fix |
| `src/components/pos/modals/CustomizeModal.tsx` | Full redesign: 75vh height, two bordered cards with ScrollArea, redesigned header with base/current prices, new footer with changes summary + price breakdown |
| `src/components/pos/modals/ReplacementPills.tsx` | Redesign to radio-style list items (not pills) showing price + [default] tag, grouped by slot name |

### CustomizeModal Layout Structure

```text
Dialog (80vw x 75vh)
+-- Header: "Customize: {name}" | "Base {base} SAR" | "Current {total} SAR"
+-- Body (flex-1, overflow hidden)
|   +-- grid-cols-2 gap-4, full height
|   |   +-- Left Card (border, rounded, flex-col)
|   |   |   +-- Header: "INGREDIENTS"
|   |   |   +-- ScrollArea: IngredientRow cards
|   |   +-- Right Card (border, rounded, flex-col)
|   |       +-- Header: "COMBO REPLACEMENTS"
|   |       +-- ScrollArea: Replacement groups with radio-style rows
+-- Footer (border-t)
    +-- Changes Summary (extras added, replacements changed)
    +-- Price Breakdown (Base, Extras, Replacement Diff, separator, Total)
    +-- Buttons: Cancel | Add to Cart - {total} SAR
```

### Replacement Group Display (radio-style)
Each group shows a label (e.g., "Drink Slot (choose 1)") followed by radio-style rows:
```text
[filled circle] Pepsi          0.00 SAR   [default]
[empty circle]  Coke           0.00 SAR
[empty circle]  Ice Tea       +3.00 SAR
```
- The default item is pre-selected when opening
- Selecting a non-default item records the price difference
- Selecting the default clears the replacement

### No database changes required.

