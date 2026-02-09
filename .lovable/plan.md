

# Order List UI Redesign -- Summary Cards, Expandable Rows, and Improved Layout

## Overview

Redesign the Order List page to match the reference image with four summary stat cards at the top, a more compact and aligned table layout, expandable rows showing item details inline (nested grid), and a larger/improved tooltip.

## Changes

### 1. Summary Stat Cards (New Section)

Add a row of 4 icon-driven stat cards above the tabs:

- **Total Orders** -- `ClipboardList` icon, count of all orders in current date range
- **In Process** -- `Layers` icon, count of pending/unpaid orders
- **Completed** -- `CheckSquare` icon, count of paid orders
- **Payment Pending** -- `DollarSign` icon, count of unpaid orders

Each card: white bg, rounded-xl border, dark icon in a rounded square badge, bold number + subtitle. Laid out in a 4-column grid.

### 2. Tabs + Filters on Same Row

Move the tabs and filter controls (search, date, type, payment) onto a single row to reduce vertical space waste. Tabs on the left, filters on the right -- matching the reference image layout.

### 3. Expandable / Nested Item Rows

Add a chevron toggle on each order row. Clicking it expands the row to show a nested sub-table of items:

| Item Name | Customization | Qty | Price |
|-----------|---------------|-----|-------|
| Chicken Biryani | -- No Tomato, + Extra Cheese | 1 | 46.00 |
| Curd | | 1 | 0.00 |

This gives full item + customization visibility without needing a tooltip or drawer.

### 4. Bigger Tooltip

Increase tooltip width from `max-w-xs` (320px) to `max-w-sm` (384px), increase padding and font size to `text-sm` (14px), and add more breathing room between items.

### 5. Compact Row Alignment

- Tighter column widths, consistent alignment
- Action icons grouped tightly with uniform spacing
- Remove unnecessary cell padding
- Ensure all columns align cleanly as in the reference

## Technical Details

### Files Modified

1. **`src/pages/pos/OrderList.tsx`**
   - Add summary stat cards section (computed from order data via a separate count query or derive from current data)
   - Merge tabs + filters into one sticky row
   - Add expandable row state (`expandedOrderId`) with a chevron toggle in the Order # column
   - Render a nested `<tr>` with a sub-table when expanded, showing items with customization details
   - Tighten column class widths and padding

2. **`src/components/pos/orders/OrderItemsTooltip.tsx`**
   - Increase `max-w-xs` to `max-w-sm`
   - Change `text-xs` to `text-sm`
   - Increase padding from `p-3` to `p-4`
   - Add `min-w-[320px]` for consistent width

3. **`src/hooks/pos/usePOSOrders.ts`**
   - Add a new `useOrderStats` hook (or inline query) that fetches counts: total, in-process, completed, pending -- scoped to the current date filter
   - This avoids loading all orders just for counts

### Expanded Row Design

When a row is expanded, a full-width sub-row appears below it containing a mini-table:

```
| Item Name          | Customization              | Qty | Price  |
|--------------------|----------------------------|-----|--------|
| Chicken Biryani    | - No Tomato, + Extra Cheese|  1  | 46.00  |
| Curd               |                            |  1  |  0.00  |
```

- Light gray background (`bg-muted/30`)
- Dotted top border
- Smaller text (`text-[13px]`)
- Customization shown inline as comma-separated tags with `-` and `+` prefixes

### Stat Cards Layout

Four equal-width cards in a grid:
- Each card: `rounded-xl border p-4 flex items-center gap-3`
- Icon: 40x40 rounded-lg dark bg with white icon
- Text: Bold large number + small muted subtitle

