import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { BranchInsight } from "./BranchInsightCard";

interface Props {
  branches: BranchInsight[];
  selectedIds: string[];
  onToggle: (branchId: string) => void;
}

const COLORS = ["#2c8cb4", "#7c3aed", "#32c080", "#dc8c3c", "#ec4899"];

export default function BranchComparisonPanel({ branches, selectedIds, onToggle }: Props) {
  const selected = branches.filter((b) => selectedIds.includes(b.branchId));

  // Metrics to compare
  const metrics = selected.length >= 2
    ? [
        { label: "Orders", getValue: (b: BranchInsight) => b.totalOrders },
        { label: "Revenue", getValue: (b: BranchInsight) => b.revenue },
        { label: "Cancellations", getValue: (b: BranchInsight) => b.cancellations },
      ]
    : [];

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Compare Branches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Checkboxes */}
        <div className="flex flex-wrap gap-3">
          {branches.map((b) => (
            <label key={b.branchId} className="flex items-center gap-1.5 text-xs cursor-pointer">
              <Checkbox
                checked={selectedIds.includes(b.branchId)}
                onCheckedChange={() => onToggle(b.branchId)}
              />
              <span className="font-medium">{b.branchName}</span>
            </label>
          ))}
        </div>

        {/* Comparison bars */}
        {metrics.length > 0 && (
          <div className="space-y-3">
            {metrics.map((metric) => {
              const maxVal = Math.max(...selected.map(metric.getValue), 1);
              return (
                <div key={metric.label}>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">{metric.label}</p>
                  <div className="space-y-1">
                    {selected.map((b, i) => {
                      const val = metric.getValue(b);
                      const pct = (val / maxVal) * 100;
                      return (
                        <div key={b.branchId} className="flex items-center gap-2">
                          <span className="w-24 text-xs text-muted-foreground truncate">{b.branchName}</span>
                          <div className="flex-1 h-5 bg-muted/50 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-16 text-right">
                            {metric.label === "Revenue"
                              ? `${(val / 1000).toFixed(1)}k`
                              : val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Average comparison */}
            <div className="border-t border-dotted border-muted pt-2">
              <div className="flex flex-wrap gap-4 text-xs">
                {metrics.map((metric) => {
                  const avg = selected.reduce((s, b) => s + metric.getValue(b), 0) / selected.length;
                  return (
                    <span key={metric.label} className="text-muted-foreground">
                      Avg {metric.label}: <span className="font-semibold text-foreground">
                        {metric.label === "Revenue" ? `SAR ${avg.toFixed(0)}` : avg.toFixed(0)}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selected.length < 2 && (
          <p className="text-xs text-muted-foreground italic">Select 2 or more branches to compare.</p>
        )}
      </CardContent>
    </Card>
  );
}
