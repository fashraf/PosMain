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
import { useLanguage } from "@/hooks/useLanguage";

interface DuplicateItem {
  name: string;
  count: number;
  type: "ingredient" | "item";
}

interface DuplicateSaveWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  duplicates: DuplicateItem[];
}

export function DuplicateSaveWarningModal({
  open,
  onOpenChange,
  onConfirm,
  duplicates,
}: DuplicateSaveWarningModalProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("itemMapping.duplicatesDetected")}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>{t("itemMapping.duplicateWarningMessage")}</p>
            <div className="mt-3">
              <p className="font-medium text-foreground mb-2">{t("itemMapping.duplicatesFound")}:</p>
              <ul className="list-disc list-inside space-y-1">
                {duplicates.map((dup, index) => (
                  <li key={index} className="text-sm">
                    {dup.name} ({t("itemMapping.addedTimes", { count: dup.count })})
                  </li>
                ))}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("itemMapping.goBack")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("itemMapping.confirmAndSave")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
