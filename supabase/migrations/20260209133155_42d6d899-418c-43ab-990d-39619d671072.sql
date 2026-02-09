
-- Audit log table for order history
CREATE TABLE public.pos_order_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.pos_orders(id) ON DELETE CASCADE,
  action text NOT NULL,
  details text,
  performed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pos_order_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage audit logs"
ON public.pos_order_audit_log
FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view audit logs for accessible orders"
ON public.pos_order_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pos_orders o
    WHERE o.id = pos_order_audit_log.order_id
    AND (
      public.is_admin(auth.uid())
      OR public.has_branch_access(auth.uid(), o.branch_id)
      OR o.taken_by = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
    )
  )
);

-- Enable realtime for pos_orders so new orders trigger UI updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.pos_orders;
