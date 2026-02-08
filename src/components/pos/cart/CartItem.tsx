import React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus, Pencil } from "lucide-react";
import type { CartItem } from "@/lib/pos/types";
import { hasCustomization } from "@/lib/pos/cartUtils";

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

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      {/* Top row: name + line total */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-base font-bold text-foreground leading-tight">
          {item.name}
        </span>
        <span className="text-xl font-bold text-foreground whitespace-nowrap">
          {item.lineTotal.toFixed(2)}
        </span>
      </div>

      {/* Modification tags */}
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
        </div>
      )}

      {/* Bottom row: qty controls + pencil */}
      <div className="mt-3 flex items-center justify-between">
        {/* Spacer for alignment */}
        <div className="flex-1" />

        {/* Qty controls */}
        <div className="flex items-center gap-1.5">
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
          <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
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

        {/* Edit pencil */}
        <div className="w-10 flex justify-end">
          {isCustomized && (
            <button
              type="button"
              onClick={() => onEditCustomization(item.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent touch-manipulation"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
