
# Remove "Custom" Badge from POS Item Card

## What
Remove the "CUSTOM" badge/chip that appears next to the item name on the POS item card (highlighted in the screenshot).

## Change (1 file)

**`src/components/pos/items/POSItemCard.tsx`** (lines 52-56)

Delete the conditional block that renders the "Custom" badge:

```tsx
// Remove this block:
{isCustomizable && (
  <span className="flex-shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
    Custom
  </span>
)}
```

The EDIT button already signals that an item is customizable, making the badge redundant.
