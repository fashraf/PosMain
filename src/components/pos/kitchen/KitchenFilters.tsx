import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AlertTriangle, Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type KDSFilter = "all" | "urgent" | "dine_in" | "delivery" | "takeaway" | "self_pickup";

interface KitchenFiltersProps {
  active: KDSFilter;
  onChange: (filter: KDSFilter) => void;
  pendingCount: number;
  urgentCount: number;
  bellEnabled: boolean;
  onToggleBell: () => void;
}

const filters: { value: KDSFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "urgent", label: "🔴 Urgent" },
  { value: "dine_in", label: "Dine-in" },
  { value: "delivery", label: "Delivery" },
  { value: "takeaway", label: "Takeaway" },
  { value: "self_pickup", label: "Self-pickup" },
];

export function KitchenFilters({ active, onChange, pendingCount, urgentCount, bellEnabled, onToggleBell }: KitchenFiltersProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between bg-slate-900 px-4 py-2">
      {/* Left: stats */}
      <div className="flex items-center gap-4 text-[15px] min-w-[180px]">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Pending:</span>
          <span className="rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-400">
            {pendingCount}
          </span>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="rounded bg-red-500/20 px-2 py-0.5 font-bold text-red-400 animate-pulse">
              {urgentCount}
            </span>
          </div>
        )}
      </div>

      {/* Center: filter pills */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={cn(
              "rounded-full px-5 py-2 text-[15px] font-medium transition-all",
              "touch-manipulation select-none",
              active === f.value
                ? "bg-white text-slate-900 shadow-md"
                : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Right: bell toggle + clock */}
      <div className="flex items-center gap-4 min-w-[180px] justify-end">
        <div className="flex items-center gap-2">
          {bellEnabled ? (
            <Bell className="h-5 w-5 text-amber-400" />
          ) : (
            <BellOff className="h-5 w-5 text-slate-500" />
          )}
          <Switch checked={bellEnabled} onCheckedChange={onToggleBell} />
        </div>
        <span className="text-[14px] text-slate-400 tabular-nums" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
          {format(now, "HH:mm:ss")}
        </span>
      </div>
    </div>
  );
}
