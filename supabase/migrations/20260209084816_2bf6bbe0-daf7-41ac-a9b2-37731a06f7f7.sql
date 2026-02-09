ALTER TABLE public.pos_orders
  ADD CONSTRAINT pos_orders_order_type_check
  CHECK (order_type IN ('dine_in', 'takeaway', 'self_pickup', 'delivery'));