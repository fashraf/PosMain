

# Smart Payment for Order Edits

## Overview

When editing an existing order, the Payment column in the checkout modal will calculate the **balance difference** between the previous total and the new total, and adjust the payment logic accordingly:

- **New total = Previous total**: No payment needed -- show a green checkmark with "No payment action needed"
- **New total < Previous total** (items removed): No payment to collect -- show a green refund banner with "Return X.XX SAR to customer"
- **New total > Previous total** (items added): Only collect the **balance** -- show the difference as the amount due, not the full total

## What Changes

### PaymentColumn

Pass `previousOrderTotal` as a new optional prop. When in edit mode (i.e. `previousOrderTotal` is provided):

1. Calculate `balanceDue = total - previousOrderTotal`
2. **If balanceDue <= 0** (equal or refund scenario):
   - Hide all payment method buttons and tendered amount inputs
   - Show a reconciliation banner:
     - Equal: Green `CheckCircle2` icon -- "No payment action needed"
     - Refund: Green `TrendingDown` icon -- "Return X.XX SAR to customer"
3. **If balanceDue > 0** (additional payment needed):
   - Show an orange `TrendingUp` banner: "Collect X.XX SAR additional"
   - Show payment method buttons but use `balanceDue` as the effective amount for cash tendered validation and change calculation
   - The "Exact" quick-add button fills the balance amount, not the full total
   - Cash change is calculated against the balance, not the full total

### CheckoutModal

- Pass `previousOrderTotal` to `PaymentColumn`
- Update `canSubmit()` validation:
  - If editing and balance <= 0, always allow submission (no payment validation needed)
  - If editing and balance > 0, validate tendered amount against the **balance**, not the full total
- Update `getSubmitHint()` to reflect balance-based messages

### No other files change

The `PaymentReconciliationCard` on the order-complete page remains as-is -- it already handles the post-submission summary.

## Technical Details

### Files Modified

1. **`src/components/pos/checkout/PaymentColumn.tsx`**
   - Add optional `previousTotal?: number` prop
   - Compute `balanceDue = total - (previousTotal ?? total)`
   - When `balanceDue <= 0`: render a reconciliation card (reuse icons from `PaymentReconciliationCard`) and hide payment inputs
   - When `balanceDue > 0`: show an "Additional payment" banner above payment methods, use `balanceDue` for cash change calculation and the Exact button

2. **`src/components/pos/checkout/CheckoutModal.tsx`**
   - Pass `previousOrderTotal` to `PaymentColumn`
   - Update `canSubmit()`: if edit mode and `balanceDue <= 0`, skip cash/split validation
   - Update `canSubmit()`: if edit mode and `balanceDue > 0`, validate tendered amount against `balanceDue` instead of `cart.total`
   - Update `getSubmitHint()` accordingly

### Payment Logic Summary

```text
balanceDue = newTotal - previousTotal

balanceDue <= 0:
  - No payment fields shown
  - Submit always enabled (cart not empty + address ok)
  - Banner shows refund amount or "no action"

balanceDue > 0:
  - Payment methods shown
  - Cash: tendered must >= balanceDue
  - Change = tendered - balanceDue
  - Exact button = Math.ceil(balanceDue)
  - Split: cashAmount validated against balanceDue
```
