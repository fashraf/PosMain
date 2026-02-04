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
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface SaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  entityType: string;
  isNew: boolean;
  isSaving?: boolean;
}

export function SaveConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  entityType,
  isNew,
  isSaving = false,
}: SaveConfirmModalProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-dotted border-muted-foreground/40">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <AlertDialogTitle className="text-[15px]">
              {t("maintenance.readyToSave")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-[13px] pt-2">
            You are about to {isNew ? "add" : "update"}{" "}
            <span className="font-medium text-foreground">"{itemName}"</span> {isNew ? "as a new" : "in"} {entityType}.
            <br />
            <span className="text-muted-foreground mt-2 block">
              This will be available immediately across all item forms.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-[13px]" disabled={isSaving}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="text-[13px]"
            disabled={isSaving}
          >
            {isSaving ? t("common.loading") : t("common.confirmAndSave")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
