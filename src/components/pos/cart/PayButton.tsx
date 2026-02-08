import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";

interface PayButtonProps {
  total: number;
  disabled?: boolean;
  onClearAll?: () => void;
  onClick: () => void;
}

export function PayButton({ total, disabled, onClearAll, onClick }: PayButtonProps) {
  return (
    <div className="border-t bg-background p-3 flex items-center gap-3">
      {/* Clear Cart - left */}
      {!disabled && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/5 px-4 h-12 text-sm font-medium text-destructive hover:bg-destructive/10 active:scale-95 transition-all touch-manipulation whitespace-nowrap"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      )}

      {/* Confirm & Pay - right */}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 h-14 text-primary-foreground text-base font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all touch-manipulation disabled:opacity-50 disabled:pointer-events-none"
      >
        <ShoppingCart className="h-5 w-5" />
        Confirm & Pay → {total.toFixed(2)} SAR
      </button>
    </div>
  );
}
