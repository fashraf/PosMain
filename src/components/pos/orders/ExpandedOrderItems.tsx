import type { OrderItemRow } from "@/hooks/pos/usePOSOrders";

interface ExpandedOrderItemsProps {
  items: OrderItemRow[];
}

export function ExpandedOrderItems({ items }: ExpandedOrderItemsProps) {
  return (
    <tr>
      <td colSpan={10} className="p-0">
        <div className="mx-4 my-2 rounded-lg bg-[#FAFAFA] shadow-sm border border-slate-100 px-4 py-2 max-w-[50%]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-slate-500 bg-slate-100/70">
                <th className="text-left py-1.5 px-2 font-medium w-[40%]">Item Name</th>
                <th className="text-left py-1.5 px-2 font-medium w-[35%]">Customization</th>
                <th className="text-center py-1.5 px-2 font-medium w-[10%]">Qty</th>
                <th className="text-right py-1.5 px-2 font-medium w-[15%]">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const cust = item.customization_json;
                const removed: string[] = cust?.removedIngredients || [];
                const added: string[] = (cust?.addedIngredients || []).map(
                  (a: any) => a.name || a
                );
                const replacements: string[] = (cust?.replacements || []).map(
                  (r: any) => r.name || r
                );
                const hasCustom = removed.length > 0 || added.length > 0 || replacements.length > 0;

                return (
                  <tr key={item.id} className="border-t border-dotted border-slate-200">
                    <td className="py-1.5 px-2 font-medium text-slate-700">{item.item_name}</td>
                    <td className="py-1.5 px-2">
                      {!hasCustom ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <div className="space-y-0.5">
                          {removed.map((r, i) => (
                            <div key={`r-${i}`} className="text-red-400">– No {r}</div>
                          ))}
                          {added.map((a, i) => (
                            <div key={`a-${i}`} className="text-emerald-500">+ Extra {a}</div>
                          ))}
                          {replacements.map((r, i) => (
                            <div key={`rp-${i}`} className="text-blue-500">↻ {r}</div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-1.5 px-2 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-slate-700">{item.line_total.toFixed(2)}</td>
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
