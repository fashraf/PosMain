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

      // Fetch ingredients from pos_item_ingredients using item id
      const { data: ingredients, error: ingredientsError } = await supabase
        .from("pos_item_ingredients")
        .select("*")
        .eq("menu_item_id", itemId)
        .order("sort_order", { ascending: true });

      if (ingredientsError) {
        throw new Error(`Failed to fetch ingredients: ${ingredientsError.message}`);
      }

      // Fetch replacements from pos_item_replacements using item id
      const { data: replacements, error: replacementsError } = await supabase
        .from("pos_item_replacements")
        .select("*")
        .eq("menu_item_id", itemId)
        .order("replacement_group", { ascending: true })
        .order("sort_order", { ascending: true });

      if (replacementsError) {
        throw new Error(`Failed to fetch replacements: ${replacementsError.message}`);
      }

      return {
        item,
        ingredients: (ingredients || []).map((ing) => ({
          ...ing,
          extra_price: Number(ing.extra_price),
        })),
        replacements: (replacements || []).map((rep) => ({
          ...rep,
          price_difference: Number(rep.price_difference),
        })),
      };
    },
    enabled: !!itemId,
    staleTime: 2 * 60 * 1000,
  });
}
