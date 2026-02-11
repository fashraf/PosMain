import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PrintTemplateData, ReceiptPreview } from "./ReceiptPreview";
import { Check, X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
  data: PrintTemplateData;
}

function Pill({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full border bg-muted/40">
      {on ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-muted-foreground/50" />}
      {label}
    </span>
  );
}

export function PrintTemplateSaveModal({ open, onOpenChange, onConfirm, data }: Props) {
  const bodyCount = [data.show_item_name, data.show_qty, data.show_price, data.show_line_total, data.show_total_amount, data.show_discount, data.show_tax_breakdown].filter(Boolean).length;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Save Print Template</AlertDialogTitle>
          <AlertDialogDescription>
            Review the template configuration before saving.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Left: pill summary */}
          <div className="space-y-3">
            <div className="text-[13px]">
              <span className="font-medium">Template:</span> {data.name || "Untitled"}
            </div>

            <div className="space-y-1.5">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Header</p>
              <div className="flex flex-wrap gap-1.5">
                <Pill on={data.show_logo} label="Logo" />
                <Pill on={data.show_branch_name} label="Branch Name" />
                <Pill on={data.show_branch_mobile} label="Mobile" />
                <Pill on={data.show_order_id} label="Order ID" />
                <Pill on={data.show_order_taken_by} label="Taken By" />
                <Pill on={data.show_cr_number} label="CR Number" />
                <Pill on={data.show_vat_number} label="VAT Number" />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Body ({bodyCount} columns)</p>
              <div className="flex flex-wrap gap-1.5">
                <Pill on={data.show_item_name} label="Item" />
                <Pill on={data.show_qty} label="Qty" />
                <Pill on={data.show_price} label="Price" />
                <Pill on={data.show_line_total} label="Line Total" />
                <Pill on={data.show_discount} label="Discount" />
                <Pill on={data.show_tax_breakdown} label="Tax" />
                <Pill on={data.show_customization} label="Customization" />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">QR & Footer</p>
              <div className="flex flex-wrap gap-1.5">
                <Pill on={data.show_qr} label="QR Code" />
                <Pill on={data.show_footer} label="Footer" />
              </div>
            </div>
          </div>

          {/* Right: receipt preview */}
          <div className="transform scale-[0.85] origin-top-right">
            <ReceiptPreview data={data} />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Save Template</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
