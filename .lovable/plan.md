

# POS Order List -- Refined Polish Pass

## Overview

Incremental polish of the existing Order List to match the latest spec: +2px font sizing, refined Items column format, dotted nested grid separators, clickable stat cards, "Last Updated" indicator, column header icons, and width tuning for Type/Time Ago columns.

## Changes

### 1. Font Size Bump (+2px globally within `.pos-orders-font`)

**File: `src/index.css`**
- Update `.pos-orders-font` to set `font-size: 15px` (base 13px + 2px) as the root size for the POS orders scope
- All `text-[12px]` cells in the table become `text-[14px]`
- All `text-[13px]` become `text-[15px]`
- Tab text stays `text-sm` (14px) which is already appropriate at +2px from 12px
- Tooltip inherits the larger base from `.pos-orders-font`

### 2. Items Column Format Change

**File: `src/components/pos/orders/OrderItemsTooltip.tsx`**
- Change the inline preview text from `"3 Items (Mango Bite, Curd, ...)"` to the format: `"1 x Mango Bite, 2 x Curd, 1 x Chicken Biryani (c)"`
- Each item shows `{qty} x {name}`
- If an item has customizations, append `(c)` after its name
- Items joined by `, ` with ellipsis if more than 3 items
- Remove the separate "3 Items" count prefix -- the format itself conveys quantity

### 3. Nested Grid Dotted Row Separators

**File: `src/components/pos/orders/ExpandedOrderItems.tsx`**
- Change row borders from `border-t border-slate-100` (solid) to `border-t border-dotted border-slate-200`
- Keep the `#FAFAFA` background and shadow styling

### 4. Nested Grid Width: 50%

**File: `src/components/pos/orders/ExpandedOrderItems.tsx`**
- The nested grid container gets `max-w-[50%]` so it only spans half the parent row width (left-aligned)
- Keeps it compact and unobtrusive

### 5. Clickable Stat Cards (Filter Action)

**File: `src/components/pos/orders/OrderStatCards.tsx`**
- Accept an `onCardClick(tab: OrderStatusTab)` prop
- Map each card to a tab: Total -> "all", In Process -> "unpaid", Completed -> "completed", Total Sales -> "completed"
- Add `cursor-pointer` and `hover:shadow-md` transition
- Active card gets a subtle ring/border highlight

**File: `src/pages/pos/OrderList.tsx`**
- Pass `onCardClick={(tab) => updateFilter("tab", tab)}` to `OrderStatCards`

### 6. "Last Updated" Indicator

**File: `src/pages/pos/OrderList.tsx`**
- Add a small `"Last updated: X min ago"` text next to the stat cards row (right-aligned)
- Calculated from `dataUpdatedAt` returned by TanStack Query's `useQuery` result
- Updates every 30s via the existing tick interval

### 7. Column Header Icons

**File: `src/pages/pos/OrderList.tsx`**
- Add tiny icons (14px) next to column header text:
  - Order #: `Hash` icon
  - Items: `ShoppingBag` icon
  - Type: `Utensils` icon
  - Payment: `CreditCard` icon
  - Total: `DollarSign` icon
  - Time: `Clock` icon
  - Time Ago: `Timer` icon
  - Status: `Activity` icon
- Icons are `text-slate-400` and `h-3.5 w-3.5`, inline with the header text

### 8. Type and Time Ago Column Width Increase

**File: `src/pages/pos/OrderList.tsx`**
- Type column: increase from `w-[75px]` to `w-[95px]` so "Self Pickup" fits on one line
- Time Ago column: increase from `w-[75px]` to `w-[95px]` so "1h 23m ago" fits on one line
- Type cell font stays at the new `text-[14px]`

### 9. Table Cell Font Size Updates

**File: `src/pages/pos/OrderList.tsx`**
- All `text-[12px]` table cells -> `text-[14px]`
- Order # cell `text-sm` -> `text-[15px]`
- Total cell `text-sm` -> `text-[15px]`
- View button text `text-[11px]` -> `text-[13px]`
- Header cells `text-xs` -> `text-[13px]`

## Summary of Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Bump `.pos-orders-font` base font-size to 15px |
| `src/pages/pos/OrderList.tsx` | Column widths, font sizes, header icons, last-updated text, stat card click handler |
| `src/components/pos/orders/OrderItemsTooltip.tsx` | Items format: `1 x Name (c), 2 x Name` |
| `src/components/pos/orders/ExpandedOrderItems.tsx` | Dotted row borders, 50% max width |
| `src/components/pos/orders/OrderStatCards.tsx` | Clickable cards with `onCardClick` prop |
| `src/hooks/pos/usePOSOrders.ts` | Expose `dataUpdatedAt` from query result |

