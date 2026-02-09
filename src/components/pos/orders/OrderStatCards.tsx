import { ClipboardList, Layers, CheckSquare, AlertCircle } from "lucide-react";
import type { OrderStats, OrderStatusTab } from "@/hooks/pos/usePOSOrders";
import { cn } from "@/lib/utils";

interface OrderStatCardsProps {
  stats: OrderStats;
  isLoading: boolean;
  activeTab?: OrderStatusTab;
  onCardClick?: (tab: OrderStatusTab) => void;
}

const cards: {
  key: keyof OrderStats;
  label: string;
  icon: typeof ClipboardList;
  bg: string;
  iconColor: string;
  tab: OrderStatusTab;
}[] = [
  { key: "total", label: "Total Orders", icon: ClipboardList, bg: "bg-slate-100", iconColor: "text-slate-600", tab: "all" },
  { key: "inProcess", label: "In Process", icon: Layers, bg: "bg-amber-50", iconColor: "text-amber-600", tab: "unpaid" },
  { key: "completed", label: "Completed", icon: CheckSquare, bg: "bg-emerald-50", iconColor: "text-emerald-600", tab: "completed" },
  { key: "paymentPending", label: "Total Unpaid", icon: AlertCircle, bg: "bg-red-50", iconColor: "text-red-500", tab: "unpaid" },
];

export function OrderStatCards({ stats, isLoading, activeTab, onCardClick }: OrderStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 py-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const raw = isLoading ? null : stats[card.key];
        const value = raw == null ? "—" : raw;
        const isActive = activeTab === card.tab;
        return (
          <div
            key={card.key}
            onClick={() => onCardClick?.(card.tab)}
            className={cn(
              "rounded-lg border border-slate-200 bg-white p-3 flex items-center gap-3 shadow-sm transition-all cursor-pointer hover:shadow-md",
              isActive && "ring-2 ring-slate-300"
            )}
          >
            <div className={`${card.bg} rounded-lg h-9 w-9 flex items-center justify-center shrink-0`}>
              <Icon className={`h-[18px] w-[18px] ${card.iconColor}`} />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800 leading-tight tabular-nums">{value}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{card.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
