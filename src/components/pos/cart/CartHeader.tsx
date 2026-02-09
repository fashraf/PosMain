import React from "react";
import { ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
  totalQuantity: number;
  editingOrderNumber?: number | null;
}

export function CartHeader({ itemCount, totalQuantity, editingOrderNumber }: CartHeaderProps) {
  return (
    <div className="border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: item count or editing badge */}
        <div className="flex items-center gap-2">
          {editingOrderNumber ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-sm font-bold text-destructive animate-pulse-red">
              Editing Order #{editingOrderNumber}
            </span>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">
                Total Item : {itemCount}
              </span>
            </>
          )}
        </div>

        {/* Right: Qty label */}
        {itemCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {totalQuantity} pcs
          </span>
        )}
      </div>
    </div>
  );
}
