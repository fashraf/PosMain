import React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import type { POSItemIngredient } from "@/lib/pos/types";

interface IngredientCardProps {
  ingredient: POSItemIngredient;
  isExtra: boolean;
  isRemoved: boolean;
  onExtraToggle: () => void;
  onRemovalToggle: () => void;
}

export function IngredientCard({
  ingredient,
  isExtra,
  isRemoved,
  onExtraToggle,
  onRemovalToggle,
}: IngredientCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      {/* Info */}
      <div className="mb-3">
        <h4 className="font-medium">{ingredient.ingredient_name_en}</h4>
        {ingredient.can_add_extra && ingredient.extra_price > 0 && (
          <p className="text-sm text-muted-foreground">
            Rs. {ingredient.extra_price.toFixed(2)}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {ingredient.is_removable && (
          <button
            type="button"
            onClick={onRemovalToggle}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 font-medium",
              "touch-manipulation transition-colors active:scale-95",
              isRemoved
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-muted-foreground/30 text-muted-foreground hover:border-destructive/50"
            )}
          >
            <Minus className="h-4 w-4" />
            REMOVE
          </button>
        )}

        {ingredient.can_add_extra && (
          <button
            type="button"
            onClick={onExtraToggle}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 font-medium",
              "touch-manipulation transition-colors active:scale-95",
              isExtra
                ? "border-green-600 bg-green-600/10 text-green-600"
                : "border-muted-foreground/30 text-muted-foreground hover:border-green-600/50"
            )}
          >
            <Plus className="h-4 w-4" />
            EXTRA
          </button>
        )}
      </div>
    </div>
  );
}
