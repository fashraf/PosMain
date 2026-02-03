import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormSectionCard } from "@/components/shared/FormSectionCard";
import { FormField } from "@/components/shared/FormField";
import { FormRow } from "@/components/shared/FormRow";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { CheckboxGroup } from "@/components/shared/CheckboxGroup";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X, FileText, Clock, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const mockCategories = [
  {
    id: "1",
    name_en: "Breakfast",
    name_ar: "إفطار",
    name_ur: "ناشتہ",
    time_slots: ["breakfast"],
    order_types: ["dine_in", "takeaway"],
    aggregators: [],
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    name_en: "Lunch Specials",
    name_ar: "عروض الغداء",
    name_ur: "دوپہر کے خاص پکوان",
    time_slots: ["lunch"],
    order_types: ["dine_in", "takeaway", "delivery"],
    aggregators: ["uber_eats", "talabat"],
    sort_order: 2,
    is_active: true,
  },
];

export default function CategoriesEdit() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    time_slots: [] as string[],
    order_types: [] as string[],
    aggregators: [] as string[],
    sort_order: 0,
    is_active: true,
  });

  const [formData, setFormData] = useState({ ...initialData });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const category = mockCategories.find((c) => c.id === id);
    if (category) {
      const data = {
        name_en: category.name_en,
        name_ar: category.name_ar,
        name_ur: category.name_ur,
        time_slots: category.time_slots,
        order_types: category.order_types,
        aggregators: category.aggregators,
        sort_order: category.sort_order,
        is_active: category.is_active,
      };
      setInitialData(data);
      setFormData(data);
    }
  }, [id]);

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

  const getChanges = useMemo((): Change[] => {
    const changes: Change[] = [];
    
    if (formData.name_en !== initialData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: initialData.name_en, newValue: formData.name_en });
    if (formData.name_ar !== initialData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: initialData.name_ar, newValue: formData.name_ar });
    if (formData.name_ur !== initialData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: initialData.name_ur, newValue: formData.name_ur });
    
    if (JSON.stringify(formData.time_slots) !== JSON.stringify(initialData.time_slots)) {
      const oldSlots = initialData.time_slots.map(s => t(`categories.${s}` as any)).join(", ");
      const newSlots = formData.time_slots.map(s => t(`categories.${s}` as any)).join(", ");
      changes.push({ field: t("categories.timeAvailability"), oldValue: oldSlots, newValue: newSlots });
    }
    
    if (JSON.stringify(formData.order_types) !== JSON.stringify(initialData.order_types)) {
      const oldTypes = initialData.order_types.join(", ");
      const newTypes = formData.order_types.join(", ");
      changes.push({ field: t("categories.availableForOrderTypes"), oldValue: oldTypes, newValue: newTypes });
    }
    
    if (formData.sort_order !== initialData.sort_order) {
      changes.push({ field: t("categories.sortOrder"), oldValue: initialData.sort_order.toString(), newValue: formData.sort_order.toString() });
    }
    
    if (formData.is_active !== initialData.is_active) {
      changes.push({ field: t("common.status"), oldValue: initialData.is_active ? t("common.active") : t("common.inactive"), newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    }
    
    return changes;
  }, [formData, initialData, t]);

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
      toast({ title: t("categories.editCategory"), description: `${formData.name_en} has been updated.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/categories");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-3 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/categories")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("categories.editCategory")}</h1>
      </div>

      {/* Basic Info */}
      <FormSectionCard title={t("branches.basicInfo")} icon={FileText}>
        <FormRow columns={2}>
          <FormField label={t("categories.categoryName")} required>
            <CompactMultiLanguageInput
              label=""
              values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
              onChange={handleNameChange}
            />
          </FormField>
          <FormField label={t("categories.sortOrder")}>
            <Input
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="max-w-[100px] h-9"
            />
          </FormField>
        </FormRow>

        <div className="flex items-center justify-between pt-3 mt-3 border-t">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t("common.status")}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{formData.is_active ? t("common.active") : t("common.inactive")}</span>
            <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
          </div>
        </div>
      </FormSectionCard>

      {/* Time Availability */}
      <FormSectionCard title={t("categories.timeAvailability")} icon={Clock}>
        <CheckboxGroup
          label={t("categories.availableFor")}
          options={timeSlotOptions}
          value={formData.time_slots}
          onChange={(slots) => setFormData((prev) => ({ ...prev, time_slots: slots }))}
        />
      </FormSectionCard>

      {/* Menu Availability */}
      <FormSectionCard title={t("categories.menuAvailability")} icon={Menu}>
        <div className="space-y-3">
          <CheckboxGroup
            label={t("categories.availableForOrderTypes")}
            options={orderTypeOptions}
            value={formData.order_types}
            onChange={(types) => setFormData((prev) => ({ ...prev, order_types: types }))}
          />

          <div className="border-t pt-3">
            <CheckboxGroup
              label={t("categories.availableForAggregators")}
              options={aggregatorOptions}
              value={formData.aggregators}
              onChange={(aggs) => setFormData((prev) => ({ ...prev, aggregators: aggs }))}
              columns={3}
            />
          </div>
        </div>
      </FormSectionCard>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/categories")} disabled={isSaving}><X className="h-4 w-4 me-1" />{t("common.cancel")}</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 me-1" />{t("common.save")}</Button>
        </div>
      </div>

      <ConfirmChangesModal open={showConfirmModal} onOpenChange={setShowConfirmModal} onConfirm={handleConfirmSave} changes={getChanges} isLoading={isSaving} />
    </div>
  );
}
