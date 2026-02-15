import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  KPIData,
  QuickStat,
  HourlyRevenue,
  KeyMetric,
  DashboardAlert,
  DonutSegment,
  OrderListItem,
  StaffListItem,
} from "@/components/dashboard/mockDashboardData";
import type { DetailKPI } from "@/components/dashboard/BranchDetailKPIStrip";
import type { ActivityItem } from "@/components/dashboard/RecentActivityFeed";
import type { CollectionSummary } from "@/components/dashboard/CollectionSummaryStrip";
import type { TopSellingItem } from "@/components/dashboard/TopSellingItemsCard";
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

const DONUT_COLORS = ["#2c8cb4", "#32c080", "#dc8c3c", "#64b4e0", "#a09888", "#8b5cf6"];

function timeAgoShort(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  const hrs = Math.floor(diff / 60);
  return `${hrs}h ${diff % 60}m ago`;
}

export function useBranchDashboardData(branchId: string | null) {
  const todayOrdersQuery = useQuery({
    queryKey: ["branch-dashboard-today", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const { from, to } = todayRange();
      const { data, error } = await supabase
        .from("pos_orders")
        .select("id, total_amount, subtotal, vat_amount, payment_status, payment_method, order_type, created_at, order_number, cancel_reason")
        .eq("branch_id", branchId)
        .gte("created_at", from)
        .lt("created_at", to);
      if (error) throw error;
      return data || [];
    },
    enabled: !!branchId,
    staleTime: 15000,
    refetchInterval: 60000,
  });

  const yesterdayOrdersQuery = useQuery({
    queryKey: ["branch-dashboard-yesterday", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const { from, to } = yesterdayRange();
      const { data, error } = await supabase
        .from("pos_orders")
        .select("id, total_amount, payment_status, created_at")
        .eq("branch_id", branchId)
        .gte("created_at", from)
        .lt("created_at", to);
      if (error) throw error;
      return data || [];
    },
    enabled: !!branchId,
    staleTime: 60000,
  });

  const recentOrdersQuery = useQuery({
    queryKey: ["branch-dashboard-recent", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const { data, error } = await supabase
        .from("pos_orders")
        .select("id, order_number, total_amount, payment_status, created_at, order_type, cancel_reason")
        .eq("branch_id", branchId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!branchId,
    staleTime: 15000,
    refetchInterval: 60000,
  });

  const branchStaffQuery = useQuery({
    queryKey: ["branch-dashboard-staff", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const { data, error } = await supabase
        .from("user_branches")
        .select("user_id, profiles!inner(id, full_name, employee_code, is_active, phone)")
        .eq("branch_id", branchId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!branchId,
    staleTime: 60000,
  });

  const orderItemsQuery = useQuery({
    queryKey: ["branch-dashboard-items", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const { from, to } = todayRange();
      const { data: orders } = await supabase
        .from("pos_orders")
        .select("id")
        .eq("branch_id", branchId)
        .gte("created_at", from)
        .lt("created_at", to);
      if (!orders || orders.length === 0) return [];
      const orderIds = orders.map((o) => o.id);
      const { data, error } = await supabase
        .from("pos_order_items")
        .select("id, item_name, line_total, quantity, menu_item_id")
        .in("order_id", orderIds);
      if (error) throw error;
      return data || [];
    },
    enabled: !!branchId,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["branch-dashboard-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("maintenance_categories").select("id, name_en").eq("is_active", true);
      if (error) throw error;
      return data || [];
    },
    staleTime: 300000,
  });

  const menuItemsQuery = useQuery({
    queryKey: ["branch-dashboard-menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pos_menu_items").select("id, category_id");
      if (error) throw error;
      return data || [];
    },
    staleTime: 300000,
  });

  // ---- Derived data ----
  const todayOrders = todayOrdersQuery.data || [];
  const yesterdayOrders = yesterdayOrdersQuery.data || [];
  const staffData = branchStaffQuery.data || [];
  const orderItems = orderItemsQuery.data || [];
  const categories = categoriesQuery.data || [];
  const menuItems = menuItemsQuery.data || [];

  const todayPaid = todayOrders.filter((o) => o.payment_status === "paid");
  const yesterdayPaid = yesterdayOrders.filter((o) => o.payment_status === "paid");
  const todayRevenue = todayPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
  const yesterdayRevenue = yesterdayPaid.reduce((s, o) => s + (o.total_amount || 0), 0);
  const avgCheck = todayPaid.length > 0 ? todayRevenue / todayPaid.length : 0;
  const pendingCount = todayOrders.filter((o) => o.payment_status === "pending").length;
  const cancelledCount = todayOrders.filter((o) => o.payment_status === "cancelled").length;
  const yesterdayCancelled = yesterdayOrders.filter((o) => o.payment_status === "cancelled").length;

  const revChange = yesterdayRevenue > 0
    ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : todayRevenue > 0 ? 100 : 0;

  // Last order time
  const sortedByTime = [...todayOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const lastOrderTime = sortedByTime.length > 0 ? sortedByTime[0].created_at : null;

  // Yesterday comparison
  const yesterdayComparison = {
    orders: { today: todayOrders.length, yesterday: yesterdayOrders.length, change: yesterdayOrders.length > 0 ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0 },
    revenue: { today: todayRevenue, yesterday: yesterdayRevenue, change: revChange },
    cancellations: { today: cancelledCount, yesterday: yesterdayCancelled, change: yesterdayCancelled > 0 ? ((cancelledCount - yesterdayCancelled) / yesterdayCancelled) * 100 : 0 },
  };

  // === Enhanced KPI strip data ===
  const detailKPIs: DetailKPI[] = [
    { label: "Total Orders", value: String(todayOrders.length), change: yesterdayComparison.orders.change, icon: "orders" },
    { label: "Revenue", value: `SAR ${todayRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: revChange, icon: "revenue" },
    { label: "Cancellations", value: String(cancelledCount), change: yesterdayComparison.cancellations.change, icon: "cancellations" },
    { label: "Avg Check", value: `SAR ${avgCheck.toFixed(0)}`, icon: "time" },
    { label: "Staff On Duty", value: `${staffData.filter((s: any) => s.profiles?.is_active).length} / ${staffData.length}`, icon: "staff" },
    { label: "Last Order", value: lastOrderTime ? timeAgoShort(lastOrderTime) : "—", icon: "lastOrder" },
  ];

  // === Recent Activity Feed ===
  const recentActivity: ActivityItem[] = (recentOrdersQuery.data || []).slice(0, 15).map((o) => {
    const isCancelled = o.payment_status === "cancelled";
    return {
      id: o.id,
      type: isCancelled ? "order_cancelled" as const : "order_placed" as const,
      label: `#${o.order_number}  ${isCancelled ? "Cancelled" : "Placed"}`,
      detail: isCancelled
        ? `Reason: ${o.cancel_reason || "Not specified"}`
        : `SAR ${(o.total_amount || 0).toFixed(0)} · ${(o.order_type || "").replace(/_/g, " ")}`,
      timestamp: o.created_at,
      timeAgo: timeAgoShort(o.created_at),
    };
  });

  // KPIs (existing 3-card)
  const kpiData: KPIData[] = [
    {
      label: "Revenue Today",
      value: `SAR ${todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      numericValue: todayRevenue, target: yesterdayRevenue || 1,
      percentage: yesterdayRevenue > 0 ? Math.min(Math.round((todayRevenue / yesterdayRevenue) * 100), 100) : todayRevenue > 0 ? 100 : 0,
      trend: `${revChange >= 0 ? "+" : ""}${revChange.toFixed(0)}% vs yesterday`,
      trendDirection: revChange >= 0 ? "up" : "down",
      targetLabel: yesterdayRevenue > 0 ? `${Math.round((todayRevenue / yesterdayRevenue) * 100)}% of yesterday` : "No yesterday data",
      color: revChange >= 0 ? "#32c080" : "#dc8c3c",
    },
    {
      label: "Avg Check",
      value: `SAR ${avgCheck.toFixed(2)}`, numericValue: avgCheck, target: 100,
      percentage: Math.min(Math.round((avgCheck / 100) * 100), 100),
      trend: `${todayPaid.length} paid orders`, trendDirection: "up",
      targetLabel: todayPaid.length > 0 ? "Today's average" : "No orders yet",
      color: avgCheck > 0 ? "#32c080" : "#a09888",
    },
    {
      label: "Total Orders",
      value: String(todayOrders.length), numericValue: todayOrders.length, target: yesterdayOrders.length || 1,
      percentage: yesterdayOrders.length > 0 ? Math.min(Math.round((todayOrders.length / yesterdayOrders.length) * 100), 100) : todayOrders.length > 0 ? 100 : 0,
      trend: `Yesterday: ${yesterdayOrders.length}`,
      trendDirection: todayOrders.length >= yesterdayOrders.length ? "up" : "down",
      targetLabel: `${todayPaid.length} paid, ${pendingCount} pending`,
      color: "#64b4e0",
    },
  ];

  // Quick stats
  const quickStats: QuickStat[] = [
    { label: "Paid Orders", value: String(todayPaid.length) },
    { label: "Pending", value: String(pendingCount) },
    { label: "Cancelled", value: String(cancelledCount) },
    { label: "Staff Assigned", value: String(staffData.length) },
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

  // Payment modes donut
  const paymentModeMap = new Map<string, number>();
  todayPaid.forEach((o) => { const m = o.payment_method || "unknown"; paymentModeMap.set(m, (paymentModeMap.get(m) || 0) + 1); });
  const paymentModes: DonutSegment[] = Array.from(paymentModeMap.entries()).map(([name, value], i) => ({
    name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value, color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  // Order types donut
  const orderTypeMap = new Map<string, number>();
  todayOrders.forEach((o) => { const t = o.order_type || "unknown"; orderTypeMap.set(t, (orderTypeMap.get(t) || 0) + 1); });
  const orderTypes: DonutSegment[] = Array.from(orderTypeMap.entries()).map(([name, value], i) => ({
    name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value, color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  // Category breakdown donut
  const menuItemCategoryMap = new Map<string, string>();
  menuItems.forEach((mi) => { if (mi.category_id) menuItemCategoryMap.set(mi.id, mi.category_id); });
  const categoryNameMap = new Map<string, string>();
  categories.forEach((c) => categoryNameMap.set(c.id, c.name_en));
  const categorySalesMap = new Map<string, number>();
  orderItems.forEach((oi) => {
    const catId = oi.menu_item_id ? menuItemCategoryMap.get(oi.menu_item_id) : null;
    const catName = catId ? categoryNameMap.get(catId) || "Uncategorized" : "Uncategorized";
    categorySalesMap.set(catName, (categorySalesMap.get(catName) || 0) + (oi.line_total || 0));
  });
  const categoryBreakdown: DonutSegment[] = Array.from(categorySalesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({ name, value: Math.round(value * 100) / 100, color: DONUT_COLORS[i % DONUT_COLORS.length] }));

  // Staff list
  const staffList: StaffListItem[] = staffData.map((s: any) => ({
    name: s.profiles?.full_name || "—", employeeCode: s.profiles?.employee_code || "—", isActive: s.profiles?.is_active ?? true,
  }));

  // Recent orders list
  const recentOrders: OrderListItem[] = (recentOrdersQuery.data || []).map((o) => ({
    time: new Date(o.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    orderNumber: `#${o.order_number}`, total: o.total_amount || 0, status: o.payment_status,
  }));

  // Slowest/pending orders
  const pendingOrders = todayOrders
    .filter((o) => o.payment_status === "pending")
    .map((o) => {
      const createdAt = new Date(o.created_at);
      const durationMin = Math.round((Date.now() - createdAt.getTime()) / 60000);
      return { time: createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }), orderNumber: `#${o.order_number}`, total: o.total_amount || 0, status: o.payment_status, duration: durationMin };
    })
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 50);

  // Key metrics
  const keyMetrics: KeyMetric[] = [
    { label: "Today Revenue", value: `SAR ${todayRevenue.toFixed(2)}`, trend: `vs SAR ${yesterdayRevenue.toFixed(2)} yesterday`, trendDirection: todayRevenue >= yesterdayRevenue ? "up" : "down", icon: "target" },
    { label: "Paid Orders", value: String(todayPaid.length), trend: `Yesterday: ${yesterdayPaid.length}`, trendDirection: todayPaid.length >= yesterdayPaid.length ? "up" : "down", icon: "clock" },
    { label: "Branch Staff", value: String(staffData.length), trend: "Assigned", trendDirection: "neutral", icon: "users" },
    { label: "Pending Orders", value: String(pendingCount), trend: pendingCount === 0 ? "All clear" : "Awaiting payment", trendDirection: pendingCount === 0 ? "up" : "down", icon: "zap" },
    { label: "Avg Check", value: `SAR ${avgCheck.toFixed(2)}`, trend: todayPaid.length > 0 ? "Per paid order" : "No data", trendDirection: "neutral", icon: "utensils" },
    { label: "Cancelled", value: String(cancelledCount), trend: cancelledCount === 0 ? "None today" : "Needs attention", trendDirection: cancelledCount === 0 ? "up" : "down", icon: "smartphone" },
  ];

  // Alerts
  const alerts: DashboardAlert[] = [];
  if (todayOrders.length === 0) alerts.push({ type: "warning", message: "No orders today yet." });
  if (cancelledCount > 0) alerts.push({ type: "warning", message: `${cancelledCount} order(s) cancelled today.` });
  if (pendingCount > 0) alerts.push({ type: "action", message: `${pendingCount} order(s) pending payment.` });
  if (todayRevenue > yesterdayRevenue && yesterdayRevenue > 0) alerts.push({ type: "success", message: `Revenue up ${revChange.toFixed(0)}% vs yesterday!` });
  if (todayRevenue > 0 && todayRevenue < yesterdayRevenue) alerts.push({ type: "warning", message: `Revenue down vs yesterday (SAR ${yesterdayRevenue.toFixed(2)}).` });
  if (alerts.length === 0) alerts.push({ type: "success", message: "All systems operational." });

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

  const hourlyTotalsMap = new Map<number, number>();
  const hourlyCollectedMap = new Map<number, number>();
  for (let h = 0; h < 24; h++) { hourlyTotalsMap.set(h, 0); hourlyCollectedMap.set(h, 0); }
  todayOrders.forEach((o) => { const h = new Date(o.created_at).getHours(); hourlyTotalsMap.set(h, (hourlyTotalsMap.get(h) || 0) + (o.total_amount || 0)); });
  todayPaid.forEach((o) => { const h = new Date(o.created_at).getHours(); hourlyCollectedMap.set(h, (hourlyCollectedMap.get(h) || 0) + (o.total_amount || 0)); });
  const hourlyTotals: number[] = [];
  const hourlyCollectedArr: number[] = [];
  for (let h = 6; h <= 23; h++) { hourlyTotals.push(hourlyTotalsMap.get(h) || 0); hourlyCollectedArr.push(hourlyCollectedMap.get(h) || 0); }

  const collectionSummary: CollectionSummary = {
    totalAmount: todayTotal,
    collected: todayCollected,
    notCollected: todayNotCollected,
    cancelledAmount: todayCancelledAmt,
    cancelledCount,
    vatCollected: todayVat,
    totalAmountChange: pctChange(todayTotal, yesterdayTotal),
    collectedChange: pctChange(todayCollected, yesterdayCollectedAmt),
    notCollectedChange: pctChange(todayNotCollected, yesterdayNotCollected),
    cancelledChange: pctChange(todayCancelledAmt, yesterdayCancelledAmt),
    vatChange: 0,
    hourlyTotals,
    hourlyCollected: hourlyCollectedArr,
  };

  // === Top Selling Items ===
  const itemAgg = new Map<string, { quantity: number; revenue: number }>();
  orderItems.forEach((oi) => {
    const prev = itemAgg.get(oi.item_name) || { quantity: 0, revenue: 0 };
    itemAgg.set(oi.item_name, { quantity: prev.quantity + (oi.quantity || 1), revenue: prev.revenue + (oi.line_total || 0) });
  });
  const topSellingItems: TopSellingItem[] = Array.from(itemAgg.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

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
  const orderTypeBreakdownData: OrderTypeItem[] = Array.from(otMap.entries())
    .map(([type, v]) => ({ type, ...v }))
    .sort((a, b) => b.amount - a.amount);

  // === Hourly Orders (count) ===
  const hourlyOrderCountMap = new Map<number, number>();
  const yesterdayHourlyOrderCountMap = new Map<number, number>();
  for (let h = 0; h < 24; h++) { hourlyOrderCountMap.set(h, 0); yesterdayHourlyOrderCountMap.set(h, 0); }
  todayOrders.forEach((o) => { const h = new Date(o.created_at).getHours(); hourlyOrderCountMap.set(h, (hourlyOrderCountMap.get(h) || 0) + 1); });
  yesterdayOrders.forEach((o) => { const h = new Date(o.created_at).getHours(); yesterdayHourlyOrderCountMap.set(h, (yesterdayHourlyOrderCountMap.get(h) || 0) + 1); });
  const hourlyOrders: HourlyOrderItem[] = [];
  for (let h = 6; h <= 23; h++) {
    hourlyOrders.push({ hour: String(h).padStart(2, "0"), count: hourlyOrderCountMap.get(h) || 0, yesterdayCount: yesterdayHourlyOrderCountMap.get(h) || 0 });
  }

  const isLoading = todayOrdersQuery.isLoading || yesterdayOrdersQuery.isLoading || branchStaffQuery.isLoading;
  const isFetching = todayOrdersQuery.isFetching || yesterdayOrdersQuery.isFetching;

  return {
    kpiData, quickStats, hourlyRevenue, keyMetrics, alerts,
    paymentModes, orderTypes, categoryBreakdown, staffList, recentOrders, pendingOrders,
    detailKPIs, yesterdayComparison, recentActivity, lastOrderTime,
    collectionSummary, topSellingItems, paymentMethodBreakdown, orderTypeBreakdown: orderTypeBreakdownData, hourlyOrders,
    isLoading, isFetching,
  };
}
