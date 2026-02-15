import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  KPIData,
  QuickStat,
  HourlyRevenue,
  BranchContribution,
  StaffMetrics,
  KeyMetric,
  DashboardAlert,
} from "@/components/dashboard/mockDashboardData";
import type { BranchInsight } from "@/components/dashboard/BranchInsightCard";
import type { CollectionSummary } from "@/components/dashboard/CollectionSummaryStrip";
import type { PaymentMethodItem } from "@/components/dashboard/PaymentMethodChart";
import type { OrderTypeItem } from "@/components/dashboard/OrderTypeBarChart";
import type { HourlyOrderItem } from "@/components/dashboard/HourlyOrdersChart";

function todayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 86400000);
  return { from: start.toISOString(), to: end.toISOString() };
}

function yesterdayRange() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  return { from: yesterdayStart.toISOString(), to: todayStart.toISOString() };
}

export function useDashboardData() {
  // Active branches
  const branchesQuery = useQuery({
    queryKey: ["dashboard-branches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("id, name, is_active")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000,
  });

  // Active staff count + branch assignments
  const staffQuery = useQuery({
    queryKey: ["dashboard-staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, is_active")
        .eq("is_active", true);
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000,
  });

  // User-branch assignments for per-branch staff count
  const userBranchesQuery = useQuery({
    queryKey: ["dashboard-user-branches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_branches")
        .select("user_id, branch_id");
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000,
  });

  // Today's orders
  const todayOrdersQuery = useQuery({
    queryKey: ["dashboard-today-orders"],
    queryFn: async () => {
      const { from, to } = todayRange();
      const { data, error } = await supabase
        .from("pos_orders")
        .select("id, total_amount, subtotal, vat_amount, payment_status, payment_method, order_type, branch_id, created_at")
        .gte("created_at", from)
        .lt("created_at", to);
      if (error) throw error;
      return data || [];
    },
    staleTime: 15000,
    refetchInterval: 30000,
  });

  // Yesterday's orders
  const yesterdayOrdersQuery = useQuery({
    queryKey: ["dashboard-yesterday-orders"],
    queryFn: async () => {
      const { from, to } = yesterdayRange();
      const { data, error } = await supabase
        .from("pos_orders")
        .select("id, total_amount, payment_status, branch_id, created_at")
        .gte("created_at", from)
        .lt("created_at", to);
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000,
  });

  const branches = branchesQuery.data || [];
  const staff = staffQuery.data || [];
  const userBranches = userBranchesQuery.data || [];
  const todayOrders = todayOrdersQuery.data || [];
  const yesterdayOrders = yesterdayOrdersQuery.data || [];

  const todayPaid = todayOrders.filter((o) => o.payment_status === "paid");
  const yesterdayPaid = yesterdayOrders.filter((o) => o.payment_status === "paid");

  const todayRevenue = todayPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
  const yesterdayRevenue = yesterdayPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
  const avgCheck = todayPaid.length > 0 ? todayRevenue / todayPaid.length : 0;
  const pendingCount = todayOrders.filter((o) => o.payment_status === "pending").length;
  const cancelledCount = todayOrders.filter((o) => o.payment_status === "cancelled").length;

  const revChange = yesterdayRevenue > 0
    ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(0)
    : todayRevenue > 0 ? "+100" : "0";

  // === Branch Insights for BOZ ===
  const branchInsights: BranchInsight[] = branches.map((b) => {
    const branchTodayOrders = todayOrders.filter((o) => o.branch_id === b.id);
    const branchYesterdayOrders = yesterdayOrders.filter((o) => o.branch_id === b.id);
    const branchPaid = branchTodayOrders.filter((o) => o.payment_status === "paid");
    const branchYestPaid = branchYesterdayOrders.filter((o) => o.payment_status === "paid");
    const branchRevenue = branchPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
    const branchYestRevenue = branchYestPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
    const branchCancelled = branchTodayOrders.filter((o) => o.payment_status === "cancelled").length;
    const branchYestCancelled = branchYesterdayOrders.filter((o) => o.payment_status === "cancelled").length;

    // Last placed order
    const sortedOrders = [...branchTodayOrders].sort((a, c) => new Date(c.created_at).getTime() - new Date(a.created_at).getTime());
    const lastPlacedAt = sortedOrders.length > 0 ? sortedOrders[0].created_at : null;

    // Staff for this branch
    const branchStaffIds = userBranches.filter((ub) => ub.branch_id === b.id).map((ub) => ub.user_id);
    const activeStaff = staff.filter((s) => branchStaffIds.includes(s.id));

    // Order type breakdown
    const typeMap = new Map<string, number>();
    branchTodayOrders.forEach((o) => {
      const t = (o.order_type || "unknown").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      typeMap.set(t, (typeMap.get(t) || 0) + 1);
    });
    const total = branchTodayOrders.length || 1;
    const orderTypeBreakdown = Array.from(typeMap.entries()).map(([type, count]) => ({
      type,
      pct: Math.round((count / total) * 100),
    }));

    return {
      branchId: b.id,
      branchName: b.name,
      totalOrders: branchTodayOrders.length,
      lastPlacedAt,
      cancellations: branchCancelled,
      cancellationChange: branchYestCancelled > 0 ? ((branchCancelled - branchYestCancelled) / branchYestCancelled) * 100 : 0,
      staffOnDuty: activeStaff.length,
      totalStaff: branchStaffIds.length,
      revenue: branchRevenue,
      revenueChange: branchYestRevenue > 0 ? ((branchRevenue - branchYestRevenue) / branchYestRevenue) * 100 : 0,
      orderTypeBreakdown,
    };
  });

  // KPIs
  const kpiData: KPIData[] = [
    {
      label: "Total Revenue",
      value: `SAR ${todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      numericValue: todayRevenue,
      target: yesterdayRevenue || 1,
      percentage: yesterdayRevenue > 0 ? Math.min(Math.round((todayRevenue / yesterdayRevenue) * 100), 100) : todayRevenue > 0 ? 100 : 0,
      trend: `${Number(revChange) >= 0 ? "+" : ""}${revChange}% vs yesterday`,
      trendDirection: Number(revChange) >= 0 ? "up" : "down",
      targetLabel: yesterdayRevenue > 0
        ? `${Math.round((todayRevenue / yesterdayRevenue) * 100)}% of yesterday`
        : "No yesterday data",
      color: Number(revChange) >= 0 ? "#32c080" : "#dc8c3c",
    },
    {
      label: "Avg Check",
      value: `SAR ${avgCheck.toFixed(2)}`,
      numericValue: avgCheck,
      target: 100,
      percentage: Math.min(Math.round((avgCheck / 100) * 100), 100),
      trend: `${todayPaid.length} paid orders`,
      trendDirection: "up",
      targetLabel: todayPaid.length > 0 ? "Today's average" : "No orders yet",
      color: avgCheck > 0 ? "#32c080" : "#a09888",
    },
    {
      label: "Total Orders",
      value: String(todayOrders.length),
      numericValue: todayOrders.length,
      target: yesterdayOrders.length || 1,
      percentage: yesterdayOrders.length > 0 ? Math.min(Math.round((todayOrders.length / yesterdayOrders.length) * 100), 100) : todayOrders.length > 0 ? 100 : 0,
      trend: `Yesterday: ${yesterdayOrders.length}`,
      trendDirection: todayOrders.length >= yesterdayOrders.length ? "up" : "down",
      targetLabel: `${todayPaid.length} paid, ${pendingCount} pending`,
      color: "#64b4e0",
    },
    {
      label: "Cancelled",
      value: String(cancelledCount),
      numericValue: cancelledCount,
      target: todayOrders.length || 1,
      percentage: todayOrders.length > 0 ? Math.max(100 - Math.round((cancelledCount / todayOrders.length) * 100), 0) : 100,
      trend: cancelledCount === 0 ? "None today" : `${cancelledCount} cancelled`,
      trendDirection: cancelledCount === 0 ? "up" : "down",
      targetLabel: cancelledCount === 0 ? "Excellent" : "Needs attention",
      color: cancelledCount === 0 ? "#32c080" : "#dc8c3c",
    },
  ];

  // Quick stats
  const quickStats: QuickStat[] = [
    { label: "Paid Orders", value: String(todayPaid.length) },
    { label: "Pending", value: String(pendingCount) },
    { label: "Active Branches", value: String(branches.length) },
    { label: "Active Staff", value: String(staff.length) },
  ];

  // Hourly revenue
  const hourlyMap = new Map<number, number>();
  const yesterdayHourlyMap = new Map<number, number>();
  for (let h = 0; h < 24; h++) { hourlyMap.set(h, 0); yesterdayHourlyMap.set(h, 0); }
  todayPaid.forEach((o) => { const h = new Date(o.created_at).getHours(); hourlyMap.set(h, (hourlyMap.get(h) || 0) + (o.total_amount || 0)); });
  yesterdayPaid.forEach((o) => { const h = new Date(o.created_at).getHours(); yesterdayHourlyMap.set(h, (yesterdayHourlyMap.get(h) || 0) + (o.total_amount || 0)); });
  const hourlyRevenue: HourlyRevenue[] = [];
  for (let h = 6; h <= 23; h++) {
    hourlyRevenue.push({ hour: String(h).padStart(2, "0"), revenue: Math.round((hourlyMap.get(h) || 0) * 100) / 100, yesterday: Math.round((yesterdayHourlyMap.get(h) || 0) * 100) / 100 });
  }

  // Branch contribution
  const branchContribution: BranchContribution[] = branches.map((b) => {
    const branchRevenue = todayPaid.filter((o) => o.branch_id === b.id).reduce((s, o) => s + (o.total_amount || 0), 0);
    return { name: b.name, percentage: todayRevenue > 0 ? Math.round((branchRevenue / todayRevenue) * 100) : 0, revenue: Math.round(branchRevenue * 100) / 100 };
  }).sort((a, b) => b.revenue - a.revenue);

  // Staff metrics
  const staffMetrics: StaffMetrics = {
    scheduled: staff.length, clocked: staff.length, overtime: 0, attendance: staff.length > 0 ? 100 : 0,
    absenteeism: 0, salesPerHour: 0, avgTip: 0, topBranch: branches.length > 0 ? branches[0].name : "—", topBranchSalesPerHour: 0,
  };

  // Key metrics
  const keyMetrics: KeyMetric[] = [
    { label: "Today Revenue", value: `SAR ${todayRevenue.toFixed(2)}`, trend: `vs SAR ${yesterdayRevenue.toFixed(2)} yesterday`, trendDirection: todayRevenue >= yesterdayRevenue ? "up" : "down", icon: "target" },
    { label: "Paid Orders", value: String(todayPaid.length), trend: `Yesterday: ${yesterdayPaid.length}`, trendDirection: todayPaid.length >= yesterdayPaid.length ? "up" : "down", icon: "clock" },
    { label: "Active Staff", value: String(staff.length), trend: "Currently active", trendDirection: "neutral", icon: "users" },
    { label: "Active Branches", value: String(branches.length), trend: "Operational", trendDirection: "neutral", icon: "smartphone" },
    { label: "Pending Orders", value: String(pendingCount), trend: pendingCount === 0 ? "All clear" : "Awaiting payment", trendDirection: pendingCount === 0 ? "up" : "down", icon: "zap" },
    { label: "Avg Check", value: `SAR ${avgCheck.toFixed(2)}`, trend: todayPaid.length > 0 ? "Per paid order" : "No data", trendDirection: "neutral", icon: "utensils" },
  ];

  // Alerts
  const alerts: DashboardAlert[] = [];
  if (todayOrders.length === 0) alerts.push({ type: "warning", message: "No orders today yet. Waiting for first order." });
  if (cancelledCount > 0) alerts.push({ type: "warning", message: `${cancelledCount} order(s) cancelled today.` });
  if (pendingCount > 0) alerts.push({ type: "action", message: `${pendingCount} order(s) pending payment — follow up with cashiers.` });
  if (todayRevenue > yesterdayRevenue && yesterdayRevenue > 0) alerts.push({ type: "success", message: `Revenue is up ${revChange}% compared to yesterday!` });
  if (todayRevenue > 0 && todayRevenue < yesterdayRevenue) alerts.push({ type: "warning", message: `Revenue is down compared to yesterday (SAR ${yesterdayRevenue.toFixed(2)}).` });
  if (branches.length === 0) alerts.push({ type: "warning", message: "No active branches found." });
  if (alerts.length === 0) alerts.push({ type: "success", message: "All systems operational. Dashboard ready." });

  // === Collection Summary ===
  const todayTotal = todayOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const todayCollected = todayPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
  const todayNotCollected = todayOrders.filter((o) => o.payment_status === "pending").reduce((s, o) => s + (o.total_amount || 0), 0);
  const todayCancelledAmt = todayOrders.filter((o) => o.payment_status === "cancelled").reduce((s, o) => s + (o.total_amount || 0), 0);
  const todayVat = todayPaid.reduce((s, o) => s + (o.vat_amount || 0), 0);

  const yesterdayTotal = yesterdayOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const yesterdayCollectedAmt = yesterdayPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
  const yesterdayNotCollected = yesterdayOrders.filter((o) => o.payment_status === "pending").reduce((s, o) => s + (o.total_amount || 0), 0);
  const yesterdayCancelledAmt = yesterdayOrders.filter((o) => o.payment_status === "cancelled").reduce((s, o) => s + (o.total_amount || 0), 0);

  const pctChange = (today: number, yesterday: number) => yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : today > 0 ? 100 : 0;

  // Hourly sparkline data
  const hourlyTotalsMap = new Map<number, number>();
  const hourlyCollectedMap = new Map<number, number>();
  for (let h = 0; h < 24; h++) { hourlyTotalsMap.set(h, 0); hourlyCollectedMap.set(h, 0); }
  todayOrders.forEach((o) => { const h = new Date(o.created_at).getHours(); hourlyTotalsMap.set(h, (hourlyTotalsMap.get(h) || 0) + (o.total_amount || 0)); });
  todayPaid.forEach((o) => { const h = new Date(o.created_at).getHours(); hourlyCollectedMap.set(h, (hourlyCollectedMap.get(h) || 0) + (o.total_amount || 0)); });
  const hourlyTotals: number[] = [];
  const hourlyCollected: number[] = [];
  for (let h = 6; h <= 23; h++) { hourlyTotals.push(hourlyTotalsMap.get(h) || 0); hourlyCollected.push(hourlyCollectedMap.get(h) || 0); }

  const collectionSummary: CollectionSummary = {
    totalAmount: todayTotal,
    collected: todayCollected,
    notCollected: todayNotCollected,
    cancelledAmount: todayCancelledAmt,
    cancelledCount: cancelledCount,
    vatCollected: todayVat,
    totalAmountChange: pctChange(todayTotal, yesterdayTotal),
    collectedChange: pctChange(todayCollected, yesterdayCollectedAmt),
    notCollectedChange: pctChange(todayNotCollected, yesterdayNotCollected),
    cancelledChange: pctChange(todayCancelledAmt, yesterdayCancelledAmt),
    vatChange: 0,
    hourlyTotals,
    hourlyCollected,
  };

  // === Payment Method Breakdown ===
  const pmMap = new Map<string, { count: number; amount: number }>();
  todayPaid.forEach((o) => {
    const m = o.payment_method || "unknown";
    const prev = pmMap.get(m) || { count: 0, amount: 0 };
    pmMap.set(m, { count: prev.count + 1, amount: prev.amount + (o.total_amount || 0) });
  });
  const paymentMethodBreakdown: PaymentMethodItem[] = Array.from(pmMap.entries())
    .map(([method, v]) => ({ method, ...v }))
    .sort((a, b) => b.amount - a.amount);

  // === Order Type Breakdown ===
  const otMap = new Map<string, { count: number; amount: number }>();
  todayOrders.forEach((o) => {
    const t = o.order_type || "unknown";
    const prev = otMap.get(t) || { count: 0, amount: 0 };
    otMap.set(t, { count: prev.count + 1, amount: prev.amount + (o.total_amount || 0) });
  });
  const orderTypeBreakdown: OrderTypeItem[] = Array.from(otMap.entries())
    .map(([type, v]) => ({ type, ...v }))
    .sort((a, b) => b.amount - a.amount);

  // === Hourly Orders (count, not revenue) ===
  const hourlyOrderCountMap = new Map<number, number>();
  const yesterdayHourlyOrderCountMap = new Map<number, number>();
  for (let h = 0; h < 24; h++) { hourlyOrderCountMap.set(h, 0); yesterdayHourlyOrderCountMap.set(h, 0); }
  todayOrders.forEach((o) => { const h = new Date(o.created_at).getHours(); hourlyOrderCountMap.set(h, (hourlyOrderCountMap.get(h) || 0) + 1); });
  yesterdayOrders.forEach((o) => { const h = new Date(o.created_at).getHours(); yesterdayHourlyOrderCountMap.set(h, (yesterdayHourlyOrderCountMap.get(h) || 0) + 1); });
  const hourlyOrders: HourlyOrderItem[] = [];
  for (let h = 6; h <= 23; h++) {
    hourlyOrders.push({ hour: String(h).padStart(2, "0"), count: hourlyOrderCountMap.get(h) || 0, yesterdayCount: yesterdayHourlyOrderCountMap.get(h) || 0 });
  }

  const isLoading = branchesQuery.isLoading || staffQuery.isLoading || todayOrdersQuery.isLoading || yesterdayOrdersQuery.isLoading;

  return {
    kpiData, quickStats, hourlyRevenue, branchContribution, staffMetrics, keyMetrics, alerts,
    branchCount: branches.length, branchInsights, isLoading,
    collectionSummary, paymentMethodBreakdown, orderTypeBreakdown, hourlyOrders,
  };
}
