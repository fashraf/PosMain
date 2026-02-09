import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import type { KDSOrderItem } from "@/hooks/pos/useKitchenOrders";

interface KitchenItemModalProps {
  item: KDSOrderItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (orderItemId: string, itemName: string) => void;
}

export function KitchenItemModal({ item, open, onClose, onConfirm }: KitchenItemModalProps) {
  if (!item) return null;

  const cust = item.customization_json as any;
  const extras = cust?.extras || [];
  const removals = cust?.removals || [];
  const replacements = cust?.replacements || [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm mx-auto p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="bg-slate-50 px-6 pt-6 pb-4">
          <DialogTitle className="text-[21px] font-bold text-slate-800">
            {item.quantity > 1 && <span className="mr-1">×{item.quantity}</span>}
            {item.item_name}
          </DialogTitle>
          {(removals.length > 0 || extras.length > 0 || replacements.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[17px]">
              {removals.map((r: any, i: number) => (
                <span key={i} className="text-red-500">- {r.name || r}</span>
              ))}
              {extras.map((e: any, i: number) => (
                <span key={i} className="text-emerald-600">+ {e.name || e}</span>
              ))}
              {replacements.map((rp: any, i: number) => (
                <span key={i} className="text-blue-500">→ {rp.name || rp}</span>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="px-6 py-6 space-y-3">
          <p className="text-center text-slate-500 text-sm">Was it completed?</p>
          <button
            onClick={() => {
              onConfirm(item.id, item.item_name);
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-[21px] font-bold text-white shadow-lg transition-all hover:bg-emerald-600 active:scale-[0.98] touch-manipulation"
          >
            <Check className="h-6 w-6" />
            YES — DONE
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-200 touch-manipulation"
          >
            No
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
