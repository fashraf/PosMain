import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

interface FinanceDataParams {
  branchId: string | null;
  dateRange: { from: string; to: string };
}

export function useFinanceData({ branchId, dateRange }: FinanceDataParams) {
  return useQuery({
    queryKey: ["finance-data", branchId, dateRange.from, dateRange.to],
    queryFn: async () => {
      // Fetch orders
      let ordersQuery = supabase
        .from("pos_orders")
        .select("id, subtotal, vat_amount, total_amount, payment_method, payment_status, order_type, branch_id, cancel_reason, cancelled_at, created_at")
        .gte("created_at", dateRange.from)
        .lte("created_at", dateRange.to);
      if (branchId) ordersQuery = ordersQuery.eq("branch_id", branchId);
      const { data: orders = [] } = await ordersQuery;

      // Fetch branches
      const { data: branches = [] } = await supabase.from("branches").select("id, name").eq("is_active", true);

      // Fetch expenses
      let expQuery = supabase
        .from("finance_expenses" as any)
        .select("*")
        .gte("expense_date", dateRange.from.split("T")[0])
        .lte("expense_date", dateRange.to.split("T")[0]);
      if (branchId) expQuery = expQuery.eq("branch_id", branchId);
      const { data: expenses = [] } = await expQuery;

      // Compute KPIs
      const paidOrders = orders.filter((o: any) => o.payment_status === "paid");
      const cancelledOrders = orders.filter((o: any) => o.payment_status === "cancelled");
      const totalSales = paidOrders.reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);
      const totalVAT = paidOrders.reduce((s: number, o: any) => s + Number(o.vat_amount || 0), 0);
      const totalCancellations = cancelledOrders.reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);
      const cancellationCount = cancelledOrders.length;

      // Expenses by category
      const expByCategory: Record<string, number> = {};
      (expenses as any[]).forEach((e: any) => {
        expByCategory[e.category] = (expByCategory[e.category] || 0) + Number(e.amount || 0);
      });
      const totalCOGS = expByCategory["cogs"] || 0;
      const totalOpex = Object.entries(expByCategory)
        .filter(([k]) => k !== "cogs")
        .reduce((s, [, v]) => s + v, 0);
      const grossProfit = totalSales - totalCOGS;
      const netProfit = grossProfit - totalOpex;

      // Payment breakdown
      const paymentBreakdown: Record<string, number> = {};
      paidOrders.forEach((o: any) => {
        const m = o.payment_method || "unknown";
        paymentBreakdown[m] = (paymentBreakdown[m] || 0) + Number(o.total_amount || 0);
      });

      // Branch-wise summary
      const branchMap: Record<string, any> = {};
      branches.forEach((b: any) => {
        branchMap[b.id] = { id: b.id, name: b.name, sales: 0, vat: 0, cancellations: 0, orders: 0 };
      });
      paidOrders.forEach((o: any) => {
        if (branchMap[o.branch_id]) {
          branchMap[o.branch_id].sales += Number(o.total_amount || 0);
          branchMap[o.branch_id].vat += Number(o.vat_amount || 0);
          branchMap[o.branch_id].orders += 1;
        }
      });
      cancelledOrders.forEach((o: any) => {
        if (branchMap[o.branch_id]) {
          branchMap[o.branch_id].cancellations += Number(o.total_amount || 0);
        }
      });
      const branchSummary = Object.values(branchMap).filter((b: any) => b.sales > 0 || b.cancellations > 0);

      // Sparkline data (last 7 days)
      const sparklineDays = 7;
      const salesSpark: number[] = [];
      const vatSpark: number[] = [];
      const cancelSpark: number[] = [];
      for (let i = sparklineDays - 1; i >= 0; i--) {
        const day = format(subDays(new Date(), i), "yyyy-MM-dd");
        const dayOrders = orders.filter((o: any) => o.created_at?.startsWith(day));
        salesSpark.push(dayOrders.filter((o: any) => o.payment_status === "paid").reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0));
        vatSpark.push(dayOrders.filter((o: any) => o.payment_status === "paid").reduce((s: number, o: any) => s + Number(o.vat_amount || 0), 0));
        cancelSpark.push(dayOrders.filter((o: any) => o.payment_status === "cancelled").reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0));
      }

      // Daily trend data
      const trendMap: Record<string, { date: string; revenue: number; vat: number; cancellations: number }> = {};
      orders.forEach((o: any) => {
        const day = (o.created_at || "").split("T")[0];
        if (!trendMap[day]) trendMap[day] = { date: day, revenue: 0, vat: 0, cancellations: 0 };
        if (o.payment_status === "paid") {
          trendMap[day].revenue += Number(o.total_amount || 0);
          trendMap[day].vat += Number(o.vat_amount || 0);
        }
        if (o.payment_status === "cancelled") {
          trendMap[day].cancellations += Number(o.total_amount || 0);
        }
      });
      const trendData = Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));

      // Cancel reasons
      const cancelReasons: Record<string, number> = {};
      cancelledOrders.forEach((o: any) => {
        const r = o.cancel_reason || "Unknown";
        cancelReasons[r] = (cancelReasons[r] || 0) + 1;
      });

      return {
        totalSales,
        totalVAT,
        totalCancellations,
        cancellationCount,
        grossProfit,
        netProfit,
        totalCOGS,
        totalOpex,
        expByCategory,
        paymentBreakdown,
        branchSummary,
        salesSpark,
        vatSpark,
        cancelSpark,
        trendData,
        cancelledOrders,
        cancelReasons,
        orders,
        paidOrders,
      };
    },
  });
}
