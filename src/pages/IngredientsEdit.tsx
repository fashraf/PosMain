import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
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
import { FormSectionCard } from "@/components/shared/FormSectionCard";
import { FormField } from "@/components/shared/FormField";
import { FormRow } from "@/components/shared/FormRow";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X, FileText, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const unitOptions = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "pieces", label: "Pieces" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (mL)" },
];

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
    <div className="space-y-3 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/ingredients")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("ingredients.editIngredient")}</h1>
      </div>

      {/* Basic Info */}
      <FormSectionCard title={t("branches.basicInfo")} icon={FileText}>
        <FormRow columns={2}>
          <FormField label={t("ingredients.ingredientName")} required>
            <CompactMultiLanguageInput
              label=""
              values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
              onChange={handleNameChange}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t("ingredients.type")}>
              <Select value={formData.type} onValueChange={(value: "liquid" | "solid") => setFormData((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">{t("ingredients.solid")}</SelectItem>
                  <SelectItem value="liquid">{t("ingredients.liquid")}</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={t("ingredients.baseUnit")}>
              <Select value={formData.base_unit} onValueChange={(value) => setFormData((prev) => ({ ...prev, base_unit: value }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormRow>
      </FormSectionCard>

      {/* Stock & Pricing */}
      <FormSectionCard title={`${t("ingredients.currentStock")} & ${t("common.price")}`} icon={Package}>
        <FormRow columns={4}>
          <FormField label={t("ingredients.currentStock")}>
            <Input type="number" min="0" value={formData.current_quantity} onChange={(e) => setFormData((prev) => ({ ...prev, current_quantity: parseFloat(e.target.value) || 0 }))} className="h-9" />
          </FormField>
          <FormField label={t("ingredients.alertThreshold")} tooltip={t("tooltips.alertThreshold")}>
            <Input type="number" min="0" value={formData.alert_threshold} onChange={(e) => setFormData((prev) => ({ ...prev, alert_threshold: parseFloat(e.target.value) || 0 }))} className="h-9" />
          </FormField>
          <FormField label={t("ingredients.costPerUnit")}>
            <Input type="number" min="0" step="0.01" value={formData.cost_price} onChange={(e) => setFormData((prev) => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))} className="h-9" />
          </FormField>
          <FormField label={t("ingredients.sellingPrice")}>
            <Input type="number" min="0" step="0.01" value={formData.selling_price ?? ""} onChange={(e) => setFormData((prev) => ({ ...prev, selling_price: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Optional" className="h-9" />
          </FormField>
        </FormRow>
      </FormSectionCard>

      {/* Extra Options */}
      <FormSectionCard title={t("ingredients.canAddAsExtra")} icon={Settings}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-normal">{t("ingredients.canSellIndividually")}</Label>
            <Switch checked={formData.can_sell_individually} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, can_sell_individually: checked }))} />
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <Label className="text-sm font-normal">{t("ingredients.canAddAsExtra")}</Label>
            <Switch checked={formData.can_add_extra} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, can_add_extra: checked, extra_cost: checked ? prev.extra_cost : null }))} />
          </div>

          {formData.can_add_extra && (
            <FormField label={t("ingredients.extraCost")} tooltip={t("tooltips.extraCost")}>
              <Input type="number" min="0" step="0.01" value={formData.extra_cost ?? ""} onChange={(e) => setFormData((prev) => ({ ...prev, extra_cost: e.target.value ? parseFloat(e.target.value) : null }))} className="max-w-[150px] h-9" />
            </FormField>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t("common.status")}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{formData.is_active ? t("common.active") : t("common.inactive")}</span>
              <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
            </div>
          </div>
        </div>
      </FormSectionCard>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/ingredients")} disabled={isSaving}><X className="h-4 w-4 me-1" />{t("common.cancel")}</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 me-1" />{t("common.save")}</Button>
        </div>
      </div>

      <ConfirmChangesModal open={showConfirmModal} onOpenChange={setShowConfirmModal} onConfirm={handleConfirmSave} changes={getChanges} isLoading={isSaving} />
    </div>
  );
}
