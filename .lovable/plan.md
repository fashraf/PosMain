
# Cart Add Animation + Larger Item Cards

## 1. Green blink animation when adding item to cart

When an item is added to cart, the corresponding `CartItemRow` will flash green for ~2 seconds then fade out.

**How it works:**
- Track a `highlightedItemId` state in `CartPanel` (or parent)
- When `addItem` is called, set the highlighted ID to the newly added/updated cart item
- Pass it down to `CartItemList` -> `CartItemRow`
- `CartItemRow` applies a green background (`bg-emerald-100`) that fades out over 2s using a CSS transition
- After 2s, clear the highlight state

**Files:**
- `src/components/pos/cart/CartItem.tsx` -- accept `isHighlighted` prop, apply green flash class
- `src/components/pos/cart/CartItemList.tsx` -- accept `highlightedItemId`, pass `isHighlighted` to each row
- `src/components/pos/cart/CartPanel.tsx` -- add `highlightedItemId` state, set it on add, pass down
- `src/index.css` -- add a `@keyframes cart-flash-green` animation (green bg -> transparent over 2s)

**Animation CSS:**
```css
@keyframes cart-flash-green {
  0% { background-color: rgb(209 250 229); }   /* emerald-100 */
  100% { background-color: transparent; }
}
.animate-cart-flash {
  animation: cart-flash-green 2s ease-out forwards;
}
```

## 2. Increase POS item card size

Based on the reference image, the cards should be larger with:
- Bigger image: `52x52` -> `64x64`
- Bigger ADD button: `h-8` -> `h-10`
- More padding: `p-2.5` -> `p-3`
- Larger text: keep `text-base` for name, bump price to `text-lg`
- Fewer columns on smaller screens for more room: keep `grid-cols-2` but increase `gap-3` -> `gap-4`

**Files:**
- `src/components/pos/items/POSItemCard.tsx` -- increase image size, button height, padding
- `src/components/pos/items/POSItemGrid.tsx` -- increase gap

## Technical Details

| File | Change |
|------|--------|
| `POSItemCard.tsx` | Image 64x64, button h-10, padding p-3, price text-lg |
| `POSItemGrid.tsx` | Gap from gap-3 to gap-4 |
| `CartItem.tsx` | Add `isHighlighted` prop, apply `animate-cart-flash` class |
| `CartItemList.tsx` | Accept `highlightedItemId`, pass boolean to rows |
| `CartPanel.tsx` | Add highlight state, set on item add, clear after 2s |
| `src/index.css` | Add `cart-flash-green` keyframes + `.animate-cart-flash` class |
