import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { OrderItemRow } from "@/hooks/pos/usePOSOrders";

interface OrderItemsTooltipProps {
  items: OrderItemRow[];
  subtotal: number;
  vatAmount: number;
  total: number;
}

export function OrderItemsTooltip({ items, subtotal, vatAmount, total }: OrderItemsTooltipProps) {
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const preview = items
    .slice(0, 3)
    .map((i) => i.item_name)
    .join(", ");
  const suffix = items.length > 3 ? "…" : "";

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span className="cursor-default text-[14px]">
          <span className="font-medium">{count} Items</span>
          <span className="text-muted-foreground ml-1 hidden lg:inline">
            ({preview}{suffix})
          </span>
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        className="max-w-sm min-w-[320px] p-4 text-sm space-y-3"
      >
        {items.map((item) => {
          const cust = item.customization_json;
          const removedIngredients: string[] = cust?.removedIngredients || [];
          const addedIngredients: string[] = (cust?.addedIngredients || []).map(
            (a: any) => a.name || a
          );
          const hasCustom = removedIngredients.length > 0 || addedIngredients.length > 0;

          return (
            <div key={item.id}>
              <div className="flex justify-between font-medium">
                <span>
                  {item.item_name} x{item.quantity}
                </span>
                <span>{item.line_total.toFixed(2)}</span>
              </div>
              {hasCustom && (
                <div className="pl-3 text-muted-foreground space-y-0.5 mt-0.5">
                  {removedIngredients.map((r, i) => (
                    <div key={i}>– No {r}</div>
                  ))}
                  {addedIngredients.map((a, i) => (
                    <div key={i}>+ Extra {a}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="border-t border-border pt-1.5 mt-1.5 space-y-0.5">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
