import React from "react";
import { ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b bg-background px-4 py-3">
      <ShoppingCart className="h-5 w-5 text-primary" />
      <h2 className="font-semibold">Cart</h2>
      {itemCount > 0 && (
        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {itemCount}
        </span>
      )}
    </div>
  );
}
