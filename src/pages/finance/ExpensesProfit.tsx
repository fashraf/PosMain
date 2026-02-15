import { useState } from "react";
import { useFinanceData } from "@/hooks/useFinanceData";
import { useFinanceExpenses } from "@/hooks/useFinanceExpenses";
import {
  FinanceDateRangePicker,
  FinanceBranchFilter,
  FinanceGradientBarChart,
  FinanceAreaChart,
  FinanceStatStrip,
  FinanceDataTable,
  FinancePLCard,
  ExpenseForm,
  ExportButtons,
  exportToCSV,
} from "@/components/finance";
import type { DateRange } from "@/components/finance/FinanceDateRangePicker";
import { startOfMonth, endOfDay, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

const defaultRange: DateRange = {
  from: startOfMonth(new Date()).toISOString(),
  to: endOfDay(new Date()).toISOString(),
};

const CATEGORY_LABELS: Record<string, string> = {
  cogs: "COGS",
  salaries: "Salaries",
  rent: "Rent",
  utilities: "Utilities",
  marketing: "Marketing",
  other: "Other",
};

export default function ExpensesProfit() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const [branchId, setBranchId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: finData, isLoading: finLoading } = useFinanceData({ branchId, dateRange });
  const { data: expenses = [], isLoading: expLoading } = useFinanceExpenses({ branchId, dateRange });

  const isLoading = finLoading || expLoading;

  const fmt = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const plRows = finData
    ? [
        { label: "Revenue", amount: finData.totalSales, isBold: true },
        { label: "Cost of Goods Sold", amount: finData.totalCOGS, isSubtract: true },
        { label: "Gross Profit", amount: finData.grossProfit, isBold: true, isResult: true },
        { label: "Salaries & Wages", amount: finData.expByCategory["salaries"] || 0, isSubtract: true },
        { label: "Rent", amount: finData.expByCategory["rent"] || 0, isSubtract: true },
        { label: "Utilities", amount: finData.expByCategory["utilities"] || 0, isSubtract: true },
        { label: "Marketing", amount: finData.expByCategory["marketing"] || 0, isSubtract: true },
        { label: "Other Expenses", amount: finData.expByCategory["other"] || 0, isSubtract: true },
        { label: "Net Profit", amount: finData.netProfit, isBold: true, isResult: true },
      ]
    : [];

  const margin = finData && finData.totalSales > 0 ? ((finData.netProfit / finData.totalSales) * 100) : 0;

  const expenseTableData = expenses.map((e: any) => ({
    date: format(new Date(e.expense_date), "MMM d, yyyy"),
    category: CATEGORY_LABELS[e.category] || e.category,
    amount: Number(e.amount),
    description: e.description || "—",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Expenses & Profit</h1>
        <p className="text-sm text-muted-foreground">Cost tracking and profit & loss analysis</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <FinanceDateRangePicker value={dateRange} onChange={setDateRange} />
        <FinanceBranchFilter value={branchId} onChange={setBranchId} />
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px]" />
      ) : (
        <>
          {/* Stat Strip */}
          {finData && (
            <FinanceStatStrip stats={[
              { label: "Revenue", value: fmt(finData.totalSales), color: "#00d4ff" },
              { label: "Total Expenses", value: fmt(finData.totalCOGS + Object.values(finData.expByCategory).reduce((s: number, v: any) => s + (Number(v) || 0), 0)), color: "#ec4899" },
              { label: "Net Margin", value: `${margin.toFixed(1)}%`, description: margin >= 0 ? "Profitable" : "Loss", color: margin >= 0 ? "#7c3aed" : "#ec4899" },
            ]} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: P&L + Charts */}
            <div className="lg:col-span-2 space-y-4">
              <FinancePLCard rows={plRows} />

              {/* Margin Trend */}
              {finData && (
                <FinanceAreaChart
                  title="Profit Trend"
                  data={finData.trendData}
                  areas={[
                    { dataKey: "revenue", color: "#00d4ff", name: "Revenue" },
                    { dataKey: "cancellations", color: "#ec4899", name: "Expenses/Cancellations" },
                  ]}
                />
              )}

              {/* Expense Breakdown Chart */}
              {finData && (
                <FinanceGradientBarChart
                  title="Expense Breakdown"
                  data={Object.entries(finData.expByCategory).map(([k, v]) => ({ name: CATEGORY_LABELS[k] || k, value: v as number }))}
                />
              )}

              {/* Expense Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-medium text-foreground">Expense Records</h2>
                  <ExportButtons onExportCSV={() => exportToCSV(expenseTableData, "expenses")} />
                </div>
                <FinanceDataTable
                  columns={[
                    { key: "date", label: "Date", sortable: true },
                    { key: "category", label: "Category", sortable: true },
                    { key: "amount", label: "Amount", sortable: true, align: "right", render: (r: any) => fmt(r.amount) },
                    { key: "description", label: "Description" },
                  ]}
                  data={expenseTableData}
                />
              </div>
            </div>

            {/* Right: Add Expense Form */}
            <div>
              <ExpenseForm onSaved={() => {
                queryClient.invalidateQueries({ queryKey: ["finance-expenses"] });
                queryClient.invalidateQueries({ queryKey: ["finance-data"] });
              }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
