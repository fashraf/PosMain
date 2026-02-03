import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { differenceInDays, isPast, isToday } from "date-fns";

interface ExpiryBadgeProps {
  expiryDate: Date | string;
  className?: string;
}

type ExpiryStatus = "safe" | "warning" | "critical" | "expired";

function getExpiryStatus(expiryDate: Date): ExpiryStatus {
  if (isPast(expiryDate) && !isToday(expiryDate)) return "expired";
  
  const daysRemaining = differenceInDays(expiryDate, new Date());
  
  if (daysRemaining <= 0) return "expired";
  if (daysRemaining <= 3) return "critical";
  if (daysRemaining <= 14) return "warning";
  return "safe";
}

const statusConfig: Record<ExpiryStatus, { icon: string; bgClass: string; textClass: string }> = {
  safe: {
    icon: "🟢",
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  warning: {
    icon: "🟡",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
  critical: {
    icon: "🔴",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
  },
  expired: {
    icon: "⛔",
    bgClass: "bg-destructive/20",
    textClass: "text-destructive",
  },
};

export function ExpiryBadge({ expiryDate, className }: ExpiryBadgeProps) {
  const { t } = useLanguage();
  const date = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const status = getExpiryStatus(date);
  const config = statusConfig[status];
  const daysRemaining = differenceInDays(date, new Date());

  const getLabel = () => {
    if (status === "expired") return t("inventory.expired");
    if (daysRemaining === 0) return t("inventory.expirestoday");
    if (daysRemaining === 1) return `1 ${t("inventory.day")}`;
    return `${daysRemaining} ${t("inventory.days")}`;
  };

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
      <span>{getLabel()}</span>
    </div>
  );
}

// Compact text version for tables
export function ExpiryText({ expiryDate }: { expiryDate: Date | string }) {
  const { t } = useLanguage();
  const date = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const status = getExpiryStatus(date);
  const config = statusConfig[status];
  const daysRemaining = differenceInDays(date, new Date());

  const getLabel = () => {
    if (status === "expired") return t("inventory.expired");
    if (daysRemaining === 0) return t("inventory.expirestoday");
    if (daysRemaining === 1) return `1 ${t("inventory.day")}`;
    return `${daysRemaining}d`;
  };

  return (
    <span className={cn("inline-flex items-center gap-1", config.textClass)}>
      <span>{config.icon}</span>
      <span className="font-medium">{getLabel()}</span>
    </span>
  );
}

// Legend component for reference
export function ExpiryLegend() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span>🟢 {t("inventory.expirySafe")}</span>
      <span>🟡 {t("inventory.expiryWarning")}</span>
      <span>🔴 {t("inventory.expiryCritical")}</span>
      <span>⛔ {t("inventory.expired")}</span>
    </div>
  );
}
