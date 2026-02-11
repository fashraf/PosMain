import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
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
import StaffAttendanceCard from "@/components/dashboard/StaffAttendanceCard";
import BranchContributionChart from "@/components/dashboard/BranchContributionChart";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Skeleton } from "@/components/ui/skeleton";

const ALL_BRANCHES = "__all__";

export default function Dashboard() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(ALL_BRANCHES);

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
  const isAllBranches = selectedBranchId === ALL_BRANCHES;

  // Both hooks called unconditionally (React rules)
  const groupData = useDashboardData();
  const branchData = useBranchDashboardData(isAllBranches ? null : selectedBranchId);

  const isLoading = branchesQuery.isLoading || (isAllBranches ? groupData.isLoading : branchData.isLoading);
  const isFetching = isAllBranches ? false : branchData.isFetching;

  if (isLoading) {
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

      {isAllBranches ? (
        <>
          {/* All Branches: KPI Gauges (4 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupData.kpiData.map((kpi) => (
              <KPIGaugeCard key={kpi.label} data={kpi} />
            ))}
          </div>

          <QuickStatsStrip stats={groupData.quickStats} />

          <RevenueTrendChart data={groupData.hourlyRevenue} />

          {/* Branch Contribution + Staff Attendance side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BranchContributionChart data={groupData.branchContribution} />
            <StaffAttendanceCard data={groupData.staffMetrics} />
          </div>

          <KeyMetricsGrid data={groupData.keyMetrics} />

          <AlertsPanel data={groupData.alerts} />
        </>
      ) : (
        <>
          {/* Branch view: 3x KPI Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {branchData.kpiData.map((kpi) => (
              <KPIGaugeCard key={kpi.label} data={kpi} />
            ))}
          </div>

          <QuickStatsStrip stats={branchData.quickStats} />

          {/* Donut Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DonutChartCard title="Payment Modes" data={branchData.paymentModes} centerLabel={`${branchData.paymentModes.reduce((s, d) => s + d.value, 0)} orders`} />
            <DonutChartCard title="Sales by Category" data={branchData.categoryBreakdown} centerLabel={`SAR ${branchData.categoryBreakdown.reduce((s, d) => s + d.value, 0).toFixed(0)}`} />
            <DonutChartCard title="Order Types" data={branchData.orderTypes} centerLabel={`${branchData.orderTypes.reduce((s, d) => s + d.value, 0)} orders`} />
          </div>

          <RevenueTrendChart data={branchData.hourlyRevenue} />

          {/* Staff & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CashierDutyTable data={branchData.staffList} />
            <KeyMetricsGrid data={branchData.keyMetrics} />
          </div>

          {/* Scrollable Lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecentOrdersList data={branchData.recentOrders} />
            <SlowestOrdersList data={branchData.pendingOrders} />
            <StaffAttendanceList data={branchData.staffList} />
          </div>

          <AlertsPanel data={branchData.alerts} />
        </>
      )}
    </div>
  );
}
