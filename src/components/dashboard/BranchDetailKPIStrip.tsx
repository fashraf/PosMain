import { TrendingUp, TrendingDown, Minus, ShoppingCart, DollarSign, XCircle, Timer, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SparklineChart } from "@/components/finance/SparklineChart";
import { cn } from "@/lib/utils";

export interface DetailKPI {
  label: string;
  value: string;
  change?: number;
  sparkline?: number[];
  icon: "orders" | "revenue" | "cancellations" | "time" | "staff" | "lastOrder";
}

interface Props {
  data: DetailKPI[];
}

const ICON_MAP = {
  orders: ShoppingCart,
  revenue: DollarSign,
  cancellations: XCircle,
  time: Timer,
  staff: Users,
  lastOrder: Clock,
};

const SPARKLINE_COLORS: Record<string, string> = {
  orders: "#2c8cb4",
  revenue: "#32c080",
  cancellations: "#dc8c3c",
  time: "#7c3aed",
  staff: "#64b4e0",
  lastOrder: "#a09888",
};

export default function BranchDetailKPIStrip({ data }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {data.map((kpi) => {
        const Icon = ICON_MAP[kpi.icon];
        const color = SPARKLINE_COLORS[kpi.icon];
        const isUp = (kpi.change ?? 0) > 0;
        const isDown = (kpi.change ?? 0) < 0;
        const TrendIcon = kpi.change === undefined || kpi.change === 0 ? Minus : isUp ? TrendingUp : TrendingDown;
        const invertGood = kpi.icon === "cancellations" || kpi.icon === "time";
        const isGood = invertGood ? isDown : isUp;
        const trendColor = kpi.change === undefined || kpi.change === 0
          ? "text-muted-foreground"
          : isGood ? "text-emerald-600" : "text-orange-600";

        return (
          <Card key={kpi.label} className="p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              <Icon className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-bold text-foreground tracking-tight mb-1">{kpi.value}</div>
            <div className="flex items-center justify-between gap-1">
              {kpi.sparkline && kpi.sparkline.length > 0 ? (
                <div className="flex-1 min-w-0">
                  <SparklineChart data={kpi.sparkline} color={color} height={28} />
                </div>
              ) : <div className="flex-1" />}
              {kpi.change !== undefined && (
                <span className={cn("flex items-center gap-0.5 text-[11px] font-semibold shrink-0", trendColor)}>
                  <TrendIcon className="h-3 w-3" />
                  {Math.abs(kpi.change).toFixed(0)}%
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
