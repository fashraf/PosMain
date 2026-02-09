import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Plus, Minus, Pencil, ShoppingCart, XCircle, Banknote, CreditCard, Clock } from "lucide-react";
import { PaymentReconciliationCard } from "@/components/pos/checkout/PaymentReconciliationCard";
import { TouchButton } from "@/components/pos/shared";
import { CancelOrderModal } from "@/components/pos/modals/CancelOrderModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  name: string;
  quantity: number;
  basePrice: number;
  lineTotal: number;
}

interface OrderChange {
  type: "added" | "removed";
  items: string[];
}

interface OrderCompleteState {
  mode: "new" | "update";
  orderId: string;
  orderNumber: number;
  items: OrderItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  orderType: string;
  paymentMethod: string;
  paymentStatus: string;
  tenderedAmount: number;
  changeAmount: number;
  cashAmount: number;
  cardAmount: number;
  changes?: OrderChange[];
  previousTotal?: number;
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
  self_pickup: "Self Pickup",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  both: "Cash + Card",
  pay_later: "Pay Later",
};

export default function OrderComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderCompleteState | null;
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!state) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No order data found.</p>
          <TouchButton onClick={() => navigate("/pos")} className="rounded-xl">
            Back to POS
          </TouchButton>
        </div>
      </div>
    );
  }

  const isUpdate = state.mode === "update";

  const handleCancelOrder = async (reason: string) => {
    setIsCancelling(true);
    try {
      const { error } = await supabase
        .from("pos_orders")
        .update({
          payment_status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancel_reason: reason,
        })
        .eq("id", state.orderId);

      if (error) throw error;

      toast({ title: "Order Cancelled", description: `Order #${state.orderNumber} has been cancelled.` });
      navigate("/pos");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to cancel order", variant: "destructive" });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 overflow-auto">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 p-5 shadow-sm">
            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-foreground/80">
              {isUpdate ? "Order Updated" : "New Order Created"}
            </h2>
            <p className="text-3xl font-bold text-primary/85">
              Order #{state.orderNumber}
            </p>
          </div>
        </div>

        {/* Change summary for updates */}
        {isUpdate && state.changes && state.changes.length > 0 && (
          <div className="rounded-2xl border border-dotted border-violet-200/60 bg-violet-50/20 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground/70">Edit Summary</h3>
            {state.changes.map((change, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {change.type === "added" ? (
                  <Plus className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <Minus className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                )}
                <span className="text-foreground/70">
                  {change.type === "added" ? "Added" : "Removed"}{" "}
                  {change.items.length} item{change.items.length !== 1 ? "s" : ""}:{" "}
                  <span className="font-medium text-foreground/80">
                    {change.items.join(", ")}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="flex justify-center gap-2">
          <span className="rounded-full bg-violet-100/60 px-3 py-1 text-xs font-medium text-violet-700">
            {ORDER_TYPE_LABELS[state.orderType] || state.orderType}
          </span>
          <span className="rounded-full bg-blue-100/60 px-3 py-1 text-xs font-medium text-blue-700">
            {PAYMENT_LABELS[state.paymentMethod] || state.paymentMethod}
          </span>
        </div>

        {/* Items table */}
        <div className="rounded-2xl border border-dotted border-violet-200/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-violet-50/40 text-muted-foreground text-xs">
                <th className="text-left px-4 py-2 font-medium">Item</th>
                <th className="text-center px-2 py-2 font-medium">Qty</th>
                <th className="text-right px-2 py-2 font-medium">Price</th>
                <th className="text-right px-4 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((item, i) => (
                <tr key={i} className="border-t border-dotted border-violet-100/60">
                  <td className="px-4 py-2 text-foreground/80">{item.name}</td>
                  <td className="px-2 py-2 text-center text-foreground/60">{item.quantity}</td>
                  <td className="px-2 py-2 text-right text-foreground/60">{item.basePrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-medium text-foreground/80">{item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="rounded-2xl border border-dotted border-violet-200/60 bg-gradient-to-br from-violet-50/40 to-transparent p-4 space-y-1 text-sm">
          <div className="flex justify-between text-foreground/60">
            <span>Subtotal</span>
            <span>{state.subtotal.toFixed(2)} SAR</span>
          </div>
          <div className="flex justify-between text-foreground/60">
            <span>VAT (15%)</span>
            <span>{state.vatAmount.toFixed(2)} SAR</span>
          </div>
          <div className="border-t border-dotted border-violet-200/60 pt-2 mt-2 flex justify-between text-base font-bold text-foreground/80">
            <span>Total</span>
            <span>{state.total.toFixed(2)} SAR</span>
          </div>
        </div>

        {/* Payment Reconciliation (edit mode only) */}
        {isUpdate && state.previousTotal != null && (
          <PaymentReconciliationCard
            previousTotal={state.previousTotal}
            currentTotal={state.total}
          />
        )}

        {/* Payment Details */}
        <PaymentDetailsCard state={state} />

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2">
          <TouchButton
            variant="outline"
            className="min-w-[120px] rounded-xl shadow-sm border-violet-200 text-violet-700 hover:bg-violet-50"
            onClick={() => navigate("/pos", { state: { editOrderId: state.orderId } })}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Order
          </TouchButton>
          <TouchButton
            className="min-w-[120px] rounded-xl shadow-sm"
            onClick={() => navigate("/pos")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Order
          </TouchButton>
          <TouchButton
            variant="outline"
            className="min-w-[120px] rounded-xl shadow-sm border-destructive/40 text-destructive hover:bg-destructive/5"
            onClick={() => setShowCancel(true)}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Order
          </TouchButton>
        </div>
      </div>

      <CancelOrderModal
        open={showCancel}
        onOpenChange={setShowCancel}
        onConfirm={handleCancelOrder}
        isSubmitting={isCancelling}
      />
    </div>
  );
}

function PaymentDetailsCard({ state }: { state: OrderCompleteState }) {
  const { paymentMethod } = state;
  const total = state.total ?? 0;
  const tenderedAmount = state.tenderedAmount ?? 0;
  const changeAmount = state.changeAmount ?? 0;
  const cashAmount = state.cashAmount ?? 0;
  const cardAmount = state.cardAmount ?? 0;

  if (paymentMethod === "pay_later") {
    return (
      <div className="rounded-2xl border border-dotted border-amber-200/60 bg-amber-50/30 p-4 space-y-1 text-sm">
        <div className="flex items-center gap-2 font-semibold text-amber-700">
          <Clock className="h-4 w-4" />
          Payment Pending
        </div>
        <p className="text-amber-600/80 text-xs">Customer has not yet paid. Amount due: {total.toFixed(2)} SAR</p>
      </div>
    );
  }

  if (paymentMethod === "card") {
    return (
      <div className="rounded-2xl border border-dotted border-violet-200/60 bg-violet-50/20 p-4 space-y-1 text-sm">
        <div className="flex items-center gap-2 font-semibold text-foreground/70">
          <CreditCard className="h-4 w-4" />
          Payment Details
        </div>
        <div className="flex justify-between text-foreground/60">
          <span>Charged to Card</span>
          <span className="font-medium text-foreground/80">{total.toFixed(2)} SAR</span>
        </div>
      </div>
    );
  }

  if (paymentMethod === "both") {
    return (
      <div className="rounded-2xl border border-dotted border-violet-200/60 bg-violet-50/20 p-4 space-y-1 text-sm">
        <div className="flex items-center gap-2 font-semibold text-foreground/70">
          <Banknote className="h-4 w-4" />
          Payment Details — Split
        </div>
        <div className="flex justify-between text-foreground/60">
          <span>Cash Portion</span>
          <span className="font-medium text-foreground/80">{cashAmount.toFixed(2)} SAR</span>
        </div>
        <div className="flex justify-between text-foreground/60">
          <span>Card Portion</span>
          <span className="font-medium text-foreground/80">{cardAmount.toFixed(2)} SAR</span>
        </div>
      </div>
    );
  }

  // Default: cash
  return (
    <div className="rounded-2xl border border-dotted border-violet-200/60 bg-violet-50/20 p-4 space-y-1 text-sm">
      <div className="flex items-center gap-2 font-semibold text-foreground/70">
        <Banknote className="h-4 w-4" />
        Payment Details
      </div>
      <div className="flex justify-between text-foreground/60">
        <span>Tendered</span>
        <span className="font-medium text-foreground/80">{tenderedAmount.toFixed(2)} SAR</span>
      </div>
      <div className="flex justify-between text-emerald-600">
        <span>Change Given</span>
        <span className="font-semibold">{changeAmount.toFixed(2)} SAR</span>
      </div>
    </div>
  );
}
