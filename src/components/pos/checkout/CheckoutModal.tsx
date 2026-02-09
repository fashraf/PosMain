import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TouchButton } from "@/components/pos/shared";
import { OrderReviewColumn } from "./OrderReviewColumn";
import { OrderTypeColumn } from "./OrderTypeColumn";
import { PaymentColumn } from "./PaymentColumn";
import { OrderConfirmation } from "./OrderConfirmation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { POSCartHook } from "@/hooks/pos";
import type { OrderType, PaymentMethod, CheckoutFormData } from "@/lib/pos/types";
import type { Json } from "@/integrations/supabase/types";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: POSCartHook;
  onOrderComplete: () => void;
  onEditCustomization: (cartItemId: string) => void;
}

export function CheckoutModal({
  open,
  onOpenChange,
  cart,
  onOrderComplete,
  onEditCustomization,
}: CheckoutModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderNumber: number; itemCount: number; total: number } | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    orderType: "dine_in",
    customerMobile: "",
    customerName: "",
    deliveryAddress: "",
    paymentMethod: "cash",
    tenderedAmount: 0,
    cashAmount: 0,
    takenBy: "",
    notes: "",
  });

  const canSubmit = () => {
    if (cart.isEmpty) return false;
    if (formData.orderType === "delivery" && !formData.deliveryAddress.trim()) return false;
    if (formData.paymentMethod === "cash" && formData.tenderedAmount < cart.total) return false;
    if (formData.paymentMethod === "both" && (formData.cashAmount <= 0 || formData.cashAmount > cart.total)) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      if (formData.orderType === "delivery" && !formData.deliveryAddress.trim()) {
        setShowAddressError(true);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id || "")
        .single();

      const paymentStatus = formData.paymentMethod === "pay_later" ? "pending" : "paid";
      const paymentMethodDb =
        formData.paymentMethod === "both"
          ? "both"
          : formData.paymentMethod === "pay_later"
          ? null
          : formData.paymentMethod;

      const { data: order, error: orderError } = await supabase
        .from("pos_orders")
        .insert({
          order_type: formData.orderType,
          customer_mobile: formData.customerMobile || null,
          customer_name: formData.customerName || null,
          delivery_address: formData.orderType === "delivery" ? formData.deliveryAddress : null,
          subtotal: cart.subtotal,
          vat_rate: cart.vatRate,
          vat_amount: cart.vatAmount,
          total_amount: cart.total,
          payment_status: paymentStatus,
          payment_method: paymentMethodDb,
          tendered_amount: formData.paymentMethod === "cash" ? formData.tenderedAmount : 0,
          change_amount: formData.paymentMethod === "cash" ? Math.max(0, formData.tenderedAmount - cart.total) : 0,
          taken_by: profile?.id || null,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItemId,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.basePrice,
        customization_json: JSON.parse(JSON.stringify(item.customization)) as Json,
        customization_hash: item.customizationHash,
        line_total: item.lineTotal,
      }));

      const { error: itemsError } = await supabase
        .from("pos_order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderResult({
        orderNumber: order.order_number,
        itemCount: cart.items.length,
        total: cart.total,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    setOrderResult(null);
    setFormData({
      orderType: "dine_in",
      customerMobile: "",
      customerName: "",
      deliveryAddress: "",
      paymentMethod: "cash",
      tenderedAmount: 0,
      cashAmount: 0,
      takenBy: "",
      notes: "",
    });
    onOrderComplete();
  };

  const handleClearOrder = () => {
    if (showConfirmClear) {
      cart.clearCart();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      setTimeout(() => setShowConfirmClear(false), 3000);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOrderResult(null);
      setShowConfirmClear(false);
      setShowAddressError(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl font-bold">Complete Order</DialogTitle>
        </DialogHeader>

        {orderResult ? (
          <OrderConfirmation
            orderNumber={orderResult.orderNumber}
            itemCount={orderResult.itemCount}
            total={orderResult.total}
            onNewOrder={handleNewOrder}
          />
        ) : (
          <>
            {/* 3-column grid */}
            <div className="flex-1 overflow-hidden grid grid-cols-12 divide-x">
              <div className="col-span-4 p-4 flex flex-col overflow-hidden">
                <OrderReviewColumn
                  items={cart.items}
                  subtotal={cart.subtotal}
                  vatRate={cart.vatRate}
                  vatAmount={cart.vatAmount}
                  total={cart.total}
                  onIncrement={cart.incrementItem}
                  onDecrement={cart.decrementItem}
                  onEditCustomization={onEditCustomization}
                />
              </div>

              <div className="col-span-4 p-4 flex flex-col overflow-auto bg-muted/20">
                <OrderTypeColumn
                  selected={formData.orderType}
                  onChange={(type) => {
                    setFormData((prev) => ({
                      ...prev,
                      orderType: type,
                      paymentMethod:
                        (type === "takeaway" || type === "self_pickup") && prev.paymentMethod === "pay_later"
                          ? "cash"
                          : prev.paymentMethod,
                    }));
                    setShowAddressError(false);
                  }}
                  customerMobile={formData.customerMobile}
                  customerName={formData.customerName}
                  deliveryAddress={formData.deliveryAddress}
                  onMobileChange={(v) => setFormData((p) => ({ ...p, customerMobile: v }))}
                  onNameChange={(v) => setFormData((p) => ({ ...p, customerName: v }))}
                  onAddressChange={(v) => setFormData((p) => ({ ...p, deliveryAddress: v }))}
                  showAddressError={showAddressError}
                />
              </div>

              <div className="col-span-4 p-4 flex flex-col overflow-auto">
                <PaymentColumn
                  total={cart.total}
                  paymentMethod={formData.paymentMethod}
                  orderType={formData.orderType}
                  tenderedAmount={formData.tenderedAmount}
                  cashAmount={formData.cashAmount}
                  onPaymentMethodChange={(m) => setFormData((p) => ({ ...p, paymentMethod: m }))}
                  onTenderedAmountChange={(a) => setFormData((p) => ({ ...p, tenderedAmount: a }))}
                  onCashAmountChange={(a) => setFormData((p) => ({ ...p, cashAmount: a }))}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t shrink-0">
              <TouchButton
                variant="outline"
                className={showConfirmClear ? "border-destructive text-destructive" : ""}
                onClick={handleClearOrder}
              >
                {showConfirmClear ? "Confirm Clear?" : "Clear Order"}
              </TouchButton>
              <TouchButton
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className="min-w-[200px] h-12 text-base font-semibold"
              >
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </TouchButton>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
