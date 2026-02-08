import React from "react";
import { ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
}

export function CartHeader({ itemCount, totalQuantity, subtotal }: CartHeaderProps) {
  return (
    <div className="border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: item count */}
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">
            Total Item : {itemCount}
          </span>
        </div>

        {/* Right: Qty label */}
        {itemCount > 0 && (
          <span className="text-xs text-muted-foreground">Qty</span>
        )}
      </div>

      {/* Subtotal display */}
      {itemCount > 0 && (
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[22px] font-bold text-foreground">
            Subtotal: {subtotal.toFixed(2)} SAR
          </span>
          <span className="text-xs text-muted-foreground">
            {totalQuantity} pcs
          </span>
        </div>
      )}
    </div>
  );
}
