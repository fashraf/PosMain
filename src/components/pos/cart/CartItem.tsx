import React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import type { CartItem } from "@/lib/pos/types";
import { hasCustomization, calculateItemPrice } from "@/lib/pos/cartUtils";

interface CartItemRowProps {
  item: CartItem;
  isHighlighted?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onEditCustomization: (cartItemId: string) => void;
}

export function CartItemRow({
  item,
  isHighlighted,
  onIncrement,
  onDecrement,
  onRemove,
  onEditCustomization,
}: CartItemRowProps) {
  const isCustomized = hasCustomization(item.customization);
  const baseTotal = item.basePrice * item.quantity;
  const hasExtraCost = isCustomized && item.lineTotal !== baseTotal;

  const handleRowClick = () => {
    onEditCustomization(item.id);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleRowClick}
      className={cn(
        "relative pl-4 pr-3 py-3 cursor-pointer hover:bg-accent/50 transition-colors",
        isCustomized && "pl-5",
        isHighlighted && "animate-cart-flash"
      )}
    >
      {/* Red left marker for customized items */}
      {isCustomized && (
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-destructive" />
      )}

      {/* Main row: 12-col grid */}
      <div className="grid grid-cols-12 items-center">
        {/* Col-5: Name + unit price */}
        <div className="col-span-5 flex flex-col min-w-0">
          <span className="truncate text-base font-bold text-foreground">
            {item.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {item.basePrice.toFixed(2)}
          </span>
        </div>

        {/* Col-4: Qty controls */}
        <div className="col-span-4 flex items-center justify-center gap-1.5" onClick={stopPropagation}>
          <button
            type="button"
            onClick={item.quantity === 1 ? onRemove : onDecrement}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              "bg-destructive/10 text-destructive",
              "touch-manipulation active:scale-95 transition-transform"
            )}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-7 text-center font-semibold text-sm">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrement}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              "bg-primary/10 text-primary",
              "touch-manipulation active:scale-95 transition-transform"
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Col-3: Line total */}
        <div className="col-span-3 text-right">
          <span className="text-xl font-bold text-foreground">
            {(isCustomized ? baseTotal : item.lineTotal).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Modification lines */}
      {isCustomized && (
        <div className="mt-2 space-y-0.5 text-sm">
          {item.customization.removals.map((r) => (
            <div key={r.id} className="flex items-center gap-1 text-destructive">
              <span>×</span>
              <span className="line-through">{r.name}</span>
            </div>
          ))}
          {item.customization.extras.map((e) => (
            <div key={e.id} className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span>+ {e.name}</span>
              {e.price > 0 && <span className="text-xs">+{e.price.toFixed(2)} SAR</span>}
            </div>
          ))}
          {item.customization.replacements.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-primary">
              <span>→ {r.name}</span>
              {r.priceDiff !== 0 && (
                <span className="text-xs">
                  {r.priceDiff > 0 ? "+" : ""}
                  {r.priceDiff.toFixed(2)} SAR
                </span>
              )}
            </div>
          ))}
          {hasExtraCost && (
            <div className="flex items-center justify-end gap-1.5 pt-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>{item.lineTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
