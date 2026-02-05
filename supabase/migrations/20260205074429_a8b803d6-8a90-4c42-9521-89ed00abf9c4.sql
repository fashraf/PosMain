-- Fix overly permissive RLS policy for user_activity_log inserts
-- Drop the existing permissive policy
DROP POLICY IF EXISTS "System can insert activity logs" ON public.user_activity_log;

-- Create a proper policy that only allows admins to insert activity logs
-- (Edge functions with service_role bypass RLS anyway)
CREATE POLICY "Admins can insert activity logs"
ON public.user_activity_log
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));