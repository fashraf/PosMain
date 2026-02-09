

# KDS Enhancements -- Order Sorting, Blink, Bell, Dividers, Mark All Done, Undo

## Overview

Six targeted improvements to make the Kitchen Display more functional and visually informative.

---

## 1. Descending Order (Latest First)

Currently orders sort oldest-first with completed pushed to the bottom. Change to **descending** (newest first), keeping completed orders at the bottom.

**File:** `src/hooks/pos/useKitchenOrders.ts`
- Reverse the sort: `new Date(b.created_at).getTime() - new Date(a.created_at).getTime()` (instead of a - b)
- Completed orders still sink to bottom

---

## 2. New Order Blink (8 times) + Ring

Currently new orders (<60s) get `animate-pulse` which runs infinitely. Replace with a custom CSS keyframe animation that blinks exactly 8 times over ~4 seconds, plus a solid colored ring border.

**File:** `tailwind.config.ts`
- Add keyframe `kds-blink`: alternates opacity between 1 and 0.4, runs 8 iterations over 4s

**File:** `src/components/pos/kitchen/KitchenOrderCard.tsx`
- Replace `animate-pulse` with the new `animate-kds-blink` class
- Add `ring-2 ring-amber-400` (solid ring, not 50% opacity) so the ring is clearly visible even after blinking stops

---

## 3. Items Divided by Dotted Line, Center-Aligned at 75% Width

Each item row will be separated by a centered dotted divider line that spans 75% of the card width.

**File:** `src/components/pos/kitchen/KitchenOrderCard.tsx`
- Between each `KitchenItemRow`, insert a `<div className="mx-auto w-3/4 border-t border-dotted border-slate-300" />` divider
- Skip divider before the first item

---

## 4. Bell Icon for Orders Older Than 30 Minutes

When an order has been active for 30+ minutes and still has incomplete items, show an animated ringing bell icon in the card header next to the time-ago text.

**File:** `src/components/pos/kitchen/KitchenOrderCard.tsx`
- Calculate elapsed minutes from `order.created_at`
- If elapsed >= 30 and order has incomplete items, render a `Bell` icon from lucide-react with a CSS wiggle/ring animation in red-orange color
- Position: right side of the gradient header bar, next to the "Xm ago" text

**File:** `tailwind.config.ts`
- Add keyframe `kds-bell-ring`: a subtle left-right rotation wiggle that loops continuously

---

## 5. "Mark All as Done" Button

Add a button in each order card footer (next to the progress bar) that marks ALL remaining incomplete items as done in one tap.

**File:** `src/hooks/pos/useKitchenOrders.ts`
- Add a new mutation `markAllComplete` that takes an array of order item IDs and upserts all of them into `kds_item_status` in a batch

**File:** `src/components/pos/kitchen/KitchenOrderCard.tsx`
- Add a "Mark All Done" button (with `CheckCheck` icon) below the progress bar
- Only visible when there are incomplete items remaining
- Calls the new `markAllComplete` handler
- Shows a confirmation toast

**File:** `src/pages/pos/KitchenDisplay.tsx`
- Pass `handleMarkAllComplete` down to `KitchenOrderCard`

---

## 6. Undo Complete (Per Item)

Allow tapping a completed item to undo it (revert to incomplete).

**File:** `src/components/pos/kitchen/KitchenItemRow.tsx`
- Remove `disabled={item.is_completed}` so completed items are tappable
- When a completed item is tapped, call a new `onUndoTap` callback

**File:** `src/components/pos/kitchen/KitchenOrderCard.tsx`
- When a completed item is tapped, call `undoItemComplete` directly (no modal needed -- instant undo with toast)
- Pass `onUndoTap` prop to `KitchenItemRow`

**File:** `src/pages/pos/KitchenDisplay.tsx`
- Extract `undoItemComplete` from the hook and pass it through

---

## Files Summary

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Add `kds-blink` (8x blink) and `kds-bell-ring` (wiggle) keyframes + animations |
| `src/hooks/pos/useKitchenOrders.ts` | Reverse sort order; add `markAllComplete` mutation; expose `undoItemComplete` |
| `src/components/pos/kitchen/KitchenOrderCard.tsx` | 8x blink + ring for new orders; dotted dividers between items; bell icon for 30m+ orders; "Mark All Done" button; undo handler for completed items |
| `src/components/pos/kitchen/KitchenItemRow.tsx` | Make completed items tappable; add `onUndoTap` callback |
| `src/pages/pos/KitchenDisplay.tsx` | Pass `handleMarkAllComplete` and `undoItemComplete` to cards |

