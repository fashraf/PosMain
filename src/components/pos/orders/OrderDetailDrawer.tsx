import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderRow } from "@/hooks/pos/usePOSOrders";
import { Banknote, CreditCard, Clock, MapPin, User, Phone } from "lucide-react";
import { format } from "date-fns";

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
}

export function OrderDetailDrawer({ order, open, onOpenChange }: OrderDetailDrawerProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:max-w-[420px] overflow-y-auto p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <SheetTitle className="flex items-center justify-between">
            <span>Order #{order.order_number}</span>
            <OrderStatusBadge status={order.payment_status} />
          </SheetTitle>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{ORDER_TYPE_LABELS[order.order_type] || order.order_type}</span>
            <span>•</span>
            <span>{format(new Date(order.created_at), "MMM d, h:mm a")}</span>
          </div>
        </SheetHeader>

        <div className="p-5 space-y-5">
          {/* Customer info */}
          {(order.customer_name || order.customer_mobile || order.delivery_address) && (
            <div className="rounded-xl border border-dotted border-border p-3 space-y-1.5 text-sm">
              {order.customer_name && (
                <div className="flex items-center gap-2 text-foreground/70">
                  <User className="h-3.5 w-3.5" />
                  {order.customer_name}
                </div>
              )}
              {order.customer_mobile && (
                <div className="flex items-center gap-2 text-foreground/70">
                  <Phone className="h-3.5 w-3.5" />
                  {order.customer_mobile}
                </div>
              )}
              {order.delivery_address && (
                <div className="flex items-center gap-2 text-foreground/70">
                  <MapPin className="h-3.5 w-3.5" />
                  {order.delivery_address}
                </div>
              )}
            </div>
          )}

          {/* Items */}
          <div className="rounded-xl border border-dotted border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs">
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
                    <tr key={item.id} className="border-t border-border">
                      <td className="px-3 py-2">
                        <div className="text-foreground/80">{item.item_name}</div>
                        {(removed.length > 0 || added.length > 0) && (
                          <div className="text-xs text-muted-foreground mt-0.5 space-y-0.5">
                            {removed.map((r, i) => (
                              <div key={i}>– {r}</div>
                            ))}
                            {added.map((a, i) => (
                              <div key={i}>+ {a}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="text-center px-2 py-2 text-foreground/60">{item.quantity}</td>
                      <td className="text-right px-3 py-2 font-medium tabular-nums">{item.line_total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="rounded-xl border border-dotted border-border p-3 space-y-1 text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>Subtotal</span>
              <span>{order.subtotal.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>VAT ({order.vat_rate}%)</span>
              <span>{order.vat_amount.toFixed(2)} SAR</span>
            </div>
            <div className="border-t border-border pt-1.5 mt-1.5 flex justify-between font-bold">
              <span>Total</span>
              <span>{order.total_amount.toFixed(2)} SAR</span>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-dotted border-border p-3 space-y-1 text-sm">
            <div className="flex items-center gap-2 font-semibold text-foreground/70 mb-1">
              {order.payment_method === "card" ? (
                <CreditCard className="h-4 w-4" />
              ) : order.payment_status === "pending" ? (
                <Clock className="h-4 w-4" />
              ) : (
                <Banknote className="h-4 w-4" />
              )}
              Payment
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>Method</span>
              <span className="capitalize">{order.payment_method || "Pending"}</span>
            </div>
            {order.tendered_amount != null && order.tendered_amount > 0 && (
              <div className="flex justify-between text-foreground/60">
                <span>Tendered</span>
                <span>{order.tendered_amount.toFixed(2)} SAR</span>
              </div>
            )}
            {order.change_amount != null && order.change_amount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Change</span>
                <span>{order.change_amount.toFixed(2)} SAR</span>
              </div>
            )}
          </div>

          {/* Cashier */}
          {order.cashier_name && (
            <div className="text-xs text-muted-foreground">
              Created by: <span className="font-medium text-foreground/70">{order.cashier_name}</span>
            </div>
          )}

          {/* Cancel reason */}
          {order.cancel_reason && (
            <div className="rounded-xl border border-dotted border-destructive/30 bg-destructive/5 p-3 text-sm">
              <div className="font-medium text-destructive text-xs mb-1">Cancel Reason</div>
              <p className="text-foreground/70">{order.cancel_reason}</p>
            </div>
          )}

          {order.notes && (
            <div className="rounded-xl border border-dotted border-border p-3 text-sm">
              <div className="font-medium text-xs text-muted-foreground mb-1">Notes</div>
              <p className="text-foreground/70">{order.notes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
