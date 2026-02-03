import { useLanguage } from "@/hooks/useLanguage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SaveSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  ingredientCount: number;
  ingredientTotal: number;
  itemCount: number;
  itemTotal: number;
  baseCost: number;
  comboPrice: number;
  sellingPrice: number;
  profit: number;
}

export function SaveSummaryModal({
  open,
  onOpenChange,
  onConfirm,
  ingredientCount,
  ingredientTotal,
  itemCount,
  itemTotal,
  baseCost,
  comboPrice,
  sellingPrice,
  profit,
}: SaveSummaryModalProps) {
  const { t } = useLanguage();

  const getProfitColor = () => {
    if (profit > 0) return "text-success";
    if (profit < 0) return "text-destructive";
    return "text-warning";
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <DialogTitle className="text-[15px]">
            {t("itemMapping.confirmSave")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <table className="w-full text-[13px]">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">{t("itemMapping.ingredients")}</td>
                <td className="py-2 text-center">{ingredientCount} pcs</td>
                <td className="py-2 text-right font-medium">SAR {ingredientTotal.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">{t("itemMapping.items")}</td>
                <td className="py-2 text-center">{itemCount} lines</td>
                <td className="py-2 text-right font-medium">SAR {itemTotal.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-border h-2">
                <td colSpan={3}></td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">{t("itemMapping.baseCost")}</td>
                <td className="py-2"></td>
                <td className="py-2 text-right font-medium">SAR {baseCost.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">{t("itemMapping.comboPrice")}</td>
                <td className="py-2"></td>
                <td className="py-2 text-right font-medium">SAR {comboPrice.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">{t("itemMapping.sellingPrice")}</td>
                <td className="py-2"></td>
                <td className="py-2 text-right font-medium">SAR {sellingPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">{t("itemMapping.profit")}</td>
                <td className="py-2"></td>
                <td className={cn("py-2 text-right font-bold", getProfitColor())}>
                  SAR {profit.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DialogFooter className="p-4 pt-0 border-t border-border gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-[13px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="h-8 text-[13px] min-w-[120px]"
          >
            {t("itemMapping.confirmSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
