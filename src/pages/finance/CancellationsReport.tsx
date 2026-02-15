import { useState } from "react";
import { useFinanceData } from "@/hooks/useFinanceData";
import {
  FinanceDateRangePicker,
  FinanceBranchFilter,
  FinanceKPICard,
  FinanceAreaChart,
  FinanceDonutChart,
  FinanceStatStrip,
  FinanceDataTable,
  ExportButtons,
  exportToCSV,
} from "@/components/finance";
import type { DateRange } from "@/components/finance/FinanceDateRangePicker";
import { startOfMonth, endOfDay, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle, DollarSign, Percent, AlertTriangle } from "lucide-react";

const defaultRange: DateRange = {
  from: startOfMonth(new Date()).toISOString(),
  to: endOfDay(new Date()).toISOString(),
};

export default function CancellationsReport() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const [branchId, setBranchId] = useState<string | null>(null);

  const { data, isLoading } = useFinanceData({ branchId, dateRange });

  const fmt = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const cancellationRate = data && data.paidOrders.length + data.cancellationCount > 0
    ? ((data.cancellationCount / (data.paidOrders.length + data.cancellationCount)) * 100)
    : 0;

  const topReason = data
    ? Object.entries(data.cancelReasons).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    : "N/A";

  const cancelTableData = data
    ? data.cancelledOrders.map((o: any) => ({
        date: format(new Date(o.created_at), "MMM d, yyyy HH:mm"),
        order: `#${o.id?.slice(0, 8)}`,
        amount: Number(o.total_amount || 0),
        reason: o.cancel_reason || "Not specified",
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cancellations Report</h1>
        <p className="text-sm text-muted-foreground">Refund and cancellation analysis</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <FinanceDateRangePicker value={dateRange} onChange={setDateRange} />
        <FinanceBranchFilter value={branchId} onChange={setBranchId} />
      </div>

      {isLoading ? (
        <Skeleton className="h-[300px]" />
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FinanceKPICard title="Total Cancellations" value={String(data.cancellationCount)} sparklineData={data.cancelSpark} color="#ec4899" icon={<XCircle className="h-4 w-4" />} />
            <FinanceKPICard title="Refund Amount" value={fmt(data.totalCancellations)} sparklineData={data.cancelSpark} color="#ec4899" icon={<DollarSign className="h-4 w-4" />} />
            <FinanceKPICard title="Cancel Rate" value={`${cancellationRate.toFixed(1)}%`} sparklineData={[cancellationRate]} color="#ec4899" icon={<Percent className="h-4 w-4" />} />
            <FinanceKPICard title="Top Reason" value={topReason} sparklineData={[0]} color="#a78bfa" icon={<AlertTriangle className="h-4 w-4" />} />
          </div>

          {/* Stat Strip */}
          <FinanceStatStrip stats={[
            { label: "Cancelled Orders", value: String(data.cancellationCount), color: "#ec4899" },
            { label: "Total Refunded", value: fmt(data.totalCancellations), color: "#7c3aed" },
            { label: "Cancellation Rate", value: `${cancellationRate.toFixed(1)}%`, color: "#6366f1" },
          ]} />

          {/* Trend - Area Chart */}
          <FinanceAreaChart
            title="Cancellation Trend"
            data={data.trendData}
            areas={[{ dataKey: "cancellations", color: "#ec4899", name: "Cancellations" }]}
            showLabels
          />

          {/* Charts + Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-foreground">Cancelled Orders</h2>
                <ExportButtons onExportCSV={() => exportToCSV(cancelTableData, "cancellations")} />
              </div>
              <FinanceDataTable
                columns={[
                  { key: "date", label: "Date" },
                  { key: "order", label: "Order" },
                  { key: "amount", label: "Amount", sortable: true, align: "right", render: (r: any) => fmt(r.amount) },
                  { key: "reason", label: "Reason" },
                ]}
                data={cancelTableData}
              />
            </div>
            <FinanceDonutChart
              title="Cancellation Reasons"
              data={Object.entries(data.cancelReasons).map(([name, value]) => ({ name, value: value as number }))}
              centerLabel={String(data.cancellationCount)}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
