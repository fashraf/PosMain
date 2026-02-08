
-- Create item_sub_items table for combo sub-item mappings
CREATE TABLE public.item_sub_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  sub_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  replacement_price NUMERIC NOT NULL DEFAULT 0,
  can_remove BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.item_sub_items ENABLE ROW LEVEL SECURITY;

-- RLS policies matching item_ingredients
CREATE POLICY "Admins can manage item_sub_items"
ON public.item_sub_items
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can view item_sub_items"
ON public.item_sub_items
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_item_sub_items_updated_at
BEFORE UPDATE ON public.item_sub_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookup
CREATE INDEX idx_item_sub_items_item_id ON public.item_sub_items(item_id);
