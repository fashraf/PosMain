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
      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
        {groupName} (choose 1)
      </h4>
      <div className="space-y-1.5">
        {replacements.map((rep) => {
          const isSelected = rep.is_default ? isDefaultSelected : selectedId === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => handleSelect(rep)}
              className={cn(
                "w-full flex items-center gap-4 rounded-xl px-5 py-4 text-left transition-all duration-150 min-h-[48px]",
                "active:scale-[0.98] touch-manipulation",
                isSelected
                  ? "bg-primary/15 border border-primary/30"
                  : "border border-transparent hover:bg-white/5"
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                  isSelected ? "border-primary" : "border-gray-600"
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </div>

              {/* Name */}
              <span
                className={cn(
                  "flex-1 text-base font-medium transition-colors duration-150",
                  isSelected ? "text-white" : "text-gray-400"
                )}
              >
                {rep.replacement_name_en}
              </span>

              {/* Price */}
              <span className="text-sm text-gray-400 tabular-nums">
                {rep.price_difference > 0
                  ? `+${rep.price_difference.toFixed(2)} SAR`
                  : `${rep.price_difference.toFixed(2)} SAR`}
              </span>

              {/* Default tag */}
              {rep.is_default && (
                <span className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-300">
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
