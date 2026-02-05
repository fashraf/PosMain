import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { POSCategory } from "@/lib/pos/types";

/**
 * Fetch categories for POS from maintenance_categories table
 */
export function usePOSCategories() {
  return useQuery({
    queryKey: ["pos-categories"],
    queryFn: async (): Promise<POSCategory[]> => {
      const { data, error } = await supabase
        .from("maintenance_categories")
        .select("id, name_en, name_ar, name_ur, icon_class, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
