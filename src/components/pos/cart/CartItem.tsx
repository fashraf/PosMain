import React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus, Pencil } from "lucide-react";
import type { CartItem } from "@/lib/pos/types";
import { hasCustomization, calculateItemPrice } from "@/lib/pos/cartUtils";

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onEditCustomization: (cartItemId: string) => void;
}

export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onEditCustomization,
}: CartItemRowProps) {
  const isCustomized = hasCustomization(item.customization);
  const baseTotal = item.basePrice * item.quantity;
  const hasExtraCost = isCustomized && item.lineTotal !== baseTotal;

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      {/* Main row: name, qty controls, pencil, price — all inline */}
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-base font-bold text-foreground">
          {item.name}
        </span>

        {/* Qty controls */}
        <div className="flex items-center gap-1.5 shrink-0">
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

        {/* Pencil icon */}
        {isCustomized && (
          <button
            type="button"
            onClick={() => onEditCustomization(item.id)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent touch-manipulation shrink-0"
          >
            <Pencil className="h-5 w-5" />
          </button>
        )}

        {/* Price */}
        <span className="text-xl font-bold text-foreground whitespace-nowrap shrink-0 min-w-[70px] text-right">
          {(isCustomized ? baseTotal : item.lineTotal).toFixed(2)}
        </span>
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
          {item.customization.replacement && (
            <div className="flex items-center justify-between text-primary">
              <span>→ {item.customization.replacement.name}</span>
              {item.customization.replacement.priceDiff !== 0 && (
                <span className="text-xs">
                  {item.customization.replacement.priceDiff > 0 ? "+" : ""}
                  {item.customization.replacement.priceDiff.toFixed(2)} SAR
                </span>
              )}
            </div>
          )}
          {/* Green-dot adjusted total */}
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
