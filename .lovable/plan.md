
# Compact Horizontal POS Item Card

## What Changes

Redesign `POSItemCard` from a vertical (image-on-top) layout to a compact horizontal layout:

```text
Current (vertical):              New (horizontal):
+------------------+            +----------------------------------+
|   [  Image  ]    |            | [img] Item Name         [ADD]   |
|                  |            |       Rs. 350.00    [CUSTOMIZE] |
|  Item Name       |            +----------------------------------+
|  Rs. 350.00      |
| [ADD] [CUSTOMIZE]|
+------------------+
```

### Layout Structure

- Card becomes a **single horizontal row** with 3 zones:
  1. **Left**: Small square image (48x48 rounded), hidden if no image
  2. **Middle**: Name (bold, truncated) on top, price below -- takes remaining space
  3. **Right**: Action buttons stacked vertically (compact)
- If no image, the text zone simply starts from the left edge
- "Customizable" badge sits as a small tag next to the item name instead of absolute-positioned

### Card Sizing

- Fixed height (~70-80px)
- Grid stays 2-4 columns but cards are much shorter, fitting more items on screen
- Dotted border, rounded corners preserved

### Button Adjustments

- Buttons become smaller pill-shaped (h-8 instead of h-11)
- If customizable: two buttons stacked vertically on the right
- If not customizable: single ADD button on the right
- Same colors: blue primary ADD, outline CUSTOMIZE

## Technical Details

### File Modified

| File | Change |
|------|--------|
| `src/components/pos/items/POSItemCard.tsx` | Complete layout restructure from vertical flex-col to horizontal flex-row with image, text, and button zones |

### No Other Files Affected

The grid (`POSItemGrid.tsx`) and all parent wiring remain unchanged -- only the card's internal layout changes.
