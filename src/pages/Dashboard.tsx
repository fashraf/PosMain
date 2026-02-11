import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPIGaugeCard from "@/components/dashboard/KPIGaugeCard";
import QuickStatsStrip from "@/components/dashboard/QuickStatsStrip";
import RevenueTrendChart from "@/components/dashboard/RevenueTrendChart";
import BranchContributionChart from "@/components/dashboard/BranchContributionChart";
import StaffAttendanceCard from "@/components/dashboard/StaffAttendanceCard";
import KeyMetricsGrid from "@/components/dashboard/KeyMetricsGrid";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const {
    kpiData,
    quickStats,
    hourlyRevenue,
    branchContribution,
    staffMetrics,
    keyMetrics,
    alerts,
    branchCount,
    isLoading,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-[260px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardHeader branchCount={branchCount} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <KPIGaugeCard key={kpi.label} data={kpi} />
        ))}
      </div>

      <QuickStatsStrip stats={quickStats} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RevenueTrendChart data={hourlyRevenue} />
        </div>
        <div className="lg:col-span-2">
          <BranchContributionChart data={branchContribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StaffAttendanceCard data={staffMetrics} />
        <KeyMetricsGrid data={keyMetrics} />
      </div>

      <AlertsPanel data={alerts} />
    </div>
  );
}
