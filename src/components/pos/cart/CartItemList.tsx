import React from "react";
import { CartItemRow } from "./CartItem";
import type { CartItem } from "@/lib/pos/types";

interface CartItemListProps {
  items: CartItem[];
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onEditCustomization: (cartItemId: string) => void;
}

export function CartItemList({
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onEditCustomization,
}: CartItemListProps) {
  return (
    <div className="flex flex-col p-3">
      {items.map((item, idx) => (
        <React.Fragment key={item.id}>
          <CartItemRow
            item={item}
            onIncrement={() => onIncrement(item.id)}
            onDecrement={() => onDecrement(item.id)}
            onRemove={() => onRemove(item.id)}
            onEditCustomization={onEditCustomization}
          />
          {idx < items.length - 1 && (
            <div className="flex justify-center">
              <div className="w-3/4 border-b border-dotted border-border" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
