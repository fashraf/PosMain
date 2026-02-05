import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import {
  useUnits,
  useStorageTypes,
  useIngredientGroups,
  useLocalizedLabel,
} from "@/hooks/useMaintenanceData";

const INGREDIENT_TYPES = [
  { id: "solid", label: "Solid" },
  { id: "liquid", label: "Liquid" },
  { id: "powder", label: "Powder" },
  { id: "other", label: "Other" },
];

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
  const getLocalizedLabel = useLocalizedLabel();

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    unit_id: "",
    cost_per_unit: 0,
    is_active: true,
  });

  const unitOptions = useMemo(() => 
    (units || []).map(u => ({ 
      id: u.id, 
      label: `${getLocalizedLabel(u)} (${u.symbol})` 
    })), 
    [units, getLocalizedLabel]
  );

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleSaveClick = () => {
    if (!formData.name_en) {
      toast({
        title: t("common.error") || "Error",
        description: "Please fill in the ingredient name (English).",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase.from("ingredients").insert({
        name_en: formData.name_en,
        name_ar: formData.name_ar || null,
        name_ur: formData.name_ur || null,
        unit_id: formData.unit_id || null,
        cost_per_unit: formData.cost_per_unit,
        is_active: formData.is_active,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["ingredients-master-list"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients-master"] });

      toast({
        title: t("common.success") || "Success",
        description: t("inventory.ingredientCreated") || "Ingredient created successfully",
      });
      
      setShowConfirmModal(false);
      navigate("/inventory/ingredients");
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to create ingredient",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const ingredientSummary = {
    name: formData.name_en,
    type: "",
    unit: units?.find((u) => u.id === formData.unit_id)?.name_en || "",
    storageType: "",
    categories: [],
    costPrice: formData.cost_per_unit,
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

      {/* Section 1: Ingredient Basics */}
      <DashedSectionCard title={t("ingredients.ingredientBasics") || "Ingredient Basics"} icon={Carrot} variant="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiLanguageInputWithIndicators
            label={t("ingredients.ingredientName")}
            values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
            onChange={handleNameChange}
            required
            singleLine
          />
        </div>
      </DashedSectionCard>

      {/* Section 2: Classification */}
      <DashedSectionCard title={t("ingredients.classification") || "Classification"} icon={Tag} variant="green">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("common.unit")}>
            <SearchableSelect
              value={formData.unit_id}
              onChange={(value) => setFormData((prev) => ({ ...prev, unit_id: value }))}
              options={unitOptions}
              placeholder={t("common.select")}
              searchPlaceholder={t("common.search")}
              emptyText={t("common.noResults") || "No results found"}
              isLoading={unitsLoading}
            />
          </FormField>
        </div>
      </DashedSectionCard>

      {/* Section 3: Pricing */}
      <DashedSectionCard title={t("ingredients.pricing") || "Pricing"} icon={DollarSign} variant="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField label={t("ingredients.costPrice") || "Cost per Unit"} required>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">SAR</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_per_unit}
                onChange={(e) => setFormData((prev) => ({ ...prev, cost_per_unit: parseFloat(e.target.value) || 0 }))}
                className="h-10"
              />
            </div>
          </FormField>

          <div className="flex items-center gap-3 h-10">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active" className="text-sm cursor-pointer">
              {formData.is_active ? t("common.active") : t("common.inactive")}
            </Label>
          </div>
        </div>
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
