

# Fix: Green flash not triggering on first-time item add

## Root Cause

When adding a **new** item to the cart, the highlight ID is set to `item.id` (the menu item ID, e.g. `"curd-123"`), but the actual cart item gets a **random UUID** (e.g. `"a1b2c3..."`). The `CartItemList` compares `highlight.id` against the cart item's UUID -- they never match, so no animation plays.

For **existing** items (re-adding the same thing), `cart.items.find(i => i.menuItemId === item.id)` finds the existing cart entry and uses its UUID -- so the flash works. But for new items, the `find()` returns `undefined` because React hasn't committed the state update yet.

## Fix

After calling `cart.addItem(...)`, look up the matching cart item to get its **cart ID**. Since React state updates are batched, we need to read from `cart.items` which may not yet include the new item. The fix: always try to find the matching cart item, and if not found (new item), fall back to `item.id` (the menu item ID). Then in `CartItemList`, match against **both** `item.id` and `item.menuItemId`.

**Simpler approach**: Change the comparison in `CartItemList` to also check `item.menuItemId`:

```
const isHighlighted = highlight?.id === item.id || highlight?.id === item.menuItemId;
```

This way, whether we highlight by cart UUID or by menu item ID, it will match.

## Technical Details

### File: `src/components/pos/cart/CartItemList.tsx`

Change the highlight match logic from:
```tsx
const isHighlighted = highlight?.id === item.id;
```
to:
```tsx
const isHighlighted = highlight?.id === item.id || highlight?.id === item.menuItemId;
```

This is a **one-line fix** -- no other files need to change. The `handleAddItem` in `POSMain.tsx` already passes `item.id` (menu item ID), and for increment/decrement it passes the cart item UUID. Both cases will now match correctly.

