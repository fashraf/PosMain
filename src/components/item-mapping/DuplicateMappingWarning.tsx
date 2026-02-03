import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { AlertTriangle } from "lucide-react";

interface DuplicateMappingWarningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredientName: string;
  currentQuantity: number;
  unit: string;
  onGoToExisting: () => void;
}

export function DuplicateMappingWarning({
  open,
  onOpenChange,
  ingredientName,
  currentQuantity,
  unit,
  onGoToExisting,
}: DuplicateMappingWarningProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {t("itemMapping.duplicateWarning")}
          </DialogTitle>
          <DialogDescription className="pt-2">
            <span className="font-medium text-foreground">"{ingredientName}"</span>{" "}
            {t("itemMapping.duplicateDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              {t("itemMapping.currentQuantity")}:
            </p>
            <p className="text-lg font-medium">
              {currentQuantity} {unit}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onGoToExisting}>
            {t("itemMapping.goToExisting")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
