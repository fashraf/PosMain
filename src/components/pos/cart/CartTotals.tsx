import React from "react";

interface CartTotalsProps {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export function CartTotals({
  subtotal,
  vatRate,
  vatAmount,
  total,
}: CartTotalsProps) {
  return (
    <div className="border-t bg-background px-4 py-3">
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">VAT {vatRate}%</span>
          <span>{vatAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>TOTAL</span>
          <span className="text-primary">{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
