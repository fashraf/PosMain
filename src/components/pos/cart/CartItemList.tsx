import React from "react";
import { CartItemRow } from "./CartItem";
import type { CartItem } from "@/lib/pos/types";

interface CartItemListProps {
  items: CartItem[];
  highlight?: { id: string; color: 'green' | 'red'; tick: number } | null;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onEditCustomization: (cartItemId: string) => void;
}

export function CartItemList({
  items,
  highlight,
  onIncrement,
  onDecrement,
  onRemove,
  onEditCustomization,
}: CartItemListProps) {
  return (
    <div className="flex flex-col p-3">
      {items.map((item, idx) => {
        const isHighlighted = highlight?.id === item.id || highlight?.id === item.menuItemId;
        return (
        <React.Fragment key={isHighlighted ? `${item.id}-${highlight.tick}` : item.id}>
          <CartItemRow
            item={item}
            isHighlighted={isHighlighted}
            highlightColor={isHighlighted ? highlight.color : undefined}
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
        );
      })}
    </div>
  );
}
