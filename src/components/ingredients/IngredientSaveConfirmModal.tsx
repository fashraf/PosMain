import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Carrot, Check, X, Thermometer, Tag, DollarSign, Scale } from "lucide-react";

interface IngredientSummary {
  name: string;
  type: string;
  unit: string;
  storageType: string;
  categories: string[];
  costPrice: number;
}

interface IngredientSaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  ingredient: IngredientSummary;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export function IngredientSaveConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  ingredient,
  isLoading,
  isEditMode = false,
}: IngredientSaveConfirmModalProps) {
  const { t } = useLanguage();

  const title = isEditMode
    ? (t("ingredients.updated") || "Updated!")
    : (t("ingredients.perfectReady") || "Perfect!");
  
  const message = isEditMode
    ? (t("ingredients.readyToApply") || "Ready to apply changes?")
    : (t("ingredients.readyToSaveIngredient") || "Ready to save this ingredient?");

  const buttonText = isEditMode
    ? (t("common.update") || "Update")
    : (t("items.yesSave") || "Yes, Save");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Carrot className="h-7 w-7 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {title} 🥕
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {message}
          </p>
        </DialogHeader>

        {/* Ingredient Summary Card */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <span className="font-semibold text-foreground">{ingredient.name || "Untitled"}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("ingredients.ingredientType")}:</span>
              <span className="font-medium">{ingredient.type || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("common.unit")}:</span>
              <span className="font-medium">{ingredient.unit || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("ingredients.storageType")}:</span>
              <span className="font-medium">{ingredient.storageType || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("ingredients.costPrice")}:</span>
              <span className="font-medium">SAR {ingredient.costPrice.toFixed(2)}</span>
            </div>
          </div>

          {ingredient.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t">
              {ingredient.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {t("ingredients.availableForRecipes")}
        </p>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            <X className="h-4 w-4 me-1.5" />
            {t("items.noGoBack")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 me-1.5" />
            {isLoading ? t("common.loading") : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
