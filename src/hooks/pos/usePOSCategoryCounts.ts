import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CategoryCounts {
  byCategory: Record<string, number>;
  total: number;
  favorites: number;
}

export function usePOSCategoryCounts() {
  return useQuery({
    queryKey: ["pos-category-counts"],
    queryFn: async (): Promise<CategoryCounts> => {
      const [{ data: items, error: itemsError }, { data: favItems, error: favError }] =
        await Promise.all([
          supabase
            .from("items")
            .select("category_id")
            .eq("is_active", true),
          supabase
            .from("items")
            .select("id")
            .eq("is_active", true)
            .eq("is_favorite", true),
        ]);

      if (itemsError) throw new Error(itemsError.message);
      if (favError) throw new Error(favError.message);

      const byCategory: Record<string, number> = {};
      let total = 0;
      for (const item of items || []) {
        total++;
        const catId = item.category_id;
        if (catId) {
          byCategory[catId] = (byCategory[catId] || 0) + 1;
        }
      }

      return { byCategory, total, favorites: favItems?.length ?? 0 };
    },
    staleTime: 5 * 60 * 1000,
  });
}
