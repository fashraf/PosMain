import React from "react";

interface PriceSummaryProps {
  basePrice: number;
  extrasTotal: number;
  replacementDiff: number;
  total: number;
}

export function PriceSummary({
  basePrice,
  extrasTotal,
  replacementDiff,
  total,
}: PriceSummaryProps) {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Base Price</span>
        <span>{basePrice.toFixed(2)}</span>
      </div>
      {extrasTotal > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Extras</span>
          <span>+{extrasTotal.toFixed(2)}</span>
        </div>
      )}
      {replacementDiff !== 0 && (
        <div className="flex justify-between text-blue-600">
          <span>Replacement</span>
          <span>
            {replacementDiff > 0 ? "+" : ""}
            {replacementDiff.toFixed(2)}
          </span>
        </div>
      )}
      <div className="flex justify-between border-t pt-2 font-semibold">
        <span>Item Total</span>
        <span className="text-primary">{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
