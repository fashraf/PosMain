import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
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
  IngredientTable,
  ItemTable,
  AddIngredientModal,
  AddItemModal,
  RemoveConfirmModal,
  type IngredientMappingItem,
  type SubItemMappingItem,
  type AvailableIngredient,
  type AvailableItem,
} from "@/components/item-mapping";
import { Save, X, FileText, Tags, Clock, BarChart3, Carrot, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock available ingredients
const mockAvailableIngredients: AvailableIngredient[] = [
  { id: "1", name_en: "Tomato", name_ar: "طماطم", name_ur: "ٹماٹر", unit: "Kg", cost_per_unit: 5.00, current_stock: 150, min_stock: 10, reorder_level: 25 },
  { id: "2", name_en: "Cheese", name_ar: "جبنة", name_ur: "پنیر", unit: "Kg", cost_per_unit: 12.00, current_stock: 25, min_stock: 5, reorder_level: 15 },
  { id: "3", name_en: "Chicken Breast", name_ar: "صدر دجاج", name_ur: "چکن بریسٹ", unit: "Kg", cost_per_unit: 12.00, current_stock: 5, min_stock: 10, reorder_level: 20 },
  { id: "4", name_en: "Olive Oil", name_ar: "زيت زيتون", name_ur: "زیتون کا تیل", unit: "L", cost_per_unit: 5.00, current_stock: 20, min_stock: 5, reorder_level: 10 },
  { id: "5", name_en: "Basil", name_ar: "ريحان", name_ur: "تلسی", unit: "Kg", cost_per_unit: 20.00, current_stock: 8, min_stock: 2, reorder_level: 5 },
  { id: "6", name_en: "Lettuce", name_ar: "خس", name_ur: "سلاد پتہ", unit: "Pcs", cost_per_unit: 0.15, current_stock: 100, min_stock: 20, reorder_level: 50 },
  { id: "7", name_en: "Mushrooms", name_ar: "فطر", name_ur: "مشروم", unit: "Kg", cost_per_unit: 8.00, current_stock: 15, min_stock: 5, reorder_level: 10 },
];

// Mock available items for combo
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
  const isDetailsComplete = false; // Optional section
  const isInventoryComplete = false; // Optional section
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
      can_remove: false,
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

  const handleIngredientQuantityChange = (mappingId: string, quantity: number) => {
    setIngredientMappings(
      ingredientMappings.map((m) => (m.id === mappingId ? { ...m, quantity } : m))
    );
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
      const ingredient = mockAvailableIngredients.find((i) => i.id === m.ingredient_id);
      return sum + (ingredient ? m.quantity * ingredient.cost_per_unit : 0);
    }, 0);
  }, [ingredientMappings]);

  const totalSubItemCost = useMemo(() => {
    return subItemMappings.reduce((sum, m) => sum + m.quantity * m.unit_price, 0);
  }, [subItemMappings]);

  // Validation with scroll-to-first-error
  const handleSave = () => {
    // Check name
    if (!formData.name_en) {
      toast({ title: "Validation Error", description: "Please fill Item Name (English)", variant: "destructive" });
      nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const input = nameInputRef.current?.querySelector("input");
        input?.focus();
      }, 400);
      return;
    }
    
    // Check category
    if (!formData.category) {
      toast({ title: "Validation Error", description: "Please select a Category", variant: "destructive" });
      categoryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const trigger = categoryRef.current?.querySelector("button");
        trigger?.focus();
      }, 400);
      return;
    }
    
    // Check serving times
    if (formData.serving_times.length === 0) {
      toast({ title: "Validation Error", description: "Please select at least one Serving Time", variant: "destructive" });
      servingTimeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    
    // TODO: Upload imageFile to storage bucket here
    // const imageUrl = await uploadImage(imageFile);
    
    setTimeout(() => {
      toast({ title: t("items.addItem"), description: `${formData.name_en} has been added.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/items");
    }, 800);
  };

  const confirmModalItem = useMemo(() => ({
    // Identity
    name_en: formData.name_en || "New Item",
    name_ar: formData.name_ar,
    name_ur: formData.name_ur,
    description_en: formData.description_en,
    image_url: formData.image_url,

    // Classification
    item_type: itemTypes?.find((i) => i.id === formData.item_type)?.name_en || formData.item_type,
    category: categories?.find((c) => c.id === formData.category)?.name_en || "",
    subcategories: formData.subcategories.map((id) => subcategories?.find((s) => s.id === id)?.name_en || "").filter(Boolean),
    serving_times: formData.serving_times.map((id) => servingTimes?.find((s) => s.id === id)?.name_en || "").filter(Boolean),
    
    // Status
    is_active: formData.is_active,
    is_combo: formData.is_combo,
    base_cost: formData.base_cost,

    // Details
    prep_time: formData.preparation_time_minutes,
    calories: formData.calories,
    highlights: formData.highlights,
    allergens: formData.allergens,

    // Inventory
    current_stock: formData.current_stock,
    low_stock_threshold: formData.low_stock_threshold,

    // Mappings
    ingredientCount: ingredientMappings.length,
    itemCount: subItemMappings.length,
    ingredientMappings: ingredientMappings,
    itemMappings: subItemMappings,
    ingredientTotalCost: totalIngredientCost,
    itemTotalCost: totalSubItemCost,
  }), [formData, ingredientMappings, subItemMappings, totalIngredientCost, totalSubItemCost, categories, subcategories, servingTimes, itemTypes]);

  return (
    <>
      <LoadingOverlay visible={isSaving} message="Saving item..." />
      
      <div className="pb-24">
        <div>
          {/* Section Navigation Bar with Back button */}
          <SectionNavigationBar
            sections={sections}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onBack={() => navigate("/items")}
            backLabel="BACK"
          />

          <div className="space-y-4 pt-3">
            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column - 4/12 */}
              <div className="lg:col-span-4 space-y-4">
                {/* Basic Info Left (Image, Name, Description) */}
                <div ref={sectionRefs.basics}>
                  <DashedSectionCard 
                    id="basics"
                    title={t("items.basicInformation")} 
                    icon={FileText} 
                    variant="purple"
                    isComplete={isBasicsComplete}
                  >
                    <div className="space-y-3">
                      {/* Hero Image Upload - reduced size */}
                      <ImageUploadHero
                        value={formData.image_url}
                        onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                        onFileChange={setImageFile}
                        size={100}
                        className="mx-auto"
                      />

                      {/* Item Name with indicators */}
                      <div ref={nameInputRef}>
                        <MultiLanguageInputWithIndicators
                          label={t("items.itemName")}
                          values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
                          onChange={handleNameChange}
                          required
                          placeholder="Enter item name..."
                        />
                      </div>

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
                </div>

                {/* Inventory Section */}
                <div ref={sectionRefs.inventory}>
                  <DashedSectionCard 
                    id="inventory"
                    title={t("items.inventory")} 
                    icon={BarChart3} 
                    variant="amber"
                    isComplete={isInventoryComplete}
                  >
                    <InventoryProgressCard
                      currentStock={formData.current_stock}
                      maxStock={100}
                      lowStockThreshold={formData.low_stock_threshold}
                      onCurrentStockChange={(value) => setFormData((prev) => ({ ...prev, current_stock: value }))}
                      onThresholdChange={(value) => setFormData((prev) => ({ ...prev, low_stock_threshold: value }))}
                    />
                  </DashedSectionCard>
                </div>
              </div>

              {/* Right Column - 8/12 */}
              <div className="lg:col-span-8 space-y-4">
                {/* Basic Info Right (Type, Cost, Toggles) */}
                <DashedSectionCard title={t("items.basicInformation")} icon={FileText} variant="purple">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium mb-1 flex items-center gap-1">
                          {t("items.itemType")}
                          <TooltipInfo content={t("tooltips.itemType")} />
                        </Label>
                        <SearchableSelect
                          value={formData.item_type}
                          onChange={(value) => setFormData((prev) => ({ ...prev, item_type: value as "edible" | "non_edible" }))}
                          options={itemTypeOptions}
                          placeholder={t("common.select")}
                          searchPlaceholder={t("common.search")}
                          emptyText={t("common.noResults") || "No results"}
                          isLoading={itemTypesLoading}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1 block">{t("items.baseCost")} (SAR)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.base_cost}
                          onChange={(e) => setFormData((prev) => ({ ...prev, base_cost: parseFloat(e.target.value) || 0 }))}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="isCombo"
                          checked={formData.is_combo}
                          onCheckedChange={handleComboToggle}
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
                          onCheckedChange={handleStatusToggle}
                        />
                        <Label htmlFor="status" className="text-sm font-normal">
                          {formData.is_active ? t("common.active") : t("common.inactive")}
                        </Label>
                      </div>
                    </div>
                  </div>
                </DashedSectionCard>

                {/* Classification Section */}
                <div ref={sectionRefs.classification}>
                  <DashedSectionCard 
                    id="classification"
                    title={t("items.classification")} 
                    icon={Tags} 
                    variant="green"
                    isComplete={isClassificationComplete}
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div ref={categoryRef}>
                          <Label className="text-sm font-medium mb-1 flex items-center gap-1">
                            {t("items.category")} <span className="text-destructive">*</span>
                            <TooltipInfo content={t("tooltips.category")} />
                          </Label>
                          <SearchableSelect
                            value={formData.category}
                            onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                            options={categoryOptions}
                            placeholder={t("items.selectCategory")}
                            searchPlaceholder={t("common.search")}
                            emptyText={t("common.noResults") || "No results"}
                            isLoading={categoriesLoading}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1 flex items-center gap-1">
                            {t("items.subcategory")}
                            <TooltipInfo content={t("tooltips.subcategory")} />
                          </Label>
                          <SearchableMultiSelect
                            value={formData.subcategories}
                            onChange={(value) => setFormData((prev) => ({ ...prev, subcategories: value }))}
                            options={subcategoryOptions}
                            placeholder={formData.category ? t("items.selectSubcategories") : t("items.selectCategoryFirst")}
                            searchPlaceholder={t("common.search")}
                            emptyText={t("common.noResults") || "No results"}
                            isLoading={subcategoriesLoading}
                            disabled={!formData.category}
                          />
                        </div>
                      </div>

                      <div ref={servingTimeRef}>
                        <Label className="text-sm font-medium mb-1.5 flex items-center gap-1">
                          {t("items.servingTime")} <span className="text-destructive">*</span>
                          <TooltipInfo content={t("tooltips.servingTime")} />
                        </Label>
                        <div className="flex flex-wrap gap-4 min-h-[32px]">
                          {servingTimesLoading ? (
                            <span className="text-muted-foreground text-sm">{t("common.loading")}</span>
                          ) : (servingTimes || []).map((time) => (
                            <div key={time.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`serving-${time.id}`}
                                checked={formData.serving_times.includes(time.id)}
                                onCheckedChange={() => handleServingTimeToggle(time.id)}
                              />
                              <Label htmlFor={`serving-${time.id}`} className="text-sm font-normal cursor-pointer">
                                {getLocalizedLabel(time)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DashedSectionCard>
                </div>

                {/* Details Section */}
                <div ref={sectionRefs.details}>
                  <DashedSectionCard 
                    id="details"
                    title={t("items.details")} 
                    icon={Clock} 
                    variant="blue"
                    isComplete={isDetailsComplete}
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-sm font-medium mb-1 flex items-center gap-1">
                            {t("items.preparationTime")}
                            <TooltipInfo content={t("items.preparationTimeTooltip")} />
                          </Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              value={formData.preparation_time_minutes}
                              onChange={(e) => setFormData((prev) => ({ ...prev, preparation_time_minutes: parseInt(e.target.value) || 0 }))}
                              className="h-9 pe-10"
                            />
                            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">min</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1 flex items-center gap-1">
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
                              className="h-9 pe-10"
                            />
                            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">kcal</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1 flex items-center gap-1">
                            {t("items.highlights")}
                            <TooltipInfo content={t("items.highlightsTooltip")} />
                          </Label>
                          <Input
                            type="text"
                            value={formData.highlights}
                            onChange={(e) => setFormData((prev) => ({ ...prev, highlights: e.target.value }))}
                            placeholder={t("items.highlightsPlaceholder")}
                            className="h-9"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t">
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
            </div>

            {/* Ingredient & Item Mapping Section - Full Width */}
            <div ref={sectionRefs.ingredients}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ingredients */}
                <DashedSectionCard
                  id="ingredients"
                  title={t("itemMapping.ingredients")}
                  icon={Carrot}
                  variant="green"
                  isComplete={isIngredientsComplete}
                >
                  <IngredientTable
                    mappings={ingredientMappings}
                    onQuantityChange={handleIngredientQuantityChange}
                    onRemove={(id) => {
                      const mapping = ingredientMappings.find((m) => m.id === id);
                      if (mapping) handleRequestRemove(id, mapping.ingredient_name, "ingredient");
                    }}
                    onAdd={() => setShowAddIngredientModal(true)}
                    totalCost={totalIngredientCost}
                  />
                </DashedSectionCard>

                {/* Items (only for combo) */}
                {formData.is_combo && (
                  <div ref={sectionRefs.items}>
                    <DashedSectionCard
                      id="items"
                      title={t("itemMapping.items")}
                      icon={Package}
                      variant="amber"
                      isComplete={isItemsComplete}
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
                        totalComboPrice={0}
                        isCombo={formData.is_combo}
                      />
                    </DashedSectionCard>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer - contained within main content area */}
        <div className="fixed bottom-0 left-[16rem] right-0 bg-background border-t z-10">
          <div className="py-3 px-4 flex justify-end">
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
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
        </div>

        {/* Modals */}
        <AddIngredientModal
          open={showAddIngredientModal}
          onOpenChange={setShowAddIngredientModal}
          onConfirm={handleAddIngredient}
          ingredients={mockAvailableIngredients}
          mappedIds={mappedIngredientIds}
          currentLanguage={currentLanguage}
        />

        <AddItemModal
          open={showAddItemModal}
          onOpenChange={setShowAddItemModal}
          onConfirm={(item, qty, _extraCost) => handleAddItem(item, qty)}
          items={mockAvailableItems}
          mappedIds={mappedSubItemIds}
          currentItemId=""
          currentLanguage={currentLanguage}
        />

        <RemoveConfirmModal
          open={!!removeConfirm}
          onOpenChange={(open) => !open && setRemoveConfirm(null)}
          onConfirm={confirmRemove}
          itemName={removeConfirm?.name || ""}
          itemType={removeConfirm?.type || "ingredient"}
        />

        <ItemSaveConfirmModal
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          onConfirm={handleConfirmSave}
          item={confirmModalItem}
          isLoading={isSaving}
        />

        <ReplacementModal
          open={replacementModalState.open}
          onOpenChange={(open) => !open && setReplacementModalState(prev => ({ ...prev, open: false }))}
          parentItemName={replacementModalState.parentName}
          parentItemId={replacementModalState.mappingId}
          replacements={currentReplacements}
          onReplacementsChange={handleReplacementsChange}
          availableItems={mockAvailableItems}
          currentLanguage={currentLanguage}
        />
      </div>

      {/* Confirmation Modals */}
      <ConfirmActionModal
        open={comboConfirm.open}
        onOpenChange={(open) => !open && setComboConfirm({ open: false, newValue: false })}
        onConfirm={confirmComboChange}
        title={t("items.enableComboTitle") || "Enable Combo?"}
        message={t("items.enableComboMessage") || "Enabling combo allows sub-item mapping. Continue?"}
        confirmLabel={t("common.confirm")}
      />

      <ConfirmActionModal
        open={statusConfirm.open}
        onOpenChange={(open) => !open && setStatusConfirm({ open: false, newValue: false })}
        onConfirm={confirmStatusChange}
        title={t("items.deactivateItemTitle") || "Deactivate Item?"}
        message={t("items.deactivateItemMessage") || "Deactivating this item will remove it from POS. Continue?"}
        confirmLabel={t("common.confirm")}
        variant="destructive"
      />
    </>
  );
}
