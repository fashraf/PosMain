 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { useLanguage } from "@/hooks/useLanguage";
 
 // Types for maintenance data
 export interface MaintenanceItem {
   id: string;
   name_en: string;
   name_ar?: string | null;
   name_ur?: string | null;
   is_active: boolean;
 }
 
 export interface CategoryItem extends MaintenanceItem {
   sort_order?: number | null;
   icon_class?: string | null;
   description?: string | null;
 }
 
 export interface SubcategoryItem extends MaintenanceItem {
   parent_category_id?: string | null;
   description?: string | null;
 }
 
 export interface ServingTimeItem extends MaintenanceItem {
   sort_order?: number | null;
   icon_class?: string | null;
   time_range?: string | null;
 }
 
 export interface UnitItem extends MaintenanceItem {
   symbol: string;
   base_unit_id?: string | null;
   conversion_factor?: number | null;
 }
 
 export interface StorageTypeItem extends MaintenanceItem {
   icon_class?: string | null;
   temp_range?: string | null;
 }
 
 export interface AllergenItem extends MaintenanceItem {
   icon_class?: string | null;
   severity: "low" | "medium" | "high";
 }
 
 export interface ItemTypeItem extends MaintenanceItem {
   description?: string | null;
 }
 
 export interface IngredientGroupItem extends MaintenanceItem {
   description?: string | null;
 }
 
 // Helper to get localized label
 export function useLocalizedLabel() {
   const { currentLanguage } = useLanguage();
   
   return (item: { name_en: string; name_ar?: string | null; name_ur?: string | null }) => {
     if (currentLanguage === "ar" && item.name_ar) return item.name_ar;
     if (currentLanguage === "ur" && item.name_ur) return item.name_ur;
     return item.name_en;
   };
 }
 
 // Categories
 export function useCategories() {
   return useQuery({
     queryKey: ["maintenance", "categories"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("maintenance_categories")
         .select("id, name_en, name_ar, name_ur, is_active, sort_order, icon_class, description")
         .eq("is_active", true)
         .order("sort_order", { ascending: true, nullsFirst: false })
         .order("name_en");
       
       if (error) throw error;
       return data as CategoryItem[];
     },
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
 }
 
 // Subcategories (with optional category filter for cascading)
 export function useSubcategories(categoryId?: string) {
   return useQuery({
     queryKey: ["maintenance", "subcategories", categoryId],
     queryFn: async () => {
       let query = supabase
         .from("maintenance_subcategories")
         .select("id, name_en, name_ar, name_ur, is_active, parent_category_id, description")
         .eq("is_active", true);
       
       if (categoryId) {
         query = query.eq("parent_category_id", categoryId);
       }
       
       const { data, error } = await query.order("name_en");
       
       if (error) throw error;
       return data as SubcategoryItem[];
     },
     staleTime: 5 * 60 * 1000,
   });
 }
 
 // Serving Times
 export function useServingTimes() {
   return useQuery({
     queryKey: ["maintenance", "serving_times"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("serving_times")
         .select("id, name_en, name_ar, name_ur, is_active, sort_order, icon_class, time_range")
         .eq("is_active", true)
         .order("sort_order", { ascending: true, nullsFirst: false })
         .order("name_en");
       
       if (error) throw error;
       return data as ServingTimeItem[];
     },
     staleTime: 5 * 60 * 1000,
   });
 }
 
 // Units
 export function useUnits() {
   return useQuery({
     queryKey: ["maintenance", "units"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("units")
         .select("id, name_en, name_ar, name_ur, is_active, symbol, base_unit_id, conversion_factor")
         .eq("is_active", true)
         .order("name_en");
       
       if (error) throw error;
       return data as UnitItem[];
     },
     staleTime: 5 * 60 * 1000,
   });
 }
 
 // Storage Types
 export function useStorageTypes() {
   return useQuery({
     queryKey: ["maintenance", "storage_types"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("storage_types")
         .select("id, name_en, name_ar, name_ur, is_active, icon_class, temp_range")
         .eq("is_active", true)
         .order("name_en");
       
       if (error) throw error;
       return data as StorageTypeItem[];
     },
     staleTime: 5 * 60 * 1000,
   });
 }
 
 // Allergens
 export function useAllergens() {
   return useQuery({
     queryKey: ["maintenance", "allergens"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("allergens")
         .select("id, name_en, name_ar, name_ur, is_active, icon_class, severity")
         .eq("is_active", true)
         .order("name_en");
       
       if (error) throw error;
       return data as AllergenItem[];
     },
     staleTime: 5 * 60 * 1000,
   });
 }
 
 // Item Types
 export function useItemTypes() {
   return useQuery({
     queryKey: ["maintenance", "item_types"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("item_types")
         .select("id, name_en, name_ar, name_ur, is_active, description")
         .eq("is_active", true)
         .order("name_en");
       
       if (error) throw error;
       return data as ItemTypeItem[];
     },
     staleTime: 5 * 60 * 1000,
   });
 }
 
 // Ingredient Groups
 export function useIngredientGroups() {
   return useQuery({
     queryKey: ["maintenance", "ingredient_groups"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("ingredient_groups")
         .select("id, name_en, name_ar, name_ur, is_active, description")
         .eq("is_active", true)
         .order("name_en");
       
       if (error) throw error;
       return data as IngredientGroupItem[];
     },
     staleTime: 5 * 60 * 1000,
   });
 }