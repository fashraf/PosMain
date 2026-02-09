
# Fix Customization Data Field Names + Extra Prices

## Problem

The customization data is stored in the database as:
- `extras: [{id, name, price}]`
- `removals: [{id, name}]`
- `replacements: [{id, group, name, priceDiff}]`

But the `OrderItemCard` component reads:
- `cust?.removedIngredients` (wrong -- should be `cust?.removals`)
- `cust?.addedIngredients` (wrong -- should be `cust?.extras`)

The `hasCustomization` helper in `OrderItemsTooltip.tsx` has the same wrong field names. This is why only replacements show up -- that field name happens to match.

## Changes

### 1. Fix field names in `OrderItemCard.tsx`

- Line 11: `cust?.removedIngredients` changes to `cust?.removals`
- Line 12: `cust?.addedIngredients` changes to `cust?.extras`
- For `removed`, extract name from objects: `removals` stores `{id, name}`, not plain strings
- For `added`/extras, price field is `price` (already correct)
- For replacements, price field is `priceDiff` (fix from `price_difference`)
- Show extra price inline: `+ Tomato (+2.00)` in emerald

### 2. Fix `hasCustomization` in `OrderItemsTooltip.tsx`

- Line 21: `cust.removedIngredients` changes to `cust.removals`
- Line 22: `cust.addedIngredients` changes to `cust.extras`

This ensures the orange underline and orange dot appear correctly on badges.

## Files Modified

| File | Change |
|------|--------|
| `src/components/pos/orders/OrderItemCard.tsx` | Fix field names (`removals`, `extras`), show extra prices inline |
| `src/components/pos/orders/OrderItemsTooltip.tsx` | Fix `hasCustomization` field names |
