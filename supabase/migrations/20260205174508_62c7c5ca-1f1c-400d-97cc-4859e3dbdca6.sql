-- Fix overly permissive INSERT policies
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can create orders" ON public.pos_orders;
DROP POLICY IF EXISTS "Users can insert order items" ON public.pos_order_items;

-- Create proper INSERT policy for orders - users can only insert if they have branch access
CREATE POLICY "Users can create orders"
ON public.pos_orders FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin(auth.uid())
  OR public.has_branch_access(auth.uid(), branch_id)
);

-- Create proper INSERT policy for order items - users can only insert to orders they created
CREATE POLICY "Users can insert order items"
ON public.pos_order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pos_orders o
    WHERE o.id = order_id
    AND (
      public.is_admin(auth.uid())
      OR o.taken_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  )
);