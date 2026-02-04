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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { FormField } from "@/components/shared/FormField";
import { MultiLanguageInputWithIndicators } from "@/components/shared/MultiLanguageInputWithIndicators";
import { AllergenPicker, type AllergenType } from "@/components/shared/AllergenPicker";
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

  // Calculate stock percentage for progress bar
  const stockPercentage = formData.max_stock > 0
    ? Math.round((formData.current_stock / formData.max_stock) * 100)
    : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

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

      {/* Section 1: Visual & Basics (Purple) */}
      <DashedSectionCard title={t("ingredients.visualAndBasics") || "Visual & Basics"} icon={Carrot} variant="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiLanguageInputWithIndicators
            label={t("ingredients.ingredientName")}
            values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
            onChange={handleNameChange}
            required
          />
          <MultiLanguageInputWithIndicators
            label={t("ingredients.shortDescription") || "Short Description"}
            values={{ en: formData.description_en, ar: formData.description_ar, ur: formData.description_ur }}
            onChange={handleDescriptionChange}
            multiline
          />
        </div>
      </DashedSectionCard>

      {/* Section 2: Classification (Green) */}
      <DashedSectionCard title={t("ingredients.classification") || "Classification"} icon={Tag} variant="green">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label={t("ingredients.ingredientType") || "Type"} required>
            <Select
              value={formData.ingredient_type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, ingredient_type: value }))}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t("common.select")} />
              </SelectTrigger>
              <SelectContent>
                {INGREDIENT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label={t("common.unit")} required>
            <Select
              value={formData.unit}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t("common.select")} />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label={t("ingredients.storageType") || "Storage Type"} required>
            <Select
              value={formData.storage_type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, storage_type: value }))}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t("common.select")} />
              </SelectTrigger>
              <SelectContent>
                {STORAGE_TYPES.map((storage) => (
                  <SelectItem key={storage.id} value={storage.id}>
                    {storage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Section 3: Inventory & Alerts (Amber) */}
      <DashedSectionCard title={t("ingredients.inventoryAndAlerts") || "Inventory & Alerts"} icon={AlertTriangle} variant="amber">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-muted-foreground">{t("items.stockAvailable")}</span>
            <span className="text-sm font-semibold">{stockPercentage}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all rounded-full", getProgressColor(stockPercentage))}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
        </div>

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
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData((prev) => ({ ...prev, supplier: e.target.value }))}
              placeholder="e.g., Fresh Foods Co."
              className="h-10"
            />
          </FormField>
        </div>

        <AllergenPicker
          label={t("ingredients.allergenFlags") || "Allergen Flags"}
          value={formData.allergens}
          onChange={(allergens) => setFormData((prev) => ({ ...prev, allergens }))}
        />
      </DashedSectionCard>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10 flex items-center gap-3",
          isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4"
        )}
      >
        <div className={cn("flex-1 flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/inventory/ingredients")}
            disabled={isSaving}
          >
            <X className="h-4 w-4 me-1" />
            {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSaveClick} disabled={isSaving}>
            <Save className="h-4 w-4 me-1" />
            {t("common.save")}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <IngredientSaveConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        ingredient={ingredientSummary}
        isLoading={isSaving}
      />
    </div>
  );
}
