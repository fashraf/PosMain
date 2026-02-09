ALTER TABLE public.pos_orders
  ADD COLUMN cancelled_at timestamptz,
  ADD COLUMN cancel_reason text;