

# POS Order List (Cashier View)

## Overview

A dedicated `/pos/orders` page within the POS layout, providing cashiers with a fast, touch-friendly order management screen. The page lists all orders with status tabs, filters, item tooltips, and action buttons -- optimized for high-volume restaurant/gas-station environments.

## Page Structure

### Header Bar (Sticky)
- Title "Orders" on the left
- "+ New Order" button on the right (navigates to `/pos`)

### Status Tabs (Sticky, below header)
- All | Active | Unpaid | Completed | Cancelled
- "Unpaid" tab shows a small warning icon
- Active = paid orders from today that are not cancelled
- Unpaid = `payment_status = 'pending'`
- Completed = `payment_status = 'paid'`
- Cancelled = `payment_status = 'cancelled'`

### Filter Bar (Sticky, below tabs)
- Search input (order number or item name)
- Date filter (Today default, with options for Yesterday, Last 7 Days, All)
- Order Type dropdown (All, Dine In, Take Away, Delivery, Self Pickup)
- Payment Method dropdown (All, Cash, Card, Split, Pay Later)
- Default sort: newest first (created_at DESC)

### Order Table
- Columns: Order # | Items | Type | Payment | Total | Time | Status | Actions
- 42px row height, zebra striping, lavender hover
- Unpaid rows get a soft red pulse animation (reuse `animate-pulse-red` from CSS)
- "Items" column shows count + first 2-3 item names truncated; hovering/tapping opens a tooltip showing full item breakdown with customizations, subtotal, tax, and total

### Status Badges
- Paid: Green pill
- Pending: Red pill with soft pulse
- Cancelled: Grey pill
- Split (both): Yellow pill

### Action Buttons (per row)
- **Edit** (Pencil icon): Navigate to `/pos` with `editOrderId` state (existing flow)
- **Collect Payment** (Banknote icon): Only visible on unpaid orders; opens a payment-only modal
- **Cancel** (XCircle icon): Opens the existing `CancelOrderModal`
- **Delete** (Trash2 icon): Only visible for managers; confirms with a PIN/confirmation modal

### Order Detail Drawer (click on Order #)
- Right-side sheet showing full order details
- Items table with customizations
- Payment details card
- Totals breakdown
- Created-by info and timestamps

## Database Changes

### New table: `pos_order_audit_log`
Tracks all changes to orders for the audit history section.

```sql
CREATE TABLE pos_order_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  action text NOT NULL,
  details text,
  performed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pos_order_audit_log ENABLE ROW LEVEL SECURITY;
```

RLS: Admins can manage; authenticated users with branch access can view logs for their orders.

**Note**: Audit log population will be a follow-up enhancement. The table is created now so the UI can reference it.

## New Files

1. **`src/pages/pos/OrderList.tsx`** -- Main page component with tabs, filters, table, and actions
2. **`src/components/pos/orders/OrderStatusBadge.tsx`** -- Reusable status pill component
3. **`src/components/pos/orders/OrderItemsTooltip.tsx`** -- Hover/tap tooltip showing item breakdown
4. **`src/components/pos/orders/OrderDetailDrawer.tsx`** -- Right-side sheet for full order view
5. **`src/components/pos/orders/CollectPaymentModal.tsx`** -- Payment-only modal for unpaid orders
6. **`src/components/pos/orders/DeleteOrderModal.tsx`** -- Manager-only delete confirmation
7. **`src/hooks/pos/usePOSOrders.ts`** -- TanStack Query hook for fetching/filtering orders

## Modified Files

1. **`src/App.tsx`** -- Add route `/pos/orders` within POSLayout
2. **`src/pages/pos/index.ts`** -- Export `OrderList`
3. **`src/components/pos/layout/POSLayout.tsx`** -- (Optional) Add a minimal top nav link to toggle between POS and Orders

## Key Implementation Details

### Data Fetching (`usePOSOrders`)
- Fetches from `pos_orders` with filters for status, date range, order type, payment method
- Joins `profiles` for cashier name (taken_by -> profiles.full_name)
- Joins `pos_order_items` for item details (used in tooltips)
- Sorted by `created_at DESC`
- Paginated (15 per page)
- Uses TanStack Query with refetch on window focus

### Collect Payment Modal
- Reuses the same payment method buttons and cash/card logic from `PaymentColumn`
- Only allows payment entry -- no item editing
- Updates `pos_orders` with payment_status, payment_method, tendered_amount, change_amount

### Permissions
- Edit, Cancel, Collect Payment: Available to all authenticated POS users
- Delete: Checks `user_roles` for `manager` or `admin` role before showing the button
- Role check done via a query to `user_roles` table (no client-side storage)

### Responsive Behavior
- Full table on desktop/tablet landscape
- On narrower screens: Items column collapses to just count ("3 Items")
- Action buttons remain icon-only for space efficiency

### Navigation Integration
- POSLayout gets a minimal top bar with "POS" and "Orders" links
- Order complete page gets a "View Orders" button alongside existing actions

