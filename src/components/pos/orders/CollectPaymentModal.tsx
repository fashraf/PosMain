import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TouchButton } from "@/components/pos/shared";
import { Input } from "@/components/ui/input";
import { Banknote, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CollectPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: number;
  totalAmount: number;
  onSuccess: () => void;
}

type PayMethod = "cash" | "card" | "both";

export function CollectPaymentModal({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  totalAmount,
  onSuccess,
}: CollectPaymentModalProps) {
  const [method, setMethod] = useState<PayMethod>("cash");
  const [tendered, setTendered] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const change = method === "cash" ? Math.max(0, tendered - totalAmount) : 0;
  const cardPortion = method === "both" ? totalAmount - cashAmount : 0;

  const canSubmit = () => {
    if (method === "cash") return tendered >= totalAmount;
    if (method === "card") return true;
    if (method === "both") return cashAmount > 0 && cashAmount < totalAmount;
    return false;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("pos_orders")
        .update({
          payment_status: "paid",
          payment_method: method === "both" ? "both" : method,
          tendered_amount: method === "cash" ? tendered : method === "both" ? cashAmount : totalAmount,
          change_amount: change,
        })
        .eq("id", orderId);

      if (error) throw error;
      toast({ title: "Payment Collected", description: `Order #${orderNumber} paid.` });
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const methods: { key: PayMethod; label: string; icon: React.ReactNode }[] = [
    { key: "cash", label: "Cash", icon: <Banknote className="h-5 w-5" /> },
    { key: "card", label: "Card", icon: <CreditCard className="h-5 w-5" /> },
    { key: "both", label: "Split", icon: <><Banknote className="h-4 w-4" /><CreditCard className="h-4 w-4" /></> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Collect Payment — Order #{orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="text-center py-3">
          <span className="text-3xl font-bold tabular-nums">{totalAmount.toFixed(2)}</span>
          <span className="text-lg text-muted-foreground ml-1">SAR</span>
        </div>

        {/* Method selector */}
        <div className="grid grid-cols-3 gap-2">
          {methods.map((m) => (
            <TouchButton
              key={m.key}
              variant={method === m.key ? "default" : "outline"}
              className={cn("h-12 rounded-xl flex items-center justify-center gap-2", method !== m.key && "border-border")}
              onClick={() => setMethod(m.key)}
            >
              {m.icon}
              {m.label}
            </TouchButton>
          ))}
        </div>

        {/* Cash tendered */}
        {method === "cash" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Tendered Amount</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={tendered || ""}
              onChange={(e) => setTendered(Number(e.target.value))}
              className="h-12 text-lg text-center rounded-xl"
              placeholder="0.00"
            />
            <div className="flex justify-between">
              <TouchButton
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => setTendered(Math.ceil(totalAmount))}
              >
                Exact ({Math.ceil(totalAmount)})
              </TouchButton>
              {change > 0 && (
                <span className="text-emerald-600 font-semibold text-sm self-center">
                  Change: {change.toFixed(2)} SAR
                </span>
              )}
            </div>
          </div>
        )}

        {/* Split */}
        {method === "both" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Cash Portion</label>
            <Input
              type="number"
              min={0}
              max={totalAmount}
              step={0.01}
              value={cashAmount || ""}
              onChange={(e) => setCashAmount(Number(e.target.value))}
              className="h-12 text-lg text-center rounded-xl"
            />
            {cashAmount > 0 && cashAmount < totalAmount && (
              <div className="text-sm text-muted-foreground text-center">
                Card: {cardPortion.toFixed(2)} SAR
              </div>
            )}
          </div>
        )}

        <TouchButton
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          className="w-full h-12 rounded-xl text-base font-semibold mt-2"
        >
          {isSubmitting ? "Processing…" : "Confirm Payment"}
        </TouchButton>
      </DialogContent>
    </Dialog>
  );
}
