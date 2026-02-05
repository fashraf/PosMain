-- Fix 1: Insert admin role for existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('222d0e7a-8f79-4b75-a858-676b59886c25', 'admin')
ON CONFLICT DO NOTHING;

-- Fix 2: Create function to auto-assign admin to first user
CREATE OR REPLACE FUNCTION public.assign_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first user (no existing roles)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles LIMIT 1) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users for future signups
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_first_user_admin();