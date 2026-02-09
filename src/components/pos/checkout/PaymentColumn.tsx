import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TouchButton } from "@/components/pos/shared";
import { cn } from "@/lib/utils";
import type { PaymentMethod, OrderType } from "@/lib/pos/types";

interface PaymentColumnProps {
  total: number;
  paymentMethod: PaymentMethod;
  orderType: OrderType;
  tenderedAmount: number;
  cashAmount: number;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onTenderedAmountChange: (amount: number) => void;
  onCashAmountChange: (amount: number) => void;
}

const PAYMENT_METHODS: { method: PaymentMethod; label: string }[] = [
  { method: "cash", label: "Cash" },
  { method: "card", label: "Card" },
  { method: "both", label: "Both (Split)" },
  { method: "pay_later", label: "Pay Later" },
];

const QUICK_ADD = [10, 20, 50];

export function PaymentColumn({
  total,
  paymentMethod,
  orderType,
  tenderedAmount,
  cashAmount,
  onPaymentMethodChange,
  onTenderedAmountChange,
  onCashAmountChange,
}: PaymentColumnProps) {
  const isPayLaterDisabled = orderType === "takeaway" || orderType === "self_pickup";
  const change = tenderedAmount - total;
  const cardAmount = total - cashAmount;

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-primary/40" />
        Payment
      </h3>

      {/* Total display */}
      <div className="mb-4 rounded-2xl border-2 border-dotted border-violet-200/60 bg-gradient-to-br from-violet-50 to-blue-50/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">Total Amount</p>
        <p className="text-2xl font-bold text-primary/85">{total.toFixed(2)} SAR</p>
      </div>

      {/* Payment method buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {PAYMENT_METHODS.map(({ method, label }) => {
          const disabled = method === "pay_later" && isPayLaterDisabled;
          return (
            <button
              key={method}
              disabled={disabled}
              onClick={() => onPaymentMethodChange(method)}
              className={cn(
                "rounded-2xl border-2 px-3 py-3 text-xs font-semibold transition-all min-h-[48px]",
                "hover:border-primary/50 active:scale-95",
                disabled && "opacity-40 cursor-not-allowed",
                paymentMethod === method
                  ? "border-primary bg-gradient-to-br from-primary/5 to-violet-50 text-primary shadow-md shadow-primary/10"
                  : "border-dotted border-violet-200/60 text-foreground"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Dynamic fields */}
      {paymentMethod === "cash" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-semibold">Tendered Amount</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={tenderedAmount || ""}
              onChange={(e) => onTenderedAmountChange(parseFloat(e.target.value) || 0)}
              className="h-12 text-lg font-bold text-center rounded-xl border-violet-200/60"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-2">
            {QUICK_ADD.map((amt) => (
              <TouchButton
                key={amt}
                variant="outline"
                size="sm"
                className="flex-1 min-h-[40px] text-xs font-semibold rounded-xl border-violet-200/60"
                onClick={() => onTenderedAmountChange(tenderedAmount + amt)}
              >
                +{amt}
              </TouchButton>
            ))}
            <TouchButton
              variant="outline"
              size="sm"
              className="flex-1 min-h-[40px] text-xs font-semibold rounded-xl border-violet-200/60"
              onClick={() => onTenderedAmountChange(Math.ceil(total))}
            >
              Exact
            </TouchButton>
          </div>

          <div
            className={cn(
              "rounded-xl p-3 text-center font-bold",
              change >= 0
                ? "bg-emerald-50/80 text-emerald-600"
                : "bg-red-50/80 text-red-500"
            )}
          >
            <p className="text-xs font-normal text-muted-foreground">Change</p>
            <p className="text-lg">{change >= 0 ? change.toFixed(2) : `(${Math.abs(change).toFixed(2)})`} SAR</p>
          </div>
        </div>
      )}

      {paymentMethod === "both" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-semibold">Cash Amount</Label>
            <Input
              type="number"
              min={0}
              max={total}
              step={0.01}
              value={cashAmount || ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                onCashAmountChange(Math.min(val, total));
              }}
              className="h-11 text-base font-bold text-center rounded-xl border-violet-200/60"
              placeholder="0.00"
            />
          </div>
          <div className="rounded-xl border-2 border-dotted border-violet-200/60 bg-violet-50/20 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Card Amount</span>
              <span className="font-bold">{cardAmount >= 0 ? cardAmount.toFixed(2) : "0.00"} SAR</span>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "pay_later" && (
        <div className="rounded-xl border-2 border-dotted border-amber-200/60 bg-amber-50/50 p-3 text-center text-sm text-amber-700">
          Payment will be collected later. Order will be marked as pending.
        </div>
      )}

      {paymentMethod === "card" && (
        <div className="rounded-xl border-2 border-dotted border-violet-200/60 bg-violet-50/20 p-3 text-center text-sm text-muted-foreground">
          Card payment — charge {total.toFixed(2)} SAR
        </div>
      )}
    </div>
  );
}
