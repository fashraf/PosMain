import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

export function MaintenanceDialog({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  isSaving = false,
  className,
}: MaintenanceDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl border-2 border-dotted border-muted-foreground/40 p-0 overflow-hidden",
          className
        )}
      >
        <DialogHeader className="px-6 py-4 border-b border-dotted border-muted-foreground/30 bg-muted/30">
          <DialogTitle className="text-[15px] font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {children}
        </div>
        <DialogFooter className="px-6 py-4 border-t border-dotted border-muted-foreground/30 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="text-[13px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="text-[13px]"
          >
            {isSaving ? t("common.loading") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
