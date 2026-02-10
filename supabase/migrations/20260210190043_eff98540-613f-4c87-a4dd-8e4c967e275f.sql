
-- Add new columns to branches table
ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS branch_code text,
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS name_ur text,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'SAR',
  ADD COLUMN IF NOT EXISTS currency_symbol text NOT NULL DEFAULT 'ر.س',
  ADD COLUMN IF NOT EXISTS vat_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vat_rate numeric NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS pricing_mode text NOT NULL DEFAULT 'exclusive',
  ADD COLUMN IF NOT EXISTS rounding_rule text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS order_types text[] NOT NULL DEFAULT '{}';

-- Add unique constraint on branch_code (partial - only when not null)
CREATE UNIQUE INDEX IF NOT EXISTS branches_branch_code_unique ON public.branches (branch_code) WHERE branch_code IS NOT NULL;

-- Delete existing branches to re-seed cleanly
DELETE FROM public.branches;

-- Seed 3 branches
INSERT INTO public.branches (name, branch_code, name_ar, name_ur, currency, currency_symbol, vat_enabled, vat_rate, pricing_mode, rounding_rule, order_types, is_active)
VALUES
  ('Main Branch', 'MAIN', 'الفرع الرئيسي', 'مرکزی شاخ', 'SAR', 'ر.س', true, 15, 'exclusive', 'none', '{dine_in,takeaway,delivery}', true),
  ('Downtown', 'DOWNTOWN', 'وسط المدينة', 'ڈاؤن ٹاؤن', 'SAR', 'ر.س', true, 15, 'exclusive', '0.05', '{dine_in,takeaway}', true),
  ('Mall Outlet', 'MALL', 'منفذ المول', 'مال آؤٹ لیٹ', 'USD', '$', false, 0, 'inclusive', 'none', '{takeaway}', false);
