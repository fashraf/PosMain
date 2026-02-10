
-- =============================================
-- PHASE 1: RBAC OVERHAUL - COMPLETE MIGRATION
-- =============================================

-- A1. Maintenance Employee Types
CREATE TABLE public.maintenance_emp_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  name_ur text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_emp_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage emp_types" ON public.maintenance_emp_types FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Authenticated users can view emp_types" ON public.maintenance_emp_types FOR SELECT USING (true);

CREATE TRIGGER update_maintenance_emp_types_updated_at
  BEFORE UPDATE ON public.maintenance_emp_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed employee types
INSERT INTO public.maintenance_emp_types (name_en, name_ar, name_ur) VALUES
  ('Full Time', 'دوام كامل', 'فل ٹائم'),
  ('Part Time', 'دوام جزئي', 'پارٹ ٹائم'),
  ('Intern', 'متدرب', 'انٹرن');

-- A2. Roles Table
CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text,
  is_system boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage roles" ON public.roles FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Authenticated users can view roles" ON public.roles FOR SELECT USING (true);

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default roles
INSERT INTO public.roles (name, description, color, is_system) VALUES
  ('Admin', 'Full system access', '#EF4444', true),
  ('Waiter', 'Takes orders and serves customers', '#F97316', true),
  ('Cashier', 'Handles payments and billing', '#22C55E', true),
  ('Logistics In-Charge', 'Manages items, pricing, and inventory', '#3B82F6', true),
  ('Chef / Kitchen', 'Views and manages kitchen orders', '#A855F7', true);

-- A3. Permissions Table
CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  group_name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage permissions" ON public.permissions FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Authenticated users can view permissions" ON public.permissions FOR SELECT USING (true);

-- Seed permissions
INSERT INTO public.permissions (code, name, description, group_name, sort_order) VALUES
  -- Orders
  ('orders.create', 'Create Order', 'Can create new orders', 'Orders', 1),
  ('orders.view_own', 'View Own Orders', 'Can view orders created by self', 'Orders', 2),
  ('orders.view_all', 'View All Orders', 'Can view all orders across branches', 'Orders', 3),
  ('orders.close_own', 'Close Own Orders', 'Can close orders created by self', 'Orders', 4),
  ('orders.close_all', 'Close All Orders', 'Can close any order', 'Orders', 5),
  ('orders.cancel', 'Cancel Order', 'Can cancel an order', 'Orders', 6),
  ('orders.reopen', 'Reopen Order', 'Can reopen a closed order with reason', 'Orders', 7),
  -- Payments
  ('payments.view_bills', 'View Bills', 'Can view payment bills', 'Payments', 1),
  ('payments.close_payment', 'Close Payment', 'Can close/complete a payment', 'Payments', 2),
  ('payments.void_payment', 'Void Payment', 'Can void a completed payment', 'Payments', 3),
  -- Items & Ingredients
  ('items.add', 'Add Items', 'Can add new items and ingredients', 'Items & Ingredients', 1),
  ('items.update', 'Update Items', 'Can update existing items and ingredients', 'Items & Ingredients', 2),
  ('items.view_pricing', 'View Item Pricing', 'Can view item cost and pricing data', 'Items & Ingredients', 3),
  ('items.update_pricing', 'Update Item Pricing', 'Can change item prices', 'Items & Ingredients', 4),
  -- Inventory
  ('inventory.adjustments', 'Stock Adjustments', 'Can make stock adjustments', 'Inventory', 1),
  ('inventory.transfers', 'Stock Transfers', 'Can transfer stock between branches', 'Inventory', 2),
  ('inventory.stock_issue', 'Stock Issue', 'Can issue stock from inventory', 'Inventory', 3),
  -- Printing
  ('printing.print_kot', 'Print KOT', 'Can print kitchen order tickets', 'Printing', 1),
  ('printing.print_receipt', 'Print Receipt', 'Can print order receipts', 'Printing', 2),
  ('printing.print_bill', 'Print Bill', 'Can print payment bills', 'Printing', 3),
  -- User Management
  ('users.view', 'View Users', 'Can view user list and profiles', 'User Management', 1),
  ('users.create', 'Create Users', 'Can create new user accounts', 'User Management', 2),
  ('users.manage_roles', 'Manage Roles', 'Can create and edit roles', 'User Management', 3),
  ('users.manage_permissions', 'Manage Permissions', 'Can assign permissions to roles', 'User Management', 4),
  -- Kitchen
  ('kitchen.view', 'View Kitchen Orders', 'Can view kitchen display', 'Kitchen', 1),
  ('kitchen.close_items', 'Close Items', 'Can mark items as completed', 'Kitchen', 2),
  ('kitchen.close_order', 'Close Order', 'Can mark entire order as done in kitchen', 'Kitchen', 3),
  ('kitchen.reopen_order', 'Reopen Order', 'Can reopen a completed kitchen order', 'Kitchen', 4);

-- A4. Role Permissions Junction
CREATE TABLE public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Authenticated users can view role_permissions" ON public.role_permissions FOR SELECT USING (true);

-- Seed: Admin gets ALL permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p WHERE r.name = 'Admin';

-- Seed: Waiter permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'Waiter' AND p.code IN (
  'orders.create', 'orders.view_own', 'orders.view_all', 'orders.close_all',
  'printing.print_kot', 'printing.print_receipt'
);

-- Seed: Cashier permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'Cashier' AND p.code IN (
  'orders.create', 'orders.view_all', 'orders.close_all',
  'payments.view_bills', 'payments.close_payment',
  'items.view_pricing', 'items.update_pricing',
  'printing.print_bill', 'printing.print_receipt'
);

-- Seed: Logistics In-Charge permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'Logistics In-Charge' AND p.code IN (
  'items.add', 'items.update', 'items.view_pricing', 'items.update_pricing',
  'inventory.adjustments', 'inventory.transfers', 'inventory.stock_issue'
);

-- Seed: Chef / Kitchen permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'Chef / Kitchen' AND p.code IN (
  'kitchen.view', 'kitchen.close_items', 'kitchen.close_order', 'kitchen.reopen_order',
  'orders.view_all', 'orders.reopen',
  'printing.print_kot'
);

-- A5. Migrate user_roles from enum to role_id
ALTER TABLE public.user_roles ADD COLUMN role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE;

-- Migrate existing data
UPDATE public.user_roles ur
SET role_id = r.id
FROM public.roles r
WHERE (
  (ur.role = 'admin' AND r.name = 'Admin') OR
  (ur.role = 'waiter' AND r.name = 'Waiter') OR
  (ur.role = 'cashier' AND r.name = 'Cashier') OR
  (ur.role = 'kitchen' AND r.name = 'Chef / Kitchen') OR
  (ur.role = 'manager' AND r.name = 'Admin') OR
  (ur.role = 'kiosk' AND r.name = 'Cashier')
);

-- Drop old column and constraint
ALTER TABLE public.user_roles DROP COLUMN role;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_role_id_not_null CHECK (role_id IS NOT NULL);
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role_id);

-- A6. Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN age integer,
  ADD COLUMN nationality text,
  ADD COLUMN national_id text,
  ADD COLUMN national_id_expiry date,
  ADD COLUMN passport_number text,
  ADD COLUMN passport_expiry date,
  ADD COLUMN emp_type_id uuid REFERENCES public.maintenance_emp_types(id),
  ADD COLUMN default_language text NOT NULL DEFAULT 'en',
  ADD COLUMN force_password_change boolean NOT NULL DEFAULT false;

-- A7. Rewrite database functions for new roles structure
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND lower(r.name) = lower(_role::text)
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.name = 'Admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.assign_first_user_admin()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles LIMIT 1) THEN
    INSERT INTO public.user_roles (user_id, role_id)
    SELECT NEW.id, r.id FROM public.roles r WHERE r.name = 'Admin' LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;
