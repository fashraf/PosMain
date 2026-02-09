

# Complete Order -- Full-Screen Checkout Modal Redesign

## Overview

Replace the current bottom drawer checkout with a large **90vh x 90vw Dialog modal** using a **3-column layout** optimized for tablet touch. The modal is titled "Complete Order" and includes Order Review, Order Type, and Payment sections side by side.

## Layout Structure

```text
+--------------------------------------------------------------+
| Complete Order                                          [X]   |
+------------------+------------------+------------------------+
| ORDER REVIEW     | ORDER TYPE       | PAYMENT                |
| (col-4)          | (col-4)          | (col-4)                |
|                  |                  |                        |
| Scrollable items | 4 large cards:   | Radio: Cash / Card /   |
| with qty stepper | - Dining         |   Both / Pay Later     |
| and mod chips    | - Take Away      |                        |
|                  | - Self Pickup    | Cash: total, tendered, |
| Sticky totals:   | - Delivery       |   +10/+20/+50/Exact,  |
| Subtotal         |                  |   change display       |
| VAT              | If Delivery:     |                        |
| TOTAL (bold)     |   address field  | Both: cash + card      |
|                  |   (mandatory)    |   split inputs         |
|                  |                  |                        |
|                  |                  | Pay Later: disabled    |
|                  |                  |   for takeaway/pickup  |
+------------------+------------------+------------------------+
| [Clear Order]                          [Submit Order]         |
+--------------------------------------------------------------+
```

## Detailed Column Breakdown

### Column 1 -- Order Review (col-span-4)

- Scrollable list of cart items
- Each item row: name, unit price, quantity stepper (- qty +), edit icon to open customize modal
- Modifier chips below each item: red "No Tomato", green "+ Cheese", blue replacement arrows
- Sticky bottom section within column:
  - Subtotal, VAT (15%), Grand Total (large, bold, primary color)

### Column 2 -- Order Type (col-span-4)

- 4 large touchable cards with icons (UtensilsCrossed, ShoppingBag, Package, Truck)
  - Dining, Take Away, Self Pickup, Delivery
- Single selection, highlighted with primary border + bg tint
- Update OrderType enum: add `'self_pickup'` alongside existing types
- Conditional: when "Delivery" selected, show inline address textarea (mandatory, red border if empty)
- Customer details (mobile + name) shown below order type cards

### Column 3 -- Payment (col-span-4)

- **Payment method radio group** (large touch-friendly buttons):
  - Cash, Card, Both (Split), Pay Later
  - "Pay Later" disabled when order type is Take Away or Self Pickup
- **Dynamic fields based on selection:**
  - **Cash**: Read-only total, tendered amount input (large numeric), quick-add buttons (+10, +20, +50, Exact), auto-calculated change (green if positive, red if negative/insufficient)
  - **Card**: No additional fields (just total display)
  - **Both (Split)**: Two inputs -- "Cash Amount" and auto-calculated "Card Amount" (total - cash). Validation: cash cannot exceed total
  - **Pay Later**: No fields, just confirmation text
- Total displayed prominently at top of payment column

## Footer

- **Left**: "Clear Order" button (outline/destructive) -- triggers confirmation modal before clearing
- **Right**: "Submit Order" button (primary, large) -- disabled until all validations pass
- Validation rules:
  - Cart must not be empty
  - If Delivery: address is required
  - If Cash: tendered >= total
  - If Both: cash amount must be > 0 and <= total

## After Submit -- Order Confirmation Screen

- Replace modal content with a success view:
  - Large checkmark icon
  - "Order Placed!" heading
  - Order number (#XXXX)
  - Brief order summary (item count, total)
  - Action buttons: "New Order" (primary, clears cart and closes), "Print Receipt" (outline, placeholder for future)

## Type Updates

Update `CheckoutFormData` in `types.ts`:

```typescript
export type PaymentMethod = 'cash' | 'card' | 'both' | 'pay_later';
export type OrderType = 'dine_in' | 'takeaway' | 'self_pickup' | 'delivery';

export interface CheckoutFormData {
  orderType: OrderType;
  customerMobile: string;
  customerName: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  tenderedAmount: number;
  cashAmount: number; // for split
  takenBy: string;
  notes: string;
}
```

## Database Changes

- The `pos_orders` table already stores `order_type` as a string and `payment_method` as a string, so no schema migration is needed. We just write the new enum values ('self_pickup', 'card', 'both', 'pay_later') and add a `tendered_amount` and `change_amount` column via migration.

## Files to Create / Edit

| File | Action |
|------|--------|
| `src/lib/pos/types.ts` | Update OrderType, PaymentMethod, CheckoutFormData |
| `src/components/pos/checkout/CheckoutModal.tsx` | **NEW** -- main 90% dialog with 3-column layout |
| `src/components/pos/checkout/OrderReviewColumn.tsx` | **NEW** -- scrollable items + totals |
| `src/components/pos/checkout/OrderTypeColumn.tsx` | **NEW** -- type cards + delivery address + customer form |
| `src/components/pos/checkout/PaymentColumn.tsx` | **NEW** -- payment method selection + cash/split fields |
| `src/components/pos/checkout/OrderConfirmation.tsx` | **NEW** -- post-submit success view |
| `src/components/pos/checkout/index.ts` | Update exports |
| `src/pages/pos/POSMain.tsx` | Swap `CheckoutDrawer` for `CheckoutModal` |
| DB migration | Add `tendered_amount` and `change_amount` columns to `pos_orders` |

## Design Tokens

- White background, gray-50 column backgrounds
- Primary (#3d44fc) for selected states and CTA
- Minimum 44px touch targets on all buttons
- Large text for totals (text-2xl), medium for prices (text-lg)
- Rounded-xl cards with border-2 for order type selection
- Same visual language as the existing CustomizeModal (85vw dialog pattern)

