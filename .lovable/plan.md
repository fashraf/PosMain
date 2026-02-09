
# Payment Reconciliation on Order Edit

## Overview

When an order is edited and the total changes, the order-complete page should show a clear, icon-driven reconciliation banner telling the cashier exactly what to do:

- **Total increased** (red/orange): "Collect 15.50 SAR more" with an upward arrow icon
- **Total decreased** (green): "Return 8.25 SAR to customer" with a downward arrow icon  
- **No change** (neutral): "No payment action needed" with a checkmark icon

## What Changes

### 1. Track Previous Total

When entering edit mode, `POSMain.tsx` will also fetch and store the **previous total** from the original order. This gets passed through to `CheckoutModal`, which passes it in the navigation state to the order-complete page.

### 2. CheckoutModal -- Pass Previous Total

Add `previousTotal` to the navigation state when in edit mode so the order-complete page can calculate the difference.

### 3. OrderComplete -- Payment Reconciliation Card

Add a new `PaymentReconciliationCard` component that only appears when `mode === "update"`. It compares `previousTotal` vs `total` and shows one of three states:

- **Collect More** -- Orange/red card with `TrendingUp` icon and the exact amount to collect
- **Return to Customer** -- Green card with `TrendingDown` icon and the exact amount to refund
- **No Action** -- Neutral card with `CheckCircle2` icon confirming totals match

This card will appear prominently between the totals section and the payment details section, with clear large text and intuitive icons.

## Technical Details

### Files Modified

1. **`src/pages/pos/POSMain.tsx`**
   - Fetch `total_amount` when loading the order for editing
   - Store it in a new state variable `previousOrderTotal`
   - Pass it to `CheckoutModal` as a new prop

2. **`src/components/pos/checkout/CheckoutModal.tsx`**
   - Accept new `previousOrderTotal` prop
   - Include `previousTotal` in the navigation state to `/pos/order-complete` (only in edit mode)

3. **`src/pages/pos/OrderComplete.tsx`**
   - Extend `OrderCompleteState` interface with `previousTotal?: number`
   - Add a `PaymentReconciliationCard` component that renders between totals and payment details
   - Three visual states:
     - **Collect more**: Orange border, `TrendingUp` icon, bold amount in orange
     - **Return**: Green border, `TrendingDown` icon, bold amount in green
     - **No action**: Neutral border, `CheckCircle2` icon, "Totals match" message
