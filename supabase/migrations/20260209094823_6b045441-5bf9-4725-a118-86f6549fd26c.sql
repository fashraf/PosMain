-- Allow users to delete order items for orders they own (needed for edit order flow)
CREATE POLICY "Users can delete their own order items"
ON public.pos_order_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM pos_orders o
    WHERE o.id = pos_order_items.order_id
    AND (
      is_admin(auth.uid())
      OR o.taken_by = (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid())
    )
  )
);