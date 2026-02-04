import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Check, ImageIcon, Clock, Flame, Carrot, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemSaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  item: {
    name: string;
    image_url?: string | null;
    category: string;
    subcategories: string[];
    base_cost: number;
    calories?: number | null;
    prep_time: number;
    serving_times: string[];
    ingredientCount?: number;
    itemCount?: number;
    isCombo?: boolean;
  };
  isLoading?: boolean;
  isEdit?: boolean;
}

export function ItemSaveConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  item,
  isLoading = false,
  isEdit = false,
}: ItemSaveConfirmModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto text-4xl mb-2">🍕</div>
          <DialogTitle className="text-xl font-semibold text-center">
            {t("items.looksDelicious")}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("items.readyToSave")}
          </p>
        </DialogHeader>

        {/* Item Summary Card */}
        <div className="rounded-xl border bg-muted/30 p-4 my-2">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
              <p className="text-sm text-muted-foreground">
                {item.category}
                {item.subcategories.length > 0 && ` · ${item.subcategories.join(", ")}`}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="font-medium text-primary">
                  SAR {item.base_cost.toFixed(2)}
                </span>
                {item.calories && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Flame className="h-3.5 w-3.5" />
                    {item.calories} kcal
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {item.prep_time} min
                </span>
              </div>
              {item.serving_times.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.serving_times.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Mapping counts */}
          {(item.ingredientCount !== undefined || item.itemCount !== undefined) && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dashed">
              {item.ingredientCount !== undefined && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Carrot className="h-3.5 w-3.5 text-orange-500" />
                  {item.ingredientCount} ingredients
                </span>
              )}
              {item.isCombo && item.itemCount !== undefined && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package className="h-3.5 w-3.5 text-amber-500" />
                  {item.itemCount} items
                </span>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-3 sm:justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            {t("items.noGoBack")}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            <Check className="h-4 w-4 me-1" />
            {t("items.yesSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
