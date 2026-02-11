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

interface BranchSaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  branchName: string;
  salesChannelsCount: number;
  taxCount: number;
  pricingMode: string;
  isActive: boolean;
}

export function BranchSaveConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  branchName,
  salesChannelsCount,
  taxCount,
  pricingMode,
  isActive,
}: BranchSaveConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Confirm Branch Configuration Changes
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Review the configuration for <strong>{branchName || "this branch"}</strong>:
              </p>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/50 border">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Sales Channels</p>
                  <Badge variant="secondary" className="text-xs">{salesChannelsCount} selected</Badge>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Tax Rules</p>
                  <Badge variant="secondary" className="text-xs">{taxCount} configured</Badge>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Pricing Mode</p>
                  <Badge variant="outline" className="text-xs capitalize">{pricingMode}</Badge>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
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
