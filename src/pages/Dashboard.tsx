import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPIGaugeCard from "@/components/dashboard/KPIGaugeCard";
import QuickStatsStrip from "@/components/dashboard/QuickStatsStrip";
import RevenueTrendChart from "@/components/dashboard/RevenueTrendChart";
import BranchContributionChart from "@/components/dashboard/BranchContributionChart";
import StaffAttendanceCard from "@/components/dashboard/StaffAttendanceCard";
import KeyMetricsGrid from "@/components/dashboard/KeyMetricsGrid";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import {
  kpiData,
  quickStats,
  hourlyRevenue,
  branchContribution,
  staffMetrics,
  keyMetrics,
  alerts,
} from "@/components/dashboard/mockDashboardData";

export default function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <DashboardHeader />

      {/* KPI Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <KPIGaugeCard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Quick Stats Strip */}
      <QuickStatsStrip stats={quickStats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RevenueTrendChart data={hourlyRevenue} />
        </div>
        <div className="lg:col-span-2">
          <BranchContributionChart data={branchContribution} />
        </div>
      </div>

      {/* Staff + Key Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StaffAttendanceCard data={staffMetrics} />
        <KeyMetricsGrid data={keyMetrics} />
      </div>

      {/* Alerts */}
      <AlertsPanel data={alerts} />
    </div>
  );
}
