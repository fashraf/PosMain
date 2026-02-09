import React from "react";
import { CheckCircle2 } from "lucide-react";
import { TouchButton } from "@/components/pos/shared";

interface OrderConfirmationProps {
  orderNumber: number;
  itemCount: number;
  total: number;
  onNewOrder: () => void;
}

export function OrderConfirmation({
  orderNumber,
  itemCount,
  total,
  onNewOrder,
}: OrderConfirmationProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 py-12">
      <div className="rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 p-5 shadow-sm">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Order Placed!</h2>
        <p className="text-4xl font-bold text-primary/85">#{orderNumber}</p>
      </div>
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
        <p className="text-lg font-semibold text-foreground">{total.toFixed(2)} SAR</p>
      </div>
      <div className="flex gap-3 mt-4">
        <TouchButton variant="outline" className="min-w-[140px] rounded-xl shadow-sm" disabled>
          Print Receipt
        </TouchButton>
        <TouchButton className="min-w-[140px] rounded-xl shadow-sm" onClick={onNewOrder}>
          New Order
        </TouchButton>
      </div>
    </div>
  );
}
