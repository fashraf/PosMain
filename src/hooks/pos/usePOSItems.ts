import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { POSMenuItem, POSItemIngredient, POSItemReplacement } from "@/lib/pos/types";

interface UsePOSItemsOptions {
  categoryId?: string | null;
  favoritesOnly?: boolean;
}

/**
 * Fetch POS menu items from items table with optional category filter
 */
export function usePOSItems(options: UsePOSItemsOptions = {}) {
  const { categoryId, favoritesOnly } = options;

  return useQuery({
    queryKey: ["pos-items", categoryId, favoritesOnly],
    queryFn: async (): Promise<POSMenuItem[]> => {
      let query = supabase
        .from("items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (favoritesOnly) {
        query = query.eq("is_favorite", true);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch menu items: ${error.message}`);
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        name_en: item.name_en,
        name_ar: item.name_ar,
        name_ur: item.name_ur,
        description_en: item.description_en,
        category_id: item.category_id,
        base_price: Number(item.base_cost),
        image_url: item.image_url,
        is_customizable: item.is_customizable,
        is_favorite: item.is_favorite,
        is_available: item.is_active,
        sort_order: item.sort_order,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch single menu item with ingredients and replacements
 */
export function usePOSItemDetails(itemId: string | null) {
  return useQuery({
    queryKey: ["pos-menu-item-details", itemId],
    queryFn: async (): Promise<{
      item: POSMenuItem;
      ingredients: POSItemIngredient[];
      replacements: POSItemReplacement[];
    } | null> => {
      if (!itemId) return null;

      // Fetch item from items table (shared with Item Master)
      const { data: rawItem, error: itemError } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single();

      const item = rawItem ? {
        id: rawItem.id,
        name_en: rawItem.name_en,
        name_ar: rawItem.name_ar,
        name_ur: rawItem.name_ur,
        description_en: rawItem.description_en,
        category_id: rawItem.category_id,
        base_price: Number(rawItem.base_cost),
        image_url: rawItem.image_url,
        is_customizable: rawItem.is_customizable,
        is_favorite: rawItem.is_favorite,
        is_available: rawItem.is_active,
        sort_order: rawItem.sort_order,
        created_at: rawItem.created_at,
        updated_at: rawItem.updated_at,
      } : null;

      if (itemError || !item) {
        throw new Error(`Failed to fetch item: ${itemError?.message ?? 'Not found'}`);
      }

      // Fetch ingredients from item_ingredients (shared with Item Master)
      const { data: itemIngredients, error: ingredientsError } = await supabase
        .from("item_ingredients")
        .select("*, ingredients(name_en, name_ar, name_ur)")
        .eq("item_id", itemId)
        .order("sort_order", { ascending: true });

      if (ingredientsError) {
        throw new Error(`Failed to fetch ingredients: ${ingredientsError.message}`);
      }

      // Map item_ingredients to POSItemIngredient format
      const ingredients: POSItemIngredient[] = (itemIngredients || []).map((ing: any) => ({
        id: ing.id,
        menu_item_id: itemId,
        ingredient_name_en: ing.ingredients?.name_en || "Unknown",
        ingredient_name_ar: ing.ingredients?.name_ar || null,
        ingredient_name_ur: ing.ingredients?.name_ur || null,
        extra_price: Number(ing.extra_cost) || 0,
        is_removable: ing.can_remove ?? true,
        is_default_included: true,
        sort_order: ing.sort_order || 0,
        created_at: ing.created_at,
      }));

      // Fetch sub-items for combo replacements from item_sub_items
      const { data: subItems, error: subItemsError } = await supabase
        .from("item_sub_items")
        .select("*, sub_item:items!item_sub_items_sub_item_id_fkey(name_en, name_ar, name_ur, base_cost)")
        .eq("item_id", itemId)
        .order("sort_order", { ascending: true });

      if (subItemsError) {
        throw new Error(`Failed to fetch sub-items: ${subItemsError.message}`);
      }

      // Build replacements from sub-items (combo logic)
      let replacements: POSItemReplacement[] = [];
      if (subItems && subItems.length > 0) {
        replacements = subItems.map((si: any, index: number) => ({
          id: si.id,
          menu_item_id: itemId,
          replacement_group: "combo",
          replacement_name_en: si.sub_item?.name_en || "Unknown",
          replacement_name_ar: si.sub_item?.name_ar || null,
          replacement_name_ur: si.sub_item?.name_ur || null,
          price_difference: si.is_default ? 0 : Number(si.replacement_price) || 0,
          is_default: si.is_default ?? (index === 0),
          sort_order: si.sort_order || index,
          created_at: si.created_at,
        }));
      } else {
        // Fallback: check pos_item_replacements for legacy data
        const { data: legacyReplacements } = await supabase
          .from("pos_item_replacements")
          .select("*")
          .eq("menu_item_id", itemId)
          .order("replacement_group", { ascending: true })
          .order("sort_order", { ascending: true });

        replacements = (legacyReplacements || []).map((rep: any) => ({
          ...rep,
          price_difference: Number(rep.price_difference),
        }));
      }

      return {
        item,
        ingredients,
        replacements,
      };
    },
    enabled: !!itemId,
    staleTime: 2 * 60 * 1000,
  });
}
