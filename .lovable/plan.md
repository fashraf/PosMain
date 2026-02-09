

# Edit Order Flow from Order Complete Page

## Overview

When the user clicks "Edit Order" on the order-complete page, the POS screen should load the existing order's items into the cart and display the Order ID in a red blinking badge in the cart header, making it clear the user is editing an existing order (not creating a new one).

## What Changes

### 1. POSMain -- Detect Edit Mode from Navigation State

`POSMain.tsx` currently ignores `location.state`. It needs to:
- Read `editOrderId` from `useLocation().state`
- Fetch the order + order items from the database
- Populate the cart with those items
- Store the editing order ID and order number in local state
- Pass the edit indicator down to `CartPanel` and `CartHeader`

### 2. CartHeader -- Show Blinking Red Order ID

When in edit mode, `CartHeader` will display a red blinking badge like:

**Editing Order #1042** (in red, with a CSS blink/pulse animation)

This replaces or supplements the normal "Total Item: X" header.

### 3. CartPanel -- Pass Edit State Through

`CartPanel` receives the edit info (order number) and forwards it to `CartHeader`.

### 4. CheckoutModal -- Support Update Mode

When editing an existing order, the submit handler should:
- UPDATE the existing `pos_orders` row instead of INSERTing a new one
- DELETE old `pos_order_items` and INSERT the new set
- Navigate to `/pos/order-complete` with `mode: "update"` and change summary

### 5. CSS Animation

Add a simple `animate-blink` keyframe to the Tailwind config or inline for the red order ID badge.

## Technical Details

### Files Modified

1. **`src/pages/pos/POSMain.tsx`**
   - Import `useLocation`
   - Read `location.state?.editOrderId`
   - Add `useEffect` to fetch order + items from `pos_orders` / `pos_order_items` when `editOrderId` is present
   - Populate cart via `cart.addItem()` for each order item
   - Store `editingOrderId` and `editingOrderNumber` in state
   - Pass `editingOrderNumber` to `CartPanel`
   - Pass `editingOrderId` + `editingOrderNumber` to `CheckoutModal`
   - Clear edit state after order complete

2. **`src/components/pos/cart/CartHeader.tsx`**
   - Add optional `editingOrderNumber` prop
   - When set, render a red pulsing badge: "Editing Order #XXX"

3. **`src/components/pos/cart/CartPanel.tsx`**
   - Accept optional `editingOrderNumber` prop
   - Forward to `CartHeader`

4. **`src/components/pos/checkout/CheckoutModal.tsx`**
   - Accept optional `editingOrderId` and `editingOrderNumber` props
   - In `handleSubmit`: if `editingOrderId` is set, do an UPDATE + delete/re-insert items instead of INSERT
   - Navigate with `mode: "update"` and compute a change summary (added/removed items)
   - Show "Update Order" instead of "Submit Order" on the button

5. **`src/index.css`** (or `tailwind.config.ts`)
   - Add a `blink` or `pulse-red` animation keyframe for the order ID badge

### Database

No schema changes needed -- all tables already support updates.

### Edit Flow Sequence

1. User clicks "Edit Order" on `/pos/order-complete`
2. Navigates to `/pos` with `state: { editOrderId: "uuid" }`
3. `POSMain` detects `editOrderId`, fetches order items from DB
4. Cart is populated with the fetched items
5. Red blinking "Editing Order #1042" appears in cart header
6. User modifies items, clicks Pay
7. `CheckoutModal` shows "Update Order" button
8. On submit: updates existing order row + replaces order items
9. Navigates to `/pos/order-complete` with `mode: "update"` and change summary

