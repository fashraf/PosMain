import React from "react";
import { cn } from "@/lib/utils";
import type { POSItemIngredient } from "@/lib/pos/types";

interface ChangesSummaryProps {
  ingredients: POSItemIngredient[];
  extras: Set<string>;
  removals: Set<string>;
  selectedReplacement: {
    id: string;
    group: string;
    name: string;
    priceDiff: number;
  } | null;
  basePrice: number;
  extrasTotal: number;
  replacementDiff: number;
  total: number;
}

export function ChangesSummary({
  ingredients,
  extras,
  removals,
  selectedReplacement,
  basePrice,
  extrasTotal,
  replacementDiff,
  total,
}: ChangesSummaryProps) {
  const extraItems = ingredients.filter((ing) => extras.has(ing.id));
  const removedItems = ingredients.filter((ing) => removals.has(ing.id));
  const hasChanges = extraItems.length > 0 || removedItems.length > 0 || selectedReplacement !== null;

  return (
    <div className="flex gap-6 items-start w-full">
      {/* Changes Applied - Left side */}
      <div className="flex-1 min-w-0">
        {hasChanges && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Changes Applied
            </p>
            <div className="text-xs text-card-foreground space-y-0.5">
              {extraItems.map((ing) => (
                <p key={ing.id}>
                  • Extra added: <span className="font-medium">{ing.ingredient_name_en}</span>
                  {ing.extra_price > 0 && (
                    <span className="text-muted-foreground ml-1">
                      (+{ing.extra_price.toFixed(2)} SAR)
                    </span>
                  )}
                </p>
              ))}
              {removedItems.map((ing) => (
                <p key={ing.id} className="text-destructive">
                  • Removed: <span className="font-medium">{ing.ingredient_name_en}</span>
                </p>
              ))}
              {selectedReplacement && (
                <p>
                  • Replacement: <span className="font-medium">{selectedReplacement.name}</span>
                  {selectedReplacement.priceDiff !== 0 && (
                    <span className="text-muted-foreground ml-1">
                      ({selectedReplacement.priceDiff > 0 ? "+" : ""}
                      {selectedReplacement.priceDiff.toFixed(2)} SAR)
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className={cn("space-y-1 text-xs", hasChanges && "mt-3")}>
          <div className="flex justify-between text-muted-foreground">
            <span>Base</span>
            <span className="tabular-nums">{basePrice.toFixed(2)} SAR</span>
          </div>
          {extrasTotal > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Extras & Additions</span>
              <span className="tabular-nums">{extrasTotal.toFixed(2)} SAR</span>
            </div>
          )}
          {replacementDiff !== 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Replacement Difference</span>
              <span className="tabular-nums">
                {replacementDiff > 0 ? "+" : ""}{replacementDiff.toFixed(2)} SAR
              </span>
            </div>
          )}
          <div className="border-t border-border pt-1.5 flex justify-between font-bold text-sm text-card-foreground">
            <span>Final Total</span>
            <span className="tabular-nums">{total.toFixed(2)} SAR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
