import { ArrowUp, TrendingUp, Clock, ShoppingCart, Users, DollarSign } from "lucide-react";
import type { QuickStat } from "./mockDashboardData";

interface Props {
  stats: QuickStat[];
}

const ICONS = [ShoppingCart, DollarSign, Clock, Users, TrendingUp];
const ACCENTS = [
  "hsl(199 52% 44%)",
  "hsl(153 58% 47%)",
  "hsl(258 60% 63%)",
  "hsl(33 65% 55%)",
  "hsl(340 75% 55%)",
];

export default function QuickStatsStrip({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s, i) => {
        const Icon = ICONS[i % ICONS.length];
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all duration-200 group"
          >
            {/* Decorative gradient blob */}
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-[0.08] group-hover:opacity-[0.15] transition-opacity"
              style={{ background: accent }}
            />
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${accent}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: accent }} />
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                {s.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-foreground tracking-tight">{s.value}</span>
              {s.trend && (
                <span
                  className="flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ color: "hsl(153 58% 47%)", background: "hsl(153 58% 47% / 0.1)" }}
                >
                  <ArrowUp className="h-3 w-3" />
                  {s.trend}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
