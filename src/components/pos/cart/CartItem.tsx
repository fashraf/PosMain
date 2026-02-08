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
  const unitPrice = item.basePrice +
    item.customization.extras.reduce((s, e) => s + e.price, 0) +
    (item.customization.replacement?.priceDiff ?? 0);

  return (
    <div className="px-3 py-2.5">
      {/* Main row: icon | name | qty controls | total */}
      <div className="flex items-center gap-2">
        {/* Edit icon – only for customized items */}
        <div className="w-6 flex-shrink-0">
          {isCustomized && (
            <button
              type="button"
              onClick={() => onEditCustomization(item.id)}
              className="flex h-6 w-6 items-center justify-center rounded text-primary hover:bg-primary/10 touch-manipulation"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Item name */}
        <span className="flex-1 min-w-0 font-semibold text-sm truncate">
          {item.name}
        </span>

        {/* Quantity controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={item.quantity === 1 ? onRemove : onDecrement}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded",
              "bg-destructive/10 text-destructive",
              "touch-manipulation active:scale-95"
            )}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-7 text-center font-semibold text-sm">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrement}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded",
              "bg-primary/10 text-primary",
              "touch-manipulation active:scale-95"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Line total */}
        <span className="w-20 text-right font-bold text-sm">
          {item.lineTotal.toFixed(2)}
        </span>
      </div>

      {/* Price breakdown */}
      <div className="ml-8 mt-0.5 text-xs text-muted-foreground">
        Price : {item.basePrice.toFixed(2)} × {item.quantity}
      </div>

      {/* Customization details */}
      {isCustomized && (
        <div className="ml-8 mt-1 space-y-0.5 text-xs">
          {item.customization.removals.map((r) => (
            <div key={r.id} className="flex justify-between text-destructive">
              <span>× {r.name}</span>
              <span className="text-muted-foreground">removed</span>
            </div>
          ))}
          {item.customization.extras.map((e) => (
            <div key={e.id} className="flex justify-between text-green-600">
              <span>+ {e.name}</span>
              {e.price > 0 && <span>+{e.price.toFixed(2)} SAR</span>}
            </div>
          ))}
          {item.customization.replacement && (
            <div className="flex justify-between text-primary">
              <span>✏ {item.customization.replacement.name}</span>
              {item.customization.replacement.priceDiff !== 0 && (
                <span>
                  {item.customization.replacement.priceDiff > 0 ? "+" : ""}
                  {item.customization.replacement.priceDiff.toFixed(2)} SAR
                </span>
              )}
            </div>
          )}
          {/* Customized unit total */}
          {(item.customization.extras.length > 0 ||
            item.customization.removals.length > 0 ||
            item.customization.replacement) && (
            <div className="flex justify-end font-bold text-foreground pt-0.5">
              &gt; {unitPrice.toFixed(2)} SAR
            </div>
          )}
        </div>
      )}
    </div>
  );
}
