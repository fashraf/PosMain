import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklineChart } from "@/components/finance/SparklineChart";
import { cn } from "@/lib/utils";
import type { BranchInsight } from "./BranchInsightCard";

interface Props {
  data: BranchInsight[];
  onBranchClick: (branchId: string) => void;
  sparklineData?: Record<string, number[]>;
}

function TrendCell({ value, invert }: { value: number; invert?: boolean }) {
  const isUp = value > 0;
  const isGood = invert ? value < 0 : isUp;
  const Icon = value === 0 ? Minus : isUp ? TrendingUp : TrendingDown;
  const color = value === 0 ? "text-muted-foreground" : isGood ? "text-emerald-600" : "text-orange-600";
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", color)}>
      <Icon className="h-3 w-3" />
      {value > 0 ? "+" : ""}{value.toFixed(0)}%
    </span>
  );
}

function relativeTimeShort(iso: string | null): string {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "now";
  if (diff < 60) return `${diff}m`;
  return `${Math.floor(diff / 60)}h`;
}

export default function BOZCompactTable({ data, onBranchClick, sparklineData }: Props) {
  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Scan</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-dotted border-muted">
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Branch</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Orders</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Last</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Cancel.</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Staff</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Revenue</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">vs Yest</th>
                {sparklineData && <th className="px-3 py-2 text-muted-foreground font-medium w-[80px]">Trend</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((b, i) => (
                <tr
                  key={b.branchId}
                  className={cn(
                    "h-[42px] cursor-pointer transition-colors hover:bg-accent/40",
                    i % 2 === 0 ? "bg-background" : "bg-muted/20",
                    "border-b border-dotted border-muted last:border-0"
                  )}
                  onClick={() => onBranchClick(b.branchId)}
                >
                  <td className="px-4 py-2 font-medium text-foreground">{b.branchName}</td>
                  <td className="text-right px-3 py-2 font-semibold">{b.totalOrders}</td>
                  <td className="text-right px-3 py-2 text-muted-foreground">{relativeTimeShort(b.lastPlacedAt)}</td>
                  <td className="text-right px-3 py-2">
                    <span className="flex items-center justify-end gap-1">
                      {b.cancellations}
                      <TrendCell value={b.cancellationChange} invert />
                    </span>
                  </td>
                  <td className="text-right px-3 py-2">{b.staffOnDuty}</td>
                  <td className="text-right px-3 py-2 font-semibold">
                    {b.revenue >= 1000 ? `${(b.revenue / 1000).toFixed(1)}k` : b.revenue.toFixed(0)}
                  </td>
                  <td className="text-right px-3 py-2">
                    <TrendCell value={b.revenueChange} />
                  </td>
                  {sparklineData && (
                    <td className="px-3 py-1">
                      <SparklineChart data={sparklineData[b.branchId] || [0, 0, 0]} height={28} color="#7c3aed" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
