-- Create items table for Item Master
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  name_ur TEXT,
  description_en TEXT,
  description_ar TEXT,
  description_ur TEXT,
  item_type TEXT DEFAULT 'edible',
  base_cost NUMERIC NOT NULL DEFAULT 0,
  is_combo BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_customizable BOOLEAN NOT NULL DEFAULT false,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  category_id UUID REFERENCES public.maintenance_categories(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage items"
ON public.items
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can view active items"
ON public.items
FOR SELECT
USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON public.items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();