import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBranchDashboardData } from "@/hooks/useBranchDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPIGaugeCard from "@/components/dashboard/KPIGaugeCard";
import QuickStatsStrip from "@/components/dashboard/QuickStatsStrip";
import DonutChartCard from "@/components/dashboard/DonutChartCard";
import RevenueTrendChart from "@/components/dashboard/RevenueTrendChart";
import CashierDutyTable from "@/components/dashboard/CashierDutyTable";
import KeyMetricsGrid from "@/components/dashboard/KeyMetricsGrid";
import RecentOrdersList from "@/components/dashboard/RecentOrdersList";
import SlowestOrdersList from "@/components/dashboard/SlowestOrdersList";
import StaffAttendanceList from "@/components/dashboard/StaffAttendanceList";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  // Fetch active branches
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

  const branches = branchesQuery.data || [];

  // Auto-select first branch
  if (branches.length > 0 && !selectedBranchId) {
    setSelectedBranchId(branches[0].id);
  }

  const {
    kpiData,
    quickStats,
    hourlyRevenue,
    keyMetrics,
    alerts,
    paymentModes,
    orderTypes,
    categoryBreakdown,
    staffList,
    recentOrders,
    pendingOrders,
    isLoading,
    isFetching,
  } = useBranchDashboardData(selectedBranchId);

  if (branchesQuery.isLoading || isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
        </div>
        <Skeleton className="h-[260px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardHeader
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={setSelectedBranchId}
        isFetching={isFetching}
      />

      {/* KPI Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiData.map((kpi) => (
          <KPIGaugeCard key={kpi.label} data={kpi} />
        ))}
      </div>

      <QuickStatsStrip stats={quickStats} />

      {/* Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DonutChartCard title="Payment Modes" data={paymentModes} centerLabel={`${paymentModes.reduce((s, d) => s + d.value, 0)} orders`} />
        <DonutChartCard title="Sales by Category" data={categoryBreakdown} centerLabel={`SAR ${categoryBreakdown.reduce((s, d) => s + d.value, 0).toFixed(0)}`} />
        <DonutChartCard title="Order Types" data={orderTypes} centerLabel={`${orderTypes.reduce((s, d) => s + d.value, 0)} orders`} />
      </div>

      {/* Revenue Trend */}
      <RevenueTrendChart data={hourlyRevenue} />

      {/* Staff & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CashierDutyTable data={staffList} />
        <KeyMetricsGrid data={keyMetrics} />
      </div>

      {/* Scrollable Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecentOrdersList data={recentOrders} />
        <SlowestOrdersList data={pendingOrders} />
        <StaffAttendanceList data={staffList} />
      </div>

      <AlertsPanel data={alerts} />
    </div>
  );
}
