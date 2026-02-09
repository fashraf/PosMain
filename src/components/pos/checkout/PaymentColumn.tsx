import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TouchButton } from "@/components/pos/shared";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";
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
  previousTotal?: number;
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
  previousTotal,
}: PaymentColumnProps) {
  const isEditMode = previousTotal != null;
  const balanceDue = isEditMode ? total - previousTotal : total;
  const isPayLaterDisabled = orderType === "takeaway" || orderType === "self_pickup";

  // For edit mode with no additional payment needed
  if (isEditMode && balanceDue <= 0.01) {
    const isRefund = balanceDue < -0.01;
    const absDiff = Math.abs(balanceDue);

    return (
      <div className="flex h-full flex-col">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary/40" />
          Payment
        </h3>

        {/* Total display */}
        <div className="mb-4 rounded-2xl border-2 border-dotted border-violet-200/60 bg-gradient-to-br from-violet-50 to-blue-50/30 p-3 text-center">
          <p className="text-xs text-muted-foreground">New Total</p>
          <p className="text-2xl font-bold text-primary/85">{total.toFixed(2)} SAR</p>
          <p className="text-xs text-muted-foreground mt-1">Previous: {previousTotal.toFixed(2)} SAR</p>
        </div>

        {/* Reconciliation banner */}
        {isRefund ? (
          <div className="rounded-2xl border-2 border-emerald-300/70 bg-emerald-50/40 p-5 flex items-center gap-4">
            <div className="rounded-full bg-emerald-100 p-3 shrink-0">
              <TrendingDown className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700/80">Refund to Customer</p>
              <p className="text-2xl font-bold text-emerald-700">
                Return {absDiff.toFixed(2)} SAR
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-violet-200/60 bg-violet-50/20 p-5 flex items-center gap-4">
            <div className="rounded-full bg-violet-100 p-3 shrink-0">
              <CheckCircle2 className="h-7 w-7 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">No Payment Action Needed</p>
              <p className="text-lg font-semibold text-foreground/70">Totals match — no change required</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Normal mode OR edit mode with balance > 0
  const effectiveAmount = isEditMode ? balanceDue : total;
  const change = tenderedAmount - effectiveAmount;
  const cardAmount = effectiveAmount - cashAmount;

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-primary/40" />
        Payment
      </h3>

      {/* Total display */}
      <div className="mb-4 rounded-2xl border-2 border-dotted border-violet-200/60 bg-gradient-to-br from-violet-50 to-blue-50/30 p-3 text-center">
        {isEditMode ? (
          <>
            <p className="text-xs text-muted-foreground">New Total</p>
            <p className="text-lg font-bold text-primary/85">{total.toFixed(2)} SAR</p>
            <p className="text-xs text-muted-foreground mt-1">Previous: {previousTotal!.toFixed(2)} SAR</p>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary/85">{total.toFixed(2)} SAR</p>
          </>
        )}
      </div>

      {/* Additional payment banner for edit mode */}
      {isEditMode && (
        <div className="mb-4 rounded-2xl border-2 border-orange-300/70 bg-orange-50/40 p-4 flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-2.5 shrink-0">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-orange-700/80">Additional Payment</p>
            <p className="text-xl font-bold text-orange-700">
              Collect {effectiveAmount.toFixed(2)} SAR
            </p>
          </div>
        </div>
      )}

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
              onClick={() => onTenderedAmountChange(Math.ceil(effectiveAmount))}
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
              max={effectiveAmount}
              step={0.01}
              value={cashAmount || ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                onCashAmountChange(Math.min(val, effectiveAmount));
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
          Card payment — charge {effectiveAmount.toFixed(2)} SAR
        </div>
      )}
    </div>
  );
}
