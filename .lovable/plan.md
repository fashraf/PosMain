

# Full Cart Redesign: Match Reference Image

The previous plan only covered the header. Here is the complete set of changes covering every remaining item from your original specification.

## Summary of All Changes

### 1. Cart Header Redesign (`CartHeader.tsx`)
- Merge into a **single row**: Cart icon + "Total Item : X" on the left, "Qty" label in center-right, "Clear All" button on far right
- Remove the separate column headers sub-row

### 2. Cart Item Card Redesign (`CartItem.tsx`)
- **Card style**: Each item becomes a rounded card (`rounded-2xl`) with subtle shadow and light border, padding 16-20px
- **Layout restructure**:
  - Left: Item name (16px bold)
  - Right column: Line total price in **20px bold** high-contrast
  - Below name: Modification tags (14px) -- red strikethrough for removals, green "+" for extras, purple arrow for replacements
  - Quantity controls: Large pill-style `[- 1 +]` buttons (44x44px min touch targets, 14px qty number)
  - Edit pencil icon (24px) moved to bottom-right of card, only visible for customized items
- Remove the "Price : X.XX x qty" breakdown line (not in reference)
- Remove the unit total line at bottom of customization details

### 3. Cart Item List (`CartItemList.tsx`)
- Add spacing/gap between cards instead of flat divider lines
- Each card is visually separated by whitespace (gap-3)

### 4. Bottom Footer Redesign (`PayButton.tsx` + `CartTotals.tsx`)
- **Merge** CartTotals and PayButton into a single sticky footer bar
- **Left side**: "Clear Cart" button (red outline, with trash icon) -- moved from header
- **Right side**: Large green "Confirm & Pay -> XXX SAR" button with cart icon
- Remove the separate Subtotal/VAT/TOTAL breakdown section (move subtotal info into the header area instead)
- The header gets a **Subtotal: XXX SAR** display (22px bold)

### 5. Empty Cart State (`CartPanel.tsx`)
- Replace plain "Your cart is empty" with a centered friendly message and subtle styling

### 6. CartPanel Layout Updates (`CartPanel.tsx`)
- Pass `totalQuantity` and `subtotal` to CartHeader for display
- Move "Clear All" action from header to footer
- Remove CartTotals component usage (merged into footer)

## Files Changed

| File | Change |
|------|--------|
| `CartHeader.tsx` | Single row, add Qty label, add Subtotal display (22px bold) |
| `CartItem.tsx` | Card-style with rounded corners, shadow, larger prices (20px), bigger qty buttons (44px), pencil bottom-right |
| `CartItemList.tsx` | Gap spacing between cards instead of dividers |
| `CartTotals.tsx` | Remove (merged into footer) |
| `PayButton.tsx` | Redesign as full footer: Clear Cart (left) + Confirm & Pay (right, green) |
| `CartPanel.tsx` | Updated layout, pass new props, improved empty state |
| `index.ts` | Update exports if needed |

## Technical Details

**CartHeader** new props:
```
totalQuantity: number  (sum of all qty)
subtotal: number       (for display)
```

**CartItem card** structure:
```text
+-----------------------------------------------+
| Item Name                    42.50 SAR (20px)  |
| - Onion removed (red)                          |
| + Cheese +3.50 (green)                         |
| -> Pepsi instead of Mango (purple)             |
|                     [- ] 2 [ +]         pencil |
+-----------------------------------------------+
```

**Footer** structure:
```text
| [Trash Clear Cart]          [Confirm & Pay -> 120.50 SAR] |
```

Qty buttons increase from 28px (h-7) to 44px (h-11) for proper touch targets. Prices go from text-sm to text-xl for the line total.

