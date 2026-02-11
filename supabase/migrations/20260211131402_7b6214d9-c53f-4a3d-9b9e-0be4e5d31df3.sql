
-- Add new columns to print_templates
ALTER TABLE public.print_templates
  ADD COLUMN logo_width integer NOT NULL DEFAULT 80,
  ADD COLUMN logo_height integer NOT NULL DEFAULT 40,
  ADD COLUMN show_customization boolean NOT NULL DEFAULT true,
  ADD COLUMN restaurant_name_en text,
  ADD COLUMN restaurant_name_ar text,
  ADD COLUMN restaurant_name_ur text,
  ADD COLUMN cr_number text,
  ADD COLUMN vat_number text;

-- Make branch_id nullable
ALTER TABLE public.print_templates ALTER COLUMN branch_id DROP NOT NULL;

-- Drop old unique constraint on (name, branch_id) and add unique on name only
ALTER TABLE public.print_templates DROP CONSTRAINT IF EXISTS print_templates_name_branch_id_key;
ALTER TABLE public.print_templates ADD CONSTRAINT print_templates_name_key UNIQUE (name);
