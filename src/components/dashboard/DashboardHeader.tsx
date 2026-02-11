import { useState, useEffect } from "react";
import { Building2, Clock, BadgeDollarSign } from "lucide-react";

const DASH_TEAL = "#2c8cb4";

function getStatus(hour: number) {
  if (hour >= 12 && hour < 15) return { label: "Peak Lunch", color: "#dc8c3c" };
  if (hour >= 18 && hour < 21) return { label: "Peak Dinner", color: "#dc8c3c" };
  return { label: "Normal", color: "#32c080" };
}

export default function DashboardHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const status = getStatus(now.getHours());
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div
      className="rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3"
      style={{ background: `linear-gradient(135deg, ${DASH_TEAL}14, ${DASH_TEAL}08)`, border: `1px solid ${DASH_TEAL}30` }}
    >
      <h1 className="text-lg font-bold tracking-tight" style={{ color: DASH_TEAL }}>
        Restaurant Group Dashboard
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {dateStr} &middot; {timeStr}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" />
          Branches: <strong className="text-foreground">5</strong>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <BadgeDollarSign className="h-3.5 w-3.5" />
          SAR
        </span>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: status.color }}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
