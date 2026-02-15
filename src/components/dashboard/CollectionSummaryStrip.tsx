import { SparklineChart } from "@/components/finance/SparklineChart";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface CollectionSummary {
  totalAmount: number;
  collected: number;
  notCollected: number;
  cancelledAmount: number;
  cancelledCount: number;
  vatCollected: number;
  totalAmountChange: number;
  collectedChange: number;
  notCollectedChange: number;
  cancelledChange: number;
  vatChange: number;
  hourlyTotals: number[];
  hourlyCollected: number[];
}

interface Props {
  data: CollectionSummary;
}

const fmt = (v: number) =>
  v >= 1000
    ? `${(v / 1000).toFixed(1)}k`
    : v.toFixed(v < 10 ? 2 : 0);

const cards = (d: CollectionSummary) => [
  {
    label: "Total Amount",
    value: d.totalAmount,
    change: d.totalAmountChange,
    accent: "hsl(199 52% 44%)",   // teal
    bgAccent: "hsl(199 52% 44% / 0.06)",
    sparkData: d.hourlyTotals,
  },
  {
    label: "Collected",
    value: d.collected,
    change: d.collectedChange,
    accent: "hsl(153 58% 47%)",   // green
    bgAccent: "hsl(153 58% 47% / 0.06)",
    sparkData: d.hourlyCollected,
    pct: d.totalAmount > 0 ? Math.round((d.collected / d.totalAmount) * 100) : 0,
  },
  {
    label: "Not Collected",
    value: d.notCollected,
    change: d.notCollectedChange,
    accent: "hsl(33 65% 55%)",    // orange
    bgAccent: "hsl(33 65% 55% / 0.06)",
    invertTrend: true,
  },
  {
    label: "Cancelled / Refunded",
    value: d.cancelledAmount,
    change: d.cancelledChange,
    accent: "hsl(0 72% 51%)",     // red
    bgAccent: "hsl(0 72% 51% / 0.06)",
    count: d.cancelledCount,
    invertTrend: true,
  },
  {
    label: "VAT Collected",
    value: d.vatCollected,
    change: d.vatChange,
    accent: "hsl(258 60% 63%)",   // purple
    bgAccent: "hsl(258 60% 63% / 0.06)",
  },
];

export default function CollectionSummaryStrip({ data }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards(data).map((c) => {
        const isPositive = c.change >= 0;
        const goodTrend = c.invertTrend ? !isPositive : isPositive;
        return (
          <div
            key={c.label}
            className="rounded-xl border border-border p-4 relative overflow-hidden"
            style={{
              borderLeft: `4px solid ${c.accent}`,
              background: c.bgAccent,
            }}
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {c.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-foreground tracking-tight">
                SAR {fmt(c.value)}
              </span>
              {c.pct !== undefined && (
                <span className="text-xs font-semibold" style={{ color: c.accent }}>
                  {c.pct}%
                </span>
              )}
            </div>
            {c.count !== undefined && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.count} orders</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              {goodTrend ? (
                <ArrowUp className="h-3 w-3" style={{ color: "hsl(153 58% 47%)" }} />
              ) : (
                <ArrowDown className="h-3 w-3" style={{ color: "hsl(33 65% 55%)" }} />
              )}
              <span
                className="text-[11px] font-semibold"
                style={{ color: goodTrend ? "hsl(153 58% 47%)" : "hsl(33 65% 55%)" }}
              >
                {isPositive ? "+" : ""}{c.change.toFixed(1)}% vs yesterday
              </span>
            </div>
            {c.sparkData && c.sparkData.length > 0 && (
              <div className="mt-2 -mx-1">
                <SparklineChart data={c.sparkData} color={c.accent} height={32} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
