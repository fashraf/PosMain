import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

const unitOptions = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "pieces", label: "Pieces" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (mL)" },
];

export default function IngredientsAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const getChanges = (): Change[] => {
    const changes: Change[] = [];
    if (formData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: null, newValue: formData.name_en });
    if (formData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: null, newValue: formData.name_ar });
    if (formData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: null, newValue: formData.name_ur });
    changes.push({ field: t("ingredients.type"), oldValue: null, newValue: formData.type === "liquid" ? t("ingredients.liquid") : t("ingredients.solid") });
    changes.push({ field: t("ingredients.baseUnit"), oldValue: null, newValue: formData.base_unit });
    changes.push({ field: t("ingredients.currentStock"), oldValue: null, newValue: formData.current_quantity.toString() });
    changes.push({ field: t("ingredients.alertThreshold"), oldValue: null, newValue: formData.alert_threshold.toString() });
    changes.push({ field: t("ingredients.costPerUnit"), oldValue: null, newValue: `$${formData.cost_price.toFixed(2)}` });
    if (formData.selling_price !== null) {
      changes.push({ field: t("ingredients.sellingPrice"), oldValue: null, newValue: `$${formData.selling_price.toFixed(2)}` });
    }
    changes.push({ field: t("ingredients.canSellIndividually"), oldValue: null, newValue: formData.can_sell_individually ? t("common.yes") : t("common.no") });
    changes.push({ field: t("ingredients.canAddAsExtra"), oldValue: null, newValue: formData.can_add_extra ? t("common.yes") : t("common.no") });
    if (formData.can_add_extra && formData.extra_cost !== null) {
      changes.push({ field: t("ingredients.extraCost"), oldValue: null, newValue: `$${formData.extra_cost.toFixed(2)}` });
    }
    changes.push({ field: t("common.status"), oldValue: null, newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    return changes;
  };

  const handleSave = () => {
    if (!formData.name_en) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast({
        title: t("ingredients.addIngredient"),
        description: `${formData.name_en} has been added.`,
      });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/ingredients");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/ingredients")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{t("ingredients.addIngredient")}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("branches.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* Stock & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("ingredients.currentStock")} & {t("common.price")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t("ingredients.currentStock")}</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.current_quantity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, current_quantity: parseFloat(e.target.value) || 0 }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="threshold">{t("ingredients.alertThreshold")}</Label>
                <TooltipInfo content={t("tooltips.alertThreshold")} />
              </div>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={formData.alert_threshold}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, alert_threshold: parseFloat(e.target.value) || 0 }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">{t("ingredients.costPerUnit")}</Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">{t("ingredients.sellingPrice")}</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.selling_price ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, selling_price: e.target.value ? parseFloat(e.target.value) : null }))
                }
                placeholder="Optional"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extra Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("ingredients.canAddAsExtra")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="canSell">{t("ingredients.canSellIndividually")}</Label>
            </div>
            <Switch
              id="canSell"
              checked={formData.can_sell_individually}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, can_sell_individually: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="canAddExtra">{t("ingredients.canAddAsExtra")}</Label>
              <TooltipInfo content={t("tooltips.canAddExtra")} />
            </div>
            <Switch
              id="canAddExtra"
              checked={formData.can_add_extra}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, can_add_extra: checked, extra_cost: checked ? prev.extra_cost : null }))
              }
            />
          </div>

          {formData.can_add_extra && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="extraCost">{t("ingredients.extraCost")}</Label>
                <TooltipInfo content={t("tooltips.extraCost")} />
              </div>
              <Input
                id="extraCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.extra_cost ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, extra_cost: e.target.value ? parseFloat(e.target.value) : null }))
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("common.status")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
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
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 bg-background border-t p-4 z-10",
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4"
        )}
      >
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/ingredients")} disabled={isSaving}>
            <X className="h-4 w-4 me-2" />
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 me-2" />
            {t("common.save")}
          </Button>
        </div>
      </div>

      <ConfirmChangesModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        changes={getChanges()}
        isLoading={isSaving}
      />
    </div>
  );
}
