
-- Create shifts table for shift definitions
CREATE TABLE public.shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  effective_from date NOT NULL,
  effective_to date NOT NULL,
  days_of_week text[] NOT NULL DEFAULT '{}',
  start_time time NOT NULL,
  end_time time NOT NULL,
  allow_overnight boolean NOT NULL DEFAULT false,
  allow_early_clock_in boolean NOT NULL DEFAULT false,
  early_tolerance_minutes integer NOT NULL DEFAULT 15,
  allow_late_clock_out boolean NOT NULL DEFAULT false,
  force_close_after_hours integer,
  require_fingerprint boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Unique constraint to prevent duplicate shifts
ALTER TABLE public.shifts ADD CONSTRAINT unique_shift_definition 
  UNIQUE (name, start_time, end_time, effective_from, effective_to);

-- Enable RLS
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage shifts"
  ON public.shifts FOR ALL
  USING (is_admin(auth.uid()));

-- Authenticated users can view
CREATE POLICY "Authenticated users can view shifts"
  ON public.shifts FOR SELECT
  USING (true);

-- Updated_at trigger
CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON public.shifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
