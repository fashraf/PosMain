import React, { useState } from "react";
import { CartHeader } from "./CartHeader";
import { CartItemList } from "./CartItemList";
import { PayButton } from "./PayButton";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
import { ShoppingCart } from "lucide-react";
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
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onEditCustomization,
  onClearAll,
  onPay,
}: CartPanelProps) {
  const isEmpty = items.length === 0;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <CartHeader
        itemCount={items.length}
        totalQuantity={totalQuantity}
        subtotal={subtotal}
      />

      <div className="flex-1 overflow-auto">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground px-6">
            <div className="rounded-full bg-muted p-4">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <p className="text-base font-medium">Add delicious items to start 🍲</p>
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

      <PayButton
        total={total}
        disabled={isEmpty}
        onClearAll={() => setShowClearConfirm(true)}
        onClick={onPay}
      />

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
