import { ArrowUp } from "lucide-react";
import type { QuickStat } from "./mockDashboardData";

interface Props {
  stats: QuickStat[];
}

export default function QuickStatsStrip({ stats }: Props) {
  return (
    <div
      className="rounded-lg px-5 py-2.5 flex flex-wrap items-center gap-6"
      style={{ background: "#2c8cb408", border: "1px solid #2c8cb418" }}
    >
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{s.label}:</span>
          <span className="text-sm font-bold text-foreground">{s.value}</span>
          {s.trend && (
            <span className="flex items-center gap-0.5 text-[11px] font-medium" style={{ color: "#32c080" }}>
              <ArrowUp className="h-3 w-3" />
              {s.trend}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
