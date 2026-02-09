import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Plus, Minus, Printer } from "lucide-react";
import { TouchButton } from "@/components/pos/shared";

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
  orderNumber: number;
  items: OrderItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  orderType: string;
  paymentMethod: string;
  changes?: OrderChange[];
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

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2">
          <TouchButton variant="outline" className="min-w-[140px] rounded-xl shadow-sm" disabled>
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </TouchButton>
          <TouchButton className="min-w-[140px] rounded-xl shadow-sm" onClick={() => navigate("/pos")}>
            New Order
          </TouchButton>
        </div>
      </div>
    </div>
  );
}
