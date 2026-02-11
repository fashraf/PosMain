
-- Create print_templates table
CREATE TABLE public.print_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  branch_id uuid NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  show_logo boolean NOT NULL DEFAULT true,
  logo_url text,
  logo_position text NOT NULL DEFAULT 'center',
  show_branch_name boolean NOT NULL DEFAULT true,
  show_branch_mobile boolean NOT NULL DEFAULT true,
  show_order_id boolean NOT NULL DEFAULT true,
  show_order_taken_by boolean NOT NULL DEFAULT true,
  show_cr_number boolean NOT NULL DEFAULT false,
  show_vat_number boolean NOT NULL DEFAULT false,
  header_text text,
  header_alignment text NOT NULL DEFAULT 'center',
  show_item_name boolean NOT NULL DEFAULT true,
  show_qty boolean NOT NULL DEFAULT true,
  show_price boolean NOT NULL DEFAULT true,
  show_line_total boolean NOT NULL DEFAULT true,
  show_total_amount boolean NOT NULL DEFAULT true,
  show_discount boolean NOT NULL DEFAULT false,
  show_tax_breakdown boolean NOT NULL DEFAULT false,
  show_qr boolean NOT NULL DEFAULT false,
  qr_content text NOT NULL DEFAULT 'order_url',
  qr_size text NOT NULL DEFAULT 'medium',
  show_amount_above_qr boolean NOT NULL DEFAULT false,
  show_order_id_near_qr boolean NOT NULL DEFAULT false,
  show_footer boolean NOT NULL DEFAULT true,
  footer_text text,
  footer_alignment text NOT NULL DEFAULT 'center',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(name, branch_id)
);

-- Enable RLS
ALTER TABLE public.print_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage print_templates"
ON public.print_templates FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can view print_templates"
ON public.print_templates FOR SELECT
USING (true);

-- Updated_at trigger
CREATE TRIGGER update_print_templates_updated_at
BEFORE UPDATE ON public.print_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for logos
INSERT INTO storage.buckets (id, name, public) VALUES ('print-logos', 'print-logos', true);

-- Storage policies
CREATE POLICY "Print logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'print-logos');

CREATE POLICY "Admins can upload print logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'print-logos' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update print logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'print-logos' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete print logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'print-logos' AND is_admin(auth.uid()));
