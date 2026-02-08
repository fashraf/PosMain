

# Redesign Cart Item Card to Match Reference Layout

## Current vs Reference

The current layout stacks vertically: name + price on top, mods in middle, qty controls at bottom.

The reference image shows a **horizontal single-line layout** for the main row:

```text
+----------------------------------------------------------+
| Chicken Biryani    [-] 4 [+]                    140.00   |
+----------------------------------------------------------+

+----------------------------------------------------------+
| Chicken Biryani    [-] 1 [+]  pencil             35.00   |
| -> Pepsi                                      +3.00 SAR  |
|                                             * 38.00      |
+----------------------------------------------------------+

+----------------------------------------------------------+
| Chicken Biryani    [-] 1 [+]  pencil             35.00   |
| + Tomato                                                 |
+----------------------------------------------------------+
```

Key layout rules from the image:
- **Row 1**: Item name (left), qty controls (center), pencil icon (if customized), line total (right) -- all on one horizontal line
- **Row 2+**: Modification lines below, with price diffs right-aligned
- **Green dot total**: When customizations change the price, show a green-dot total below the base price (e.g., "* 38.00")
- Pencil icon appears inline with qty controls, not in bottom-right corner

## Change (1 file)

**`src/components/pos/cart/CartItem.tsx`**

Restructure the card layout:

```text
<div card>
  <!-- Main row: all on one line -->
  <div flex items-center justify-between>
    <span name (flex-shrink-0, ~40% width)>
    <div qty controls [-] N [+]>
    {isCustomized && <pencil button>}
    <span price (text-xl bold, right-aligned)>
  </div>

  <!-- Modification lines below -->
  {mods && <div mods>
    {removals...}
    {extras with +price right-aligned}
    {replacement with price diff right-aligned}
    {hasExtraCost && <div green-dot total>}
  </div>}
</div>
```

Specific changes:
1. Move qty controls and pencil icon onto the same row as the item name and price
2. Show base price (item.basePrice * item.quantity) as the main price when customized, with a green-dot adjusted total below
3. Pencil icon sits between qty controls and price, inline
4. Remove the spacer div and bottom-row layout
5. Keep 44px touch targets for qty buttons

