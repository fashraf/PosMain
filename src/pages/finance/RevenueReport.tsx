import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFinanceData } from "@/hooks/useFinanceData";
import {
  FinanceDateRangePicker,
  FinanceBranchFilter,
  FinanceDataTable,
  FinanceGradientBarChart,
  FinanceDonutChart,
  FinanceAreaChart,
  ExportButtons,
  exportToCSV,
} from "@/components/finance";
import type { DateRange } from "@/components/finance/FinanceDateRangePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startOfMonth, endOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultRange: DateRange = {
  from: startOfMonth(new Date()).toISOString(),
  to: endOfDay(new Date()).toISOString(),
};

export default function RevenueReport() {
  const [searchParams] = useSearchParams();
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const [branchId, setBranchId] = useState<string | null>(searchParams.get("branch"));

  const { data, isLoading } = useFinanceData({ branchId, dateRange });

  const { data: itemData = [] } = useQuery({
    queryKey: ["finance-items", branchId, dateRange.from, dateRange.to],
    queryFn: async () => {
      let q = supabase
        .from("pos_order_items")
        .select("item_name, quantity, unit_price, line_total, menu_item_id, order_id")
        .gte("created_at", dateRange.from)
        .lte("created_at", dateRange.to);
      const { data } = await q;
      return data || [];
    },
  });

  const fmt = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const itemMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  itemData.forEach((i: any) => {
    const k = i.item_name;
    if (!itemMap[k]) itemMap[k] = { name: k, qty: 0, revenue: 0 };
    itemMap[k].qty += Number(i.quantity || 0);
    itemMap[k].revenue += Number(i.line_total || 0);
  });
  const topItems = Object.values(itemMap).sort((a, b) => b.revenue - a.revenue).slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Revenue Report</h1>
        <p className="text-sm text-muted-foreground">Detailed revenue breakdown by branch, category, and payment type</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <FinanceDateRangePicker value={dateRange} onChange={setDateRange} />
        <FinanceBranchFilter value={branchId} onChange={setBranchId} />
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px]" />
      ) : data ? (
        <Tabs defaultValue="branch" className="space-y-4">
          <TabsList>
            <TabsTrigger value="branch">Branch-wise</TabsTrigger>
            <TabsTrigger value="payment">Payment Type</TabsTrigger>
            <TabsTrigger value="topitems">Top Items</TabsTrigger>
          </TabsList>

          <TabsContent value="branch" className="space-y-4">
            <div className="flex justify-end">
              <ExportButtons onExportCSV={() => exportToCSV(data.branchSummary, "revenue-branch")} onExportPDF={() => window.print()} />
            </div>
            <FinanceAreaChart
              title="Revenue Over Time"
              data={data.trendData}
              areas={[{ dataKey: "revenue", color: "#00d4ff", name: "Revenue" }]}
              showLabels
            />
            <FinanceDataTable
              columns={[
                { key: "name", label: "Branch", sortable: true },
                { key: "sales", label: "Revenue", sortable: true, align: "right", render: (r: any) => fmt(r.sales) },
                { key: "vat", label: "VAT", sortable: true, align: "right", render: (r: any) => fmt(r.vat) },
                { key: "orders", label: "Orders", sortable: true, align: "right" },
              ]}
              data={data.branchSummary}
            />
            <FinanceGradientBarChart data={data.branchSummary.map((b: any) => ({ name: b.name, value: b.sales }))} title="Revenue by Branch" />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="flex justify-end">
              <ExportButtons onExportCSV={() => exportToCSV(Object.entries(data.paymentBreakdown).map(([name, value]) => ({ name, value })), "revenue-payment")} />
            </div>
            <FinanceDataTable
              columns={[
                { key: "name", label: "Payment Method", sortable: true },
                { key: "value", label: "Amount", sortable: true, align: "right", render: (r: any) => fmt(r.value) },
              ]}
              data={Object.entries(data.paymentBreakdown).map(([name, value]) => ({ name, value: value as number }))}
            />
            <FinanceDonutChart data={Object.entries(data.paymentBreakdown).map(([name, value]) => ({ name, value: value as number }))} title="Payment Split" />
          </TabsContent>

          <TabsContent value="topitems" className="space-y-4">
            <div className="flex justify-end">
              <ExportButtons onExportCSV={() => exportToCSV(topItems, "top-items")} />
            </div>
            <FinanceGradientBarChart
              title="Top Items by Revenue"
              data={topItems.slice(0, 10).map((item) => ({ name: item.name, value: item.revenue }))}
            />
            <FinanceDataTable
              columns={[
                { key: "name", label: "Item", sortable: true },
                { key: "qty", label: "Qty Sold", sortable: true, align: "right" },
                { key: "revenue", label: "Revenue", sortable: true, align: "right", render: (r: any) => fmt(r.revenue) },
              ]}
              data={topItems}
            />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
