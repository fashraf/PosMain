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

  const handleSelect = (rep: POSItemReplacement) => {
    if (rep.is_default) {
      // Selecting default = clearing replacement
      onSelect(null);
    } else if (selectedId === rep.id) {
      // Deselect = back to default
      onSelect(null);
    } else {
      onSelect(rep);
    }
  };

  const isDefaultSelected = !selectedId || selectedId === defaultItem?.id;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Replace {groupName}
      </h4>
      <div className="flex flex-wrap gap-2">
        {replacements.map((rep) => {
          const isSelected = rep.is_default ? isDefaultSelected : selectedId === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => handleSelect(rep)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150",
                "active:scale-95 touch-manipulation",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {rep.replacement_name_en}
              {rep.price_difference !== 0 && !rep.is_default && (
                <span className="ml-1 opacity-75">
                  {rep.price_difference > 0 ? "+" : ""}
                  {rep.price_difference.toFixed(0)}
                </span>
              )}
              {rep.is_default && (
                <span className="ml-1 opacity-60 text-[10px]">(default)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
