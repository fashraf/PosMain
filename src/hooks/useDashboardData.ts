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

  // Active staff count
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
        .select("id, total_amount, payment_status, created_at")
        .gte("created_at", from)
        .lt("created_at", to);
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000,
  });

  const branches = branchesQuery.data || [];
  const staff = staffQuery.data || [];
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

  // Hourly revenue: today vs yesterday
  const hourlyMap = new Map<number, number>();
  const yesterdayHourlyMap = new Map<number, number>();
  for (let h = 0; h < 24; h++) {
    hourlyMap.set(h, 0);
    yesterdayHourlyMap.set(h, 0);
  }
  todayPaid.forEach((o) => {
    const h = new Date(o.created_at).getHours();
    hourlyMap.set(h, (hourlyMap.get(h) || 0) + (o.total_amount || 0));
  });
  yesterdayPaid.forEach((o) => {
    const h = new Date(o.created_at).getHours();
    yesterdayHourlyMap.set(h, (yesterdayHourlyMap.get(h) || 0) + (o.total_amount || 0));
  });

  // Only show hours 6-23
  const hourlyRevenue: HourlyRevenue[] = [];
  for (let h = 6; h <= 23; h++) {
    hourlyRevenue.push({
      hour: String(h).padStart(2, "0"),
      revenue: Math.round((hourlyMap.get(h) || 0) * 100) / 100,
      yesterday: Math.round((yesterdayHourlyMap.get(h) || 0) * 100) / 100,
    });
  }

  // Branch contribution
  const branchContribution: BranchContribution[] = branches.map((b) => {
    const branchRevenue = todayPaid
      .filter((o) => o.branch_id === b.id)
      .reduce((s, o) => s + (o.total_amount || 0), 0);
    return {
      name: b.name,
      percentage: todayRevenue > 0 ? Math.round((branchRevenue / todayRevenue) * 100) : 0,
      revenue: Math.round(branchRevenue * 100) / 100,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Staff metrics (real count, rest placeholder)
  const staffMetrics: StaffMetrics = {
    scheduled: staff.length,
    clocked: staff.length,
    overtime: 0,
    attendance: staff.length > 0 ? 100 : 0,
    absenteeism: 0,
    salesPerHour: 0,
    avgTip: 0,
    topBranch: branches.length > 0 ? branches[0].name : "—",
    topBranchSalesPerHour: 0,
  };

  // Key metrics from real data
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
  if (todayOrders.length === 0) {
    alerts.push({ type: "warning", message: "No orders today yet. Waiting for first order." });
  }
  if (cancelledCount > 0) {
    alerts.push({ type: "warning", message: `${cancelledCount} order(s) cancelled today.` });
  }
  if (pendingCount > 0) {
    alerts.push({ type: "action", message: `${pendingCount} order(s) pending payment — follow up with cashiers.` });
  }
  if (todayRevenue > yesterdayRevenue && yesterdayRevenue > 0) {
    alerts.push({ type: "success", message: `Revenue is up ${revChange}% compared to yesterday!` });
  }
  if (todayRevenue > 0 && todayRevenue < yesterdayRevenue) {
    alerts.push({ type: "warning", message: `Revenue is down compared to yesterday (SAR ${yesterdayRevenue.toFixed(2)}).` });
  }
  if (branches.length === 0) {
    alerts.push({ type: "warning", message: "No active branches found." });
  }
  if (alerts.length === 0) {
    alerts.push({ type: "success", message: "All systems operational. Dashboard ready." });
  }

  const isLoading = branchesQuery.isLoading || staffQuery.isLoading || todayOrdersQuery.isLoading || yesterdayOrdersQuery.isLoading;

  return {
    kpiData,
    quickStats,
    hourlyRevenue,
    branchContribution,
    staffMetrics,
    keyMetrics,
    alerts,
    branchCount: branches.length,
    isLoading,
  };
}
