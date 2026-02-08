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
        "rounded-xl border px-5 py-4 transition-all duration-200",
        "bg-[#111827] border-gray-700/50",
        isRemoved && "bg-red-950/30 border-red-500/30",
        isExtra && !isRemoved && "bg-emerald-950/20 border-emerald-500/30"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Name + price */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-base font-semibold text-white transition-all duration-200",
              isRemoved && "line-through text-red-400"
            )}
          >
            {ingredient.ingredient_name_en}
          </p>
          {canExtra && (
            <p className="text-sm text-gray-400 mt-0.5">
              +{ingredient.extra_price.toFixed(2)} SAR
            </p>
          )}
        </div>

        {/* Toggle controls */}
        <div className="flex items-center gap-6 ml-4">
          {canRemove && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 font-medium">Remove</span>
              <Switch
                checked={isRemoved}
                onCheckedChange={onRemoveToggle}
                className="data-[state=checked]:bg-red-500"
              />
            </div>
          )}
          {canExtra && (
            <div
              className={cn(
                "flex items-center gap-2 transition-opacity duration-200",
                isRemoved && "opacity-40 pointer-events-none"
              )}
            >
              <span className="text-sm text-gray-400 font-medium">Extra</span>
              <Switch
                checked={isExtra}
                onCheckedChange={onExtraToggle}
                disabled={isRemoved}
                className="data-[state=checked]:bg-emerald-500"
              />
              {isExtra && (
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-xs font-bold">
                  +Extra
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
