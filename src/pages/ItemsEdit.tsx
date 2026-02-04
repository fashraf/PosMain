import { useState, useEffect, useMemo, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { ImageUploadHero } from "@/components/shared/ImageUploadHero";
import { MultiSelectBadges } from "@/components/shared/MultiSelectBadges";
import { MultiLanguageInputWithIndicators } from "@/components/shared/MultiLanguageInputWithIndicators";
import { InventoryProgressCard } from "@/components/shared/InventoryProgressCard";
import { AllergenPicker, type AllergenType } from "@/components/shared/AllergenPicker";
import { ItemSaveConfirmModal } from "@/components/items/ItemSaveConfirmModal";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { SectionNavigationBar, type SectionNavItem } from "@/components/shared/SectionNavigationBar";
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
import { ArrowLeft, ArrowRight, Save, X, FileText, Tags, Clock, BarChart3, Carrot, Package } from "lucide-react";
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

// Mock items data
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
    category: "non_vegetarian",
    subcategories: ["pizza"],
    serving_times: ["lunch", "dinner"],
    preparation_time_minutes: 20,
    allergens: ["dairy", "gluten"] as AllergenType[],
    calories: 850,
    highlights: "Crispy, Fresh, Authentic",
    current_stock: 68,
    low_stock_threshold: 10,
    ingredientMappings: [
      { id: "m1", ingredient_id: "1", ingredient_name: "Tomato", quantity: 0.2, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 1.50, sort_order: 1 },
      { id: "m2", ingredient_id: "2", ingredient_name: "Cheese", quantity: 0.15, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 2.00, sort_order: 2 },
    ] as IngredientMappingItem[],
    subItemMappings: [] as SubItemMappingItem[],
  },
  { 
    id: "2", 
    name_en: "Family Combo", 
    name_ar: "كومبو عائلي", 
    name_ur: "فیملی کومبو", 
    description_en: "Perfect for families", 
    description_ar: "مثالي للعائلات", 
    description_ur: "خاندان کے لیے بہترین", 
    item_type: "edible" as const, 
    base_cost: 45.99, 
    is_combo: true, 
    image_url: null, 
    is_active: true,
    category: "non_vegetarian",
    subcategories: ["pizza", "bbq"],
    serving_times: ["lunch", "dinner"],
    preparation_time_minutes: 30,
    allergens: ["dairy", "gluten", "eggs"] as AllergenType[],
    calories: 2500,
    highlights: "Value Pack, Family Size",
    current_stock: 25,
    low_stock_threshold: 5,
    ingredientMappings: [] as IngredientMappingItem[],
    subItemMappings: [
      { id: "s1", sub_item_id: "101", sub_item_name: "Margherita Pizza", quantity: 2, unit_price: 12.99, sort_order: 1, combo_price: 0, replacements: [] },
      { id: "s2", sub_item_id: "102", sub_item_name: "Chicken Burger", quantity: 2, unit_price: 8.99, sort_order: 2, combo_price: 0, replacements: [] },
    ] as SubItemMappingItem[],
  },
];

export default function ItemsEdit() {
  const { t, isRTL, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
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

  // Load item data
  useEffect(() => {
    const item = mockItems.find((i) => i.id === id);
    if (item) {
      setFormData({
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
        category: item.category,
        subcategories: item.subcategories,
        serving_times: item.serving_times,
        preparation_time_minutes: item.preparation_time_minutes,
        allergens: item.allergens,
        calories: item.calories,
        highlights: item.highlights,
        current_stock: item.current_stock,
        low_stock_threshold: item.low_stock_threshold,
      });
      setIngredientMappings(item.ingredientMappings || []);
      setSubItemMappings(item.subItemMappings || []);
    }
  }, [id]);

  // Section refs for scrolling
  const sectionRefs = {
    basics: useRef<HTMLDivElement>(null),
    classification: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    inventory: useRef<HTMLDivElement>(null),
    ingredients: useRef<HTMLDivElement>(null),
    items: useRef<HTMLDivElement>(null),
  };

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
    
    Object.entries(sectionRefs).forEach(([sectionId, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(sectionId);
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

  const handleRequestRemove = (mappingId: string, name: string, type: "ingredient" | "item") => {
    setRemoveConfirm({ id: mappingId, name, type });
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
      toast({ title: t("items.editItem"), description: `${formData.name_en} has been updated.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/items");
    }, 500);
  };

  const confirmModalItem = useMemo(() => ({
    name: formData.name_en,
    image_url: formData.image_url,
    category: CATEGORIES.find((c) => c.id === formData.category)?.label || "",
    subcategories: formData.subcategories.map((subId) => SUBCATEGORIES.find((s) => s.id === subId)?.label || ""),
    base_cost: formData.base_cost,
    calories: formData.calories,
    prep_time: formData.preparation_time_minutes,
    serving_times: formData.serving_times.map((timeId) => SERVING_TIMES.find((s) => s.id === timeId)?.label || ""),
  }), [formData]);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-0 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/items")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t("items.editItem")}</h1>
      </div>

      {/* Section Navigation Bar */}
      <SectionNavigationBar
        sections={sections}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <div className="space-y-5 pt-4">
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column - 4/12 */}
          <div className="lg:col-span-4 space-y-5">
            {/* Basic Info Left (Image, Name, Description) */}
            <div ref={sectionRefs.basics}>
              <DashedSectionCard 
                id="basics"
                title={t("items.basicInformation")} 
                icon={FileText} 
                variant="purple"
                isComplete={isBasicsComplete}
              >
                <div className="space-y-4">
                  {/* Hero Image Upload - reduced size */}
                  <ImageUploadHero
                    value={formData.image_url}
                    onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                    size={140}
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
            <div ref={sectionRefs.classification}>
              <DashedSectionCard 
                id="classification"
                title={t("items.classification")} 
                icon={Tags} 
                variant="green"
                isComplete={isClassificationComplete}
              >
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
        </div>

        {/* Ingredient & Item Mapping Section - Full Width */}
        <div ref={sectionRefs.ingredients}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                onRemove={(mappingId) => {
                  const mapping = ingredientMappings.find((m) => m.id === mappingId);
                  if (mapping) handleRequestRemove(mappingId, mapping.ingredient_name, "ingredient");
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
                    onRemove={(mappingId) => {
                      const mapping = subItemMappings.find((m) => m.id === mappingId);
                      if (mapping) handleRequestRemove(mappingId, mapping.sub_item_name, "item");
                    }}
                    onAdd={() => setShowAddItemModal(true)}
                    onReplacement={() => {}}
                    onRemoveReplacement={() => {}}
                    onViewReplacement={() => {}}
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
        currentItemId={id || ""}
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
        isEdit
      />
    </div>
  );
}
