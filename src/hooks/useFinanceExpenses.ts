import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ExpenseParams {
  branchId: string | null;
  dateRange: { from: string; to: string };
}

export function useFinanceExpenses({ branchId, dateRange }: ExpenseParams) {
  return useQuery({
    queryKey: ["finance-expenses", branchId, dateRange.from, dateRange.to],
    queryFn: async () => {
      let query = supabase
        .from("finance_expenses" as any)
        .select("*")
        .gte("expense_date", dateRange.from.split("T")[0])
        .lte("expense_date", dateRange.to.split("T")[0])
        .order("expense_date", { ascending: false });
      if (branchId) query = query.eq("branch_id", branchId);
      const { data = [] } = await query;
      return data as any[];
    },
  });
}
