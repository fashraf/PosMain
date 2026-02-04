import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

type Severity = "low" | "medium" | "high";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const { t } = useLanguage();

  const config: Record<Severity, { label: string; classes: string }> = {
    low: {
      label: t("maintenance.severityLow"),
      classes: "bg-muted text-muted-foreground border-muted-foreground/30",
    },
    medium: {
      label: t("maintenance.severityMedium"),
      classes: "bg-yellow-50 text-yellow-700 border-yellow-300",
    },
    high: {
      label: t("maintenance.severityHigh"),
      classes: "bg-red-50 text-red-700 border-red-300",
    },
  };

  const { label, classes } = config[severity] || config.medium;

  return (
    <Badge variant="outline" className={cn("text-[11px]", classes, className)}>
      {label}
    </Badge>
  );
}
