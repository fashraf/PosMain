-- Create severity enum for allergens
CREATE TYPE public.allergen_severity AS ENUM ('low', 'medium', 'high');

-- 1. Maintenance Categories
CREATE TABLE public.maintenance_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    description TEXT,
    icon_class TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Maintenance Subcategories
CREATE TABLE public.maintenance_subcategories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    parent_category_id UUID REFERENCES public.maintenance_categories(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Serving Times
CREATE TABLE public.serving_times (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    time_range TEXT,
    sort_order INTEGER DEFAULT 0,
    icon_class TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Allergens
CREATE TABLE public.allergens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    icon_class TEXT,
    severity public.allergen_severity NOT NULL DEFAULT 'medium',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Item Types
CREATE TABLE public.item_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Classification Types
CREATE TABLE public.classification_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Units
CREATE TABLE public.units (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    symbol TEXT NOT NULL,
    base_unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    conversion_factor DECIMAL(15, 6) DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Storage Types
CREATE TABLE public.storage_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    icon_class TEXT,
    temp_range TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Ingredient Groups
CREATE TABLE public.ingredient_groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT,
    name_ur TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.maintenance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serving_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can read, admins can manage
-- Categories
CREATE POLICY "Authenticated users can view categories" ON public.maintenance_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage categories" ON public.maintenance_categories FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Subcategories
CREATE POLICY "Authenticated users can view subcategories" ON public.maintenance_subcategories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage subcategories" ON public.maintenance_subcategories FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Serving Times
CREATE POLICY "Authenticated users can view serving_times" ON public.serving_times FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage serving_times" ON public.serving_times FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Allergens
CREATE POLICY "Authenticated users can view allergens" ON public.allergens FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage allergens" ON public.allergens FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Item Types
CREATE POLICY "Authenticated users can view item_types" ON public.item_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage item_types" ON public.item_types FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Classification Types
CREATE POLICY "Authenticated users can view classification_types" ON public.classification_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage classification_types" ON public.classification_types FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Units
CREATE POLICY "Authenticated users can view units" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage units" ON public.units FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Storage Types
CREATE POLICY "Authenticated users can view storage_types" ON public.storage_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage storage_types" ON public.storage_types FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Ingredient Groups
CREATE POLICY "Authenticated users can view ingredient_groups" ON public.ingredient_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage ingredient_groups" ON public.ingredient_groups FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Create updated_at triggers for all tables
CREATE TRIGGER update_maintenance_categories_updated_at BEFORE UPDATE ON public.maintenance_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_subcategories_updated_at BEFORE UPDATE ON public.maintenance_subcategories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_serving_times_updated_at BEFORE UPDATE ON public.serving_times FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_allergens_updated_at BEFORE UPDATE ON public.allergens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_item_types_updated_at BEFORE UPDATE ON public.item_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classification_types_updated_at BEFORE UPDATE ON public.classification_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_storage_types_updated_at BEFORE UPDATE ON public.storage_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ingredient_groups_updated_at BEFORE UPDATE ON public.ingredient_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data for Categories
INSERT INTO public.maintenance_categories (name_en, name_ar, name_ur, icon_class, sort_order) VALUES
('Vegetarian', 'نباتي', 'سبزی خور', 'leaf', 1),
('Non-Vegetarian', 'غير نباتي', 'گوشت خور', 'drumstick', 2),
('Drinks', 'مشروبات', 'مشروبات', 'cup-straw', 3),
('Sheesha', 'شيشة', 'حقہ', 'wind', 4),
('Desserts', 'حلويات', 'میٹھے', 'cake', 5);

-- Seed initial data for Serving Times
INSERT INTO public.serving_times (name_en, name_ar, name_ur, time_range, icon_class, sort_order) VALUES
('Breakfast', 'فطور', 'ناشتہ', '6:00 - 11:00', 'sunrise', 1),
('Lunch Specials', 'عروض الغداء', 'دوپہر کے خصوصی', '11:00 - 16:00', 'sun', 2),
('Dinner', 'عشاء', 'رات کا کھانا', '16:00 - 23:00', 'moon', 3),
('Snacks', 'وجبات خفيفة', 'ناشتے', 'All Day', 'cookie', 4);

-- Seed initial data for Allergens
INSERT INTO public.allergens (name_en, name_ar, name_ur, icon_class, severity) VALUES
('Nuts', 'مكسرات', 'گری دار میوے', 'nut', 'high'),
('Dairy', 'ألبان', 'دودھ', 'milk', 'medium'),
('Gluten', 'جلوتين', 'گلوٹین', 'wheat', 'medium'),
('Eggs', 'بيض', 'انڈے', 'egg', 'low'),
('Soy', 'صويا', 'سویا', 'bean', 'low'),
('Shellfish', 'محار', 'شیلفش', 'shrimp', 'high'),
('Wheat', 'قمح', 'گندم', 'grain', 'medium');

-- Seed initial data for Item Types
INSERT INTO public.item_types (name_en, name_ar, name_ur, description) VALUES
('Edible', 'صالح للأكل', 'کھانے کے قابل', 'Food items that can be consumed'),
('Drink', 'مشروب', 'مشروب', 'Beverages and liquids'),
('Sheesha', 'شيشة', 'حقہ', 'Smoking products'),
('Accessory', 'ملحق', 'لوازمات', 'Non-consumable items');

-- Seed initial data for Classification Types
INSERT INTO public.classification_types (name_en, name_ar, name_ur) VALUES
('Food', 'طعام', 'کھانا'),
('Beverage', 'مشروب', 'مشروب'),
('Consumable', 'استهلاكي', 'استعمال کی چیز'),
('Accessory', 'ملحق', 'لوازمات');

-- Seed initial data for Units (base units first)
INSERT INTO public.units (name_en, name_ar, name_ur, symbol, conversion_factor) VALUES
('Kilogram', 'كيلوغرام', 'کلوگرام', 'kg', 1),
('Liter', 'لتر', 'لیٹر', 'L', 1),
('Piece', 'قطعة', 'ٹکڑا', 'pcs', 1),
('Pack', 'علبة', 'پیک', 'pack', 1),
('Box', 'صندوق', 'ڈبہ', 'box', 1);

-- Add sub-units referencing base units
INSERT INTO public.units (name_en, name_ar, name_ur, symbol, base_unit_id, conversion_factor) 
SELECT 'Gram', 'غرام', 'گرام', 'g', id, 0.001 FROM public.units WHERE symbol = 'kg';

INSERT INTO public.units (name_en, name_ar, name_ur, symbol, base_unit_id, conversion_factor) 
SELECT 'Milliliter', 'ميليلتر', 'ملی لیٹر', 'mL', id, 0.001 FROM public.units WHERE symbol = 'L';

-- Seed initial data for Storage Types
INSERT INTO public.storage_types (name_en, name_ar, name_ur, icon_class, temp_range) VALUES
('Freezer', 'فريزر', 'فریزر', 'snowflake', '-18°C'),
('Fridge/Chiller', 'ثلاجة', 'فریج', 'thermometer-snow', '0-4°C'),
('Dry/Ambient', 'جاف', 'خشک', 'warehouse', '15-25°C'),
('Room Temperature', 'درجة حرارة الغرفة', 'کمرے کا درجہ حرارت', 'home', '20-25°C');

-- Seed initial data for Ingredient Groups
INSERT INTO public.ingredient_groups (name_en, name_ar, name_ur, description) VALUES
('Meat & Poultry', 'لحوم ودواجن', 'گوشت اور پولٹری', 'All meat and poultry products'),
('Dairy', 'ألبان', 'دودھ کی مصنوعات', 'Milk, cheese, butter, and dairy products'),
('Produce/Vegetables', 'خضروات', 'سبزیاں', 'Fresh vegetables and produce'),
('Spices & Herbs', 'بهارات وأعشاب', 'مصالحے', 'Seasonings, spices, and herbs'),
('Dry Goods', 'سلع جافة', 'خشک اشیاء', 'Rice, flour, pasta, and dry ingredients'),
('Oils & Fats', 'زيوت ودهون', 'تیل اور چربی', 'Cooking oils, butter, and fats'),
('Beverages/Base', 'مشروبات', 'مشروبات', 'Drink bases and beverage ingredients'),
('Seafood', 'مأكولات بحرية', 'سمندری غذا', 'Fish and seafood products'),
('Bakery Items', 'منتجات المخابز', 'بیکری آئٹمز', 'Bread, pastries, and baked goods'),
('Packaging', 'تغليف', 'پیکیجنگ', 'Packaging materials and containers');

-- Seed Subcategories
INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'Sea Food', 'مأكولات بحرية', 'سمندری غذا', id, 'Fresh and cooked seafood dishes' FROM public.maintenance_categories WHERE name_en = 'Non-Vegetarian';

INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'BBQ', 'شواء', 'باربی کیو', id, 'Grilled and BBQ items' FROM public.maintenance_categories WHERE name_en = 'Non-Vegetarian';

INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'Shawarma', 'شاورما', 'شوارما', id, 'Shawarma and wraps' FROM public.maintenance_categories WHERE name_en = 'Non-Vegetarian';

INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'Pizza', 'بيتزا', 'پیزا', id, 'All pizza varieties' FROM public.maintenance_categories WHERE name_en = 'Vegetarian';

INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'Pan Cake', 'بان كيك', 'پین کیک', id, 'Pancakes and crepes' FROM public.maintenance_categories WHERE name_en = 'Desserts';

INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'Soft Drinks', 'مشروبات غازية', 'کولڈ ڈرنکس', id, 'Carbonated and soft drinks' FROM public.maintenance_categories WHERE name_en = 'Drinks';

INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'Tea and Coffee', 'شاي وقهوة', 'چائے اور کافی', id, 'Hot beverages' FROM public.maintenance_categories WHERE name_en = 'Drinks';

INSERT INTO public.maintenance_subcategories (name_en, name_ar, name_ur, parent_category_id, description) 
SELECT 'Smoking Zone', 'منطقة التدخين', 'سموکنگ زون', id, 'Sheesha and smoking products' FROM public.maintenance_categories WHERE name_en = 'Sheesha';