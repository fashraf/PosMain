

# Nested Grid & Tooltip Item Layout Redesign + Orange Underline Consistency

## Overview

Redesign the item display in all 3 places (nested grid, tooltip, right drawer) to match the reference image layout. Add orange underline and orange dot indicator for customized items consistently across all views.

## Reference Image Layout (Per Item)

```text
+-----------------------------------------------+
| Chicken Biryani          [  1  ]       35.00   |
| 35.00 (unit price, muted green)    +3.00 SAR   |
| + Tomato                                       |
| -> Pepsi                                       |
+-----------------------------------------------+
```

- Item name: bold, left-aligned, orange underline if customized
- Unit price: small muted text below name
- Qty: centered in a subtle bordered box
- Line total: bold, right-aligned
- Customizations below: extras in green (`+ Name`), replacements in blue (`-> Name`), removals in red (`- Name`)
- Replacement/extra price diff shown on the right (`+3.00 SAR`)

## Changes

### 1. Nested Grid (`ExpandedOrderItems.tsx`) -- Card-style layout

- Replace the current 4-column table with a stacked card layout per item
- Each item card:
  - **Row 1**: Item name (bold, orange underline if customized) | Qty in bordered box | Line total (bold)
  - **Row 2**: Unit price in muted green below item name | Price diff on right (if any extras/replacements add cost)
  - **Row 3+**: Customization lines:
    - `+ {name}` in emerald for extras
    - `-> {name}` in blue for replacements  
    - `- No {name}` in red for removals
  - Orange dot indicator next to item name if customized
- Items separated by dotted lines
- Keep `#FAFAFA` background, `max-w-[50%]`, rounded corners

### 2. Tooltip (`OrderItemsTooltip.tsx`)

**Inline preview (trigger):**
- Keep badge pills (`bg-blue-50`, `text-[16px]`)
- Add orange underline (`decoration-orange-400`) for customized items (already present)
- Add small orange dot (`w-1.5 h-1.5 rounded-full bg-orange-400`) next to customized item badges

**Tooltip content:**
- Match the same card layout as nested grid
- Item name with orange underline if customized + orange dot
- Show all 3 customization types: extras, removals, replacements
- Include replacements (currently missing from tooltip -- only shows removed/added)
- Price breakdown at bottom (subtotal, tax, total)

### 3. Right Drawer (`OrderDetailDrawer.tsx`)

- Redesign items table to match card layout:
  - Item name (orange underline if customized) + orange dot
  - Unit price below name in muted text
  - Qty in bordered box
  - Line total bold right
  - Customizations listed below with colored labels
- Keep existing payment section and actions unchanged

### 4. Orange Underline + Orange Dot -- All 3 Places

Applied consistently when `hasCustom === true`:
- **Orange underline**: `underline decoration-orange-400 decoration-2 underline-offset-2` on item name
- **Orange dot**: small `w-1.5 h-1.5 rounded-full bg-orange-400 inline-block ml-1` next to the item name

### 5. `hasCustomization` Check -- Include Replacements

Update the `hasCustomization` helper in `OrderItemsTooltip.tsx` to also check `cust.replacements?.length > 0`, not just removed and added.

## Files Modified

| File | Changes |
|------|---------|
| `src/components/pos/orders/ExpandedOrderItems.tsx` | Card-style item layout matching reference image, orange underline + dot |
| `src/components/pos/orders/OrderItemsTooltip.tsx` | Add orange dot to badges, include replacements in tooltip content, card layout inside tooltip |
| `src/components/pos/orders/OrderDetailDrawer.tsx` | Card-style item layout in drawer, orange underline + dot, unit price display |

## Technical Details

### Shared customization rendering pattern (used in all 3 files):

```text
// Extract customization data
const removed = cust?.removedIngredients || []
const added = (cust?.addedIngredients || []).map(a => a.name || a)  
const replacements = (cust?.replacements || []).map(r => r.name || r)
const hasCustom = removed.length + added.length + replacements.length > 0

// Render pattern:
// Item name with orange underline + orange dot if customized
// + {name} in emerald for extras
// -> {name} in blue for replacements
// - No {name} in red for removals
```

### Qty box styling:
```text
className="inline-flex items-center justify-center min-w-[32px] h-7 border border-slate-200 rounded text-sm font-medium text-slate-700"
```

