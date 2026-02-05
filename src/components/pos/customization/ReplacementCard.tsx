import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { POSItemReplacement } from "@/lib/pos/types";

interface ReplacementCardProps {
  replacement: POSItemReplacement;
  isSelected: boolean;
  onSelect: () => void;
}

export function ReplacementCard({
  replacement,
  isSelected,
  onSelect,
}: ReplacementCardProps) {
  const priceDiff = replacement.price_difference;
  const priceLabel =
    priceDiff === 0
      ? "Rs. 0.00"
      : priceDiff > 0
      ? `+Rs. ${priceDiff.toFixed(2)}`
      : `-Rs. ${Math.abs(priceDiff).toFixed(2)}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center rounded-xl border-2 p-4",
        "touch-manipulation transition-all active:scale-95",
        isSelected
          ? "border-green-600 bg-green-600 text-white"
          : "border-muted-foreground/30 bg-card hover:border-green-600/50"
      )}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute right-2 top-2">
          <Check className="h-4 w-4" />
        </div>
      )}

      {/* Name */}
      <span className="font-medium text-sm text-center">
        {replacement.replacement_name_en}
      </span>

      {/* Price */}
      <span
        className={cn(
          "mt-1 text-xs",
          isSelected ? "text-white/80" : "text-muted-foreground"
        )}
      >
        {priceLabel}
      </span>
    </button>
  );
}
