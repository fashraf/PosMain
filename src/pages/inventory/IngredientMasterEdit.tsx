import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { SearchableMultiSelect } from "@/components/shared/SearchableMultiSelect";
import { IngredientSaveConfirmModal } from "@/components/ingredients/IngredientSaveConfirmModal";
import {
  useUnits,
  useStorageTypes,
  useIngredientGroups,
  useLocalizedLabel,
} from "@/hooks/useMaintenanceData";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

// Ingredient types are static (standard classification)
const INGREDIENT_TYPES = [
  { id: "solid", label: "Solid" },
  { id: "liquid", label: "Liquid" },
  { id: "powder", label: "Powder" },
  { id: "other", label: "Other" },
];

export default function IngredientMasterEdit() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dynamic data hooks
  const { data: units, isLoading: unitsLoading } = useUnits();
  const { data: storageTypes, isLoading: storageTypesLoading } = useStorageTypes();
  const { data: ingredientGroups, isLoading: groupsLoading } = useIngredientGroups();
  const getLocalizedLabel = useLocalizedLabel();

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

  // Transform data for dropdowns
  const unitOptions = useMemo(() => 
    (units || []).map(u => ({ 
      id: u.id, 
      label: `${getLocalizedLabel(u)} (${u.symbol})` 
    })), 
    [units, getLocalizedLabel]
  );

  const storageTypeOptions = useMemo(() => 
    (storageTypes || []).map(s => ({ 
      id: s.id, 
      label: `${getLocalizedLabel(s)}${s.temp_range ? ` (${s.temp_range})` : ''}` 
    })), 
    [storageTypes, getLocalizedLabel]
  );

  const ingredientGroupOptions = useMemo(() => 
    (ingredientGroups || []).map(g => ({ id: g.id, label: getLocalizedLabel(g) })), 
    [ingredientGroups, getLocalizedLabel]
  );

  // Load mock data for editing (replace with Supabase fetch later)
  useEffect(() => {
    if (id) {
      // Mock data - in real implementation, fetch from Supabase
      setTimeout(() => {
        setFormData({
          name_en: "Chicken Breast",
          name_ar: "صدر دجاج",
          name_ur: "چکن بریسٹ",
          description_en: "Fresh boneless chicken breast for grilling",
          description_ar: "صدر دجاج طازج بدون عظم للشوي",
          description_ur: "گرلنگ کے لیے تازہ بون لیس چکن بریسٹ",
          ingredient_type: "solid",
          unit: "kg",
          storage_type: "fridge",
          categories: ["meat_poultry"],
          min_stock_alert: 15,
          shelf_life_days: 5,
          reorder_point: 20,
          current_stock: 68,
          max_stock: 100,
          cost_price: 25.5,
          selling_price: 35.0,
          can_purchase: true,
          will_return_on_cancel: false,
          yield_percentage: 85,
          allergens: [],
          supplier: "Fresh Poultry Co.",
          is_active: true,
        });
        setIsLoading(false);
      }, 500);
    }
  }, [id]);

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
      description: t("inventory.itemUpdated") || "Ingredient updated successfully",
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
    type: INGREDIENT_TYPES.find((it) => it.id === formData.ingredient_type)?.label || "",
    unit: units?.find((u) => u.id === formData.unit)?.name_en || "",
    storageType: storageTypes?.find((s) => s.id === formData.storage_type)?.name_en || "",
    categories: formData.categories.map(
      (cId) => ingredientGroups?.find((g) => g.id === cId)?.name_en || cId
    ),
    costPrice: formData.cost_price,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory/ingredients")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("ingredients.editIngredient") || "Edit Ingredient"}</h1>
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
              options={unitOptions}
              placeholder={t("common.select")}
              searchPlaceholder={t("common.search")}
              emptyText={t("common.noResults") || "No results found"}
              isLoading={unitsLoading}
            />
          </FormField>

          <FormField label={t("ingredients.storageType") || "Storage Type"} required>
            <SearchableSelect
              value={formData.storage_type}
              onChange={(value) => setFormData((prev) => ({ ...prev, storage_type: value }))}
              options={storageTypeOptions}
              placeholder={t("common.select")}
              searchPlaceholder={t("common.search")}
              emptyText={t("common.noResults") || "No results found"}
              isLoading={storageTypesLoading}
            />
          </FormField>

          <FormField label={t("ingredients.categoryGroup") || "Category/Group"}>
            <SearchableMultiSelect
              value={formData.categories}
              onChange={(value) => setFormData((prev) => ({ ...prev, categories: value }))}
              options={ingredientGroupOptions}
              placeholder={t("common.select")}
              searchPlaceholder={t("common.search")}
              emptyText={t("common.noResults") || "No results found"}
              isLoading={groupsLoading}
            />
          </FormField>
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
            {isSaving ? t("common.saving") : t("common.update") || "Update"}
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
        isEditMode={true}
      />
    </div>
  );
}
