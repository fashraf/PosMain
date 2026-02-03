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
import type { IngredientMappingItem } from "./IngredientMappingList";
import type { SubItemMappingItem } from "./SubItemMappingList";

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
  ingredientMappings?: IngredientMappingItem[];
  itemMappings?: SubItemMappingItem[];
  totalReplacements?: number;
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
  ingredientMappings = [],
  itemMappings = [],
  totalReplacements = 0,
}: SaveSummaryModalProps) {
  const { t } = useLanguage();

  const getProfitColor = () => {
    if (profit > 0) return "text-green-600";
    if (profit < 0) return "text-destructive";
    return "text-yellow-600";
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[75vw] p-0 gap-0 rounded-lg overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-background">
          <DialogTitle className="text-base font-semibold">
            {t("itemMapping.confirmSave")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Summary Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b border-border">
              <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                {t("itemMapping.summary")}
              </span>
            </div>
            <table className="w-full text-[13px]">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground w-[30%]">{t("itemMapping.ingredients")}</td>
                  <td className="px-4 py-2.5 w-[25%]">{ingredientCount} pcs</td>
                  <td className="px-4 py-2.5 w-[25%]"></td>
                  <td className="px-4 py-2.5 text-right font-medium w-[20%]">SAR {ingredientTotal.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{t("itemMapping.items")}</td>
                  <td className="px-4 py-2.5">{itemCount} lines</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {totalReplacements > 0 && `${totalReplacements} replacements`}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium">SAR {itemTotal.toFixed(2)}</td>
                </tr>
                <tr className="h-2 border-b border-border">
                  <td colSpan={4}></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{t("itemMapping.baseCost")}</td>
                  <td className="px-4 py-2.5" colSpan={2}></td>
                  <td className="px-4 py-2.5 text-right font-medium">SAR {baseCost.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{t("itemMapping.comboPrice")}</td>
                  <td className="px-4 py-2.5" colSpan={2}></td>
                  <td className="px-4 py-2.5 text-right font-medium">SAR {comboPrice.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{t("itemMapping.sellingPrice")}</td>
                  <td className="px-4 py-2.5" colSpan={2}></td>
                  <td className="px-4 py-2.5 text-right font-medium">SAR {sellingPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-muted-foreground">{t("itemMapping.profit")}</td>
                  <td className="px-4 py-2.5" colSpan={2}></td>
                  <td className={cn("px-4 py-2.5 text-right font-bold", getProfitColor())}>
                    SAR {profit.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detail Sections - Two Columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Ingredients Detail */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b border-border">
                <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t("itemMapping.ingredients")} ({ingredientMappings.length})
                </span>
              </div>
              <div className="divide-y divide-border max-h-[200px] overflow-y-auto">
                {ingredientMappings.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-muted-foreground text-center">
                    {t("itemMapping.noIngredientsMapped")}
                  </div>
                ) : (
                  ingredientMappings.map((ing) => (
                    <div key={ing.id} className="px-4 py-2 flex items-center justify-between text-[13px]">
                      <span className="font-medium">{ing.ingredient_name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {ing.quantity} {ing.unit}
                        </span>
                        <span className="font-medium w-20 text-right">
                          SAR {(ing.quantity * (ing.extra_cost || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Items Detail */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b border-border">
                <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t("itemMapping.items")} ({itemMappings.length})
                </span>
              </div>
              <div className="divide-y divide-border max-h-[200px] overflow-y-auto">
                {itemMappings.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-muted-foreground text-center">
                    {t("itemMapping.noItemsMapped")}
                  </div>
                ) : (
                  itemMappings.map((item) => (
                    <div key={item.id}>
                      <div className="px-4 py-2 flex items-center justify-between text-[13px]">
                        <span className="font-medium">{item.sub_item_name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">×{item.quantity}</span>
                          <span className="font-medium w-20 text-right">
                            SAR {(item.quantity * item.unit_price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {/* Replacements */}
                      {item.replacements?.map((rep) => (
                        <div key={rep.id} className="px-4 py-1.5 ps-8 flex items-center justify-between text-[12px] bg-muted/30">
                          <span className="text-muted-foreground">
                            → {rep.item_name}
                            {rep.is_default && " (Def)"}
                          </span>
                          <span className={cn(
                            "w-20 text-right",
                            rep.extra_cost > 0 ? "text-green-600" : "text-muted-foreground"
                          )}>
                            +{rep.extra_cost.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 text-[13px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="h-10 px-5 text-[13px] min-w-[140px]"
          >
            {t("itemMapping.confirmSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
