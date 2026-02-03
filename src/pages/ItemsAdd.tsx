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
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { CheckboxGroup } from "@/components/shared/CheckboxGroup";
import { AllergenPicker, type AllergenType } from "@/components/shared/AllergenPicker";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X, ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock categories for demo
const mockCategories = [
  { id: "1", name_en: "Breakfast" },
  { id: "2", name_en: "Lunch Specials" },
  { id: "3", name_en: "Dinner" },
  { id: "4", name_en: "Snacks" },
];

export default function ItemsAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
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
    // New fields
    categories: [] as string[],
    preparation_time_minutes: 15,
    allergens: [] as AllergenType[],
    calories: null as number | null,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const getChanges = (): Change[] => {
    const changes: Change[] = [];
    if (formData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: null, newValue: formData.name_en });
    if (formData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: null, newValue: formData.name_ar });
    if (formData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: null, newValue: formData.name_ur });
    changes.push({ field: t("items.itemType"), oldValue: null, newValue: formData.item_type === "edible" ? t("items.edible") : t("items.nonEdible") });
    changes.push({ field: t("items.baseCost"), oldValue: null, newValue: `$${formData.base_cost.toFixed(2)}` });
    changes.push({ field: t("items.isCombo"), oldValue: null, newValue: formData.is_combo ? t("common.yes") : t("common.no") });
    
    if (formData.categories.length > 0) {
      const catNames = formData.categories.map(id => mockCategories.find(c => c.id === id)?.name_en).filter(Boolean).join(", ");
      changes.push({ field: t("items.categories"), oldValue: null, newValue: catNames });
    }
    
    changes.push({ field: t("items.preparationTime"), oldValue: null, newValue: `${formData.preparation_time_minutes} min` });
    
    if (formData.allergens.length > 0) {
      changes.push({ field: t("items.allergens"), oldValue: null, newValue: formData.allergens.join(", ") });
    }
    
    if (formData.calories) {
      changes.push({ field: t("items.calories"), oldValue: null, newValue: `${formData.calories} kcal` });
    }
    
    changes.push({ field: t("common.status"), oldValue: null, newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    return changes;
  };

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
      toast({ title: t("items.addItem"), description: `${formData.name_en} has been added.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/items");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/items")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{t("items.addItem")}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("branches.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CompactMultiLanguageInput
              label={t("items.itemName")}
              values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
              onChange={handleNameChange}
              required
            />
            <div className="space-y-1.5">
              <Label className="text-sm">{t("items.itemType")}</Label>
              <Select
                value={formData.item_type}
                onValueChange={(value: "edible" | "non_edible") =>
                  setFormData((prev) => ({ ...prev, item_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edible">{t("items.edible")}</SelectItem>
                  <SelectItem value="non_edible">{t("items.nonEdible")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CompactMultiLanguageInput
            label={t("common.description")}
            values={{ en: formData.description_en, ar: formData.description_ar, ur: formData.description_ur }}
            onChange={handleDescriptionChange}
            multiline
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="baseCost" className="text-sm">{t("items.baseCost")}</Label>
              <Input
                id="baseCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.base_cost}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, base_cost: parseFloat(e.target.value) || 0 }))
                }
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Switch
                id="isCombo"
                checked={formData.is_combo}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_combo: checked }))
                }
              />
              <Label htmlFor="isCombo" className="text-sm font-normal">{t("items.isCombo")}</Label>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Switch
                id="status"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="status" className="text-sm font-normal">
                {formData.is_active ? t("common.active") : t("common.inactive")}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("items.categories")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckboxGroup
            label={t("items.assignCategories")}
            options={categoryOptions}
            value={formData.categories}
            onChange={(cats) => setFormData((prev) => ({ ...prev, categories: cats }))}
            columns={4}
          />
        </CardContent>
      </Card>

      {/* Preparation & Nutrition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("items.preparationAndNutrition")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="prepTime" className="text-sm">{t("items.preparationTimeMinutes")}</Label>
                <TooltipInfo content={t("tooltips.preparationTime")} />
              </div>
              <div className="relative max-w-[150px]">
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={formData.preparation_time_minutes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, preparation_time_minutes: parseInt(e.target.value) || 0 }))
                  }
                  className="pe-10"
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="calories" className="text-sm">{t("items.calories")}</Label>
                <TooltipInfo content={t("tooltips.calories")} />
              </div>
              <div className="relative max-w-[150px]">
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, calories: e.target.value ? parseInt(e.target.value) : null }))
                  }
                  placeholder="Optional"
                  className="pe-10"
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kcal</span>
              </div>
            </div>
          </div>

          <AllergenPicker
            label={t("items.allergens")}
            value={formData.allergens}
            onChange={(allergens) => setFormData((prev) => ({ ...prev, allergens }))}
            tooltip={t("tooltips.allergens")}
          />
        </CardContent>
      </Card>

      {/* Image */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("items.image")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center gap-3">
            {formData.image_url ? (
              <img src={formData.image_url} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <Button variant="outline" size="sm" disabled>
              <Upload className="h-4 w-4 me-1" />
              {t("items.uploadImage")}
            </Button>
            <p className="text-xs text-muted-foreground">Image upload coming soon</p>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/items")} disabled={isSaving}>
            <X className="h-4 w-4 me-1" />
            {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 me-1" />
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
