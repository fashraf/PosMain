import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { KitchenItemRow } from "./KitchenItemRow";
import { KitchenItemModal } from "./KitchenItemModal";
import type { KDSOrder, KDSOrderItem } from "@/hooks/pos/useKitchenOrders";

const ORDER_TYPE_COLORS: Record<string, string> = {
  dine_in: "bg-blue-500",
  delivery: "bg-red-500",
  takeaway: "bg-orange-500",
  self_pickup: "bg-emerald-500",
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "DINE-IN",
  delivery: "DELIVERY",
  takeaway: "TAKEAWAY",
  self_pickup: "SELF-PICKUP",
};

function getTimeAgoShort(createdAt: string) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  return `${h}h ${min % 60}m ago`;
}

interface KitchenOrderCardProps {
  order: KDSOrder;
  onMarkComplete: (orderItemId: string, itemName: string) => void;
}

export function KitchenOrderCard({ order, onMarkComplete }: KitchenOrderCardProps) {
  const [selectedItem, setSelectedItem] = useState<KDSOrderItem | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  const completed = order.items.filter((i) => i.is_completed).length;
  const total = order.items.length;
  const allDone = completed === total && total > 0;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Auto-fade when all done
  useEffect(() => {
    if (allDone) {
      setShowComplete(true);
      const timer = setTimeout(() => setShowComplete(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [allDone]);

  const barColor = ORDER_TYPE_COLORS[order.order_type] || "bg-slate-500";

  return (
    <>
      <div
        className={cn(
          "flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-500",
          allDone && "opacity-40 scale-[0.98]"
        )}
      >
        {/* Colored top bar */}
        <div className={cn("px-4 py-2.5 flex items-center justify-between", barColor)}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
              #{order.order_number}
            </span>
            <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
              {ORDER_TYPE_LABELS[order.order_type] || order.order_type}
            </span>
          </div>
          <span className="text-xs text-white/80">{getTimeAgoShort(order.created_at)}</span>
        </div>

        {/* Customer info for delivery */}
        {order.order_type === "delivery" && order.customer_name && (
          <div className="px-4 py-1.5 bg-red-50 text-xs text-red-700 font-medium">
            📦 {order.customer_name}
            {order.customer_mobile && ` · ${order.customer_mobile}`}
          </div>
        )}

        {/* Items list */}
        <div className="flex flex-col gap-0.5 p-2">
          {order.items.map((item) => (
            <KitchenItemRow
              key={item.id}
              item={item}
              orderCreatedAt={order.created_at}
              onTap={setSelectedItem}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>
              {completed} / {total}
            </span>
            <span>{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* ORDER COMPLETE overlay */}
        {showComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/90 rounded-xl">
            <span className="text-2xl font-bold text-white tracking-wider">ORDER COMPLETE ✓</span>
          </div>
        )}
      </div>

      <KitchenItemModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={onMarkComplete}
      />
    </>
  );
}
