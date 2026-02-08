import React, { useState } from "react";
import { CartHeader } from "./CartHeader";
import { CartItemList } from "./CartItemList";
import { CartTotals } from "./CartTotals";
import { PayButton } from "./PayButton";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
import type { CartItem } from "@/lib/pos/types";

interface CartPanelProps {
  items: CartItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onEditCustomization: (cartItemId: string) => void;
  onClearAll: () => void;
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
  onEditCustomization,
  onClearAll,
  onPay,
}: CartPanelProps) {
  const isEmpty = items.length === 0;
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <CartHeader itemCount={items.length} onClearAll={() => setShowClearConfirm(true)} />

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
            onEditCustomization={onEditCustomization}
          />
        )}
      </div>

      {!isEmpty && (
        <CartTotals
          subtotal={subtotal}
          vatRate={vatRate}
          vatAmount={vatAmount}
          total={total}
        />
      )}

      <PayButton total={total} disabled={isEmpty} onClick={onPay} />

      <ConfirmActionModal
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        onConfirm={() => {
          onClearAll();
          setShowClearConfirm(false);
        }}
        title="Clear Cart"
        message="Are you sure you want to clear all items from the cart?"
        confirmLabel="Clear All"
        variant="destructive"
      />
    </div>
  );
}
