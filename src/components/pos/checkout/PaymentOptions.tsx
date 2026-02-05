import React from "react";
import { cn } from "@/lib/utils";
import { Banknote, Clock } from "lucide-react";

interface PaymentOptionsProps {
  selected: "now" | "later";
  onChange: (method: "now" | "later") => void;
}

export function PaymentOptions({ selected, onChange }: PaymentOptionsProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
        Payment
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("now")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border-2 p-4",
            "touch-manipulation transition-colors active:scale-95",
            selected === "now"
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted-foreground/30 text-muted-foreground"
          )}
        >
          <Banknote className="h-5 w-5" />
          <span className="font-medium">Pay Now</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("later")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border-2 p-4",
            "touch-manipulation transition-colors active:scale-95",
            selected === "later"
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted-foreground/30 text-muted-foreground"
          )}
        >
          <Clock className="h-5 w-5" />
          <span className="font-medium">Pay Later</span>
        </button>
      </div>
    </div>
  );
}
