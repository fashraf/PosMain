import { useState, useMemo } from "react";
import { useKitchenOrders } from "@/hooks/pos/useKitchenOrders";
import { KitchenStatusBar, KitchenFilters, KitchenOrderCard, type KDSFilter } from "@/components/pos/kitchen";

export default function KitchenDisplay() {
  const { orders, isLoading, handleMarkComplete, handleUndoComplete, handleMarkAllComplete } = useKitchenOrders();
  const [filter, setFilter] = useState<KDSFilter>("all");

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "urgent") {
      return orders.filter((o) => {
        const elapsed = (Date.now() - new Date(o.created_at).getTime()) / 60000;
        return elapsed >= 15 && o.items.some((i) => !i.is_completed);
      });
    }
    return orders.filter((o) => o.order_type === filter);
  }, [orders, filter]);

  const pendingCount = orders.filter((o) => o.items.some((i) => !i.is_completed)).length;
  const urgentCount = orders.filter((o) => {
    const elapsed = (Date.now() - new Date(o.created_at).getTime()) / 60000;
    return elapsed >= 15 && o.items.some((i) => !i.is_completed);
  }).length;

  return (
    <div className="flex flex-col h-screen">
      <KitchenStatusBar pendingCount={pendingCount} urgentCount={urgentCount} />

      <div className="flex-1 overflow-y-auto bg-slate-100 p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-400 text-lg">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-4xl">🎉</span>
            <span className="text-slate-400 text-lg">No active orders</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 auto-rows-min">
            {filteredOrders.map((order) => (
              <div key={order.id} className="relative">
                <KitchenOrderCard
                  order={order}
                  onMarkComplete={handleMarkComplete}
                  onUndoComplete={handleUndoComplete}
                  onMarkAllComplete={handleMarkAllComplete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <KitchenFilters active={filter} onChange={setFilter} />
    </div>
  );
}
