
-- Create finance_expenses table
CREATE TABLE public.finance_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES public.branches(id) NOT NULL,
  category text NOT NULL,
  description text,
  amount numeric NOT NULL DEFAULT 0,
  expense_date date NOT NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.finance_expenses ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage finance_expenses"
ON public.finance_expenses FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can view finance_expenses"
ON public.finance_expenses FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_finance_expenses_updated_at
BEFORE UPDATE ON public.finance_expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create finance_integration_logs table
CREATE TABLE public.finance_integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  details jsonb,
  performed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.finance_integration_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage finance_integration_logs"
ON public.finance_integration_logs FOR ALL
USING (is_admin(auth.uid()));
