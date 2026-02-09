import { ClipboardList, Layers, CheckSquare, DollarSign } from "lucide-react";
import type { OrderStats } from "@/hooks/pos/usePOSOrders";

interface OrderStatCardsProps {
  stats: OrderStats;
  isLoading: boolean;
}

const cards = [
  { key: "total" as const, label: "Total Orders", icon: ClipboardList, color: "bg-primary" },
  { key: "inProcess" as const, label: "In Process", icon: Layers, color: "bg-amber-600" },
  { key: "completed" as const, label: "Completed", icon: CheckSquare, color: "bg-emerald-600" },
  { key: "paymentPending" as const, label: "Payment Pending", icon: DollarSign, color: "bg-destructive" },
];

export function OrderStatCards({ stats, isLoading }: OrderStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 py-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = isLoading ? "—" : stats[card.key];
        return (
          <div
            key={card.key}
            className="rounded-xl border border-border bg-background p-4 flex items-center gap-3"
          >
            <div className={`${card.color} rounded-lg h-10 w-10 flex items-center justify-center shrink-0`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground leading-tight">{value}</div>
              <div className="text-[12px] text-muted-foreground leading-tight">{card.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
