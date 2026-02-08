import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePOSItemDetails } from "@/hooks/pos";
import type { POSMenuItem } from "@/lib/pos/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Info } from "lucide-react";

interface ItemDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: POSMenuItem | null;
}

export function ItemDetailsModal({ open, onOpenChange, menuItem }: ItemDetailsModalProps) {
  const { data: details, isLoading } = usePOSItemDetails(open ? menuItem?.id ?? null : null);

  const replacementGroups = useMemo(() => {
    if (!details?.replacements) return {};
    return details.replacements.reduce((acc, rep) => {
      if (!acc[rep.replacement_group]) acc[rep.replacement_group] = [];
      acc[rep.replacement_group].push(rep);
      return acc;
    }, {} as Record<string, typeof details.replacements>);
  }, [details?.replacements]);

  const hasIngredients = (details?.ingredients?.length ?? 0) > 0;
  const hasReplacements = Object.keys(replacementGroups).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pos-dark max-w-[700px] w-[90vw] max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            <Info className="h-5 w-5 text-primary" />
            {menuItem?.name_en}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : details ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
            {/* Left: Ingredients */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Ingredients
              </h3>
              {hasIngredients ? (
                <div className="space-y-1.5">
                  {details.ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-card-foreground">
                        {ing.ingredient_name_en}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          Extra
                          {ing.extra_price > 0 ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <X className="h-3 w-3 text-destructive/70" />
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          Remove
                          {ing.is_removable ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <X className="h-3 w-3 text-destructive/70" />
                          )}
                        </span>
                        {ing.extra_price > 0 && (
                          <span className="text-[hsl(38,92%,50%)]">
                            +{ing.extra_price.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No ingredients configured.</p>
              )}
            </div>

            {/* Right: Replacements */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Replacements
              </h3>
              {hasReplacements ? (
                <div className="space-y-4">
                  {Object.entries(replacementGroups).map(([group, reps]) => {
                    const defaultRep = reps.find((r) => r.is_default);
                    return (
                      <div key={group} className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          {group}
                          {defaultRep && (
                            <span className="ml-1 opacity-60">
                              (default: {defaultRep.replacement_name_en})
                            </span>
                          )}
                        </p>
                        {reps
                          .filter((r) => !r.is_default)
                          .map((rep) => (
                            <div
                              key={rep.id}
                              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                            >
                              <span className="text-card-foreground">
                                {rep.replacement_name_en}
                              </span>
                              <span
                                className={
                                  rep.price_difference > 0
                                    ? "text-[hsl(38,92%,50%)] text-xs"
                                    : "text-muted-foreground text-xs"
                                }
                              >
                                {rep.price_difference > 0 ? "+" : ""}
                                Rs. {rep.price_difference.toFixed(0)}
                              </span>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No replacements available.</p>
              )}

              {/* Base price */}
              <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Base Price
                </span>
                <p className="text-lg font-bold text-[hsl(38,92%,50%)]">
                  Rs. {menuItem?.base_price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
