
-- Create kds_item_status table for tracking kitchen item completion
CREATE TABLE public.kds_item_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES public.pos_order_items(id) ON DELETE CASCADE,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  completed_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kds_item_status_order_item_id_key UNIQUE (order_item_id)
);

-- Enable RLS
ALTER TABLE public.kds_item_status ENABLE ROW LEVEL SECURITY;

-- RLS policies: authenticated users can select, insert, update
CREATE POLICY "Authenticated users can view kds status"
  ON public.kds_item_status FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert kds status"
  ON public.kds_item_status FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update kds status"
  ON public.kds_item_status FOR UPDATE
  USING (true);

CREATE POLICY "Authenticated users can delete kds status"
  ON public.kds_item_status FOR DELETE
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.kds_item_status;
