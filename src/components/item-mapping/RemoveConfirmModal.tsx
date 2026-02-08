import { useLanguage } from "@/hooks/useLanguage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  itemType: "ingredient" | "item";
  replacementCount?: number;
}

export function RemoveConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  itemType,
  replacementCount,
}: RemoveConfirmModalProps) {
  const { t } = useLanguage();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-[15px]">
            {t("common.remove")} "{itemName}"?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-4 pb-4 text-[13px] space-y-1">
          <span>
            {itemType === "ingredient"
              ? t("itemMapping.removeIngredientDescription")
              : t("itemMapping.removeItemDescription")}
          </span>
          {itemType === "item" && replacementCount != null && replacementCount > 0 && (
            <span className="block text-destructive font-medium">
              This will also remove {replacementCount} replacement(s) associated with this item.
            </span>
          )}
        </DialogDescription>
        <DialogFooter className="p-4 pt-0 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-[13px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            className="h-8 text-[13px]"
          >
            {t("common.remove")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
