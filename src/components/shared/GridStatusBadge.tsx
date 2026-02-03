import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface GridStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function GridStatusBadge({ isActive, className }: GridStatusBadgeProps) {
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium uppercase tracking-wide",
        isActive
          ? "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]"
          : "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]",
        className
      )}
    >
      {isActive ? t("common.active") : t("common.inactive")}
    </span>
  );
}
