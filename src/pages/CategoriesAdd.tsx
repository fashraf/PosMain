import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { CheckboxGroup } from "@/components/shared/CheckboxGroup";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoriesAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    time_slots: [] as string[],
    order_types: ["dine_in", "takeaway"] as string[],
    aggregators: [] as string[],
    sort_order: 0,
    is_active: true,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const timeSlotOptions = [
    { id: "breakfast", label: `${t("categories.breakfast")} (${t("categories.breakfastTime")})` },
    { id: "lunch", label: `${t("categories.lunch")} (${t("categories.lunchTime")})` },
    { id: "dinner", label: `${t("categories.dinner")} (${t("categories.dinnerTime")})` },
  ];

  const orderTypeOptions = [
    { id: "dine_in", label: t("branches.dineIn") },
    { id: "takeaway", label: t("branches.takeaway") },
    { id: "delivery", label: t("branches.delivery") },
  ];

  const aggregatorOptions = [
    { id: "uber_eats", label: t("branches.uberEats") },
    { id: "talabat", label: t("branches.talabat") },
    { id: "jahez", label: t("branches.jahez") },
    { id: "zomato", label: t("branches.zomato") },
    { id: "swiggy", label: t("branches.swiggy") },
  ];

  const getChanges = (): Change[] => {
    const changes: Change[] = [];
    
    if (formData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: null, newValue: formData.name_en });
    if (formData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: null, newValue: formData.name_ar });
    if (formData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: null, newValue: formData.name_ur });
    
    if (formData.time_slots.length > 0) {
      const slots = formData.time_slots.map(s => t(`categories.${s}` as any)).join(", ");
      changes.push({ field: t("categories.timeAvailability"), oldValue: null, newValue: slots });
    }
    
    if (formData.order_types.length > 0) {
      const types = formData.order_types.map(t => t === "dine_in" ? "Dine-In" : t).join(", ");
      changes.push({ field: t("categories.availableForOrderTypes"), oldValue: null, newValue: types });
    }
    
    if (formData.aggregators.length > 0) {
      const aggs = formData.aggregators.join(", ");
      changes.push({ field: t("categories.availableForAggregators"), oldValue: null, newValue: aggs });
    }
    
    changes.push({ field: t("categories.sortOrder"), oldValue: null, newValue: formData.sort_order.toString() });
    changes.push({ field: t("common.status"), oldValue: null, newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    
    return changes;
  };

  const handleSave = () => {
    if (!formData.name_en) {
      toast({ title: "Validation Error", description: "Please enter a category name.", variant: "destructive" });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast({ title: t("categories.addCategory"), description: `${formData.name_en} has been added.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/categories");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/categories")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{t("categories.addCategory")}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("branches.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CompactMultiLanguageInput
              label={t("categories.categoryName")}
              values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
              onChange={handleNameChange}
              required
            />
            <div className="space-y-1.5">
              <Label htmlFor="sortOrder" className="text-sm">{t("categories.sortOrder")}</Label>
              <Input
                id="sortOrder"
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="max-w-[120px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="status" className="text-sm">{t("common.status")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{formData.is_active ? t("common.active") : t("common.inactive")}</span>
              <Switch id="status" checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("categories.timeAvailability")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckboxGroup
            label={t("categories.availableFor")}
            options={timeSlotOptions}
            value={formData.time_slots}
            onChange={(slots) => setFormData((prev) => ({ ...prev, time_slots: slots }))}
          />
        </CardContent>
      </Card>

      {/* Menu Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("categories.menuAvailability")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CheckboxGroup
            label={t("categories.availableForOrderTypes")}
            options={orderTypeOptions}
            value={formData.order_types}
            onChange={(types) => setFormData((prev) => ({ ...prev, order_types: types }))}
          />

          <CheckboxGroup
            label={t("categories.availableForAggregators")}
            options={aggregatorOptions}
            value={formData.aggregators}
            onChange={(aggs) => setFormData((prev) => ({ ...prev, aggregators: aggs }))}
            columns={3}
          />
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/categories")} disabled={isSaving}><X className="h-4 w-4 me-1" />{t("common.cancel")}</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 me-1" />{t("common.save")}</Button>
        </div>
      </div>

      <ConfirmChangesModal open={showConfirmModal} onOpenChange={setShowConfirmModal} onConfirm={handleConfirmSave} changes={getChanges()} isLoading={isSaving} />
    </div>
  );
}
