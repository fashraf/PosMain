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
  const canExtra = ingredient.can_add_extra;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition-all",
        isRemoved && "opacity-50 bg-destructive/5 border-destructive/20",
        isExtra && "bg-primary/5 border-primary/20"
      )}
    >
      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold text-card-foreground",
            isRemoved && "line-through text-destructive"
          )}
        >
          {ingredient.ingredient_name_en}
        </p>
        {canExtra && (
          <p className="text-xs text-muted-foreground mt-0.5">
            +{ingredient.extra_price.toFixed(2)} SAR
          </p>
        )}
      </div>

      {/* Toggle controls */}
      <div className="flex items-center gap-5 ml-3">
        {canRemove && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Remove</span>
            <Switch
              checked={isRemoved}
              onCheckedChange={onRemoveToggle}
              className="scale-90"
            />
          </div>
        )}
        {canExtra && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Extra</span>
            <Switch
              checked={isExtra}
              onCheckedChange={onExtraToggle}
              className="scale-90 data-[state=checked]:bg-primary"
            />
            {isExtra && (
              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
                +Extra
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
