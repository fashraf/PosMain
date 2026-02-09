
ALTER TABLE public.pos_orders
  ADD COLUMN IF NOT EXISTS tendered_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS change_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_address text;
