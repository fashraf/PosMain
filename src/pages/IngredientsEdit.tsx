import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

// Mock data
const mockIngredients = [
  { id: "1", name_en: "Tomato", name_ar: "طماطم", name_ur: "ٹماٹر", type: "solid" as const, base_unit: "kg", current_quantity: 50, alert_threshold: 10, cost_price: 2.50, selling_price: null, can_sell_individually: false, can_add_extra: true, extra_cost: 0.50, is_active: true },
  { id: "2", name_en: "Olive Oil", name_ar: "زيت زيتون", name_ur: "زیتون کا تیل", type: "liquid" as const, base_unit: "liters", current_quantity: 5, alert_threshold: 3, cost_price: 15.00, selling_price: null, can_sell_individually: false, can_add_extra: false, extra_cost: null, is_active: true },
];

export default function IngredientsEdit() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState({
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

  const [formData, setFormData] = useState({ ...initialData });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const ingredient = mockIngredients.find((i) => i.id === id);
    if (ingredient) {
      const data = {
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
      };
      setInitialData(data);
      setFormData(data);
    }
  }, [id]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const getChanges = useMemo((): Change[] => {
    const changes: Change[] = [];
    if (formData.name_en !== initialData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: initialData.name_en, newValue: formData.name_en });
    if (formData.name_ar !== initialData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: initialData.name_ar, newValue: formData.name_ar });
    if (formData.name_ur !== initialData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: initialData.name_ur, newValue: formData.name_ur });
    if (formData.type !== initialData.type) changes.push({ field: t("ingredients.type"), oldValue: initialData.type === "liquid" ? t("ingredients.liquid") : t("ingredients.solid"), newValue: formData.type === "liquid" ? t("ingredients.liquid") : t("ingredients.solid") });
    if (formData.base_unit !== initialData.base_unit) changes.push({ field: t("ingredients.baseUnit"), oldValue: initialData.base_unit, newValue: formData.base_unit });
    if (formData.current_quantity !== initialData.current_quantity) changes.push({ field: t("ingredients.currentStock"), oldValue: initialData.current_quantity.toString(), newValue: formData.current_quantity.toString() });
    if (formData.alert_threshold !== initialData.alert_threshold) changes.push({ field: t("ingredients.alertThreshold"), oldValue: initialData.alert_threshold.toString(), newValue: formData.alert_threshold.toString() });
    if (formData.cost_price !== initialData.cost_price) changes.push({ field: t("ingredients.costPerUnit"), oldValue: `$${initialData.cost_price.toFixed(2)}`, newValue: `$${formData.cost_price.toFixed(2)}` });
    if (formData.selling_price !== initialData.selling_price) changes.push({ field: t("ingredients.sellingPrice"), oldValue: initialData.selling_price ? `$${initialData.selling_price.toFixed(2)}` : "-", newValue: formData.selling_price ? `$${formData.selling_price.toFixed(2)}` : "-" });
    if (formData.can_sell_individually !== initialData.can_sell_individually) changes.push({ field: t("ingredients.canSellIndividually"), oldValue: initialData.can_sell_individually ? t("common.yes") : t("common.no"), newValue: formData.can_sell_individually ? t("common.yes") : t("common.no") });
    if (formData.can_add_extra !== initialData.can_add_extra) changes.push({ field: t("ingredients.canAddAsExtra"), oldValue: initialData.can_add_extra ? t("common.yes") : t("common.no"), newValue: formData.can_add_extra ? t("common.yes") : t("common.no") });
    if (formData.extra_cost !== initialData.extra_cost) changes.push({ field: t("ingredients.extraCost"), oldValue: initialData.extra_cost ? `$${initialData.extra_cost.toFixed(2)}` : "-", newValue: formData.extra_cost ? `$${formData.extra_cost.toFixed(2)}` : "-" });
    if (formData.is_active !== initialData.is_active) changes.push({ field: t("common.status"), oldValue: initialData.is_active ? t("common.active") : t("common.inactive"), newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    return changes;
  }, [formData, initialData, t]);

  const handleSave = () => {
    if (!formData.name_en) {
      toast({ title: "Validation Error", description: "Please fill in required fields.", variant: "destructive" });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast({ title: t("ingredients.editIngredient"), description: `${formData.name_en} has been updated.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/ingredients");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/ingredients")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{t("ingredients.editIngredient")}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("branches.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MultiLanguageInput
            label={t("ingredients.ingredientName")}
            values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
            onChange={handleNameChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("ingredients.type")}</Label>
              <Select value={formData.type} onValueChange={(value: "liquid" | "solid") => setFormData((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">{t("ingredients.solid")}</SelectItem>
                  <SelectItem value="liquid">{t("ingredients.liquid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("ingredients.baseUnit")}</Label>
              <Select value={formData.base_unit} onValueChange={(value) => setFormData((prev) => ({ ...prev, base_unit: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
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
              <Input id="quantity" type="number" min="0" value={formData.current_quantity} onChange={(e) => setFormData((prev) => ({ ...prev, current_quantity: parseFloat(e.target.value) || 0 }))} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="threshold">{t("ingredients.alertThreshold")}</Label>
                <TooltipInfo content={t("tooltips.alertThreshold")} />
              </div>
              <Input id="threshold" type="number" min="0" value={formData.alert_threshold} onChange={(e) => setFormData((prev) => ({ ...prev, alert_threshold: parseFloat(e.target.value) || 0 }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">{t("ingredients.costPerUnit")}</Label>
              <Input id="costPrice" type="number" min="0" step="0.01" value={formData.cost_price} onChange={(e) => setFormData((prev) => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">{t("ingredients.sellingPrice")}</Label>
              <Input id="sellingPrice" type="number" min="0" step="0.01" value={formData.selling_price ?? ""} onChange={(e) => setFormData((prev) => ({ ...prev, selling_price: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Optional" />
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
            <Label htmlFor="canSell">{t("ingredients.canSellIndividually")}</Label>
            <Switch id="canSell" checked={formData.can_sell_individually} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, can_sell_individually: checked }))} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="canAddExtra">{t("ingredients.canAddAsExtra")}</Label>
              <TooltipInfo content={t("tooltips.canAddExtra")} />
            </div>
            <Switch id="canAddExtra" checked={formData.can_add_extra} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, can_add_extra: checked, extra_cost: checked ? prev.extra_cost : null }))} />
          </div>

          {formData.can_add_extra && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="extraCost">{t("ingredients.extraCost")}</Label>
                <TooltipInfo content={t("tooltips.extraCost")} />
              </div>
              <Input id="extraCost" type="number" min="0" step="0.01" value={formData.extra_cost ?? ""} onChange={(e) => setFormData((prev) => ({ ...prev, extra_cost: e.target.value ? parseFloat(e.target.value) : null }))} />
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
              <span className="text-sm text-muted-foreground">{formData.is_active ? t("common.active") : t("common.inactive")}</span>
              <Switch id="status" checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-4 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/ingredients")} disabled={isSaving}><X className="h-4 w-4 me-2" />{t("common.cancel")}</Button>
          <Button onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 me-2" />{t("common.save")}</Button>
        </div>
      </div>

      <ConfirmChangesModal open={showConfirmModal} onOpenChange={setShowConfirmModal} onConfirm={handleConfirmSave} changes={getChanges} isLoading={isSaving} />
    </div>
  );
}
