import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function StatusBadge({ isActive, className }: StatusBadgeProps) {
  const { t } = useLanguage();

  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        isActive
          ? "bg-success/10 text-success hover:bg-success/20 border-success/20"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {isActive ? t("common.active") : t("common.inactive")}
    </Badge>
  );
}

interface YesNoBadgeProps {
  value: boolean;
  className?: string;
}

export function YesNoBadge({ value, className }: YesNoBadgeProps) {
  const { t } = useLanguage();

  return (
    <Badge
      variant="outline"
      className={cn(
        value
          ? "border-success/30 text-success"
          : "border-muted-foreground/30 text-muted-foreground",
        className
      )}
    >
      {value ? t("common.yes") : t("common.no")}
    </Badge>
  );
}

interface TypeBadgeProps {
  type: string;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function TypeBadge({ type, variant = "outline", className }: TypeBadgeProps) {
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {type}
    </Badge>
  );
}
