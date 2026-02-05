-- POS Menu Items table
CREATE TABLE public.pos_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT,
  name_ur TEXT,
  description_en TEXT,
  category_id UUID REFERENCES public.maintenance_categories(id),
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_customizable BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POS Item Ingredients table
CREATE TABLE public.pos_item_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES public.pos_menu_items(id) ON DELETE CASCADE NOT NULL,
  ingredient_name_en TEXT NOT NULL,
  ingredient_name_ar TEXT,
  ingredient_name_ur TEXT,
  extra_price DECIMAL(10,2) DEFAULT 0,
  is_removable BOOLEAN DEFAULT true,
  is_default_included BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POS Item Replacements table
CREATE TABLE public.pos_item_replacements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES public.pos_menu_items(id) ON DELETE CASCADE NOT NULL,
  replacement_group TEXT NOT NULL,
  replacement_name_en TEXT NOT NULL,
  replacement_name_ar TEXT,
  replacement_name_ur TEXT,
  price_difference DECIMAL(10,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POS Orders table
CREATE TABLE public.pos_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  order_type TEXT NOT NULL CHECK (order_type IN ('pay_order', 'delivery', 'takeaway', 'dine_in')),
  customer_mobile TEXT,
  customer_name TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  vat_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  payment_method TEXT,
  taken_by UUID REFERENCES public.profiles(id),
  branch_id UUID REFERENCES public.branches(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POS Order Items table
CREATE TABLE public.pos_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.pos_orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.pos_menu_items(id),
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  customization_json JSONB,
  customization_hash TEXT,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.pos_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_item_replacements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pos_menu_items
CREATE POLICY "Authenticated users can view menu items"
ON public.pos_menu_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage menu items"
ON public.pos_menu_items FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for pos_item_ingredients
CREATE POLICY "Authenticated users can view ingredients"
ON public.pos_item_ingredients FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage ingredients"
ON public.pos_item_ingredients FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for pos_item_replacements
CREATE POLICY "Authenticated users can view replacements"
ON public.pos_item_replacements FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage replacements"
ON public.pos_item_replacements FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for pos_orders (users can see orders from their branch or all if admin)
CREATE POLICY "Users can view orders from their branch"
ON public.pos_orders FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid()) 
  OR public.has_branch_access(auth.uid(), branch_id)
  OR taken_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create orders"
ON public.pos_orders FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can manage orders"
ON public.pos_orders FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own orders"
ON public.pos_orders FOR UPDATE
TO authenticated
USING (taken_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for pos_order_items
CREATE POLICY "Users can view order items"
ON public.pos_order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pos_orders o
    WHERE o.id = order_id
    AND (
      public.is_admin(auth.uid())
      OR public.has_branch_access(auth.uid(), o.branch_id)
      OR o.taken_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can insert order items"
ON public.pos_order_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can manage order items"
ON public.pos_order_items FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_pos_menu_items_updated_at
BEFORE UPDATE ON public.pos_menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pos_orders_updated_at
BEFORE UPDATE ON public.pos_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_pos_menu_items_category ON public.pos_menu_items(category_id);
CREATE INDEX idx_pos_menu_items_available ON public.pos_menu_items(is_available);
CREATE INDEX idx_pos_item_ingredients_menu_item ON public.pos_item_ingredients(menu_item_id);
CREATE INDEX idx_pos_item_replacements_menu_item ON public.pos_item_replacements(menu_item_id);
CREATE INDEX idx_pos_orders_branch ON public.pos_orders(branch_id);
CREATE INDEX idx_pos_orders_taken_by ON public.pos_orders(taken_by);
CREATE INDEX idx_pos_orders_created_at ON public.pos_orders(created_at);
CREATE INDEX idx_pos_order_items_order ON public.pos_order_items(order_id);