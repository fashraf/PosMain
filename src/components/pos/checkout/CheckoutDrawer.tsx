import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { TouchButton } from "@/components/pos/shared";
import { OrderSummary } from "./OrderSummary";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { CustomerForm } from "./CustomerForm";
import { PaymentOptions } from "./PaymentOptions";
import { OrderTakenBy } from "./OrderTakenBy";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { POSCartHook } from "@/hooks/pos";
import type { OrderType, CheckoutFormData } from "@/lib/pos/types";
import type { Json } from "@/integrations/supabase/types";

interface CheckoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: POSCartHook;
  onOrderComplete: () => void;
}

export function CheckoutDrawer({
  open,
  onOpenChange,
  cart,
  onOrderComplete,
}: CheckoutDrawerProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    orderType: "pay_order",
    customerMobile: "",
    customerName: "",
    paymentMethod: "now",
    takenBy: "",
    notes: "",
  });

  const handleOrderTypeChange = (type: OrderType) => {
    setFormData((prev) => ({ ...prev, orderType: type }));
  };

  const handlePaymentMethodChange = (method: "now" | "later") => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handlePlaceOrder = async () => {
    if (cart.isEmpty) return;

    setIsSubmitting(true);

    try {
      // Get user's profile ID
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id || "")
        .single();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("pos_orders")
        .insert({
          order_type: formData.orderType,
          customer_mobile: formData.customerMobile || null,
          customer_name: formData.customerName || null,
          subtotal: cart.subtotal,
          vat_rate: cart.vatRate,
          vat_amount: cart.vatAmount,
          total_amount: cart.total,
          payment_status: formData.paymentMethod === "now" ? "paid" : "pending",
          payment_method: formData.paymentMethod === "now" ? "cash" : null,
          taken_by: profile?.id || null,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
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

      toast({
        title: "Order placed!",
        description: `Order #${order.order_number} created successfully.`,
      });

      onOrderComplete();
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>Checkout</DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 py-4">
            {/* Order Summary */}
            <OrderSummary
              items={cart.items}
              subtotal={cart.subtotal}
              vatRate={cart.vatRate}
              vatAmount={cart.vatAmount}
              total={cart.total}
            />

            {/* Order Type */}
            <OrderTypeSelector
              selected={formData.orderType}
              onChange={handleOrderTypeChange}
            />

            {/* Customer Details */}
            <CustomerForm
              mobile={formData.customerMobile}
              name={formData.customerName}
              onMobileChange={(value) =>
                setFormData((prev) => ({ ...prev, customerMobile: value }))
              }
              onNameChange={(value) =>
                setFormData((prev) => ({ ...prev, customerName: value }))
              }
            />

            {/* Payment Options */}
            <PaymentOptions
              selected={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
            />

            {/* Order Taken By */}
            <OrderTakenBy userName={user?.email || "Unknown"} />
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t">
          <TouchButton
            onClick={handlePlaceOrder}
            disabled={cart.isEmpty || isSubmitting}
            className="h-14 w-full text-base font-semibold"
          >
            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
          </TouchButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
