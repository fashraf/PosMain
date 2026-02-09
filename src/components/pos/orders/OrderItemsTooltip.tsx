import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { OrderItemRow } from "@/hooks/pos/usePOSOrders";
import { cn } from "@/lib/utils";
import { OrderItemCard } from "./OrderItemCard";

interface OrderItemsTooltipProps {
  items: OrderItemRow[];
  subtotal: number;
  vatAmount: number;
  total: number;
}

function hasCustomization(item: OrderItemRow) {
  const cust = item.customization_json;
  if (!cust) return false;
  return (
    (cust.removals?.length > 0) ||
    (cust.extras?.length > 0) ||
    (cust.replacements?.length > 0)
  );
}

export function OrderItemsTooltip({ items, subtotal, vatAmount, total }: OrderItemsTooltipProps) {
  const previewItems = items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span className="cursor-default flex flex-wrap gap-1 items-center">
          {previewItems.map((i) => (
            <span
              key={i.id}
              className={cn(
                "inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 text-[16px] font-medium",
                hasCustomization(i) && "underline decoration-orange-400 decoration-2 underline-offset-2"
              )}
            >
              {i.quantity} x {i.item_name}
              {hasCustomization(i) && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
              )}
            </span>
          ))}
          {hasMore && <span className="text-[14px] text-slate-400">…</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        className="pos-orders-font max-w-sm min-w-[320px] p-0 text-sm"
      >
        {/* Items */}
        <div className="divide-y divide-dotted divide-slate-200">
          {items.map((item) => (
            <OrderItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border px-3 py-2 space-y-0.5">
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>Tax</span>
            <span>{vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-sm">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
