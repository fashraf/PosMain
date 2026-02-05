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

      // Fetch item
      const { data: item, error: itemError } = await supabase
        .from("pos_menu_items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (itemError) {
        throw new Error(`Failed to fetch item: ${itemError.message}`);
      }

      // Fetch ingredients
      const { data: ingredients, error: ingredientsError } = await supabase
        .from("pos_item_ingredients")
        .select("*")
        .eq("menu_item_id", itemId)
        .order("sort_order", { ascending: true });

      if (ingredientsError) {
        throw new Error(`Failed to fetch ingredients: ${ingredientsError.message}`);
      }

      // Fetch replacements
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
        item: {
          ...item,
          base_price: Number(item.base_price),
        },
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
