

# KDS Layout Restructure + Print Button + Modal Enhancement

## Overview

Three changes based on the reference images:

1. **Add Print button + show quantity prefix ("1 X") on item rows** (Image 1)
2. **Show Order ID in the item completion modal + quantity prefix** (Image 2)
3. **Remove the top black status bar; merge all controls into the bottom bar** (Image 3)

---

## 1. Item Rows: Add Quantity Prefix ("1 X")

**File:** `src/components/pos/kitchen/KitchenItemRow.tsx`

Currently quantity only shows when > 1 as a badge. Change to always show as `{qty} X` text before the item name (matching the reference: "1 X Mango Bite").

## 2. Print Button in Order Card Footer

**File:** `src/components/pos/kitchen/KitchenOrderCard.tsx`

Add a "Print" button next to "Mark All Done" in the footer area. The two buttons sit side by side:
- "Mark All Done" takes ~65% width (green)
- "Print" takes ~35% width (white/outlined)

Print will trigger `window.print()` for now (or a future print handler). The button appears regardless of completion state.

## 3. Item Completion Modal: Show Order Number + Quantity

**File:** `src/components/pos/kitchen/KitchenItemModal.tsx`

- Add `orderNumber` prop to the modal
- Display "Order Id: #{orderNumber}" at the top of the modal header (matching Image 2)
- Show quantity prefix "1 X" before the item name

**File:** `src/components/pos/kitchen/KitchenOrderCard.tsx`

- Pass `order.order_number` to `KitchenItemModal`

## 4. Remove Top Status Bar, Merge Into Bottom Bar

**File:** `src/pages/pos/KitchenDisplay.tsx`

- Remove `<KitchenStatusBar />` from the top
- Merge its data (Pending count, Urgent count, Bell toggle, Clock) into the bottom bar alongside filters

**File:** `src/components/pos/kitchen/KitchenFilters.tsx`

Rename/expand to become the unified bottom bar. New layout (left to right):
- **Left:** Pending count badge, Urgent count badge (with warning icon)
- **Center:** Filter pills (All, Urgent, Dine-in, Delivery, Takeaway, Self-pickup)
- **Right:** Bell icon + Switch toggle, Date/time clock

Accept new props: `pendingCount`, `urgentCount`, `bellEnabled`, `onToggleBell`

**File:** `src/components/pos/kitchen/KitchenStatusBar.tsx`

- Keep the file but it will no longer be rendered. Can be removed or left unused.

---

## Files Summary

| File | Changes |
|------|---------|
| `src/components/pos/kitchen/KitchenItemRow.tsx` | Always show "N X" quantity prefix |
| `src/components/pos/kitchen/KitchenOrderCard.tsx` | Add Print button in footer; pass orderNumber to modal |
| `src/components/pos/kitchen/KitchenItemModal.tsx` | Add orderNumber prop; show "Order Id: #N" header + quantity |
| `src/components/pos/kitchen/KitchenFilters.tsx` | Expand to unified bottom bar with stats, bell toggle, clock |
| `src/pages/pos/KitchenDisplay.tsx` | Remove top StatusBar; pass stats/bell props to Filters |

