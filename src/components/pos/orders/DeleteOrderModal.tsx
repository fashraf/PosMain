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
import { Input } from "@/components/ui/input";
import { TouchButton } from "@/components/pos/shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DeleteOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: number;
  onSuccess: () => void;
}

export function DeleteOrderModal({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  onSuccess,
}: DeleteOrderModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = confirmText === String(orderNumber);

  const handleDelete = async () => {
    if (!canDelete) return;
    setIsDeleting(true);
    try {
      // Delete items first, then order
      await supabase.from("pos_order_items").delete().eq("order_id", orderId);
      const { error } = await supabase.from("pos_orders").delete().eq("id", orderId);
      if (error) throw error;

      toast({ title: "Order Deleted", description: `Order #${orderNumber} has been permanently deleted.` });
      onOpenChange(false);
      setConfirmText("");
      onSuccess();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setConfirmText(""); }}>
      <AlertDialogContent className="rounded-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Delete Order #{orderNumber}</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone. Type <strong>{orderNumber}</strong> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={`Type ${orderNumber} to confirm`}
          className="rounded-xl"
        />

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <TouchButton
            variant="destructive"
            className="rounded-xl"
            disabled={!canDelete || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting…" : "Delete Permanently"}
          </TouchButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
