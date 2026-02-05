import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { ImageUploadHero } from "@/components/shared/ImageUploadHero";
import { MultiLanguageInputWithIndicators } from "@/components/shared/MultiLanguageInputWithIndicators";
import { InventoryProgressCard } from "@/components/shared/InventoryProgressCard";
import { AllergenPicker, type AllergenType } from "@/components/shared/AllergenPicker";
import { ItemSaveConfirmModal } from "@/components/items/ItemSaveConfirmModal";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { SectionNavigationBar, type SectionNavItem } from "@/components/shared/SectionNavigationBar";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { SearchableMultiSelect } from "@/components/shared/SearchableMultiSelect";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
import {
  useCategories,
  useSubcategories,
  useServingTimes,
  useItemTypes,
  useLocalizedLabel,
} from "@/hooks/useMaintenanceData";
import {
  ReplacementModal,
  type ReplacementItem,
} from "@/components/item-mapping";
import {
  IngredientMappingList,
  type IngredientMappingItem,
} from "@/components/item-mapping/IngredientMappingList";
import {
  ItemTable,
  AddIngredientModal,
  AddItemModal,
  RemoveConfirmModal,
  type SubItemMappingItem,
  type AvailableIngredient,
  type AvailableItem,
} from "@/components/item-mapping";
import { Save, X, FileText, Tags, Clock, BarChart3, Carrot, Package, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock available items for combo (will be replaced with real data later)
const mockAvailableItems: AvailableItem[] = [
  { id: "101", name_en: "Margherita Pizza", name_ar: "بيتزا مارغريتا", name_ur: "مارگریٹا پیزا", base_cost: 12.99, is_combo: false },
  { id: "102", name_en: "Chicken Burger", name_ar: "برجر دجاج", name_ur: "چکن برگر", base_cost: 8.99, is_combo: false },
  { id: "103", name_en: "Soft Drink", name_ar: "مشروب غازي", name_ur: "سافٹ ڈرنک", base_cost: 2.50, is_combo: false },
  { id: "104", name_en: "French Fries", name_ar: "بطاطس مقلية", name_ur: "فرنچ فرائز", base_cost: 3.99, is_combo: false },
];

export default function ItemsAdd() {
  const { t, isRTL, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real ingredients from database
  const { data: availableIngredients = [], isLoading: ingredientsLoading } = useQuery({
    queryKey: ["ingredients-master"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingredients")
        .select("*, units(symbol)")
        .eq("is_active", true)
        .order("name_en");
      if (error) throw error;
      return (data || []).map((ing) => ({
        id: ing.id,
        name_en: ing.name_en,
        name_ar: ing.name_ar || "",
        name_ur: ing.name_ur || "",
        unit: ing.units?.symbol || "unit",
        cost_per_unit: Number(ing.cost_per_unit) || 0,
        current_stock: 100,
        min_stock: 10,
        reorder_level: 25,
      })) as AvailableIngredient[];
    },
  });

  // Dynamic data hooks
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(undefined);
  const { data: servingTimes, isLoading: servingTimesLoading } = useServingTimes();
  const { data: itemTypes, isLoading: itemTypesLoading } = useItemTypes();
  const getLocalizedLabel = useLocalizedLabel();

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

  // Confirmation modal states
  const [comboConfirm, setComboConfirm] = useState<{open: boolean; newValue: boolean}>({open: false, newValue: false});
  const [statusConfirm, setStatusConfirm] = useState<{open: boolean; newValue: boolean}>({open: false, newValue: false});

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("basics");

  // Mapping states
  const [ingredientMappings, setIngredientMappings] = useState<IngredientMappingItem[]>([]);
  const [subItemMappings, setSubItemMappings] = useState<SubItemMappingItem[]>([]);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<{
    id: string;
    name: string;
    type: "ingredient" | "item";
  } | null>(null);

  // Section refs for scrolling and validation
  const sectionRefs = {
    basics: useRef<HTMLDivElement>(null),
    classification: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    inventory: useRef<HTMLDivElement>(null),
    ingredients: useRef<HTMLDivElement>(null),
    items: useRef<HTMLDivElement>(null),
  };

  // Input refs for validation focus
  const nameInputRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const servingTimeRef = useRef<HTMLDivElement>(null);

  // Transform dynamic data for dropdowns
  const categoryOptions = useMemo(() => 
    (categories || []).map(c => ({ id: c.id, label: getLocalizedLabel(c) })), 
    [categories, getLocalizedLabel]
  );

  const subcategoryOptions = useMemo(() => {
    const filtered = formData.category 
      ? (subcategories || []).filter(s => s.parent_category_id === formData.category)
      : (subcategories || []);
    return filtered.map(s => ({ id: s.id, label: getLocalizedLabel(s) }));
  }, [subcategories, formData.category, getLocalizedLabel]);

  const servingTimeOptions = useMemo(() => 
    (servingTimes || []).map(s => ({ id: s.id, label: getLocalizedLabel(s) })), 
    [servingTimes, getLocalizedLabel]
  );

  const itemTypeOptions = useMemo(() => 
    (itemTypes || []).map(i => ({ id: i.id, label: getLocalizedLabel(i) })), 
    [itemTypes, getLocalizedLabel]
  );

  // Reset subcategories when category changes
  const prevCategoryRef = useRef(formData.category);
  useEffect(() => {
    if (prevCategoryRef.current !== formData.category && prevCategoryRef.current !== "") {
      setFormData(prev => ({ ...prev, subcategories: [] }));
    }
    prevCategoryRef.current = formData.category;
  }, [formData.category]);

  // Completion logic
  const isBasicsComplete = !!formData.name_en;
  const isClassificationComplete = !!formData.category && formData.serving_times.length > 0;
  const isDetailsComplete = false;
  const isInventoryComplete = false;
  const isIngredientsComplete = ingredientMappings.length > 0;
  const isItemsComplete = subItemMappings.length > 0;

  // Navigation sections
  const sections: SectionNavItem[] = useMemo(() => {
    const baseSections: SectionNavItem[] = [
      { id: "basics", label: t("items.basicInformation"), icon: FileText, isComplete: isBasicsComplete },
      { id: "classification", label: t("items.classification"), icon: Tags, isComplete: isClassificationComplete },
      { id: "details", label: t("items.details"), icon: Clock, isComplete: isDetailsComplete },
      { id: "inventory", label: t("items.inventory"), icon: BarChart3, isComplete: isInventoryComplete },
      { id: "ingredients", label: t("itemMapping.ingredients"), icon: Carrot, isComplete: isIngredientsComplete },
    ];
    
    if (formData.is_combo) {
      baseSections.push({ id: "items", label: t("itemMapping.items"), icon: Package, isComplete: isItemsComplete });
    }
    
    return baseSections;
  }, [t, isBasicsComplete, isClassificationComplete, isDetailsComplete, isInventoryComplete, isIngredientsComplete, isItemsComplete, formData.is_combo]);

  const handleNavigate = (sectionId: string) => {
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  // Intersection observer for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
        );
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [formData.is_combo]);

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

  // Toggle confirmation handlers
  const handleComboToggle = (checked: boolean) => {
    if (checked) {
      setComboConfirm({ open: true, newValue: true });
    } else {
      setFormData((prev) => ({ ...prev, is_combo: false }));
    }
  };

  const confirmComboChange = () => {
    setFormData((prev) => ({ ...prev, is_combo: comboConfirm.newValue }));
    setComboConfirm({ open: false, newValue: false });
  };

  const handleStatusToggle = (checked: boolean) => {
    if (!checked) {
      setStatusConfirm({ open: true, newValue: false });
    } else {
      setFormData((prev) => ({ ...prev, is_active: true }));
    }
  };

  const confirmStatusChange = () => {
    setFormData((prev) => ({ ...prev, is_active: statusConfirm.newValue }));
    setStatusConfirm({ open: false, newValue: false });
  };

  // Ingredient mapping handlers
  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const mappedIngredientIds = ingredientMappings.map((m) => m.ingredient_id);
  const mappedSubItemIds = subItemMappings.map((m) => m.sub_item_id);

  const handleAddIngredient = (ingredient: AvailableIngredient, quantity: number, extraCost: number) => {
    const newMapping: IngredientMappingItem = {
      id: `m${Date.now()}`,
      ingredient_id: ingredient.id,
      ingredient_name: getLocalizedName(ingredient),
      quantity,
      unit: ingredient.unit,
      can_remove: true,
      can_add_extra: extraCost > 0,
      extra_cost: extraCost > 0 ? extraCost : null,
      sort_order: ingredientMappings.length + 1,
    };
    setIngredientMappings([...ingredientMappings, newMapping]);
  };

  const handleAddItem = (subItem: AvailableItem, quantity: number) => {
    const newMapping: SubItemMappingItem = {
      id: `s${Date.now()}`,
      sub_item_id: subItem.id,
      sub_item_name: getLocalizedName(subItem),
      quantity,
      unit_price: subItem.base_cost,
      sort_order: subItemMappings.length + 1,
      combo_price: 0,
      replacements: [],
    };
    setSubItemMappings([...subItemMappings, newMapping]);
  };

  const handleRequestRemove = (id: string, name: string, type: "ingredient" | "item") => {
    setRemoveConfirm({ id, name, type });
  };

  const confirmRemove = () => {
    if (!removeConfirm) return;
    
    if (removeConfirm.type === "ingredient") {
      setIngredientMappings(
        ingredientMappings
          .filter((m) => m.id !== removeConfirm.id)
          .map((m, i) => ({ ...m, sort_order: i + 1 }))
      );
    } else {
      setSubItemMappings(
        subItemMappings
          .filter((m) => m.id !== removeConfirm.id)
          .map((m, i) => ({ ...m, sort_order: i + 1 }))
      );
    }
    setRemoveConfirm(null);
  };

  const handleIngredientMappingsChange = (updatedMappings: IngredientMappingItem[]) => {
    setIngredientMappings(updatedMappings);
  };

  const handleIngredientRemove = (id: string) => {
    const mapping = ingredientMappings.find((m) => m.id === id);
    if (mapping) {
      handleRequestRemove(id, mapping.ingredient_name, "ingredient");
    }
  };

  const handleItemQuantityChange = (mappingId: string, quantity: number) => {
    setSubItemMappings(
      subItemMappings.map((m) => (m.id === mappingId ? { ...m, quantity } : m))
    );
  };

  // Replacement modal state
  const [replacementModalState, setReplacementModalState] = useState({
    open: false,
    mappingId: "",
    parentName: "",
  });

  const handleOpenReplacementModal = (mappingId: string) => {
    const mapping = subItemMappings.find((m) => m.id === mappingId);
    if (mapping) {
      setReplacementModalState({
        open: true,
        mappingId,
        parentName: mapping.sub_item_name,
      });
    }
  };

  const handleReplacementsChange = (replacements: ReplacementItem[]) => {
    setSubItemMappings((prev) =>
      prev.map((m) =>
        m.id === replacementModalState.mappingId
          ? { ...m, replacements }
          : m
      )
    );
  };

  const handleRemoveReplacement = (mappingId: string, replacementId: string) => {
    setSubItemMappings((prev) =>
      prev.map((m) => {
        if (m.id === mappingId && m.replacements) {
          const filtered = m.replacements.filter((r) => r.id !== replacementId);
          if (filtered.length > 0 && !filtered.some((r) => r.is_default)) {
            filtered[0].is_default = true;
          }
          return { ...m, replacements: filtered };
        }
        return m;
      })
    );
  };

  const handleViewReplacement = (mappingId: string, _replacementId: string) => {
    handleOpenReplacementModal(mappingId);
  };

  const currentReplacements = useMemo(() => {
    const mapping = subItemMappings.find((m) => m.id === replacementModalState.mappingId);
    return mapping?.replacements || [];
  }, [subItemMappings, replacementModalState.mappingId]);

  // Cost calculations
  const totalIngredientCost = useMemo(() => {
    return ingredientMappings.reduce((sum, m) => {
      const ingredient = availableIngredients.find((i) => i.id === m.ingredient_id);
      return sum + (ingredient ? m.quantity * ingredient.cost_per_unit : 0);
    }, 0);
  }, [ingredientMappings, availableIngredients]);

  const totalSubItemCost = useMemo(() => {
    return subItemMappings.reduce((sum, m) => sum + m.quantity * m.unit_price, 0);
  }, [subItemMappings]);

  // Validation with scroll-to-first-error
  const handleSave = () => {
    if (!formData.name_en) {
      toast({ title: "Validation Error", description: "Please fill Item Name (English)", variant: "destructive" });
      nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const input = nameInputRef.current?.querySelector("input");
        input?.focus();
      }, 400);
      return;
    }
    
    if (!formData.category) {
      toast({ title: "Validation Error", description: "Please select a Category", variant: "destructive" });
      categoryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const trigger = categoryRef.current?.querySelector("button");
        trigger?.focus();
      }, 400);
      return;
    }
    
    if (formData.serving_times.length === 0) {
      toast({ title: "Validation Error", description: "Please select at least one Serving Time", variant: "destructive" });
      servingTimeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    
    try {
      // Upload image if exists
      let imageUrl = formData.image_url;
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("item-images")
          .getPublicUrl(uploadData.path);
        
        imageUrl = publicUrl;
      }

      // Insert item
      const { data: newItem, error: itemError } = await supabase
        .from("items")
        .insert({
          name_en: formData.name_en,
          name_ar: formData.name_ar || null,
          name_ur: formData.name_ur || null,
          description_en: formData.description_en || null,
          description_ar: formData.description_ar || null,
          description_ur: formData.description_ur || null,
          item_type: formData.item_type,
          base_cost: formData.base_cost,
          is_combo: formData.is_combo,
          image_url: imageUrl,
          is_active: formData.is_active,
          category_id: formData.category || null,
          is_customizable: ingredientMappings.length > 0,
          is_favorite: false,
          sort_order: 0,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Insert ingredient mappings
      if (ingredientMappings.length > 0) {
        const mappingsToInsert = ingredientMappings.map((m, index) => ({
          item_id: newItem.id,
          ingredient_id: m.ingredient_id,
          quantity: m.quantity,
          sort_order: index + 1,
          can_remove: m.can_remove,
          can_add_extra: m.can_add_extra,
          extra_cost: m.extra_cost,
        }));

        const { error: mappingError } = await supabase
          .from("item_ingredients")
          .insert(mappingsToInsert);

        if (mappingError) throw mappingError;
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["items-master"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({ title: t("items.addItem"), description: `${formData.name_en} has been added.` });
      setShowConfirmModal(false);
      navigate("/items");
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save item", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/items");
  };

  return (
    <div className="relative pb-24">
      <LoadingOverlay visible={isSaving} message={t("common.saving")} />

      {/* Section Navigation */}
      <SectionNavigationBar
        sections={sections}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onBack={handleCancel}
      />

      {/* Form Content */}
      <div className="flex flex-col lg:flex-row gap-6 pt-4">
        {/* Left Column - 33% (Sticky Sidebar) */}
        <aside className="w-full lg:w-1/3 space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Image Upload */}
          <DashedSectionCard
            title={t("items.image")}
            icon={FileText}
            variant="purple"
          >
            <div className="flex justify-center">
              <ImageUploadHero
                value={formData.image_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                onFileChange={(file) => setImageFile(file)}
                size={120}
              />
            </div>
          </DashedSectionCard>

          {/* Inventory Progress */}
          <div ref={sectionRefs.inventory} id="inventory">
            <DashedSectionCard
              title={t("items.inventory")}
              icon={BarChart3}
              variant="amber"
              isComplete={isInventoryComplete}
            >
              <InventoryProgressCard
                currentStock={formData.current_stock}
                maxStock={100}
                lowStockThreshold={formData.low_stock_threshold}
                onCurrentStockChange={(val) => setFormData((prev) => ({ ...prev, current_stock: val }))}
                onThresholdChange={(val) => setFormData((prev) => ({ ...prev, low_stock_threshold: val }))}
              />
            </DashedSectionCard>
          </div>

          {/* Status Section */}
          <DashedSectionCard
            title={t("common.status")}
            icon={Tags}
            variant="muted"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="isCombo">{t("items.isCombo")}</Label>
                  <TooltipInfo content={t("items.comboTooltip")} />
                </div>
                <Switch
                  id="isCombo"
                  checked={formData.is_combo}
                  onCheckedChange={handleComboToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="status">{t("common.active")}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formData.is_active ? t("common.active") : t("common.inactive")}
                  </span>
                  <Switch
                    id="status"
                    checked={formData.is_active}
                    onCheckedChange={handleStatusToggle}
                  />
                </div>
              </div>
            </div>
          </DashedSectionCard>
        </aside>

        {/* Right Column - 67% (Scrollable Sections) */}
        <main className="w-full lg:w-2/3 space-y-6">
          {/* Basics Section */}
          <div ref={sectionRefs.basics} id="basics">
            <DashedSectionCard
              title={t("items.basicInformation")}
              icon={FileText}
              variant="purple"
              isComplete={isBasicsComplete}
            >
              <div className="space-y-4">
                <div ref={nameInputRef}>
                  <MultiLanguageInputWithIndicators
                    label={t("items.itemName")}
                    values={{
                      en: formData.name_en,
                      ar: formData.name_ar,
                      ur: formData.name_ur,
                    }}
                    onChange={handleNameChange}
                    required
                  />
                </div>

                <MultiLanguageInputWithIndicators
                  label={t("common.description")}
                  values={{
                    en: formData.description_en,
                    ar: formData.description_ar,
                    ur: formData.description_ur,
                  }}
                  onChange={handleDescriptionChange}
                  multiline
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("items.baseCost")} *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.base_cost}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          base_cost: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("items.itemType")}</Label>
                    <SearchableSelect
                      value={formData.item_type}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          item_type: value as "edible" | "non_edible",
                        }))
                      }
                      options={[
                        { id: "edible", label: t("items.edible") },
                        { id: "non_edible", label: t("items.nonEdible") },
                      ]}
                      placeholder={t("common.select")}
                      searchPlaceholder={t("common.search")}
                    />
                  </div>
                </div>
              </div>
            </DashedSectionCard>
          </div>

          {/* Classification Section */}
          <div ref={sectionRefs.classification} id="classification">
            <DashedSectionCard
              title={t("items.classification")}
              icon={Tags}
              variant="green"
              isComplete={isClassificationComplete}
            >
              <div className="space-y-4">
                <div ref={categoryRef} className="space-y-2">
                  <Label>{t("items.category")} *</Label>
                  <SearchableSelect
                    value={formData.category}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                    options={categoryOptions}
                    placeholder={t("common.select")}
                    searchPlaceholder={t("common.search")}
                    isLoading={categoriesLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("items.subcategories")}</Label>
                  <SearchableMultiSelect
                    value={formData.subcategories}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, subcategories: value }))
                    }
                    options={subcategoryOptions}
                    placeholder={t("common.select")}
                    searchPlaceholder={t("common.search")}
                    isLoading={subcategoriesLoading}
                  />
                </div>

                <div ref={servingTimeRef} className="space-y-2">
                  <Label>{t("items.servingTimes")} *</Label>
                  <div className="flex flex-wrap gap-2">
                    {servingTimeOptions.map((time) => (
                      <div
                        key={time.id}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors",
                          formData.serving_times.includes(time.id)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-muted"
                        )}
                        onClick={() => handleServingTimeToggle(time.id)}
                      >
                        <Checkbox
                          checked={formData.serving_times.includes(time.id)}
                          className="pointer-events-none"
                        />
                        <span className="text-sm">{time.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DashedSectionCard>
          </div>

          {/* Details Section */}
          <div ref={sectionRefs.details} id="details">
            <DashedSectionCard
              title={t("items.details")}
              icon={Clock}
              variant="blue"
              isComplete={isDetailsComplete}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("items.preparationTime")}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={formData.preparation_time_minutes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preparation_time_minutes: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                      <span className="text-sm text-muted-foreground">min</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("items.calories")}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.calories || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          calories: e.target.value ? parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder={t("common.optional")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("items.allergens")}</Label>
                  <AllergenPicker
                    value={formData.allergens}
                    onChange={(allergens) =>
                      setFormData((prev) => ({ ...prev, allergens }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("items.highlights")}</Label>
                  <Input
                    value={formData.highlights}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, highlights: e.target.value }))
                    }
                    placeholder="e.g., Crispy, Fresh, Authentic"
                  />
                </div>
              </div>
            </DashedSectionCard>
          </div>

          {/* Ingredients Section */}
          <div ref={sectionRefs.ingredients} id="ingredients">
            <DashedSectionCard
              title={t("itemMapping.ingredients")}
              icon={Carrot}
              variant="muted"
              isComplete={isIngredientsComplete}
              rightBadge={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddIngredientModal(true)}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {t("itemMapping.addIngredient")}
                </Button>
              }
            >
              <IngredientMappingList
                mappings={ingredientMappings}
                onChange={handleIngredientMappingsChange}
                onRemove={handleIngredientRemove}
              />
              
              {ingredientMappings.length > 0 && (
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("itemMapping.totalIngredientCost")}
                  </span>
                  <span className="font-medium">SAR {totalIngredientCost.toFixed(2)}</span>
                </div>
              )}
            </DashedSectionCard>
          </div>

          {/* Sub-Items Section (for combos) */}
          {formData.is_combo && (
            <div ref={sectionRefs.items} id="items">
              <DashedSectionCard
                title={t("itemMapping.items")}
                icon={Package}
                variant="muted"
                isComplete={isItemsComplete}
                rightBadge={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddItemModal(true)}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    {t("itemMapping.addItem")}
                  </Button>
                }
              >
                <ItemTable
                  mappings={subItemMappings}
                  onQuantityChange={handleItemQuantityChange}
                  onRemove={(id) => {
                    const mapping = subItemMappings.find((m) => m.id === id);
                    if (mapping) handleRequestRemove(id, mapping.sub_item_name, "item");
                  }}
                  onAdd={() => setShowAddItemModal(true)}
                  onReplacement={handleOpenReplacementModal}
                  onRemoveReplacement={handleRemoveReplacement}
                  onViewReplacement={handleViewReplacement}
                  totalCost={totalSubItemCost}
                  totalComboPrice={totalSubItemCost}
                  isCombo={formData.is_combo}
                />
                
                {subItemMappings.length > 0 && (
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("itemMapping.totalSubItemCost")}
                    </span>
                    <span className="font-medium">SAR {totalSubItemCost.toFixed(2)}</span>
                  </div>
                )}
              </DashedSectionCard>
            </div>
          )}
        </main>
      </div>

      {/* Footer Actions */}
      <div
        className={cn(
          "fixed bottom-0 bg-background border-t shadow-lg z-10 px-4 py-3",
          isRTL ? "left-0 right-64" : "left-64 right-0"
        )}
      >
        <div className="max-w-6xl mx-auto flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} className="gap-2">
            <X className="h-4 w-4" />
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {t("common.save")}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AddIngredientModal
        open={showAddIngredientModal}
        onOpenChange={setShowAddIngredientModal}
        onConfirm={handleAddIngredient}
        ingredients={availableIngredients}
        mappedIds={mappedIngredientIds}
        currentLanguage={currentLanguage}
      />

      <AddItemModal
        open={showAddItemModal}
        onOpenChange={setShowAddItemModal}
        onConfirm={(item, qty) => handleAddItem(item, qty)}
        items={mockAvailableItems}
        mappedIds={mappedSubItemIds}
        currentItemId=""
        currentLanguage={currentLanguage}
      />

      <RemoveConfirmModal
        open={!!removeConfirm}
        onOpenChange={() => setRemoveConfirm(null)}
        onConfirm={confirmRemove}
        itemName={removeConfirm?.name || ""}
        itemType={removeConfirm?.type || "ingredient"}
      />

      <ReplacementModal
        open={replacementModalState.open}
        onOpenChange={(open) =>
          setReplacementModalState((prev) => ({ ...prev, open }))
        }
        parentItemName={replacementModalState.parentName}
        parentItemId={replacementModalState.mappingId}
        replacements={currentReplacements}
        onReplacementsChange={handleReplacementsChange}
        availableItems={mockAvailableItems}
        currentLanguage={currentLanguage}
      />

      <ItemSaveConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
        item={{
          name_en: formData.name_en,
          name_ar: formData.name_ar,
          name_ur: formData.name_ur,
          description_en: formData.description_en,
          item_type: formData.item_type,
          category: formData.category ? categories?.find((c) => c.id === formData.category)?.name_en || "" : "",
          subcategories: formData.subcategories,
          serving_times: formData.serving_times,
          is_active: formData.is_active,
          is_combo: formData.is_combo,
          base_cost: formData.base_cost,
          prep_time: formData.preparation_time_minutes || 0,
          calories: formData.calories,
          highlights: formData.highlights,
          allergens: formData.allergens,
          current_stock: formData.current_stock,
          low_stock_threshold: formData.low_stock_threshold,
          ingredientMappings: ingredientMappings,
          itemMappings: subItemMappings,
          ingredientTotalCost: totalIngredientCost,
          itemTotalCost: totalSubItemCost,
        }}
      />

      {/* Confirmation Modals */}
      <ConfirmActionModal
        open={comboConfirm.open}
        onOpenChange={(open) => setComboConfirm((prev) => ({ ...prev, open }))}
        onConfirm={confirmComboChange}
        title={t("items.enableComboMode")}
        message={t("items.comboModeDescription") || "This will enable combo mode for this item."}
        confirmLabel={t("common.confirm")}
      />

      <ConfirmActionModal
        open={statusConfirm.open}
        onOpenChange={(open) => setStatusConfirm((prev) => ({ ...prev, open }))}
        onConfirm={confirmStatusChange}
        title={t("items.deactivateItem")}
        message={t("items.deactivateItemDescription") || "This will deactivate the item."}
        confirmLabel={t("common.confirm")}
        variant="destructive"
      />
    </div>
  );
}
