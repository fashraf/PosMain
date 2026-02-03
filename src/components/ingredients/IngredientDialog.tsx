import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiLanguageInput } from "@/components/shared/MultiLanguageInput";
import { useLanguage } from "@/hooks/useLanguage";
import type { Ingredient } from "./IngredientTable";

interface IngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
  onSave: (ingredient: Omit<Ingredient, "id"> & { id?: string }) => void;
}

const unitOptions = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "pieces", label: "Pieces" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (mL)" },
];

export function IngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onSave,
}: IngredientDialogProps) {
  const { t } = useLanguage();
  const isEditing = !!ingredient;

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    type: "solid" as "liquid" | "solid",
    base_unit: "kg",
    current_quantity: 0,
    alert_threshold: 10,
    cost_price: 0,
    selling_price: null as number | null,
    can_sell_individually: false,
    can_add_extra: false,
    extra_cost: null as number | null,
    is_active: true,
  });

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name_en: ingredient.name_en,
        name_ar: ingredient.name_ar,
        name_ur: ingredient.name_ur,
        type: ingredient.type,
        base_unit: ingredient.base_unit,
        current_quantity: ingredient.current_quantity,
        alert_threshold: ingredient.alert_threshold,
        cost_price: ingredient.cost_price,
        selling_price: ingredient.selling_price,
        can_sell_individually: ingredient.can_sell_individually,
        can_add_extra: ingredient.can_add_extra,
        extra_cost: ingredient.extra_cost,
        is_active: ingredient.is_active,
      });
    } else {
      setFormData({
        name_en: "",
        name_ar: "",
        name_ur: "",
        type: "solid",
        base_unit: "kg",
        current_quantity: 0,
        alert_threshold: 10,
        cost_price: 0,
        selling_price: null,
        can_sell_individually: false,
        can_add_extra: false,
        extra_cost: null,
        is_active: true,
      });
    }
  }, [ingredient, open]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(ingredient?.id ? { id: ingredient.id } : {}),
      ...formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("ingredients.editIngredient") : t("ingredients.addIngredient")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MultiLanguageInput
            label={t("ingredients.ingredientName")}
            values={{
              en: formData.name_en,
              ar: formData.name_ar,
              ur: formData.name_ur,
            }}
            onChange={handleNameChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("ingredients.type")}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "liquid" | "solid") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">{t("ingredients.solid")}</SelectItem>
                  <SelectItem value="liquid">{t("ingredients.liquid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("ingredients.baseUnit")}</Label>
              <Select
                value={formData.base_unit}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, base_unit: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t("ingredients.currentStock")}</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.current_quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    current_quantity: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">{t("ingredients.alertThreshold")}</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                step="0.01"
                value={formData.alert_threshold}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    alert_threshold: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">{t("ingredients.costPerUnit")}</Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cost_price: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">{t("ingredients.sellingPrice")}</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.selling_price || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    selling_price: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="canSell">{t("ingredients.canSellIndividually")}</Label>
              <Switch
                id="canSell"
                checked={formData.can_sell_individually}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, can_sell_individually: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="canExtra">{t("ingredients.canAddAsExtra")}</Label>
              <Switch
                id="canExtra"
                checked={formData.can_add_extra}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    can_add_extra: checked,
                    extra_cost: checked ? prev.extra_cost : null,
                  }))
                }
              />
            </div>

            {formData.can_add_extra && (
              <div className="space-y-2">
                <Label htmlFor="extraCost">{t("ingredients.extraCost")}</Label>
                <Input
                  id="extraCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.extra_cost || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      extra_cost: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                  placeholder="Extra charge amount"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <Label htmlFor="status">{t("common.status")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formData.is_active ? t("common.active") : t("common.inactive")}
              </span>
              <Switch
                id="status"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
