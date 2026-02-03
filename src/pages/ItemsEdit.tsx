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
import { CheckboxGroup } from "@/components/shared/CheckboxGroup";
import { AllergenPicker, type AllergenType } from "@/components/shared/AllergenPicker";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X, ImageIcon, Upload, FileText, Tags, Clock, Image } from "lucide-react";
import { cn } from "@/lib/utils";

const mockCategories = [
  { id: "1", name_en: "Breakfast" },
  { id: "2", name_en: "Lunch Specials" },
  { id: "3", name_en: "Dinner" },
  { id: "4", name_en: "Snacks" },
];

const mockItems = [
  { 
    id: "1", 
    name_en: "Margherita Pizza", 
    name_ar: "بيتزا مارغريتا", 
    name_ur: "مارگریٹا پیزا", 
    description_en: "Classic pizza with tomato and mozzarella", 
    description_ar: "بيتزا كلاسيكية", 
    description_ur: "کلاسک پیزا", 
    item_type: "edible" as const, 
    base_cost: 12.99, 
    is_combo: false, 
    image_url: null, 
    is_active: true,
    categories: ["2", "3"],
    preparation_time_minutes: 20,
    allergens: ["dairy", "gluten"] as AllergenType[],
    calories: 850,
  },
  { 
    id: "2", 
    name_en: "Chicken Burger", 
    name_ar: "برجر دجاج", 
    name_ur: "چکن برگر", 
    description_en: "Juicy chicken patty", 
    description_ar: "قطعة دجاج", 
    description_ur: "چکن پیٹی", 
    item_type: "edible" as const, 
    base_cost: 8.99, 
    is_combo: false, 
    image_url: null, 
    is_active: true,
    categories: ["2"],
    preparation_time_minutes: 15,
    allergens: ["gluten", "eggs"] as AllergenType[],
    calories: 650,
  },
];

export default function ItemsEdit() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    description_en: "",
    description_ar: "",
    description_ur: "",
    item_type: "edible" as "edible" | "non_edible",
    base_cost: 0,
    is_combo: false,
    image_url: null as string | null,
    is_active: true,
    categories: [] as string[],
    preparation_time_minutes: 15,
    allergens: [] as AllergenType[],
    calories: null as number | null,
  });

  const [formData, setFormData] = useState({ ...initialData });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const item = mockItems.find((i) => i.id === id);
    if (item) {
      const data = {
        name_en: item.name_en,
        name_ar: item.name_ar,
        name_ur: item.name_ur,
        description_en: item.description_en || "",
        description_ar: item.description_ar || "",
        description_ur: item.description_ur || "",
        item_type: item.item_type,
        base_cost: item.base_cost,
        is_combo: item.is_combo,
        image_url: item.image_url,
        is_active: item.is_active,
        categories: item.categories,
        preparation_time_minutes: item.preparation_time_minutes,
        allergens: item.allergens,
        calories: item.calories,
      };
      setInitialData(data);
      setFormData(data);
    }
  }, [id]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleDescriptionChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`description_${lang}`]: value }));
  };

  const categoryOptions = mockCategories.map((cat) => ({
    id: cat.id,
    label: cat.name_en,
  }));

  const getChanges = useMemo((): Change[] => {
    const changes: Change[] = [];
    if (formData.name_en !== initialData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: initialData.name_en, newValue: formData.name_en });
    if (formData.name_ar !== initialData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: initialData.name_ar, newValue: formData.name_ar });
    if (formData.name_ur !== initialData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: initialData.name_ur, newValue: formData.name_ur });
    if (formData.item_type !== initialData.item_type) changes.push({ field: t("items.itemType"), oldValue: initialData.item_type === "edible" ? t("items.edible") : t("items.nonEdible"), newValue: formData.item_type === "edible" ? t("items.edible") : t("items.nonEdible") });
    if (formData.base_cost !== initialData.base_cost) changes.push({ field: t("items.baseCost"), oldValue: `$${initialData.base_cost.toFixed(2)}`, newValue: `$${formData.base_cost.toFixed(2)}` });
    if (formData.is_combo !== initialData.is_combo) changes.push({ field: t("items.isCombo"), oldValue: initialData.is_combo ? t("common.yes") : t("common.no"), newValue: formData.is_combo ? t("common.yes") : t("common.no") });
    
    if (JSON.stringify(formData.categories) !== JSON.stringify(initialData.categories)) {
      const oldCats = initialData.categories.map(id => mockCategories.find(c => c.id === id)?.name_en).filter(Boolean).join(", ");
      const newCats = formData.categories.map(id => mockCategories.find(c => c.id === id)?.name_en).filter(Boolean).join(", ");
      changes.push({ field: t("items.categories"), oldValue: oldCats || "None", newValue: newCats || "None" });
    }
    
    if (formData.preparation_time_minutes !== initialData.preparation_time_minutes) {
      changes.push({ field: t("items.preparationTime"), oldValue: `${initialData.preparation_time_minutes} min`, newValue: `${formData.preparation_time_minutes} min` });
    }
    
    if (JSON.stringify(formData.allergens) !== JSON.stringify(initialData.allergens)) {
      changes.push({ field: t("items.allergens"), oldValue: initialData.allergens.join(", ") || "None", newValue: formData.allergens.join(", ") || "None" });
    }
    
    if (formData.calories !== initialData.calories) {
      changes.push({ field: t("items.calories"), oldValue: initialData.calories ? `${initialData.calories} kcal` : "Not set", newValue: formData.calories ? `${formData.calories} kcal` : "Not set" });
    }
    
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
      toast({ title: t("items.editItem"), description: `${formData.name_en} has been updated.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/items");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-3 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/items")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("items.editItem")}</h1>
      </div>

      {/* Basic Info */}
      <FormSectionCard title={t("branches.basicInfo")} icon={FileText}>
        <FormRow columns={2}>
          <FormField label={t("items.itemName")} required>
            <CompactMultiLanguageInput
              label=""
              values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
              onChange={handleNameChange}
            />
          </FormField>
          <FormField label={t("items.itemType")}>
            <Select value={formData.item_type} onValueChange={(value: "edible" | "non_edible") => setFormData((prev) => ({ ...prev, item_type: value }))}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="edible">{t("items.edible")}</SelectItem>
                <SelectItem value="non_edible">{t("items.nonEdible")}</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormRow divider>
          <FormField label={t("common.description")} className="col-span-full">
            <CompactMultiLanguageInput
              label=""
              values={{ en: formData.description_en, ar: formData.description_ar, ur: formData.description_ur }}
              onChange={handleDescriptionChange}
              multiline
            />
          </FormField>
        </FormRow>

        <FormRow columns={3} divider>
          <FormField label={t("items.baseCost")}>
            <Input type="number" min="0" step="0.01" value={formData.base_cost} onChange={(e) => setFormData((prev) => ({ ...prev, base_cost: parseFloat(e.target.value) || 0 }))} className="h-9" />
          </FormField>

          <div className="flex items-center gap-2 pt-5">
            <Switch id="isCombo" checked={formData.is_combo} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_combo: checked }))} />
            <Label htmlFor="isCombo" className="text-sm font-normal">{t("items.isCombo")}</Label>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <Switch id="status" checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
            <Label htmlFor="status" className="text-sm font-normal">{formData.is_active ? t("common.active") : t("common.inactive")}</Label>
          </div>
        </FormRow>
      </FormSectionCard>

      {/* Categories */}
      <FormSectionCard title={t("items.categories")} icon={Tags}>
        <CheckboxGroup
          label={t("items.assignCategories")}
          options={categoryOptions}
          value={formData.categories}
          onChange={(cats) => setFormData((prev) => ({ ...prev, categories: cats }))}
          columns={4}
        />
      </FormSectionCard>

      {/* Preparation & Nutrition */}
      <FormSectionCard title={t("items.preparationAndNutrition")} icon={Clock}>
        <FormRow columns={2}>
          <FormField label={t("items.preparationTimeMinutes")} tooltip={t("tooltips.preparationTime")}>
            <div className="relative max-w-[150px]">
              <Input
                type="number"
                min="0"
                value={formData.preparation_time_minutes}
                onChange={(e) => setFormData((prev) => ({ ...prev, preparation_time_minutes: parseInt(e.target.value) || 0 }))}
                className="pe-10 h-9"
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
            </div>
          </FormField>

          <FormField label={t("items.calories")} tooltip={t("tooltips.calories")}>
            <div className="relative max-w-[150px]">
              <Input
                type="number"
                min="0"
                value={formData.calories ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, calories: e.target.value ? parseInt(e.target.value) : null }))}
                placeholder="Optional"
                className="pe-10 h-9"
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kcal</span>
            </div>
          </FormField>
        </FormRow>

        <div className="border-t pt-3 mt-3">
          <AllergenPicker
            label={t("items.allergens")}
            value={formData.allergens}
            onChange={(allergens) => setFormData((prev) => ({ ...prev, allergens }))}
            tooltip={t("tooltips.allergens")}
          />
        </div>
      </FormSectionCard>

      {/* Image */}
      <FormSectionCard title={t("items.image")} icon={Image}>
        <div className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          {formData.image_url ? (
            <img src={formData.image_url} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <Button variant="outline" size="sm" disabled>
            <Upload className="h-4 w-4 me-1" />
            {t("items.uploadImage")}
          </Button>
          <p className="text-xs text-muted-foreground">Image upload coming soon</p>
        </div>
      </FormSectionCard>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/items")} disabled={isSaving}><X className="h-4 w-4 me-1" />{t("common.cancel")}</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 me-1" />{t("common.save")}</Button>
        </div>
      </div>

      <ConfirmChangesModal open={showConfirmModal} onOpenChange={setShowConfirmModal} onConfirm={handleConfirmSave} changes={getChanges} isLoading={isSaving} />
    </div>
  );
}
