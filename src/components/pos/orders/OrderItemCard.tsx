import type { OrderItemRow } from "@/hooks/pos/usePOSOrders";
import { cn } from "@/lib/utils";

interface OrderItemCardProps {
  item: OrderItemRow;
  compact?: boolean;
}

export function OrderItemCard({ item, compact = false }: OrderItemCardProps) {
  const cust = item.customization_json;
  const removed: string[] = cust?.removedIngredients || [];
  const added: { name: string; price?: number }[] = (cust?.addedIngredients || []).map(
    (a: any) => (typeof a === "string" ? { name: a } : { name: a.name || a, price: a.price })
  );
  const replacements: { name: string; price?: number }[] = (cust?.replacements || []).map(
    (r: any) => (typeof r === "string" ? { name: r } : { name: r.name || r, price: r.price_difference ?? r.price })
  );
  const hasCustom = removed.length > 0 || added.length > 0 || replacements.length > 0;

  const priceDiff =
    added.reduce((sum, a) => sum + (a.price || 0), 0) +
    replacements.reduce((sum, r) => sum + (r.price || 0), 0);

  return (
    <div className={cn("py-2", compact ? "px-2" : "px-3")}>
      {/* Row 1: Name | Qty | Total */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 flex items-center gap-1">
          <span
            className={cn(
              "font-semibold text-slate-700",
              compact ? "text-[13px]" : "text-sm",
              hasCustom && "underline decoration-orange-400 decoration-2 underline-offset-2"
            )}
          >
            {item.item_name}
          </span>
          {hasCustom && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block shrink-0" />
          )}
        </div>
        <span className="inline-flex items-center justify-center min-w-[32px] h-7 border border-slate-200 rounded text-sm font-medium text-slate-700 shrink-0">
          {item.quantity}
        </span>
        <span className={cn("font-semibold tabular-nums text-slate-700 shrink-0", compact ? "text-[13px] min-w-[60px]" : "text-sm min-w-[70px]", "text-right")}>
          {item.line_total.toFixed(2)}
        </span>
      </div>

      {/* Row 2: Unit price | Price diff */}
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-xs text-emerald-600/70">{item.unit_price.toFixed(2)}</span>
        {priceDiff > 0 && (
          <span className="text-xs text-slate-500 tabular-nums">+{priceDiff.toFixed(2)} SAR</span>
        )}
      </div>

      {/* Customization lines */}
      {hasCustom && (
        <div className="mt-1 space-y-0.5 text-xs">
          {added.map((a, i) => (
            <div key={`a-${i}`} className="text-emerald-500">+ {a.name}</div>
          ))}
          {replacements.map((r, i) => (
            <div key={`rp-${i}`} className="text-blue-500">→ {r.name}</div>
          ))}
          {removed.map((r, i) => (
            <div key={`r-${i}`} className="text-red-400">– No {r}</div>
          ))}
        </div>
      )}
    </div>
  );
}
