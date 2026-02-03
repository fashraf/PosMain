import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface StockLevelIndicatorProps {
  current: number;
  min: number;
  reorder: number;
  unit: string;
  showValue?: boolean;
  className?: string;
}

type StockStatus = "healthy" | "low" | "critical";

function getStockStatus(current: number, min: number, reorder: number): StockStatus {
  if (current <= min) return "critical";
  if (current <= reorder) return "low";
  return "healthy";
}

const statusConfig: Record<StockStatus, { icon: string; bgClass: string; textClass: string }> = {
  healthy: {
    icon: "🟢",
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  low: {
    icon: "🟡",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
  critical: {
    icon: "🔴",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
  },
};

export function StockLevelIndicator({
  current,
  min,
  reorder,
  unit,
  showValue = true,
  className,
}: StockLevelIndicatorProps) {
  const { t } = useLanguage();
  const status = getStockStatus(current, min, reorder);
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm font-medium",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span>{config.icon}</span>
      {showValue && (
        <span>
          {current} {unit}
        </span>
      )}
    </div>
  );
}

// Compact badge version for tables
export function StockLevelBadge({
  current,
  min,
  reorder,
  unit,
}: Omit<StockLevelIndicatorProps, "showValue" | "className">) {
  const status = getStockStatus(current, min, reorder);
  const config = statusConfig[status];

  return (
    <span className={cn("inline-flex items-center gap-1", config.textClass)}>
      <span>{config.icon}</span>
      <span className="font-medium">
        {current} {unit}
      </span>
    </span>
  );
}

// Legend component for reference
export function StockLevelLegend() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span>🟢 {t("inventory.stockHealthy")}</span>
      <span>🟡 {t("inventory.stockLow")}</span>
      <span>🔴 {t("inventory.stockCritical")}</span>
    </div>
  );
}
