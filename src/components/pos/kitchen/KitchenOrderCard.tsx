import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";
import { KitchenItemRow } from "./KitchenItemRow";
import { KitchenItemModal } from "./KitchenItemModal";
import type { KDSOrder, KDSOrderItem } from "@/hooks/pos/useKitchenOrders";

const ORDER_TYPE_GRADIENTS: Record<string, string> = {
  dine_in: "bg-gradient-to-r from-blue-500 to-blue-600",
  delivery: "bg-gradient-to-r from-red-500 to-red-600",
  takeaway: "bg-gradient-to-r from-orange-500 to-orange-600",
  self_pickup: "bg-gradient-to-r from-emerald-500 to-emerald-600",
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

function isNewOrder(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 60000;
}

function getElapsedMinutes(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

interface KitchenOrderCardProps {
  order: KDSOrder;
  onMarkComplete: (orderItemId: string, itemName: string) => void;
  onUndoComplete: (orderItemId: string, itemName: string) => void;
  onMarkAllComplete: (orderItemIds: string[], orderNumber: number) => void;
}

export function KitchenOrderCard({ order, onMarkComplete, onUndoComplete, onMarkAllComplete }: KitchenOrderCardProps) {
  const [selectedItem, setSelectedItem] = useState<KDSOrderItem | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  const completed = order.items.filter((i) => i.is_completed).length;
  const total = order.items.length;
  const allDone = completed === total && total > 0;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const incompleteIds = order.items.filter((i) => !i.is_completed).map((i) => i.id);

  const progressBarColor =
    progressPct > 66 ? "bg-emerald-500" : progressPct > 33 ? "bg-amber-500" : "bg-red-500";

  useEffect(() => {
    if (allDone) {
      setShowComplete(true);
      const timer = setTimeout(() => setShowComplete(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [allDone]);

  const barGradient = ORDER_TYPE_GRADIENTS[order.order_type] || "bg-gradient-to-r from-slate-500 to-slate-600";
  const newOrder = isNewOrder(order.created_at);
  const elapsed = getElapsedMinutes(order.created_at);
  const isOverdue = elapsed >= 30 && !allDone;

  const handleItemTap = (item: KDSOrderItem) => {
    if (item.is_completed) {
      onUndoComplete(item.id, item.item_name);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-500",
          "hover:shadow-md hover:-translate-y-0.5",
          allDone && "opacity-40 scale-[0.98]",
          newOrder && !allDone && "ring-2 ring-amber-400 animate-kds-blink"
        )}
      >
        {/* Gradient top bar */}
        <div className={cn("px-4 py-2.5 flex items-center justify-between", barGradient)}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-[19px]" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
              #{order.order_number}
            </span>
            <span className="rounded bg-white/20 px-2 py-0.5 text-[15px] font-medium text-white">
              {ORDER_TYPE_LABELS[order.order_type] || order.order_type}
            </span>
            <span className="rounded bg-white/15 px-1.5 py-0.5 text-[13px] font-medium text-white/80">
              {total} items
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isOverdue && (
              <Bell className="h-5 w-5 text-orange-300 animate-kds-bell-ring" />
            )}
            <span className={cn("text-[15px] text-white/80", isOverdue && "text-orange-200 font-semibold")}>
              {getTimeAgoShort(order.created_at)}
            </span>
          </div>
        </div>

        {/* Customer info for delivery */}
        {order.order_type === "delivery" && order.customer_name && (
          <div className="px-4 py-1.5 bg-red-50 text-[15px] text-red-700 font-medium">
            📦 {order.customer_name}
            {order.customer_mobile && ` · ${order.customer_mobile}`}
          </div>
        )}

        {/* Items list with dotted dividers */}
        <div className="flex flex-col p-2">
          {order.items.map((item, idx) => (
            <div key={item.id}>
              {idx > 0 && (
                <div className="mx-auto w-3/4 border-t border-dotted border-slate-300 my-0.5" />
              )}
              <KitchenItemRow
                item={item}
                orderCreatedAt={order.created_at}
                onTap={handleItemTap}
              />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-2 pt-1">
          <div className="flex items-center justify-between text-[15px] text-slate-400 mb-1">
            <span>
              {completed} / {total}
            </span>
            <span>{progressPct}%</span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", progressBarColor)}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Mark All Done button */}
        {incompleteIds.length > 0 && (
          <div className="px-4 pb-3">
            <button
              onClick={() => onMarkAllComplete(incompleteIds, order.order_number)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-[15px] py-2 transition-colors touch-manipulation"
            >
              <CheckCheck className="h-5 w-5" />
              Mark All Done
            </button>
          </div>
        )}

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
