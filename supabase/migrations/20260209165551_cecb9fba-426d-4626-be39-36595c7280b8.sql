
-- Tighten RLS policies to require authentication
DROP POLICY "Authenticated users can insert kds status" ON public.kds_item_status;
DROP POLICY "Authenticated users can update kds status" ON public.kds_item_status;
DROP POLICY "Authenticated users can delete kds status" ON public.kds_item_status;

CREATE POLICY "Authenticated users can insert kds status"
  ON public.kds_item_status FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update kds status"
  ON public.kds_item_status FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete kds status"
  ON public.kds_item_status FOR DELETE
  USING (auth.uid() IS NOT NULL);
