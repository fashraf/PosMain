import React from "react";
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
    <div className="space-y-3">
      {/* Changes Applied */}
      {hasChanges && (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Changes Applied
          </p>
          <div className="text-xs text-card-foreground space-y-0.5">
            {extraItems.map((ing) => (
              <p key={ing.id}>
                • Extra added: {ing.ingredient_name_en}
                {ing.extra_price > 0 && (
                  <span className="text-muted-foreground ml-1">
                    (+{ing.extra_price.toFixed(2)} SAR)
                  </span>
                )}
              </p>
            ))}
            {removedItems.map((ing) => (
              <p key={ing.id} className="text-destructive">
                • Removed: {ing.ingredient_name_en}
              </p>
            ))}
            {selectedReplacement && (
              <p>
                • Replacement: {selectedReplacement.name}
                {selectedReplacement.priceDiff !== 0 && (
                  <span className="text-muted-foreground ml-1">
                    ({selectedReplacement.priceDiff > 0 ? "+" : ""}
                    {selectedReplacement.priceDiff.toFixed(2)} SAR difference)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-1 text-xs">
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
        <div className="border-t border-border pt-1 flex justify-between font-semibold text-sm text-card-foreground">
          <span>Final Total</span>
          <span className="tabular-nums">{total.toFixed(2)} SAR</span>
        </div>
      </div>
    </div>
  );
}
