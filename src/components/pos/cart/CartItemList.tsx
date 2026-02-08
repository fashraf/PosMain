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
    <div className="divide-y">
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onIncrement={() => onIncrement(item.id)}
          onDecrement={() => onDecrement(item.id)}
          onRemove={() => onRemove(item.id)}
          onEditCustomization={onEditCustomization}
        />
      ))}
    </div>
  );
}
