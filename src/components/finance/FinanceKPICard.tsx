import { SparklineChart } from "./SparklineChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinanceKPICardProps {
  title: string;
  value: string;
  sparklineData: number[];
  change?: number;
  changeDirection?: "up" | "down" | "neutral";
  color?: string;
  icon?: React.ReactNode;
}

export function FinanceKPICard({
  title,
  value,
  sparklineData,
  change,
  changeDirection = "neutral",
  color = "#2c8cb4",
  icon,
}: FinanceKPICardProps) {
  const TrendIcon = changeDirection === "up" ? TrendingUp : changeDirection === "down" ? TrendingDown : Minus;
  const trendColor = changeDirection === "up" ? "text-emerald-600" : changeDirection === "down" ? "text-orange-500" : "text-muted-foreground";

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-foreground mb-2">{value}</div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <SparklineChart data={sparklineData} color={color} height={36} />
        </div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-0.5 text-xs font-medium shrink-0", trendColor)}>
            <TrendIcon className="h-3 w-3" />
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
