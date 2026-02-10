import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { KDSOrderItem } from "@/hooks/pos/useKitchenOrders";

interface KitchenItemRowProps {
  item: KDSOrderItem;
  orderCreatedAt: string;
  onTap: (item: KDSOrderItem) => void;
}

function useElapsedMinutes(createdAt: string) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const calc = () => {
      const diffMs = Date.now() - new Date(createdAt).getTime();
      setElapsed(Math.floor(diffMs / 60000));
    };
    calc();
    const interval = setInterval(calc, 10000);
    return () => clearInterval(interval);
  }, [createdAt]);
  return elapsed;
}

function getTimerColor(minutes: number) {
  if (minutes < 5) return "text-emerald-400";
  if (minutes < 10) return "text-amber-400";
  if (minutes < 15) return "text-orange-400";
  return "text-red-400 animate-pulse";
}

function formatTimer(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function KitchenItemRow({ item, orderCreatedAt, onTap }: KitchenItemRowProps) {
  const elapsed = useElapsedMinutes(orderCreatedAt);
  const cust = item.customization_json as any;

  const extras = cust?.extras || [];
  const removals = cust?.removals || [];
  const replacements = cust?.replacements || [];
  const hasCustomizations = extras.length > 0 || removals.length > 0 || replacements.length > 0;

  return (
    <button
      onClick={() => onTap(item)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-all",
        "touch-manipulation select-none min-h-[56px]",
        item.is_completed
          ? "bg-slate-100 opacity-60"
          : "bg-white hover:bg-slate-50 active:bg-slate-100"
      )}
    >
      {/* Checkbox area */}
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
          item.is_completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300"
        )}
      >
        {item.is_completed && <Check className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-slate-600">
            {item.quantity} X
          </span>
          <span
            className={cn(
              "font-semibold text-[18px]",
              item.is_completed ? "line-through text-slate-400" : "text-slate-800"
            )}
          >
            {item.item_name}
          </span>
        </div>

        {hasCustomizations && !item.is_completed && (
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[15px]">
            {removals.map((r: any, i: number) => (
              <span key={`r-${i}`} className="text-red-500">- {r.name || r}</span>
            ))}
            {extras.map((e: any, i: number) => (
              <span key={`e-${i}`} className="text-emerald-600">
                + {e.name || e}{e.price ? ` (+${Number(e.price).toFixed(2)})` : ""}
              </span>
            ))}
            {replacements.map((rp: any, i: number) => (
              <span key={`rp-${i}`} className="text-blue-500">
                → {rp.name || rp}{rp.priceDiff ? ` (+${Number(rp.priceDiff).toFixed(2)})` : ""}
              </span>
            ))}
          </div>
        )}

        {item.is_completed && item.completed_at && (
          <span className="text-[15px] text-slate-400">
            Done at {format(new Date(item.completed_at), "HH:mm")}
          </span>
        )}
      </div>

      {/* Timer */}
      {!item.is_completed && (
        <span className={cn("shrink-0 text-[17px] font-bold tabular-nums", getTimerColor(elapsed))}>
          {formatTimer(elapsed)}
        </span>
      )}
    </button>
  );
}
