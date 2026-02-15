import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinanceData } from "@/hooks/useFinanceData";
import {
  FinanceDateRangePicker,
  FinanceBranchFilter,
  FinanceKPICard,
  FinanceLineChart,
  FinanceBarChart,
  FinanceDonutChart,
  FinanceDataTable,
  ExportButtons,
  exportToCSV,
} from "@/components/finance";
import type { FinanceColumn } from "@/components/finance/FinanceDataTable";
import type { DateRange } from "@/components/finance/FinanceDateRangePicker";
import { DollarSign, Receipt, XCircle, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { startOfMonth, endOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const defaultRange: DateRange = {
  from: startOfMonth(new Date()).toISOString(),
  to: endOfDay(new Date()).toISOString(),
};

export default function FinanceOverview() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const [branchId, setBranchId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useFinanceData({ branchId, dateRange });

  const fmt = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const branchColumns: FinanceColumn<any>[] = [
    { key: "name", label: "Branch", sortable: true },
    { key: "sales", label: "Total Sales", sortable: true, align: "right", render: (r) => fmt(r.sales) },
    { key: "vat", label: "VAT", sortable: true, align: "right", render: (r) => fmt(r.vat) },
    { key: "cancellations", label: "Cancellations", sortable: true, align: "right", render: (r) => fmt(r.cancellations) },
    { key: "orders", label: "Orders", sortable: true, align: "right" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Finance Overview</h1>
        <p className="text-sm text-muted-foreground">Branch-wise financial dashboard</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <FinanceDateRangePicker value={dateRange} onChange={setDateRange} />
        <FinanceBranchFilter value={branchId} onChange={setBranchId} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <FinanceKPICard title="Total Sales" value={fmt(data.totalSales)} sparklineData={data.salesSpark} color="#2c8cb4" icon={<DollarSign className="h-4 w-4" />} changeDirection="up" change={0} />
            <FinanceKPICard title="VAT Collected" value={fmt(data.totalVAT)} sparklineData={data.vatSpark} color="#64b4e0" icon={<Receipt className="h-4 w-4" />} changeDirection="neutral" />
            <FinanceKPICard title="Cancellations" value={fmt(data.totalCancellations)} sparklineData={data.cancelSpark} color="#dc8c3c" icon={<XCircle className="h-4 w-4" />} changeDirection={data.totalCancellations > 0 ? "down" : "neutral"} change={data.cancellationCount} />
            <FinanceKPICard title="COGS" value={fmt(data.totalCOGS)} sparklineData={[0]} color="#a09888" icon={<TrendingDown className="h-4 w-4" />} changeDirection="neutral" />
            <FinanceKPICard title="Gross Profit" value={fmt(data.grossProfit)} sparklineData={data.salesSpark.map((s, i) => s - (data.totalCOGS / 7))} color="#32c080" icon={<TrendingUp className="h-4 w-4" />} changeDirection={data.grossProfit > 0 ? "up" : "down"} />
            <FinanceKPICard title="Net Profit" value={fmt(data.netProfit)} sparklineData={data.salesSpark.map((s) => s * 0.3)} color="#8b5cf6" icon={<Wallet className="h-4 w-4" />} changeDirection={data.netProfit > 0 ? "up" : "down"} />
          </div>

          {/* Revenue Trend */}
          <div>
            <h2 className="text-sm font-medium text-foreground mb-2">Revenue Trend</h2>
            <FinanceLineChart
              data={data.trendData}
              lines={[
                { dataKey: "revenue", color: "#2c8cb4", name: "Revenue" },
                { dataKey: "vat", color: "#64b4e0", name: "VAT" },
                { dataKey: "cancellations", color: "#dc8c3c", name: "Cancellations" },
              ]}
            />
          </div>

          {/* Branch Summary Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-foreground">Branch Summary</h2>
              <ExportButtons onExportCSV={() => exportToCSV(data.branchSummary, "branch-summary")} onExportPDF={() => window.print()} />
            </div>
            <FinanceDataTable
              columns={branchColumns}
              data={data.branchSummary}
              onRowClick={(row) => navigate(`/finance/revenue?branch=${row.id}`)}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FinanceBarChart
              title="Branch Revenue Comparison"
              data={data.branchSummary.map((b: any) => ({ name: b.name, value: b.sales }))}
              layout="horizontal"
            />
            <FinanceDonutChart
              title="Payment Type Breakdown"
              data={Object.entries(data.paymentBreakdown).map(([name, value]) => ({ name, value: value as number }))}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
