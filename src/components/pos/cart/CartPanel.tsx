import React from "react";
import { CartHeader } from "./CartHeader";
import { CartItemList } from "./CartItemList";
import { CartTotals } from "./CartTotals";
import { PayButton } from "./PayButton";
import type { CartItem, POSMenuItem } from "@/lib/pos/types";

interface CartPanelProps {
  items: CartItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onEditItem: (cartItemId: string, item: POSMenuItem) => void;
  onPay: () => void;
}

export function CartPanel({
  items,
  subtotal,
  vatRate,
  vatAmount,
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onEditItem,
  onPay,
}: CartPanelProps) {
  const isEmpty = items.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <CartHeader itemCount={items.length} />

      {/* Item List */}
      <div className="flex-1 overflow-auto">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <CartItemList
            items={items}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRemove={onRemove}
            onEdit={onEditItem}
          />
        )}
      </div>

      {/* Totals */}
      {!isEmpty && (
        <CartTotals
          subtotal={subtotal}
          vatRate={vatRate}
          vatAmount={vatAmount}
          total={total}
        />
      )}

      {/* Pay Button */}
      <PayButton total={total} disabled={isEmpty} onClick={onPay} />
    </div>
  );
}
