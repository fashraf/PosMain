import React from "react";
import { cn } from "@/lib/utils";
import { CreditCard, Truck, ShoppingBag, UtensilsCrossed } from "lucide-react";
import type { OrderType } from "@/lib/pos/types";

interface OrderTypeSelectorProps {
  selected: OrderType;
  onChange: (type: OrderType) => void;
}

const ORDER_TYPES: Array<{
  value: OrderType;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "dine_in" as OrderType, label: "Pay & Order", icon: <CreditCard className="h-4 w-4" /> },
  { value: "delivery", label: "Delivery", icon: <Truck className="h-4 w-4" /> },
  { value: "takeaway", label: "Take Away", icon: <ShoppingBag className="h-4 w-4" /> },
  { value: "dine_in", label: "Dine-In", icon: <UtensilsCrossed className="h-4 w-4" /> },
];

export function OrderTypeSelector({
  selected,
  onChange,
}: OrderTypeSelectorProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
        Order Type
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {ORDER_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border-2 p-3",
              "touch-manipulation transition-colors active:scale-95",
              selected === type.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {type.icon}
            <span className="text-xs font-medium">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
