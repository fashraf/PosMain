

# Kitchen Display System (KDS) -- Phase 1

## Overview

Build a full-screen Kitchen Display System at `/pos/kitchen` that shows active (unpaid/pending) orders as visual cards in a responsive grid. Kitchen staff can tap individual items to mark them as completed, with real-time updates via Supabase Realtime.

This is a significant new module. Phase 1 focuses on the core display and item completion workflow. Advanced features (station filtering, sound alerts, offline mode, dark mode) are deferred to future phases.

## What You Will See

- A full-screen page with a top status bar showing pending count, urgent count, and current time
- Order cards in a responsive grid (2-4 columns depending on screen width)
- Each card has a colored top bar (blue = dine-in, red = delivery, orange = takeaway, green = self-pickup)
- Items listed with checkboxes -- tap to mark done
- Per-item timer with color coding (green/yellow/orange/red)
- Progress bar per order showing completion percentage
- When all items are done, the order card auto-fades and moves to a "completed" state
- Filter bar at the bottom: All / Urgent / by order type

## Database Changes

### New table: `kds_item_status`

Tracks per-item completion state separately from the POS order data (non-destructive).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | Auto-generated |
| `order_item_id` | uuid FK -> pos_order_items(id) | Unique constraint |
| `is_completed` | boolean | Default false |
| `completed_at` | timestamptz | Null until done |
| `completed_by` | uuid FK -> profiles(id) | Who marked it done |
| `created_at` | timestamptz | Default now() |

- Realtime enabled on this table
- RLS: authenticated users can select, insert, and update

### Why a separate table?

The existing `pos_order_items` table stores order/financial data. Mixing kitchen workflow state into it would complicate the POS module. A separate table keeps concerns clean and allows independent realtime subscriptions.

## New Files

### 1. `src/pages/pos/KitchenDisplay.tsx` -- Main page

- Full-screen layout (no sidebar, no scroll -- uses POSLayout)
- Top bar: "KITCHEN DISPLAY" title, date/time (auto-updating), pending count, urgent count
- Responsive card grid using CSS grid (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4`)
- Bottom filter bar: All / Urgent / Dine-in / Delivery / Takeaway
- Auto-refresh every 10s + Supabase Realtime for instant updates

### 2. `src/components/pos/kitchen/KitchenOrderCard.tsx` -- Order card

- Colored top bar based on order type
- Order number, order type label, time since creation
- Customer name (for delivery orders)
- List of items with checkboxes and timers
- Progress bar at the bottom (completed / total items, percentage)

### 3. `src/components/pos/kitchen/KitchenItemRow.tsx` -- Single item row

- Large touch target (min 56px height)
- Checkbox area on the left
- Item name (bold) with customization details below (same color-coded format: extras in green, removals in red, replacements in blue)
- Per-item timer on the right with color coding
- When completed: row becomes gray, shows "Done at HH:MM", checkbox filled
- Tap anywhere on the row to trigger completion

### 4. `src/components/pos/kitchen/KitchenItemModal.tsx` -- Confirmation modal

- Appears on tap of an item row
- Shows item name + customizations
- Large green "YES -- DONE" button
- Smaller gray "No" button
- Auto-closes on confirm
- 3-second undo toast at bottom after completion

### 5. `src/components/pos/kitchen/KitchenStatusBar.tsx` -- Top status bar

- Left: "KITCHEN DISPLAY" + optional station name
- Center: Pending orders count, Urgent count (red badge)
- Right: Current date/time (updates every second)

### 6. `src/components/pos/kitchen/KitchenFilters.tsx` -- Bottom filter bar

- Pill-style buttons: All / Urgent / Dine-in / Delivery / Takeaway
- Active filter highlighted

### 7. `src/components/pos/kitchen/index.ts` -- Barrel export

### 8. `src/hooks/pos/useKitchenOrders.ts` -- Data hook

- Fetches active orders (payment_status = 'pending' OR 'paid') from today
- Joins `kds_item_status` to get completion state per item
- Sorts: overdue first, then by creation time
- Realtime subscription on both `pos_orders` and `kds_item_status`
- Mutation: `markItemComplete(orderItemId)` -- upserts into `kds_item_status`
- Mutation: `undoItemComplete(orderItemId)` -- deletes from `kds_item_status`

## Routing

Add `/pos/kitchen` route in `App.tsx` using the existing `POSLayout` wrapper, same pattern as `/pos/orders`.

Update `src/pages/pos/index.ts` to export `KitchenDisplay`.

## Timer Logic

Per-item timer counts UP from the order's `created_at` timestamp (since we do not have per-item prep time estimates yet):

| Elapsed | Color | Style |
|---------|-------|-------|
| 0-5 min | Green | Normal |
| 5-10 min | Yellow/Amber | Normal |
| 10-15 min | Orange | Normal |
| 15+ min | Red | Pulse animation |

## Order Card Top Bar Colors

| Order Type | Color |
|-----------|-------|
| dine_in | Blue (`bg-blue-500`) |
| delivery | Red (`bg-red-500`) |
| takeaway | Orange (`bg-orange-500`) |
| self_pickup | Green (`bg-emerald-500`) |

## Interaction Flow

1. Kitchen staff sees grid of active order cards
2. Cards sorted by urgency (red timers first)
3. Tap any uncompleted item row
4. Modal appears: "Was it completed?" with big green "YES -- DONE" button
5. Tap YES: item turns gray with "Done at HH:MM", progress bar updates
6. 3-second undo toast appears at bottom
7. When all items in an order are done, card shows "ORDER COMPLETE" overlay and fades after 5 seconds

## Files Summary

| File | Action |
|------|--------|
| Migration SQL | Create `kds_item_status` table + RLS + realtime |
| `src/pages/pos/KitchenDisplay.tsx` | New -- main KDS page |
| `src/components/pos/kitchen/KitchenOrderCard.tsx` | New -- order card component |
| `src/components/pos/kitchen/KitchenItemRow.tsx` | New -- item row with timer |
| `src/components/pos/kitchen/KitchenItemModal.tsx` | New -- tap-to-complete modal |
| `src/components/pos/kitchen/KitchenStatusBar.tsx` | New -- top status bar |
| `src/components/pos/kitchen/KitchenFilters.tsx` | New -- bottom filter pills |
| `src/components/pos/kitchen/index.ts` | New -- barrel export |
| `src/hooks/pos/useKitchenOrders.ts` | New -- data fetching + realtime hook |
| `src/App.tsx` | Add `/pos/kitchen` route |
| `src/pages/pos/index.ts` | Export KitchenDisplay |

