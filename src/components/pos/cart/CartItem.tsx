import React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash2, Pencil } from "lucide-react";
import { TouchButton } from "@/components/pos/shared";
import type { CartItem, POSMenuItem } from "@/lib/pos/types";
import { hasCustomization } from "@/lib/pos/cartUtils";

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onEdit: (cartItemId: string, item: POSMenuItem) => void;
}

export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onEdit,
}: CartItemRowProps) {
  const isCustomized = hasCustomization(item.customization);

  return (
    <div className="p-3">
      {/* Main row */}
      <div className="flex items-center gap-2">
        {/* Item name with customization indicator */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            {isCustomized && (
              <span className="text-xs text-primary font-medium">(c)</span>
            )}
            <span className="font-medium text-sm truncate">{item.name}</span>
          </div>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDecrement}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              "bg-muted text-muted-foreground",
              "touch-manipulation active:scale-95"
            )}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrement}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              "bg-muted text-muted-foreground",
              "touch-manipulation active:scale-95"
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Line total */}
        <span className="w-16 text-right font-semibold text-sm">
          {item.lineTotal.toFixed(2)}
        </span>
      </div>

      {/* Customization details */}
      {isCustomized && (
        <div className="mt-1 ml-4 text-xs text-muted-foreground">
          {item.customization.extras.map((e) => (
            <div key={e.id} className="text-green-600">
              + {e.name}{e.price > 0 ? ` (+${e.price.toFixed(2)})` : ""}
            </div>
          ))}
          {item.customization.removals.map((r) => (
            <div key={r.id} className="text-red-500">- {r.name}</div>
          ))}
          {item.customization.replacement && (
            <div className="text-blue-600">
              Replace: {item.customization.replacement.name}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "flex h-7 items-center gap-1 rounded px-2 text-xs",
            "text-destructive hover:bg-destructive/10",
            "touch-manipulation"
          )}
        >
          <Trash2 className="h-3 w-3" />
          Remove
        </button>
      </div>
    </div>
  );
}
