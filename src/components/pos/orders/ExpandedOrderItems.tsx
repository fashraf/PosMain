import type { OrderItemRow } from "@/hooks/pos/usePOSOrders";
import { OrderItemCard } from "./OrderItemCard";

interface ExpandedOrderItemsProps {
  items: OrderItemRow[];
}

export function ExpandedOrderItems({ items }: ExpandedOrderItemsProps) {
  return (
    <tr>
      <td colSpan={10} className="p-0">
        <div className="mx-4 my-2 rounded-lg bg-[#FAFAFA] shadow-sm border border-slate-100 max-w-[50%] overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-3 py-1.5 text-[11px] font-medium text-slate-500 bg-slate-100/70">
            <span className="flex-1">Item Name</span>
            <span className="min-w-[32px] text-center">Qty</span>
            <span className="min-w-[60px] text-right">Price</span>
          </div>
          {/* Items */}
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={idx > 0 ? "border-t border-dotted border-slate-200" : ""}
            >
              <OrderItemCard item={item} compact />
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}
