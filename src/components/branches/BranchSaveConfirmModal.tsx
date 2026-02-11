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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { BranchFormData } from "./BranchFormPage";

interface BranchSaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  formData: BranchFormData;
  channelOptions: { id: string; label: string }[];
}

export function BranchSaveConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  formData,
  channelOptions,
}: BranchSaveConfirmModalProps) {
  const selectedChannels = channelOptions.filter((c) =>
    formData.sales_channel_ids.includes(c.id)
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Confirm Branch Configuration Changes
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Review the full configuration before saving:
              </p>

              {/* Basic Info */}
              <div className="space-y-2 p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Basic Information</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <span className="text-muted-foreground">Branch Name</span>
                  <span className="font-medium text-foreground">{formData.name || "—"}</span>
                  <span className="text-muted-foreground">Branch Code</span>
                  <span className="font-medium text-foreground font-mono">{formData.branch_code || "—"}</span>
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium text-foreground">{formData.currency}</span>
                  <span className="text-muted-foreground">Pricing Mode</span>
                  <Badge variant="outline" className="text-xs capitalize w-fit">{formData.pricing_mode}</Badge>
                  <span className="text-muted-foreground">Rounding</span>
                  <span className="font-medium text-foreground capitalize">{formData.rounding_rule === "none" ? "No rounding" : formData.rounding_rule}</span>
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={formData.is_active ? "default" : "secondary"} className="text-xs w-fit">
                    {formData.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Sales Channels */}
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Sales Channels ({selectedChannels.length})</p>
                {selectedChannels.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChannels.map((ch) => (
                      <Badge key={ch.id} variant="secondary" className="text-xs">{ch.label}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No channels selected</p>
                )}
              </div>

              {/* Tax Rules */}
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Tax Rules ({formData.taxes.length})</p>
                {formData.taxes.length > 0 ? (
                  <div className="space-y-1">
                    {formData.taxes.map((tax) => (
                      <div key={tax.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{tax.tax_name || "Unnamed"}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {tax.tax_type === "percentage" ? `${tax.value}%` : `Fixed ${tax.value}`}
                          </Badge>
                          <Badge variant={tax.is_active ? "default" : "secondary"} className="text-xs">
                            {tax.is_active ? "Active" : "Off"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No taxes configured</p>
                )}
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted border">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  These updates will reflect immediately in POS operations.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="text-sm">
            Confirm & Apply
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
