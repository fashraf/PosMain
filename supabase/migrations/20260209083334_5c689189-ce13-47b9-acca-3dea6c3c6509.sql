-- Step 1: Drop the old constraint
ALTER TABLE public.pos_orders
  DROP CONSTRAINT pos_orders_order_type_check;
