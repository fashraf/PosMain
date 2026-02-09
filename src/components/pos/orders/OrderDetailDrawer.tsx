import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderRow } from "@/hooks/pos/usePOSOrders";
import {
  Banknote, CreditCard, Clock, MapPin, User, Phone,
  Printer, ChefHat, Pencil, XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { TouchButton } from "@/components/pos/shared";

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
  self_pickup: "Self Pickup",
};

interface OrderDetailDrawerProps {
  order: OrderRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (order: OrderRow) => void;
  onCollectPayment?: (order: OrderRow) => void;
  onCancel?: (order: OrderRow) => void;
}

export function OrderDetailDrawer({
  order, open, onOpenChange, onEdit, onCollectPayment, onCancel,
}: OrderDetailDrawerProps) {
  if (!order) return null;

  const isUnpaid = order.payment_status === "pending";
  const isCancelled = order.payment_status === "cancelled";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[50vw] sm:max-w-[50vw] overflow-hidden p-0 pos-orders-font flex flex-col">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="text-slate-800">Order #{order.order_number}</span>
            <OrderStatusBadge status={order.payment_status} />
          </SheetTitle>
          <div className="flex gap-2 text-xs text-slate-500">
            <span>{ORDER_TYPE_LABELS[order.order_type] || order.order_type}</span>
            <span>•</span>
            <span>{format(new Date(order.created_at), "MMM d, h:mm a")}</span>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Customer info */}
          {(order.customer_name || order.customer_mobile || order.delivery_address) && (
            <div className="rounded-lg border border-slate-200 p-3 space-y-1.5 text-sm">
              {order.customer_name && (
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-3.5 w-3.5" /> {order.customer_name}
                </div>
              )}
              {order.customer_mobile && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-3.5 w-3.5" /> {order.customer_mobile}
                </div>
              )}
              {order.delivery_address && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-3.5 w-3.5" /> {order.delivery_address}
                </div>
              )}
            </div>
          )}

          {/* Section 1: Items */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Order Items</h3>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="text-left px-3 py-2 font-medium">Item</th>
                    <th className="text-center px-2 py-2 font-medium">Qty</th>
                    <th className="text-right px-3 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const cust = item.customization_json;
                    const removed: string[] = cust?.removedIngredients || [];
                    const added: string[] = (cust?.addedIngredients || []).map((a: any) => a.name || a);

                    return (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-3 py-2">
                          <div className="text-slate-700 font-medium">{item.item_name}</div>
                          {(removed.length > 0 || added.length > 0) && (
                            <div className="text-xs mt-0.5 space-y-0.5">
                              {removed.map((r, i) => <div key={i} className="text-red-400">– No {r}</div>)}
                              {added.map((a, i) => <div key={i} className="text-emerald-500">+ Extra {a}</div>)}
                            </div>
                          )}
                        </td>
                        <td className="text-center px-2 py-2 text-slate-500">{item.quantity}</td>
                        <td className="text-right px-3 py-2 font-medium tabular-nums text-slate-700">{item.line_total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Payment */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Payment</h3>
            <div className="rounded-lg border border-slate-200 p-3 space-y-1 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{order.subtotal.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>VAT ({order.vat_rate}%)</span>
                <span>{order.vat_amount.toFixed(2)} SAR</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 mt-1.5 flex justify-between font-bold text-slate-800">
                <span>Total</span>
                <span>{order.total_amount.toFixed(2)} SAR</span>
              </div>

              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  {order.payment_method === "card" ? (
                    <CreditCard className="h-4 w-4" />
                  ) : order.payment_status === "pending" ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <Banknote className="h-4 w-4" />
                  )}
                  <span className="capitalize font-medium">{order.payment_method || "Pending"}</span>
                </div>
                {order.tendered_amount != null && order.tendered_amount > 0 && (
                  <div className="flex justify-between text-slate-500 text-xs mt-1">
                    <span>Tendered</span>
                    <span>{order.tendered_amount.toFixed(2)} SAR</span>
                  </div>
                )}
                {order.change_amount != null && order.change_amount > 0 && (
                  <div className="flex justify-between text-emerald-600 text-xs mt-1">
                    <span>Change</span>
                    <span>{order.change_amount.toFixed(2)} SAR</span>
                  </div>
                )}
              </div>

              {isUnpaid && onCollectPayment && (
                <TouchButton
                  className="w-full h-10 rounded-lg mt-3 text-sm font-semibold"
                  onClick={() => { onOpenChange(false); onCollectPayment(order); }}
                >
                  Mark as Paid
                </TouchButton>
              )}
            </div>
          </div>

          {/* Cancel reason */}
          {order.cancel_reason && (
            <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 text-sm">
              <div className="font-medium text-red-600 text-xs mb-1">Cancel Reason</div>
              <p className="text-slate-600">{order.cancel_reason}</p>
            </div>
          )}

          {order.notes && (
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="font-medium text-xs text-slate-500 mb-1">Notes</div>
              <p className="text-slate-600">{order.notes}</p>
            </div>
          )}

          {/* Cashier */}
          {order.cashier_name && (
            <div className="text-xs text-slate-400">
              Created by: <span className="font-medium text-slate-600">{order.cashier_name}</span>
            </div>
          )}
        </div>

        {/* Section 3: Actions (sticky bottom) */}
        <div className="shrink-0 border-t border-slate-200 bg-[#F8FAFC] px-5 py-3">
          <div className="grid grid-cols-2 gap-2">
            <TouchButton variant="outline" className="h-10 rounded-lg gap-2 text-sm border-slate-200 text-slate-600">
              <Printer className="h-4 w-4" /> Print Bill
            </TouchButton>
            <TouchButton variant="outline" className="h-10 rounded-lg gap-2 text-sm border-slate-200 text-slate-600">
              <ChefHat className="h-4 w-4" /> Print Kitchen
            </TouchButton>
            {!isCancelled && onEdit && (
              <TouchButton
                variant="outline"
                className="h-10 rounded-lg gap-2 text-sm border-slate-200 text-slate-600"
                onClick={() => { onOpenChange(false); onEdit(order); }}
              >
                <Pencil className="h-4 w-4" /> Edit Order
              </TouchButton>
            )}
            {!isCancelled && onCancel && (
              <TouchButton
                variant="outline"
                className="h-10 rounded-lg gap-2 text-sm border-slate-200 text-red-500 hover:text-red-600"
                onClick={() => { onOpenChange(false); onCancel(order); }}
              >
                <XCircle className="h-4 w-4" /> Cancel Order
              </TouchButton>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
