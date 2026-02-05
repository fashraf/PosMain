-- Fix Items RLS Policy for Admin Visibility
-- Admins should see ALL items (active and inactive) for management
-- Non-admin authenticated users should only see active items (for POS)

DROP POLICY IF EXISTS "Authenticated users can view active items" ON public.items;

CREATE POLICY "Users can view items based on role"
ON public.items FOR SELECT
USING (
  is_admin(auth.uid()) OR is_active = true
);