import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TouchButton } from "@/components/pos/shared";

const CANCEL_REASONS = [
  "Customer changed mind",
  "Duplicate order",
  "Wrong items entered",
  "Customer didn't pay",
  "Other",
] as const;

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export function CancelOrderModal({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: CancelOrderModalProps) {
  const [selected, setSelected] = useState<string>("");
  const [otherText, setOtherText] = useState("");

  const finalReason =
    selected === "Other" ? (otherText.trim() || "Other") : selected;

  const handleConfirm = () => {
    if (!finalReason) return;
    onConfirm(finalReason);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground/80">Cancel Order</AlertDialogTitle>
          <AlertDialogDescription>
            Please select a reason for cancelling this order.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RadioGroup value={selected} onValueChange={setSelected} className="space-y-2 py-2">
          {CANCEL_REASONS.map((reason) => (
            <div key={reason} className="flex items-center gap-2">
              <RadioGroupItem value={reason} id={reason} />
              <Label htmlFor={reason} className="text-sm cursor-pointer">
                {reason}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selected === "Other" && (
          <Textarea
            placeholder="Enter reason…"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="resize-none rounded-xl"
            rows={2}
          />
        )}

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl">Go Back</AlertDialogCancel>
          <TouchButton
            variant="destructive"
            className="rounded-xl"
            disabled={!selected || isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? "Cancelling…" : "Confirm Cancel"}
          </TouchButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
