import { useState } from "react";
import { useFinanceData } from "@/hooks/useFinanceData";
import {
  FinanceDateRangePicker,
  FinanceBranchFilter,
  FinanceKPICard,
  FinanceAreaChart,
  FinanceStatStrip,
  FinanceDataTable,
  ExportButtons,
  exportToCSV,
} from "@/components/finance";
import type { DateRange } from "@/components/finance/FinanceDateRangePicker";
import { startOfMonth, endOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt } from "lucide-react";

const defaultRange: DateRange = {
  from: startOfMonth(new Date()).toISOString(),
  to: endOfDay(new Date()).toISOString(),
};

export default function VATReport() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const [branchId, setBranchId] = useState<string | null>(null);

  const { data, isLoading } = useFinanceData({ branchId, dateRange });

  const fmt = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">VAT Report</h1>
        <p className="text-sm text-muted-foreground">Branch-wise and item-level VAT breakdown</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <FinanceDateRangePicker value={dateRange} onChange={setDateRange} />
        <FinanceBranchFilter value={branchId} onChange={setBranchId} />
      </div>

      {isLoading ? (
        <Skeleton className="h-[300px]" />
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FinanceKPICard title="Total Taxable" value={fmt(data.totalSales - data.totalVAT)} sparklineData={data.salesSpark} color="#00d4ff" icon={<Receipt className="h-4 w-4" />} />
            <FinanceKPICard title="Total VAT (15%)" value={fmt(data.totalVAT)} sparklineData={data.vatSpark} color="#7c3aed" icon={<Receipt className="h-4 w-4" />} />
            <FinanceKPICard title="Total Inclusive" value={fmt(data.totalSales)} sparklineData={data.salesSpark} color="#6366f1" icon={<Receipt className="h-4 w-4" />} />
          </div>

          {/* Big Number Strip */}
          <FinanceStatStrip stats={[
            { label: "Taxable Amount", value: fmt(data.totalSales - data.totalVAT), color: "#00d4ff" },
            { label: "VAT Collected", value: fmt(data.totalVAT), color: "#7c3aed" },
            { label: "Total Inclusive", value: fmt(data.totalSales), color: "#6366f1" },
          ]} />

          {/* VAT Trend */}
          <FinanceAreaChart
            title="VAT Trend Over Time"
            data={data.trendData}
            areas={[
              { dataKey: "revenue", color: "#00d4ff", name: "Revenue (Incl.)" },
              { dataKey: "vat", color: "#7c3aed", name: "VAT" },
            ]}
            showLabels
          />

          {/* Branch VAT Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-foreground">Branch-wise VAT</h2>
              <ExportButtons
                onExportCSV={() => exportToCSV(
                  data.branchSummary.map((b: any) => ({
                    Branch: b.name,
                    Taxable: (b.sales - b.vat).toFixed(2),
                    VAT: b.vat.toFixed(2),
                    Total: b.sales.toFixed(2),
                  })),
                  "vat-report"
                )}
                onExportPDF={() => window.print()}
              />
            </div>
            <FinanceDataTable
              columns={[
                { key: "name", label: "Branch", sortable: true },
                { key: "taxable", label: "Taxable Amount", sortable: true, align: "right", render: (r: any) => fmt(r.sales - r.vat) },
                { key: "vat", label: "VAT Amount", sortable: true, align: "right", render: (r: any) => fmt(r.vat) },
                { key: "sales", label: "Total (Incl.)", sortable: true, align: "right", render: (r: any) => fmt(r.sales) },
              ]}
              data={data.branchSummary}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
