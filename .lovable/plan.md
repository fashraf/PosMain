

# Redesign Cart Item Row to Match Reference

## What Changes

The cart item row will be redesigned to match the reference screenshot with these behaviors:

### Visual Layout (matching the reference image)

```text
+-------------------------------------------------------+
| Total Item : 7 Qty Total |            [    Clear All  ]
+--------------------------------------------------------+
| [edit icon] Masala Paneer  [-] 1 [+]           228.00  |
| Price : 228.00 * 1 |
| × Tomato                                     removed
| + Extra Cheese                               +2.00 SAR
| ✏ Pepsi → Ice Tea                           +3.00 SAR
|                                           > 233.00 SAR (Bold)
+-------------------------------------------------------+
| Chicken Biryani             [-] 1 [+]      228.00 (Bold)
| Price : 228.00 * 1 |

+-------------------------------------------------------+



- **Left icon**: A customization indicator (e.g., a pencil/edit icon) shown only when the item has customizations. Clicking it opens the Customize Modal to view/edit modifications.
- **Item name**: Bold, on the first line next to the icon.
- **Quantity controls**: Colored minus (red/pink) and plus (blue) buttons with quantity between them.
- **Total**: Right-aligned line total.
- **Price breakdown**: Below the name, showing `Price : {unitPrice} * {qty}`.
- **Customization tags**: Listed below the price -- removals in red with `-` prefix, extras in green with `+` prefix, replacements in blue.
- **Minus to 1 deletes**: When quantity is 1 and user clicks minus, the item is removed from the cart (this already works via `updateCartItemQuantity` returning null for qty <= 0).

### Cart Header Update

- Show "Total Item : {count}" matching the reference format, replacing the current "Cart" label with badge.

### Behavior Details

- Clicking the edit icon on a customized item opens the CustomizeModal (not the old drawer) so the user can review and modify customizations.
- The separate "Remove" button row will be removed since minus-to-zero handles deletion.
- Non-customized items won't show the edit icon.

## Technical Details

### Files to Modify

1. **`src/components/pos/cart/CartItem.tsx`** -- Complete redesign of the row layout:
   - Replace `(c)` text indicator with a clickable edit icon (only for customized items)
   - Show price breakdown line: `Price : {unitPrice} * {qty}`
   - Style minus button with red/pink tint, plus button with blue tint
   - Remove the separate "Remove" / "Trash" button row
   - Keep customization detail lines (extras, removals, replacements)

2. **`src/components/pos/cart/CartHeader.tsx`** -- Update to show `Total Item : {count}` format with column headers (Qty, Total).

3. **`src/components/pos/cart/CartPanel.tsx`** -- Pass `totalQuantity` to CartHeader for the item count display.

4. **`src/components/pos/cart/CartItemList.tsx`** -- Update `onEdit` prop to work with the new icon click pattern (pass a simpler callback since the edit icon is directly on the row).

5. **`src/pages/pos/POSMain.tsx`** -- Wire the cart item edit to open `CustomizeModal` instead of `CustomizeDrawer`, so clicking the edit icon on a cart item opens the same modal used for initial customization.

### No database or schema changes required.
