import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carrot,
  Tag,
  AlertTriangle,
  DollarSign,
  FileText,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { FormField } from "@/components/shared/FormField";
import { MultiLanguageInputWithIndicators } from "@/components/shared/MultiLanguageInputWithIndicators";
import { AllergenPicker, type AllergenType } from "@/components/shared/AllergenPicker";
import { StockAvailabilityBadge } from "@/components/shared/StockAvailabilityBadge";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { IngredientSaveConfirmModal } from "@/components/ingredients/IngredientSaveConfirmModal";
import { cn } from "@/lib/utils";

// Dropdown options
const INGREDIENT_TYPES = [
  { id: "solid", label: "Solid" },
  { id: "liquid", label: "Liquid" },
  { id: "powder", label: "Powder" },
  { id: "other", label: "Other" },
];

const UNITS = [
  { id: "kg", label: "Kilogram (KG)" },
  { id: "g", label: "Gram (G)" },
  { id: "l", label: "Liter (L)" },
  { id: "ml", label: "Milliliter (ML)" },
  { id: "piece", label: "Piece" },
  { id: "pack", label: "Pack" },
  { id: "box", label: "Box" },
  { id: "dozen", label: "Dozen" },
];

const STORAGE_TYPES = [
  { id: "freezer", label: "Freezer (-18°C)" },
  { id: "fridge", label: "Fridge/Chiller (0-4°C)" },
  { id: "dry", label: "Dry/Ambient" },
  { id: "room_temp", label: "Room Temperature" },
];

const INGREDIENT_CATEGORIES = [
  { id: "meat_poultry", label: "Meat & Poultry" },
  { id: "dairy", label: "Dairy" },
  { id: "produce", label: "Produce/Vegetables" },
  { id: "spices", label: "Spices & Herbs" },
  { id: "dry_goods", label: "Dry Goods" },
  { id: "oils_fats", label: "Oils & Fats" },
  { id: "beverages", label: "Beverages/Base" },
  { id: "packaging", label: "Packaging" },
  { id: "seafood", label: "Seafood" },
  { id: "bakery", label: "Bakery Items" },
];

export default function IngredientMasterAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    name_en: "",
    name_ar: "",
    name_ur: "",
    description_en: "",
    description_ar: "",
    description_ur: "",

    // Classification
    ingredient_type: "",
    unit: "",
    storage_type: "",
    categories: [] as string[],

    // Inventory & Alerts
    min_stock_alert: 10,
    shelf_life_days: null as number | null,
    reorder_point: null as number | null,
    current_stock: 100,
    max_stock: 100,

    // Pricing
    cost_price: 0,
    selling_price: null as number | null,
    can_purchase: true,
    will_return_on_cancel: false,

    // Details
    yield_percentage: 100,
    allergens: [] as AllergenType[],
    supplier: "",

    // Status
    is_active: true,
  });

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleDescriptionChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`description_${lang}`]: value }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSaveClick = () => {
    if (!formData.name_en || !formData.ingredient_type || !formData.unit || !formData.storage_type) {
      toast({
        title: t("common.error") || "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowConfirmModal(false);

    toast({
      title: t("common.success") || "Success",
      description: t("inventory.ingredientCreated"),
    });
    navigate("/inventory/ingredients");
  };

  // Calculate stock percentage for badge
  const stockPercentage = formData.max_stock > 0
    ? Math.round((formData.current_stock / formData.max_stock) * 100)
    : 0;

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Summary for confirmation modal
  const ingredientSummary = {
    name: formData.name_en,
    type: INGREDIENT_TYPES.find((t) => t.id === formData.ingredient_type)?.label || "",
    unit: UNITS.find((u) => u.id === formData.unit)?.label || "",
    storageType: STORAGE_TYPES.find((s) => s.id === formData.storage_type)?.label || "",
    categories: formData.categories.map(
      (cId) => INGREDIENT_CATEGORIES.find((c) => c.id === cId)?.label || cId
    ),
    costPrice: formData.cost_price,
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory/ingredients")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("inventory.addIngredient")}</h1>
      </div>

      {/* Section 1: Ingredient Basics (Purple) - Name/Description side-by-side */}
      <DashedSectionCard title={t("ingredients.ingredientBasics") || "Ingredient Basics"} icon={Carrot} variant="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiLanguageInputWithIndicators
            label={t("ingredients.ingredientName")}
            values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
            onChange={handleNameChange}
            required
            singleLine
          />
          <MultiLanguageInputWithIndicators
            label={t("ingredients.shortDescription") || "Short Description"}
            values={{ en: formData.description_en, ar: formData.description_ar, ur: formData.description_ur }}
            onChange={handleDescriptionChange}
            singleLine
          />
        </div>
      </DashedSectionCard>

      {/* Section 2: Classification (Green) */}
      <DashedSectionCard title={t("ingredients.classification") || "Classification"} icon={Tag} variant="green">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label={t("ingredients.ingredientType") || "Type"} required>
            <SearchableSelect
              value={formData.ingredient_type}
              onChange={(value) => setFormData((prev) => ({ ...prev, ingredient_type: value }))}
              options={INGREDIENT_TYPES}
              placeholder={t("common.select")}
              searchPlaceholder={t("common.search")}
              emptyText={t("common.noResults") || "No results found"}
            />
          </FormField>

          <FormField label={t("common.unit")} required>
            <SearchableSelect
              value={formData.unit}
              onChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
              options={UNITS}
              placeholder={t("common.select")}
              searchPlaceholder={t("common.search")}
              emptyText={t("common.noResults") || "No results found"}
            />
          </FormField>

          <FormField label={t("ingredients.storageType") || "Storage Type"} required>
            <SearchableSelect
              value={formData.storage_type}
              onChange={(value) => setFormData((prev) => ({ ...prev, storage_type: value }))}
              options={STORAGE_TYPES}
              placeholder={t("common.select")}
              searchPlaceholder={t("common.search")}
              emptyText={t("common.noResults") || "No results found"}
            />
          </FormField>

          <FormField label={t("ingredients.categoryGroup") || "Category/Group"}>
            <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 border rounded-md bg-background">
              {formData.categories.length === 0 ? (
                <span className="text-muted-foreground text-sm">{t("common.select")}</span>
              ) : (
                formData.categories.map((catId) => {
                  const cat = INGREDIENT_CATEGORIES.find((c) => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {cat?.label}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(catId)}
                        className="hover:text-green-900"
                      >
                        ×
                      </button>
                    </span>
                  );
                })
              )}
            </div>
          </FormField>
        </div>

        {/* Category selection chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {INGREDIENT_CATEGORIES.map((cat) => {
            const isSelected = formData.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryToggle(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  isSelected
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-background border-border hover:bg-muted"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </DashedSectionCard>

      {/* Section 3: Inventory & Alerts (Amber) - with Stock Badge */}
      <DashedSectionCard
        title={t("ingredients.inventoryAndAlerts") || "Inventory & Alerts"}
        icon={AlertTriangle}
        variant="amber"
        rightBadge={<StockAvailabilityBadge percentage={stockPercentage} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            label={t("ingredients.minStockAlert") || "Min Stock Alert"}
            tooltip={t("ingredients.minStockTooltip") || "Trigger low-stock notification when quantity falls below this level"}
            required
          >
            <Input
              type="number"
              min="0"
              value={formData.min_stock_alert}
              onChange={(e) => setFormData((prev) => ({ ...prev, min_stock_alert: parseInt(e.target.value) || 0 }))}
              className="h-10"
            />
          </FormField>

          <FormField
            label={t("ingredients.shelfLifeDays") || "Shelf Life (Days)"}
            tooltip={t("ingredients.shelfLifeTooltip") || "Typical days before expiry/spoilage (used for FIFO & waste prevention)"}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={formData.shelf_life_days ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, shelf_life_days: e.target.value ? parseInt(e.target.value) : null }))}
                placeholder="—"
                className="h-10"
              />
              <span className="text-sm text-muted-foreground">{t("inventory.days")}</span>
            </div>
          </FormField>

          <FormField
            label={t("ingredients.parLevel") || "PAR Level"}
            tooltip={t("ingredients.parLevelTooltip") || "Ideal minimum quantity to maintain - triggers reorder when reached"}
          >
            <Input
              type="number"
              min="0"
              value={formData.reorder_point ?? ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, reorder_point: e.target.value ? parseInt(e.target.value) : null }))}
              placeholder="—"
              className="h-10"
            />
          </FormField>

          <FormField label={t("ingredients.currentStock") || "Current Stock"}>
            <Input
              type="number"
              min="0"
              value={formData.current_stock}
              onChange={(e) => setFormData((prev) => ({ ...prev, current_stock: parseInt(e.target.value) || 0 }))}
              className="h-10"
            />
          </FormField>
        </div>
      </DashedSectionCard>

      {/* Section 4: Pricing (Blue) */}
      <DashedSectionCard title={t("ingredients.pricing") || "Pricing"} icon={DollarSign} variant="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <FormField label={t("ingredients.costPrice") || "Cost Price"} required>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">SAR</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData((prev) => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))}
                className="h-10"
              />
            </div>
          </FormField>

          <FormField label={t("ingredients.sellingPrice") || "Selling Price"}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">SAR</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.selling_price ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, selling_price: e.target.value ? parseFloat(e.target.value) : null }))}
                placeholder={t("common.optional")}
                className="h-10"
              />
            </div>
          </FormField>

          <div className="flex items-center gap-3 h-10">
            <Switch
              id="can_purchase"
              checked={formData.can_purchase}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, can_purchase: checked }))}
            />
            <Label htmlFor="can_purchase" className="text-sm cursor-pointer">
              {t("ingredients.canPurchase") || "Can Purchase"}
            </Label>
          </div>

          <div className="flex items-center gap-3 h-10">
            <Switch
              id="will_return"
              checked={formData.will_return_on_cancel}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, will_return_on_cancel: checked }))}
            />
            <Label htmlFor="will_return" className="text-sm cursor-pointer">
              {t("ingredients.willReturnOnCancel") || "Return on Cancel"}
            </Label>
          </div>
        </div>
      </DashedSectionCard>

      {/* Section 5: Details (Muted/Gray) */}
      <DashedSectionCard title={t("ingredients.details") || "Details"} icon={FileText} variant="muted">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label={t("ingredients.yieldPercentage") || "Yield %"}
            tooltip={t("ingredients.yieldTooltip") || "Usable portion after trimming/cleaning (e.g., 85% for chicken after bones)"}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.yield_percentage}
                onChange={(e) => setFormData((prev) => ({ ...prev, yield_percentage: parseInt(e.target.value) || 0 }))}
                className="h-10"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </FormField>

          <FormField label={t("ingredients.supplier") || "Supplier/Vendor"}>
            <Input
              value={formData.supplier}
              onChange={(e) => setFormData((prev) => ({ ...prev, supplier: e.target.value }))}
              placeholder={t("common.optional")}
              className="h-10"
            />
          </FormField>
        </div>

        {/* Allergen Picker */}
        <FormField label={t("ingredients.allergenFlags") || "Allergen Flags"}>
          <AllergenPicker
            value={formData.allergens}
            onChange={(allergens) => setFormData((prev) => ({ ...prev, allergens }))}
          />
        </FormField>
      </DashedSectionCard>

      {/* Footer Actions */}
      <div className="fixed bottom-0 start-0 end-0 bg-background border-t shadow-lg z-10">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/inventory/ingredients")}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveClick} className="gap-2" disabled={isSaving}>
            <Save className="h-4 w-4" />
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <IngredientSaveConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
        ingredient={ingredientSummary}
        isEditMode={false}
      />
    </div>
  );
}
