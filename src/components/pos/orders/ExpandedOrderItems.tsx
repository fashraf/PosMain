import type { OrderItemRow } from "@/hooks/pos/usePOSOrders";

interface ExpandedOrderItemsProps {
  items: OrderItemRow[];
}

export function ExpandedOrderItems({ items }: ExpandedOrderItemsProps) {
  return (
    <tr>
      <td colSpan={8} className="p-0">
        <div className="bg-muted/30 border-t-2 border-dotted border-border px-6 py-2">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-1 font-medium w-[40%]">Item Name</th>
                <th className="text-left py-1 font-medium w-[35%]">Customization</th>
                <th className="text-center py-1 font-medium w-[10%]">Qty</th>
                <th className="text-right py-1 font-medium w-[15%]">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const cust = item.customization_json;
                const removed: string[] = cust?.removedIngredients || [];
                const added: string[] = (cust?.addedIngredients || []).map(
                  (a: any) => a.name || a
                );
                const tags = [
                  ...removed.map((r) => `– ${r}`),
                  ...added.map((a) => `+ ${a}`),
                ];

                return (
                  <tr key={item.id} className="border-t border-border/50">
                    <td className="py-1.5 font-medium text-foreground">{item.item_name}</td>
                    <td className="py-1.5 text-muted-foreground">
                      {tags.length > 0 ? tags.join(", ") : "—"}
                    </td>
                    <td className="py-1.5 text-center">{item.quantity}</td>
                    <td className="py-1.5 text-right tabular-nums">{item.line_total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
}
