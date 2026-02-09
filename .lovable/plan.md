

# Fix Order Type Check Constraint Mismatch

## Problem

The database has a check constraint on `pos_orders.order_type` that only allows these values:
- `pay_order`
- `delivery`
- `takeaway`
- `dine_in`

But the app code defines the order type `self_pickup`, which is not in the allowed list. When a user selects "Self Pickup" and submits, the insert fails.

## Solution

Update the database constraint to replace `pay_order` with `self_pickup`, since:
- The UI uses `self_pickup` consistently across 5 files
- The original `OrderTypeSelector` had "Pay & Order" mapped to `dine_in` (duplicate), suggesting `pay_order` was a leftover that was never properly used
- `self_pickup` is the meaningful order type alongside dine-in, takeaway, and delivery

## Technical Details

### Database Migration

Drop and re-create the check constraint:

```sql
ALTER TABLE public.pos_orders
  DROP CONSTRAINT pos_orders_order_type_check;

ALTER TABLE public.pos_orders
  ADD CONSTRAINT pos_orders_order_type_check
  CHECK (order_type IN ('dine_in', 'takeaway', 'self_pickup', 'delivery'));
```

### No Code Changes Needed

The TypeScript type definition and all UI components already use `self_pickup` correctly. Only the database constraint needs updating.

