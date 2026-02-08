import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
  onClearAll?: () => void;
}

export function CartHeader({ itemCount, onClearAll }: CartHeaderProps) {
  return (
    <div className="border-b bg-background px-4 py-2.5">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">
            Total Item : {itemCount}
          </span>
        </div>
        {itemCount > 0 && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 touch-manipulation"
          >
            <Trash2 className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>
      {/* Column headers */}
      {itemCount > 0 && (
        <div className="mt-1 flex items-center text-[11px] text-muted-foreground">
          <span className="w-6 flex-shrink-0" />
          <span className="flex-1" />
          <span className="w-[76px] text-center">Qty</span>
          <span className="w-20 text-right">Total</span>
        </div>
      )}
    </div>
  );
}
