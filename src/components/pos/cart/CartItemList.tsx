import React from "react";
import { CartItemRow } from "./CartItem";
import type { CartItem, POSMenuItem } from "@/lib/pos/types";

interface CartItemListProps {
  items: CartItem[];
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onEdit: (cartItemId: string, item: POSMenuItem) => void;
}

export function CartItemList({
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onEdit,
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
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
