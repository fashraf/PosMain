import React from "react";
import { cn } from "@/lib/utils";
import type { POSItemReplacement } from "@/lib/pos/types";

interface ReplacementPillsProps {
  groupName: string;
  replacements: POSItemReplacement[];
  selectedId: string | null;
  onSelect: (replacement: POSItemReplacement | null) => void;
}

export function ReplacementPills({
  groupName,
  replacements,
  selectedId,
  onSelect,
}: ReplacementPillsProps) {
  const defaultItem = replacements.find((r) => r.is_default);
  const isDefaultSelected = !selectedId || selectedId === defaultItem?.id;

  const handleSelect = (rep: POSItemReplacement) => {
    if (rep.is_default) {
      onSelect(null);
    } else if (selectedId === rep.id) {
      onSelect(null);
    } else {
      onSelect(rep);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {groupName} (choose 1)
      </h4>
      <div className="space-y-1">
        {replacements.map((rep) => {
          const isSelected = rep.is_default ? isDefaultSelected : selectedId === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => handleSelect(rep)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                "active:scale-[0.98] touch-manipulation text-left",
                isSelected
                  ? "bg-primary/10 border border-primary/30"
                  : "border border-transparent hover:bg-muted/50"
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  isSelected
                    ? "border-primary"
                    : "border-muted-foreground/40"
                )}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>

              {/* Name */}
              <span className={cn(
                "flex-1 font-medium",
                isSelected ? "text-card-foreground" : "text-muted-foreground"
              )}>
                {rep.replacement_name_en}
              </span>

              {/* Price */}
              <span className="text-xs text-muted-foreground tabular-nums">
                {rep.price_difference > 0
                  ? `+${rep.price_difference.toFixed(2)} SAR`
                  : `${rep.price_difference.toFixed(2)} SAR`}
              </span>

              {/* Default tag */}
              {rep.is_default && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  default
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
