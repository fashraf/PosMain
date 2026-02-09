import React from "react";
import { UtensilsCrossed, ShoppingBag, Package, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { OrderType } from "@/lib/pos/types";

interface OrderTypeColumnProps {
  selected: OrderType;
  onChange: (type: OrderType) => void;
  customerMobile: string;
  customerName: string;
  deliveryAddress: string;
  onMobileChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  showAddressError: boolean;
}

const ORDER_TYPES: { type: OrderType; label: string; icon: React.ElementType }[] = [
  { type: "dine_in", label: "Dine In", icon: UtensilsCrossed },
  { type: "takeaway", label: "Take Away", icon: ShoppingBag },
  { type: "self_pickup", label: "Self Pickup", icon: Package },
  { type: "delivery", label: "Delivery", icon: Truck },
];

export function OrderTypeColumn({
  selected,
  onChange,
  customerMobile,
  customerName,
  deliveryAddress,
  onMobileChange,
  onNameChange,
  onAddressChange,
  showAddressError,
}: OrderTypeColumnProps) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-primary/40" />
        Order Type
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {ORDER_TYPES.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all min-h-[80px]",
              "hover:border-primary/50 active:scale-95",
              selected === type
                ? "border-primary bg-gradient-to-br from-primary/5 to-violet-50 shadow-md shadow-primary/10"
                : "border-dotted border-violet-200/60 bg-background"
            )}
          >
            <Icon className={cn("h-6 w-6", selected === type ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-xs font-semibold", selected === type ? "text-primary" : "text-foreground")}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Delivery address */}
      {selected === "delivery" && (
        <div className="mt-4 rounded-xl border-2 border-dotted border-violet-200/60 bg-violet-50/20 p-3 space-y-1.5">
          <Label className="text-xs font-semibold">
            Delivery Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Enter delivery address..."
            value={deliveryAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            className={cn(
              "min-h-[60px] text-sm rounded-xl border-violet-200/60",
              showAddressError && !deliveryAddress.trim() && "border-destructive"
            )}
          />
          {showAddressError && !deliveryAddress.trim() && (
            <p className="text-xs text-destructive">Address is required for delivery orders</p>
          )}
        </div>
      )}

      {/* Customer details */}
      <div className="mt-4 rounded-xl border-2 border-dotted border-violet-200/60 bg-violet-50/10 p-3 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Customer Details
        </h4>
        <div className="space-y-2">
          <div>
            <Label className="text-xs">Mobile</Label>
            <Input
              placeholder="05XXXXXXXX"
              value={customerMobile}
              onChange={(e) => onMobileChange(e.target.value)}
              className="h-10 text-sm rounded-xl border-violet-200/60"
            />
          </div>
          <div>
            <Label className="text-xs">Name</Label>
            <Input
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => onNameChange(e.target.value)}
              className="h-10 text-sm rounded-xl border-violet-200/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
