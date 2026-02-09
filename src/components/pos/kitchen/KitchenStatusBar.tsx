import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ChefHat, AlertTriangle } from "lucide-react";

interface KitchenStatusBarProps {
  pendingCount: number;
  urgentCount: number;
}

export function KitchenStatusBar({ pendingCount, urgentCount }: KitchenStatusBarProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-3">
      <div className="flex items-center gap-3">
        <ChefHat className="h-6 w-6 text-amber-400" />
        <span className="text-lg font-bold tracking-wide" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
          KITCHEN DISPLAY
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Pending:</span>
          <span className="rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-400">
            {pendingCount}
          </span>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-slate-400">Urgent:</span>
            <span className="rounded bg-red-500/20 px-2 py-0.5 font-bold text-red-400 animate-pulse">
              {urgentCount}
            </span>
          </div>
        )}
      </div>

      <div className="text-sm text-slate-400" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
        {format(now, "EEE MMM dd yyyy  HH:mm:ss")}
      </div>
    </div>
  );
}
