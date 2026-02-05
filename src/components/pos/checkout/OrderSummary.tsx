import React from "react";
import type { CartItem } from "@/lib/pos/types";
import { hasCustomization } from "@/lib/pos/cartUtils";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export function OrderSummary({
  items,
  subtotal,
  vatRate,
  vatAmount,
  total,
}: OrderSummaryProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 font-semibold">ORDER SUMMARY</h3>

      {/* Items */}
      <div className="space-y-2 border-b pb-3">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between text-sm">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{item.lineTotal.toFixed(2)}</span>
            </div>
            {hasCustomization(item.customization) && (
              <div className="ml-3 text-xs text-muted-foreground">
                {item.customization.extras.map((e) => (
                  <div key={e.id}>+ {e.name}</div>
                ))}
                {item.customization.removals.map((r) => (
                  <div key={r.id}>- {r.name}</div>
                ))}
                {item.customization.replacement && (
                  <div>Replace: {item.customization.replacement.name}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT {vatRate}%</span>
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
