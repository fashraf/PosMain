
-- Create sales_channels table
CREATE TABLE public.sales_channels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en text NOT NULL,
  name_ar text,
  name_ur text,
  code text NOT NULL,
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sales_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sales_channels" ON public.sales_channels FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Authenticated users can view sales_channels" ON public.sales_channels FOR SELECT USING (true);

CREATE TRIGGER update_sales_channels_updated_at BEFORE UPDATE ON public.sales_channels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sales channels
INSERT INTO public.sales_channels (name_en, name_ar, name_ur, code, icon, is_active) VALUES
  ('In-Store', 'في المتجر', 'اسٹور میں', 'IN_STORE', '🏪', true),
  ('Zomato', 'زوماتو', 'زوماٹو', 'ZOMATO', '🛵', true),
  ('Swiggy', 'سويجي', 'سویگی', 'SWIGGY', '🛵', true),
  ('Online Website', 'الموقع الإلكتروني', 'آن لائن ویب سائٹ', 'ONLINE', '🌐', false);

-- Create branch_taxes table
CREATE TABLE public.branch_taxes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id uuid NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  tax_name text NOT NULL,
  tax_type text NOT NULL DEFAULT 'percentage',
  value numeric NOT NULL DEFAULT 0,
  apply_on text NOT NULL DEFAULT 'before_discount',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.branch_taxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage branch_taxes" ON public.branch_taxes FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Authenticated users can view branch_taxes" ON public.branch_taxes FOR SELECT USING (true);

-- Add sales_channel_ids to branches
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS sales_channel_ids uuid[] NOT NULL DEFAULT '{}';
