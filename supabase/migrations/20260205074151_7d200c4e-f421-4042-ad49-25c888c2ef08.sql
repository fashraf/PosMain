-- Phase 1: User Management Module Database Schema

-- 1. Extend app_role enum with new roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'waiter';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'kitchen';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'kiosk';

-- 2. Add columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS employee_code text;

-- Add unique constraint for employee_code
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_employee_code_key UNIQUE (employee_code);

-- 3. Create user_shifts table for shift scheduling
CREATE TABLE public.user_shifts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
    start_datetime timestamp with time zone NOT NULL,
    end_datetime timestamp with time zone NOT NULL,
    is_recurring boolean NOT NULL DEFAULT false,
    recurring_days text[] DEFAULT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on user_shifts
ALTER TABLE public.user_shifts ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_shifts
CREATE POLICY "Users can view their own shifts"
ON public.user_shifts
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all shifts"
ON public.user_shifts
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage shifts"
ON public.user_shifts
FOR ALL
USING (public.is_admin(auth.uid()));

-- Trigger for updated_at on user_shifts
CREATE TRIGGER update_user_shifts_updated_at
BEFORE UPDATE ON public.user_shifts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Create user_activity_log table for audit trail
CREATE TABLE public.user_activity_log (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    target_user_id uuid NOT NULL,
    action text NOT NULL,
    performed_by uuid,
    details jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_activity_log
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
ON public.user_activity_log
FOR SELECT
USING (public.is_admin(auth.uid()));

-- System can insert activity logs (via service role)
CREATE POLICY "System can insert activity logs"
ON public.user_activity_log
FOR INSERT
WITH CHECK (true);

-- 5. Update profiles RLS policies for admin access
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()) OR user_id = auth.uid());