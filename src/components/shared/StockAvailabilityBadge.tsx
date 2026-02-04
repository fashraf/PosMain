import { cn } from "@/lib/utils";

interface StockAvailabilityBadgeProps {
  percentage: number;
  showLabel?: boolean;
  className?: string;
}

export function StockAvailabilityBadge({
  percentage,
  showLabel = true,
  className,
}: StockAvailabilityBadgeProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  const getColors = (pct: number) => {
    if (pct >= 70) return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" };
    if (pct >= 30) return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" };
    return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
  };

  const colors = getColors(clampedPercentage);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
      <span>{clampedPercentage}%</span>
      {showLabel && <span className="hidden sm:inline">Available</span>}
    </div>
  );
}
