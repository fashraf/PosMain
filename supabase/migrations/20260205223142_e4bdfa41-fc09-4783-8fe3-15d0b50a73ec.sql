-- Create ingredients table (Ingredient Master)
CREATE TABLE public.ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  name_ur TEXT,
  unit_id UUID REFERENCES public.units(id),
  cost_per_unit NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create item_ingredients junction table
CREATE TABLE public.item_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  can_remove BOOLEAN NOT NULL DEFAULT true,
  can_add_extra BOOLEAN NOT NULL DEFAULT false,
  extra_cost NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (item_id, ingredient_id)
);

-- Enable RLS on both tables
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS for ingredients: admins/managers can manage, authenticated can read active
CREATE POLICY "Admins can manage ingredients"
ON public.ingredients
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can view active ingredients"
ON public.ingredients
FOR SELECT
USING (is_active = true);

-- RLS for item_ingredients: admins can manage, authenticated can read
CREATE POLICY "Admins can manage item_ingredients"
ON public.item_ingredients
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can view item_ingredients"
ON public.item_ingredients
FOR SELECT
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_ingredients_updated_at
BEFORE UPDATE ON public.ingredients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_item_ingredients_updated_at
BEFORE UPDATE ON public.item_ingredients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();