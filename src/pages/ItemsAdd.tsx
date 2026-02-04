import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { ImageUploadHero } from "@/components/shared/ImageUploadHero";
import { MultiSelectBadges } from "@/components/shared/MultiSelectBadges";
import { MultiLanguageInputWithIndicators } from "@/components/shared/MultiLanguageInputWithIndicators";
import { InventoryProgressCard } from "@/components/shared/InventoryProgressCard";
import { AllergenPicker, type AllergenType } from "@/components/shared/AllergenPicker";
import { ItemSaveConfirmModal } from "@/components/items/ItemSaveConfirmModal";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { ArrowLeft, ArrowRight, Save, X, FileText, Tags, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Category options
const CATEGORIES = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "non_vegetarian", label: "Non-Vegetarian" },
  { id: "drinks", label: "Drinks" },
  { id: "sheesha", label: "Sheesha" },
  { id: "desserts", label: "Desserts" },
];

// Subcategory options
const SUBCATEGORIES = [
  { id: "seafood", label: "Sea Food" },
  { id: "pancake", label: "Pan Cake" },
  { id: "pizza", label: "Pizza" },
  { id: "soft_drinks", label: "Soft Drinks" },
  { id: "tea_coffee", label: "Tea and Coffee" },
  { id: "bbq", label: "BBQ" },
  { id: "shawarma", label: "Shawarma" },
  { id: "smoking_zone", label: "Smoking Zone" },
];

// Serving time options
const SERVING_TIMES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch Specials" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
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
    category: "",
    subcategories: [] as string[],
    serving_times: [] as string[],
    preparation_time_minutes: 15,
    allergens: [] as AllergenType[],
    calories: null as number | null,
    highlights: "",
    current_stock: 100,
    low_stock_threshold: 10,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleDescriptionChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`description_${lang}`]: value }));
  };

  const handleServingTimeToggle = (timeId: string) => {
    setFormData((prev) => ({
      ...prev,
      serving_times: prev.serving_times.includes(timeId)
        ? prev.serving_times.filter((t) => t !== timeId)
        : [...prev.serving_times, timeId],
    }));
  };

  const handleSave = () => {
    if (!formData.name_en) {
      toast({ title: "Validation Error", description: "Please fill in required fields.", variant: "destructive" });
      return;
    }
    if (!formData.category) {
      toast({ title: "Validation Error", description: "Please select a category.", variant: "destructive" });
      return;
    }
    if (formData.serving_times.length === 0) {
      toast({ title: "Validation Error", description: "Please select at least one serving time.", variant: "destructive" });
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

  const confirmModalItem = useMemo(() => ({
    name: formData.name_en || "New Item",
    image_url: formData.image_url,
    category: CATEGORIES.find((c) => c.id === formData.category)?.label || "",
    subcategories: formData.subcategories.map((id) => SUBCATEGORIES.find((s) => s.id === id)?.label || ""),
    base_cost: formData.base_cost,
    calories: formData.calories,
    prep_time: formData.preparation_time_minutes,
    serving_times: formData.serving_times.map((id) => SERVING_TIMES.find((s) => s.id === id)?.label || ""),
  }), [formData]);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/items")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("items.addItem")}</h1>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column - 4/12 */}
        <div className="lg:col-span-4 space-y-5">
          {/* Basic Info Left (Image, Name, Description) */}
          <DashedSectionCard title={t("items.basicInformation")} icon={FileText} variant="purple">
            <div className="space-y-4">
              {/* Hero Image Upload */}
              <ImageUploadHero
                value={formData.image_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                size={280}
                className="mx-auto"
              />

              {/* Item Name with indicators */}
              <MultiLanguageInputWithIndicators
                label={t("items.itemName")}
                values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
                onChange={handleNameChange}
                required
                placeholder="Enter item name..."
              />

              {/* Description with indicators */}
              <MultiLanguageInputWithIndicators
                label={t("common.description")}
                values={{ en: formData.description_en, ar: formData.description_ar, ur: formData.description_ur }}
                onChange={handleDescriptionChange}
                multiline
                placeholder="Enter description..."
              />
            </div>
          </DashedSectionCard>

          {/* Inventory Section */}
          <DashedSectionCard title={t("items.inventory")} icon={BarChart3} variant="amber">
            <InventoryProgressCard
              currentStock={formData.current_stock}
              maxStock={100}
              lowStockThreshold={formData.low_stock_threshold}
              onCurrentStockChange={(value) => setFormData((prev) => ({ ...prev, current_stock: value }))}
              onThresholdChange={(value) => setFormData((prev) => ({ ...prev, low_stock_threshold: value }))}
            />
          </DashedSectionCard>
        </div>

        {/* Right Column - 8/12 */}
        <div className="lg:col-span-8 space-y-5">
          {/* Basic Info Right (Type, Cost, Toggles) */}
          <DashedSectionCard title={t("items.basicInformation")} icon={FileText} variant="purple">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("items.itemType")}</Label>
                  <Select
                    value={formData.item_type}
                    onValueChange={(value: "edible" | "non_edible") =>
                      setFormData((prev) => ({ ...prev, item_type: value }))
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edible">{t("items.edible")}</SelectItem>
                      <SelectItem value="non_edible">{t("items.nonEdible")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("items.baseCost")} (SAR)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.base_cost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, base_cost: parseFloat(e.target.value) || 0 }))}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isCombo"
                    checked={formData.is_combo}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_combo: checked }))}
                  />
                  <Label htmlFor="isCombo" className="text-sm font-normal flex items-center gap-1">
                    {t("items.isCombo")}
                    <TooltipInfo content={t("items.comboTooltip")} />
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="status"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="status" className="text-sm font-normal">
                    {formData.is_active ? t("common.active") : t("common.inactive")}
                  </Label>
                </div>
              </div>
            </div>
          </DashedSectionCard>

          {/* Classification Section */}
          <DashedSectionCard title={t("items.classification")} icon={Tags} variant="green">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">
                    {t("items.category")} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t("items.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("items.subcategory")}</Label>
                  <MultiSelectBadges
                    options={SUBCATEGORIES}
                    value={formData.subcategories}
                    onChange={(value) => setFormData((prev) => ({ ...prev, subcategories: value }))}
                    placeholder={t("items.selectSubcategories")}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t("items.servingTime")} <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-4">
                  {SERVING_TIMES.map((time) => (
                    <div key={time.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`serving-${time.id}`}
                        checked={formData.serving_times.includes(time.id)}
                        onCheckedChange={() => handleServingTimeToggle(time.id)}
                      />
                      <Label htmlFor={`serving-${time.id}`} className="text-sm font-normal cursor-pointer">
                        {time.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DashedSectionCard>

          {/* Details Section */}
          <DashedSectionCard title={t("items.details")} icon={Clock} variant="blue">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 flex items-center gap-1">
                    {t("items.preparationTime")}
                    <TooltipInfo content={t("items.preparationTimeTooltip")} />
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      value={formData.preparation_time_minutes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, preparation_time_minutes: parseInt(e.target.value) || 0 }))}
                      className="h-10 pe-12"
                    />
                    <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 flex items-center gap-1">
                    {t("items.calories")}
                    <TooltipInfo content={t("items.caloriesTooltip")} />
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      value={formData.calories ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, calories: e.target.value ? parseInt(e.target.value) : null }))}
                      placeholder="Optional"
                      className="h-10 pe-12"
                    />
                    <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kcal</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 flex items-center gap-1">
                    {t("items.highlights")}
                    <TooltipInfo content={t("items.highlightsTooltip")} />
                  </Label>
                  <Input
                    type="text"
                    value={formData.highlights}
                    onChange={(e) => setFormData((prev) => ({ ...prev, highlights: e.target.value }))}
                    placeholder={t("items.highlightsPlaceholder")}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="pt-3 border-t">
                <AllergenPicker
                  label={t("items.allergens")}
                  value={formData.allergens}
                  onChange={(allergens) => setFormData((prev) => ({ ...prev, allergens }))}
                  tooltip={t("items.allergensTooltip")}
                />
              </div>
            </div>
          </DashedSectionCard>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className={cn(
        "fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10",
        "flex items-center gap-3",
        isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4"
      )}>
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

      {/* Confirmation Modal */}
      <ItemSaveConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        item={confirmModalItem}
        isLoading={isSaving}
      />
    </div>
  );
}
