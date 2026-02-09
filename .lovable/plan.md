

# Enhanced Order Complete Page

## Overview

Upgrade the `/pos/order-complete` page with two additions:
1. **Payment details section** -- show exactly how the customer paid (tendered amount, change given, cash/card split, or pending status)
2. **Three action buttons** -- Edit Order, New Order, Cancel Order (with reason selection)

## What Changes

### 1. Pass Additional Payment Data from CheckoutModal

The `navigate()` call in `CheckoutModal.tsx` currently passes only `paymentMethod`. We need to also pass:
- `tenderedAmount` (for cash payments)
- `changeAmount` (cash change returned)
- `cashAmount` / `cardAmount` (for split payments)
- `paymentStatus` ("paid" or "pending")
- `orderId` (needed for cancel/edit operations)

### 2. Payment Summary Section on OrderComplete Page

Below the totals card, add a new "Payment Details" card that adapts to the payment method:

- **Cash**: Shows Tendered Amount, Change Given (green highlight)
- **Card**: Shows "Charged to Card" with the total
- **Both (Split)**: Shows Cash portion and Card portion
- **Pay Later**: Shows "Payment Pending" amber warning

### 3. Replace Current Action Buttons with Three Buttons

Replace the current "Print Receipt" + "New Order" with:

- **Edit Order** (outline, violet) -- navigates back to `/pos` and re-opens the checkout modal with this order's data loaded (placeholder for now -- navigates to `/pos` with state indicating edit mode)
- **New Order** (primary) -- navigates to `/pos` and clears the cart
- **Cancel Order** (outline, destructive) -- opens a modal asking for a cancellation reason

### 4. Cancel Order Modal

A small dialog with predefined cancellation reasons:
- Customer changed mind
- Duplicate order
- Wrong items entered
- Customer didn't pay
- Other (free text)

On confirm, updates the order in the database:
- Sets `payment_status` to `'cancelled'`
- Navigates back to `/pos`

### 5. Database: Add cancellation columns

Add two columns to `pos_orders`:
- `cancelled_at` (timestamptz, nullable)
- `cancel_reason` (text, nullable)

## Technical Details

### Database Migration

```sql
ALTER TABLE public.pos_orders
  ADD COLUMN cancelled_at timestamptz,
  ADD COLUMN cancel_reason text;
```

### Files Modified

1. **`src/pages/pos/OrderComplete.tsx`**
   - Expand `OrderCompleteState` interface with payment detail fields (`tenderedAmount`, `changeAmount`, `cashAmount`, `cardAmount`, `paymentStatus`, `orderId`)
   - Add a "Payment Details" card section between totals and actions
   - Replace action buttons with Edit Order / New Order / Cancel Order
   - Add cancel reason modal state and handler
   - Cancel handler: calls Supabase update on `pos_orders`, sets `payment_status='cancelled'`, `cancelled_at=now()`, `cancel_reason`

2. **`src/components/pos/checkout/CheckoutModal.tsx`**
   - Add `orderId`, `tenderedAmount`, `changeAmount`, `cashAmount`, `cardAmount`, `paymentStatus` to the navigation state passed to `/pos/order-complete`

3. **New: `src/components/pos/modals/CancelOrderModal.tsx`**
   - A small AlertDialog with reason radio buttons + optional free text
   - Calls `onConfirm(reason: string)`

### No changes needed to types, routing, or layout files.
