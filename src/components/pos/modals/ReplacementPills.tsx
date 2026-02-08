import React from "react";
import { cn } from "@/lib/utils";
import type { POSItemReplacement } from "@/lib/pos/types";

interface ReplacementPillsProps {
  groupName: string;
  replacements: POSItemReplacement[];
  selectedId: string | null;
  onSelect: (replacement: POSItemReplacement | null) => void;
  isLast?: boolean;
}

export function ReplacementPills({
  groupName,
  replacements,
  selectedId,
  onSelect,
  isLast = false,
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
    <div className={cn(!isLast && "border-b border-dotted border-gray-300 pb-4 mb-4")}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
        {groupName} (Choose 1)
      </h4>
      <div className="flex flex-wrap gap-3">
        {replacements.map((rep) => {
          const isSelected = rep.is_default ? isDefaultSelected : selectedId === rep.id;
          const isDefault = !!rep.is_default;

          return (
            <button
              key={rep.id}
              onClick={() => handleSelect(rep)}
              className={cn(
                "min-h-[60px] min-w-[130px] px-4 py-3 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all duration-200 active:scale-95 touch-manipulation",
                isDefault
                  ? isSelected
                    ? "bg-purple-200 border-purple-400"
                    : "bg-purple-100 border-purple-200"
                  : isSelected
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-purple-400"
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                  isDefault
                    ? isSelected ? "border-primary" : "border-purple-300"
                    : isSelected ? "border-white" : "border-purple-400"
                )}
              >
                {isSelected && (
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      isDefault ? "bg-primary" : isSelected ? "bg-white" : "bg-primary"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col items-start gap-0.5">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isDefault && isSelected ? "text-white" : "text-gray-900"
                  )}
                >
                  {rep.replacement_name_en}
                </span>
                {isDefault ? (
                  <span className="bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                    default
                  </span>
                ) : (
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      isSelected ? "text-white/80" : "text-gray-500"
                    )}
                  >
                    {rep.price_difference > 0
                      ? `+${rep.price_difference.toFixed(2)} SAR`
                      : `${rep.price_difference.toFixed(2)} SAR`}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
