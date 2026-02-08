import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carrot,
  Scale,
  Warehouse,
  Settings,
  FileText,
  ArrowLeft,
  ArrowRight,
  Save,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { FormField } from "@/components/shared/FormField";
import { MultiLanguageInputWithIndicators } from "@/components/shared/MultiLanguageInputWithIndicators";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { IngredientSaveConfirmModal } from "@/components/ingredients/IngredientSaveConfirmModal";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import {
  useUnits,
  useStorageTypes,
  useIngredientGroups,
  useClassificationTypes,
  useLocalizedLabel,
} from "@/hooks/useMaintenanceData";
import { cn } from "@/lib/utils";

export default function IngredientMasterAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: units, isLoading: unitsLoading } = useUnits();
  const { data: storageTypes, isLoading: storageTypesLoading } = useStorageTypes();
  const { data: ingredientGroups, isLoading: groupsLoading } = useIngredientGroups();
  const { data: classificationTypes, isLoading: classTypesLoading } = useClassificationTypes();
  const getLocalizedLabel = useLocalizedLabel();

  const [formData, setFormData] = useState({
    // Basic Details
    name_en: "",
    name_ar: "",
    name_ur: "",
    description_en: "",
    description_ar: "",
    description_ur: "",
    ingredient_group_id: "",
    classification_type_id: "",
    track_in_inventory: true,
    can_be_sold: false,
    // Measurement & Cost
    base_unit_id: "",
    purchase_unit_id: "",
    conversion_factor: 1,
    cost_per_purchase_unit: 0,
    // Inventory & Storage
    storage_type_id: "",
    min_stock_level: 0,
    max_stock_level: 0,
    shelf_life_days: 0,
    expiry_tracking: false,
    temperature_sensitive: false,
    // Status & Controls
    purchasable: true,
    return_on_cancel: true,
    is_active: true,
    // Notes
    internal_notes: "",
  });

  const costPerBaseUnit = useMemo(() => {
    if (!formData.conversion_factor || formData.conversion_factor <= 0) return null;
    return formData.cost_per_purchase_unit / formData.conversion_factor;
  }, [formData.cost_per_purchase_unit, formData.conversion_factor]);

  const unitOptions = useMemo(
    () => (units || []).map((u) => ({ id: u.id, label: `${getLocalizedLabel(u)} (${u.symbol})` })),
    [units, getLocalizedLabel]
  );

  const groupOptions = useMemo(
    () => (ingredientGroups || []).map((g) => ({ id: g.id, label: getLocalizedLabel(g) })),
    [ingredientGroups, getLocalizedLabel]
  );

  const classificationOptions = useMemo(
    () => (classificationTypes || []).map((c) => ({ id: c.id, label: getLocalizedLabel(c) })),
    [classificationTypes, getLocalizedLabel]
  );

  const storageTypeOptions = useMemo(
    () => (storageTypes || []).map((s) => ({ id: s.id, label: getLocalizedLabel(s) })),
    [storageTypes, getLocalizedLabel]
  );

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleDescriptionChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`description_${lang}`]: value }));
  };

  const validate = (): boolean => {
    if (!formData.name_en || formData.name_en.length < 2) {
      toast({ title: t("common.error"), description: "Ingredient name (English) must be at least 2 characters.", variant: "destructive" });
      return false;
    }
    if (!formData.ingredient_group_id) {
      toast({ title: t("common.error"), description: "Ingredient Group is required.", variant: "destructive" });
      return false;
    }
    if (!formData.classification_type_id) {
      toast({ title: t("common.error"), description: "Classification Type is required.", variant: "destructive" });
      return false;
    }
    if (!formData.base_unit_id) {
      toast({ title: t("common.error"), description: "Base Unit is required.", variant: "destructive" });
      return false;
    }
    if (!formData.purchase_unit_id) {
      toast({ title: t("common.error"), description: "Purchase Unit is required.", variant: "destructive" });
      return false;
    }
    if (!formData.conversion_factor || formData.conversion_factor <= 0) {
      toast({ title: t("common.error"), description: "Conversion Factor must be greater than 0.", variant: "destructive" });
      return false;
    }
    if (formData.max_stock_level > 0 && formData.max_stock_level < formData.min_stock_level) {
      toast({ title: t("common.error"), description: "Max Stock must be ≥ Min Stock.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSaveClick = () => {
    if (!validate()) return;
    setShowConfirmModal(true);
  };

  const doSave = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Prototype: only save existing DB columns
      const { error } = await supabase.from("ingredients").insert({
        name_en: formData.name_en,
        name_ar: formData.name_ar || null,
        name_ur: formData.name_ur || null,
        unit_id: formData.base_unit_id || null,
        cost_per_unit: costPerBaseUnit ?? 0,
        is_active: formData.is_active,
      });
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["ingredients-master-list"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients-master"] });

      toast({ title: t("common.success"), description: t("inventory.ingredientCreated") || "Ingredient created successfully" });
      return true;
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ title: t("common.error"), description: error.message || "Failed to create ingredient", variant: "destructive" });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmSave = async () => {
    const ok = await doSave();
    if (ok) {
      setShowConfirmModal(false);
      navigate("/inventory/ingredients");
    }
  };

  const handleSaveAndNew = async () => {
    if (!validate()) return;
    const ok = await doSave();
    if (ok) {
      setShowConfirmModal(false);
      // Reset form
      setFormData({
        name_en: "", name_ar: "", name_ur: "",
        description_en: "", description_ar: "", description_ur: "",
        ingredient_group_id: "", classification_type_id: "",
        track_in_inventory: true, can_be_sold: false,
        base_unit_id: "", purchase_unit_id: "",
        conversion_factor: 1, cost_per_purchase_unit: 0,
        storage_type_id: "", min_stock_level: 0, max_stock_level: 0,
        shelf_life_days: 0, expiry_tracking: false, temperature_sensitive: false,
        purchasable: true, return_on_cancel: true, is_active: true,
        internal_notes: "",
      });
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const ingredientSummary = {
    name: formData.name_en,
    group: ingredientGroups?.find((g) => g.id === formData.ingredient_group_id)
      ? getLocalizedLabel(ingredientGroups.find((g) => g.id === formData.ingredient_group_id)!)
      : "",
    classification: classificationTypes?.find((c) => c.id === formData.classification_type_id)
      ? getLocalizedLabel(classificationTypes.find((c) => c.id === formData.classification_type_id)!)
      : "",
    baseUnit: units?.find((u) => u.id === formData.base_unit_id)
      ? getLocalizedLabel(units.find((u) => u.id === formData.base_unit_id)!)
      : "",
    purchaseUnit: units?.find((u) => u.id === formData.purchase_unit_id)
      ? getLocalizedLabel(units.find((u) => u.id === formData.purchase_unit_id)!)
      : "",
    costPerBaseUnit: costPerBaseUnit ?? 0,
    trackInInventory: formData.track_in_inventory,
    purchasable: formData.purchasable,
    isActive: formData.is_active,
  };

  return (
    <div className="space-y-5 pb-24">
      <LoadingOverlay visible={isSaving} message={t("common.saving")} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory/ingredients")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("inventory.addIngredient")}</h1>
      </div>

      {/* Section 1: Basic Details */}
      <DashedSectionCard title="Basic Details" icon={Carrot} variant="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiLanguageInputWithIndicators
            label={t("ingredients.ingredientName")}
            values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
            onChange={handleNameChange}
            required
            singleLine
          />
          <MultiLanguageInputWithIndicators
            label="Description"
            values={{ en: formData.description_en, ar: formData.description_ar, ur: formData.description_ur }}
            onChange={handleDescriptionChange}
            singleLine={false}
          />
          <FormField label="Ingredient Group" required>
            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <SearchableSelect
                  value={formData.ingredient_group_id}
                  onChange={(v) => updateField("ingredient_group_id", v)}
                  options={groupOptions}
                  placeholder={t("common.select")}
                  searchPlaceholder={t("common.search")}
                  emptyText={t("common.noResults") || "No results found"}
                  isLoading={groupsLoading}
                />
              </div>
              <TooltipInfo content="Logical grouping for reporting and recipe mapping" />
            </div>
          </FormField>
          <FormField label="Classification Type" required>
            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <SearchableSelect
                  value={formData.classification_type_id}
                  onChange={(v) => updateField("classification_type_id", v)}
                  options={classificationOptions}
                  placeholder={t("common.select")}
                  searchPlaceholder={t("common.search")}
                  emptyText={t("common.noResults") || "No results found"}
                  isLoading={classTypesLoading}
                />
              </div>
              <TooltipInfo content="Veg / Non-Veg / Vegan / Halal classification" />
            </div>
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <Switch id="track_inventory" checked={formData.track_in_inventory} onCheckedChange={(v) => updateField("track_in_inventory", v)} />
            <Label htmlFor="track_inventory" className="text-sm cursor-pointer">Track In Inventory</Label>
            <TooltipInfo content="Enable to manage stock quantity and expiry" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="can_be_sold" checked={formData.can_be_sold} onCheckedChange={(v) => updateField("can_be_sold", v)} />
            <Label htmlFor="can_be_sold" className="text-sm cursor-pointer">Can Be Sold</Label>
            <TooltipInfo content="Enable only if this ingredient is sold directly" />
          </div>
        </div>
      </DashedSectionCard>

      {/* Section 2: Measurement & Cost */}
      <DashedSectionCard title="Measurement & Cost" icon={Scale} variant="green">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Base Unit" required>
            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <SearchableSelect
                  value={formData.base_unit_id}
                  onChange={(v) => updateField("base_unit_id", v)}
                  options={unitOptions}
                  placeholder={t("common.select")}
                  searchPlaceholder={t("common.search")}
                  emptyText={t("common.noResults") || "No results found"}
                  isLoading={unitsLoading}
                />
              </div>
              <TooltipInfo content="Unit used in recipes and consumption" />
            </div>
          </FormField>
          <FormField label="Purchase Unit" required>
            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <SearchableSelect
                  value={formData.purchase_unit_id}
                  onChange={(v) => updateField("purchase_unit_id", v)}
                  options={unitOptions}
                  placeholder={t("common.select")}
                  searchPlaceholder={t("common.search")}
                  emptyText={t("common.noResults") || "No results found"}
                  isLoading={unitsLoading}
                />
              </div>
              <TooltipInfo content="Unit used for supplier purchases" />
            </div>
          </FormField>
          <FormField label="Conversion Factor" required>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.conversion_factor}
                onChange={(e) => updateField("conversion_factor", parseFloat(e.target.value) || 0)}
                className="h-10"
              />
              <TooltipInfo content="Number of base units in one purchase unit" />
            </div>
          </FormField>
          <FormField label="Cost per Purchase Unit" required>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-muted-foreground font-medium">SAR</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost_per_purchase_unit}
                  onChange={(e) => updateField("cost_per_purchase_unit", parseFloat(e.target.value) || 0)}
                  className="h-10"
                />
              </div>
              <TooltipInfo content="Supplier cost per purchase unit" />
            </div>
          </FormField>
          <FormField label="Cost per Base Unit (Auto)">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-muted-foreground font-medium">SAR</span>
                <Input
                  type="text"
                  disabled
                  value={costPerBaseUnit !== null ? costPerBaseUnit.toFixed(4) : "--"}
                  className="h-10 bg-muted"
                />
              </div>
              <TooltipInfo content="Auto-calculated cost used in recipe costing" />
            </div>
          </FormField>
        </div>
      </DashedSectionCard>

      {/* Section 3: Inventory & Storage */}
      <DashedSectionCard title="Inventory & Storage" icon={Warehouse} variant="blue">
        <div className={cn("transition-opacity", !formData.track_in_inventory && "opacity-50 pointer-events-none")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Storage Type" required={formData.track_in_inventory}>
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <SearchableSelect
                    value={formData.storage_type_id}
                    onChange={(v) => updateField("storage_type_id", v)}
                    options={storageTypeOptions}
                    placeholder={t("common.select")}
                    searchPlaceholder={t("common.search")}
                    emptyText={t("common.noResults") || "No results found"}
                    isLoading={storageTypesLoading}
                  />
                </div>
                <TooltipInfo content="Dry, Chilled, Frozen, etc." />
              </div>
            </FormField>
            <FormField label="Min Stock Level" required={formData.track_in_inventory}>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min="0"
                  value={formData.min_stock_level}
                  onChange={(e) => updateField("min_stock_level", parseFloat(e.target.value) || 0)}
                  className="h-10"
                />
                <TooltipInfo content="Low-stock alert threshold" />
              </div>
            </FormField>
            <FormField label="Max Stock Level">
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min="0"
                  value={formData.max_stock_level}
                  onChange={(e) => updateField("max_stock_level", parseFloat(e.target.value) || 0)}
                  className="h-10"
                />
                <TooltipInfo content="Maximum recommended storage quantity" />
              </div>
            </FormField>
            <FormField label="Shelf Life (Days)">
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min="0"
                  value={formData.shelf_life_days}
                  onChange={(e) => updateField("shelf_life_days", parseInt(e.target.value) || 0)}
                  className="h-10"
                />
                <TooltipInfo content="Used to calculate expiry date" />
              </div>
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3">
              <Switch id="expiry_tracking" checked={formData.expiry_tracking} onCheckedChange={(v) => updateField("expiry_tracking", v)} />
              <Label htmlFor="expiry_tracking" className="text-sm cursor-pointer">Expiry Tracking</Label>
              <TooltipInfo content="Enable batch-wise expiry control" />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="temperature_sensitive" checked={formData.temperature_sensitive} onCheckedChange={(v) => updateField("temperature_sensitive", v)} />
              <Label htmlFor="temperature_sensitive" className="text-sm cursor-pointer">Temperature Sensitive</Label>
              <TooltipInfo content="Marks ingredient as requiring temperature control" />
            </div>
          </div>
        </div>
      </DashedSectionCard>

      {/* Section 4: Status & Controls */}
      <DashedSectionCard title="Status & Controls" icon={Settings} variant="amber">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Switch id="purchasable" checked={formData.purchasable} onCheckedChange={(v) => updateField("purchasable", v)} />
            <Label htmlFor="purchasable" className="text-sm cursor-pointer">Purchasable</Label>
            <TooltipInfo content="Available for procurement and supplier ordering" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="return_on_cancel" checked={formData.return_on_cancel} onCheckedChange={(v) => updateField("return_on_cancel", v)} />
            <Label htmlFor="return_on_cancel" className="text-sm cursor-pointer">Return on Cancel</Label>
            <TooltipInfo content="Restores stock when order is canceled" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="is_active" checked={formData.is_active} onCheckedChange={(v) => updateField("is_active", v)} />
            <Label htmlFor="is_active" className="text-sm cursor-pointer">
              {formData.is_active ? t("common.active") : t("common.inactive")}
            </Label>
            <TooltipInfo content="Inactive ingredients cannot be selected anywhere" />
          </div>
        </div>
      </DashedSectionCard>

      {/* Section 5: Notes */}
      <DashedSectionCard title="Notes" icon={FileText} variant="muted">
        <FormField label="Internal Notes">
          <div className="space-y-1">
            <Textarea
              maxLength={500}
              value={formData.internal_notes}
              onChange={(e) => updateField("internal_notes", e.target.value)}
              placeholder="Internal operational notes..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground text-end">{formData.internal_notes.length}/500</p>
          </div>
        </FormField>
      </DashedSectionCard>

      {/* Footer Actions */}
      <div className="fixed bottom-0 start-0 end-0 bg-background border-t shadow-lg z-10">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/inventory/ingredients")} className="gap-2">
            <X className="h-4 w-4" />
            {t("common.cancel")}
          </Button>
          <Button variant="secondary" onClick={handleSaveAndNew} className="gap-2" disabled={isSaving}>
            <Plus className="h-4 w-4" />
            Save & New
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
