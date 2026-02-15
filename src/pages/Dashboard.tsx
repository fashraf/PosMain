import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useBranchDashboardData } from "@/hooks/useBranchDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

import BOZCompactTable from "@/components/dashboard/BOZCompactTable";
import BranchComparisonPanel from "@/components/dashboard/BranchComparisonPanel";
import BranchDetailKPIStrip from "@/components/dashboard/BranchDetailKPIStrip";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import BranchReportLinks from "@/components/dashboard/BranchReportLinks";
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
import CollectionSummaryStrip from "@/components/dashboard/CollectionSummaryStrip";
import PaymentMethodChart from "@/components/dashboard/PaymentMethodChart";
import OrderTypeBarChart from "@/components/dashboard/OrderTypeBarChart";
import HourlyOrdersChart from "@/components/dashboard/HourlyOrdersChart";
import TopSellingItemsCard from "@/components/dashboard/TopSellingItemsCard";
import { Skeleton } from "@/components/ui/skeleton";

const ALL_BRANCHES = "__all__";

export default function Dashboard() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(ALL_BRANCHES);
  const [comparedBranches, setComparedBranches] = useState<string[]>([]);

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

  const groupData = useDashboardData();
  const branchData = useBranchDashboardData(isAllBranches ? null : selectedBranchId);

  const isLoading = branchesQuery.isLoading || (isAllBranches ? groupData.isLoading : branchData.isLoading);
  const isFetching = isAllBranches ? false : branchData.isFetching;

  const handleBranchClick = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  const handleCompareToggle = (branchId: string) => {
    setComparedBranches((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-[120px] rounded-lg" />)}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
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
          {/* 1. Collection Summary Hero Cards */}
          <CollectionSummaryStrip data={groupData.collectionSummary} />


          {/* 3. Compact Table */}
          <BOZCompactTable data={groupData.branchInsights} onBranchClick={handleBranchClick} />

          {/* 4. Branch Comparison */}
          <BranchComparisonPanel
            branches={groupData.branchInsights}
            selectedIds={comparedBranches}
            onToggle={handleCompareToggle}
          />

          {/* 5. Quick Stats */}
          <QuickStatsStrip stats={groupData.quickStats} />

          {/* 6. Revenue + Hourly Orders side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RevenueTrendChart data={groupData.hourlyRevenue} />
            <HourlyOrdersChart data={groupData.hourlyOrders} />
          </div>

          {/* 7. Payment Method + Order Type side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PaymentMethodChart data={groupData.paymentMethodBreakdown} />
            <OrderTypeBarChart data={groupData.orderTypeBreakdown} />
          </div>

          {/* 8. Branch Contribution + Staff */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BranchContributionChart data={groupData.branchContribution} />
            <StaffAttendanceCard data={groupData.staffMetrics} />
          </div>

          {/* 9. Key Metrics */}
          <KeyMetricsGrid data={groupData.keyMetrics} />

          {/* 10. Alerts */}
          <AlertsPanel data={groupData.alerts} />
        </>
      ) : (
        <>
          {/* 1. Collection Summary */}
          <CollectionSummaryStrip data={branchData.collectionSummary} />

          {/* 2. Enhanced KPI Strip */}
          <BranchDetailKPIStrip data={branchData.detailKPIs} />

          {/* 3. Today vs Yesterday Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(branchData.yesterdayComparison).map(([key, comp]) => (
              <div key={key} className="bg-card border border-dotted border-muted rounded-lg p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {key === "orders" ? "Total Orders" : key === "revenue" ? "Revenue" : "Cancellations"}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-foreground">
                    {key === "revenue" ? `SAR ${comp.today.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : comp.today}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">
                      Yesterday: {key === "revenue" ? `SAR ${comp.yesterday.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : comp.yesterday}
                    </p>
                    <span className={`text-xs font-bold ${
                      key === "cancellations"
                        ? (comp.change <= 0 ? "text-emerald-600" : "text-orange-600")
                        : (comp.change >= 0 ? "text-emerald-600" : "text-orange-600")
                    }`}>
                      {comp.change >= 0 ? "+" : ""}{comp.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Quick Stats */}
          <QuickStatsStrip stats={branchData.quickStats} />

          {/* 5. Donut Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DonutChartCard title="Payment Modes" data={branchData.paymentModes} centerLabel={`${branchData.paymentModes.reduce((s, d) => s + d.value, 0)} orders`} />
            <DonutChartCard title="Sales by Category" data={branchData.categoryBreakdown} centerLabel={`SAR ${branchData.categoryBreakdown.reduce((s, d) => s + d.value, 0).toFixed(0)}`} />
            <DonutChartCard title="Order Types" data={branchData.orderTypes} centerLabel={`${branchData.orderTypes.reduce((s, d) => s + d.value, 0)} orders`} />
          </div>

          {/* 6. Revenue + Hourly Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RevenueTrendChart data={branchData.hourlyRevenue} />
            <HourlyOrdersChart data={branchData.hourlyOrders} />
          </div>

          {/* 7. Payment Method + Top Selling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PaymentMethodChart data={branchData.paymentMethodBreakdown} />
            <TopSellingItemsCard data={branchData.topSellingItems} />
          </div>

          {/* 8. Activity Feed + Cashier Duty */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RecentActivityFeed data={branchData.recentActivity} />
            <CashierDutyTable data={branchData.staffList} />
          </div>

          {/* 9. Key Metrics */}
          <KeyMetricsGrid data={branchData.keyMetrics} />

          {/* 10. Scrollable Lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecentOrdersList data={branchData.recentOrders} />
            <SlowestOrdersList data={branchData.pendingOrders} />
            <StaffAttendanceList data={branchData.staffList} />
          </div>

          {/* 11. Alerts */}
          <AlertsPanel data={branchData.alerts} />

          {/* 12. Report Links */}
          <BranchReportLinks branchId={selectedBranchId} />
        </>
      )}
    </div>
  );
}
