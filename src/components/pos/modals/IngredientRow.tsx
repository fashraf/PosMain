import React from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import type { POSItemIngredient } from "@/lib/pos/types";

interface IngredientRowProps {
  ingredient: POSItemIngredient;
  isRemoved: boolean;
  isExtra: boolean;
  onRemoveToggle: () => void;
  onExtraToggle: () => void;
}

export function IngredientRow({
  ingredient,
  isRemoved,
  isExtra,
  onRemoveToggle,
  onExtraToggle,
}: IngredientRowProps) {
  const canRemove = ingredient.is_removable;
  const canExtra = ingredient.extra_price > 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-border px-3 py-2.5",
        isRemoved && "opacity-60"
      )}
    >
      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-card-foreground",
            isRemoved && "line-through text-destructive"
          )}
        >
          {ingredient.ingredient_name_en}
        </p>
        {canExtra && (
          <p className="text-xs text-muted-foreground">
            +Rs. {ingredient.extra_price.toFixed(2)}
          </p>
        )}
      </div>

      {/* Toggle controls */}
      <div className="flex items-center gap-4 ml-3">
        {canRemove && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Remove</span>
            <Switch
              checked={isRemoved}
              onCheckedChange={onRemoveToggle}
              className="scale-90"
            />
          </div>
        )}
        {canExtra && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Extra</span>
            <Switch
              checked={isExtra}
              onCheckedChange={onExtraToggle}
              className="scale-90 data-[state=checked]:bg-primary"
            />
          </div>
        )}
      </div>

      {/* Status badges */}
      {isExtra && (
        <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
          +Extra
        </span>
      )}
    </div>
  );
}
