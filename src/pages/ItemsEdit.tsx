import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  type IngredientMappingItem,
} from "@/components/item-mapping/IngredientMappingList";
import { IngredientTable } from "@/components/item-mapping/IngredientTable";
import {
  ItemTable,
  AddIngredientModal,
  AddItemModal,
  RemoveConfirmModal,
  type SubItemMappingItem,
  type AvailableIngredient,
  type AvailableItem,
} from "@/components/item-mapping";
import { Save, X, FileText, Tags, Clock, BarChart3, Carrot, Package, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Query for available items (for combo sub-items)
// Moved inside component to use React Query

export default function ItemsEdit() {
  const { t, isRTL, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch item data
  const { data: itemData, isLoading: itemLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch item ingredients
  const { data: itemIngredients = [] } = useQuery({
    queryKey: ["item-ingredients", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_ingredients")
        .select("*, ingredients(name_en, name_ar, name_ur, units(symbol))")
        .eq("item_id", id)
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // Fetch item sub-items (combo)
  const { data: itemSubItems = [] } = useQuery({
    queryKey: ["item-sub-items", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_sub_items")
        .select("*, sub_item:items!item_sub_items_sub_item_id_fkey(name_en, name_ar, name_ur, base_cost)")
        .eq("item_id", id)
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // Fetch available ingredients
  const { data: availableIngredients = [] } = useQuery({
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

  // Fetch available items for combo sub-items (exclude current item and combos)
  const { data: availableItems = [] } = useQuery({
    queryKey: ["items-for-combo", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("is_active", true)
        .eq("is_combo", false)
        .neq("id", id || "")
        .order("name_en");
      if (error) throw error;
      return (data || []).map((item) => ({
        id: item.id,
        name_en: item.name_en,
        name_ar: item.name_ar || "",
        name_ur: item.name_ur || "",
        base_cost: Number(item.base_cost),
        is_combo: item.is_combo,
      })) as AvailableItem[];
    },
    enabled: !!id,
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

  // Load item data into form
  useEffect(() => {
    if (itemData) {
      setFormData({
        name_en: itemData.name_en || "",
        name_ar: itemData.name_ar || "",
        name_ur: itemData.name_ur || "",
        description_en: itemData.description_en || "",
        description_ar: itemData.description_ar || "",
        description_ur: itemData.description_ur || "",
        item_type: (itemData.item_type as "edible" | "non_edible") || "edible",
        base_cost: Number(itemData.base_cost) || 0,
        is_combo: itemData.is_combo || false,
        image_url: itemData.image_url,
        is_active: itemData.is_active ?? true,
        category: itemData.category_id || "",
        subcategories: [],
        serving_times: [],
        preparation_time_minutes: 15,
        allergens: [],
        calories: null,
        highlights: "",
        current_stock: 100,
        low_stock_threshold: 10,
      });
    }
  }, [itemData]);

  // Load ingredient mappings
  useEffect(() => {
    if (itemIngredients.length > 0) {
      const mappings: IngredientMappingItem[] = itemIngredients.map((m: any) => ({
        id: m.id,
        ingredient_id: m.ingredient_id,
        ingredient_name: m.ingredients?.name_en || "Unknown",
        quantity: Number(m.quantity) || 1,
        unit: m.ingredients?.units?.symbol || "unit",
        can_remove: m.can_remove ?? true,
        can_add_extra: m.can_add_extra ?? false,
        extra_cost: m.extra_cost ? Number(m.extra_cost) : null,
        sort_order: m.sort_order || 0,
      }));
      setIngredientMappings(mappings);
    }
  }, [itemIngredients]);

  // Load sub-item mappings (combo) — reconstruct slots from flat rows
  useEffect(() => {
    if (itemSubItems.length > 0) {
      const defaults = itemSubItems.filter((m: any) => m.is_default);
      const nonDefaults = itemSubItems.filter((m: any) => !m.is_default);

      const mappings: SubItemMappingItem[] = defaults.map((d: any) => ({
        id: d.id,
        sub_item_id: d.sub_item_id,
        sub_item_name: d.sub_item?.name_en || "Unknown",
        quantity: Number(d.quantity) || 1,
        unit_price: Number(d.sub_item?.base_cost) || 0,
        sort_order: d.sort_order || 0,
        combo_price: 0,
        can_add_extra: false,
        can_remove: d.can_remove ?? false,
        extra_cost: 0,
        replacements: nonDefaults
          .filter((nd: any) => nd.sort_order > d.sort_order)
          .filter((nd: any, _: number, arr: any[]) => {
            // Find the next default's sort_order to scope replacements to this slot
            const nextDefault = defaults.find((dd: any) => dd.sort_order > d.sort_order);
            return !nextDefault || nd.sort_order < nextDefault.sort_order;
          })
          .map((nd: any) => ({
            id: nd.id,
            item_id: nd.sub_item_id,
            item_name: nd.sub_item?.name_en || "Unknown",
            extra_cost: Number(nd.replacement_price) || 0,
            is_default: false,
          })),
      }));
      setSubItemMappings(mappings);
    }
  }, [itemSubItems]);

  const [comboConfirm, setComboConfirm] = useState<{open: boolean; newValue: boolean}>({open: false, newValue: false});
  const [statusConfirm, setStatusConfirm] = useState<{open: boolean; newValue: boolean}>({open: false, newValue: false});

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("basics");

  const [ingredientMappings, setIngredientMappings] = useState<IngredientMappingItem[]>([]);
  const [subItemMappings, setSubItemMappings] = useState<SubItemMappingItem[]>([]);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editIngredientData, setEditIngredientData] = useState<{
    ingredientId: string;
    quantity: number;
    extraCost: number;
    canAddExtra: boolean;
    canRemove: boolean;
  } | null>(null);
  const [editItemData, setEditItemData] = useState<{
    itemId: string;
    quantity: number;
    extraCost: number;
    canAddExtra: boolean;
    canRemove: boolean;
    replacementItemId?: string;
  } | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<{
    id: string;
    name: string;
    type: "ingredient" | "item";
  } | null>(null);

  const sectionRefs = {
    basics: useRef<HTMLDivElement>(null),
    classification: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    inventory: useRef<HTMLDivElement>(null),
    ingredients: useRef<HTMLDivElement>(null),
    items: useRef<HTMLDivElement>(null),
  };

  const nameInputRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const servingTimeRef = useRef<HTMLDivElement>(null);

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

  const isBasicsComplete = !!formData.name_en;
  const isClassificationComplete = !!formData.category && formData.serving_times.length > 0;
  const isDetailsComplete = false;
  const isInventoryComplete = false;
  const isIngredientsComplete = ingredientMappings.length > 0;
  const isItemsComplete = subItemMappings.length > 0;

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

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const mappedIngredientIds = ingredientMappings.map((m) => m.ingredient_id);
  const mappedSubItemIds = subItemMappings.map((m) => m.sub_item_id);

  const handleAddIngredient = (ingredient: AvailableIngredient, quantity: number, extraCost: number, canAddExtra: boolean, canRemove: boolean) => {
    const newMapping: IngredientMappingItem = {
      id: `m${Date.now()}`,
      ingredient_id: ingredient.id,
      ingredient_name: getLocalizedName(ingredient),
      quantity,
      unit: ingredient.unit,
      can_remove: canRemove,
      can_add_extra: canAddExtra,
      extra_cost: canAddExtra && extraCost > 0 ? extraCost : null,
      sort_order: ingredientMappings.length + 1,
    };
    setIngredientMappings([...ingredientMappings, newMapping]);
  };

  const handleEditIngredient = (mappingId: string) => {
    const mapping = ingredientMappings.find(m => m.id === mappingId);
    if (!mapping) return;
    setEditIngredientData({
      ingredientId: mapping.ingredient_id,
      quantity: mapping.quantity,
      extraCost: mapping.extra_cost || 0,
      canAddExtra: mapping.can_add_extra,
      canRemove: mapping.can_remove,
    });
    setShowAddIngredientModal(true);
  };

  const handleEditIngredientConfirm = (ingredient: AvailableIngredient, quantity: number, extraCost: number, canAddExtra: boolean, canRemove: boolean) => {
    if (!editIngredientData) return;
    setIngredientMappings(prev => prev.map(m => {
      if (m.ingredient_id === editIngredientData.ingredientId) {
        return { ...m, quantity, can_add_extra: canAddExtra, can_remove: canRemove, extra_cost: canAddExtra && extraCost > 0 ? extraCost : null };
      }
      return m;
    }));
    setEditIngredientData(null);
  };

  const handleAddItem = (subItem: AvailableItem, quantity: number, extraCost: number, canAddExtra: boolean, canRemove: boolean, replacementItem?: AvailableItem) => {
    const newMapping: SubItemMappingItem = {
      id: `s${Date.now()}`,
      sub_item_id: subItem.id,
      sub_item_name: getLocalizedName(subItem),
      quantity,
      unit_price: subItem.base_cost,
      sort_order: subItemMappings.length + 1,
      combo_price: 0,
      can_add_extra: canAddExtra,
      can_remove: canRemove,
      extra_cost: canAddExtra && extraCost > 0 ? extraCost : 0,
      replacement_item_id: replacementItem?.id,
      replacement_item_name: replacementItem ? getLocalizedName(replacementItem) : undefined,
      replacements: [],
    };
    setSubItemMappings([...subItemMappings, newMapping]);
  };

  const handleEditItem = (mappingId: string) => {
    const mapping = subItemMappings.find(m => m.id === mappingId);
    if (!mapping) return;
    setEditItemData({
      itemId: mapping.sub_item_id,
      quantity: mapping.quantity,
      extraCost: mapping.extra_cost || 0,
      canAddExtra: mapping.can_add_extra || false,
      canRemove: mapping.can_remove || false,
      replacementItemId: mapping.replacement_item_id,
    });
    setShowAddItemModal(true);
  };

  const handleEditItemConfirm = (item: AvailableItem, quantity: number, extraCost: number, canAddExtra: boolean, canRemove: boolean, replacementItem?: AvailableItem) => {
    if (!editItemData) return;
    setSubItemMappings(prev => prev.map(m => {
      if (m.sub_item_id === editItemData.itemId) {
        return {
          ...m,
          quantity,
          can_add_extra: canAddExtra,
          can_remove: canRemove,
          extra_cost: canAddExtra && extraCost > 0 ? extraCost : 0,
          replacement_item_id: replacementItem?.id,
          replacement_item_name: replacementItem ? getLocalizedName(replacementItem) : undefined,
        };
      }
      return m;
    }));
    setEditItemData(null);
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

  const handleIngredientMappingsChange = (updatedMappings: IngredientMappingItem[]) => {
    setIngredientMappings(updatedMappings);
  };

  const handleIngredientRemove = (mappingId: string) => {
    const mapping = ingredientMappings.find((m) => m.id === mappingId);
    if (mapping) {
      handleRequestRemove(mappingId, mapping.ingredient_name, "ingredient");
    }
  };

  const handleItemQuantityChange = (mappingId: string, quantity: number) => {
    setSubItemMappings(
      subItemMappings.map((m) => (m.id === mappingId ? { ...m, quantity } : m))
    );
  };

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

  const totalIngredientCost = useMemo(() => {
    return ingredientMappings.reduce((sum, m) => {
      const ingredient = availableIngredients.find((i) => i.id === m.ingredient_id);
      return sum + (ingredient ? m.quantity * ingredient.cost_per_unit : 0);
    }, 0);
  }, [ingredientMappings, availableIngredients]);

  const totalSubItemCost = useMemo(() => {
    return subItemMappings.reduce((sum, m) => sum + m.quantity * m.unit_price, 0);
  }, [subItemMappings]);

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
    
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    
    try {
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

      const { error: updateError } = await supabase
        .from("items")
        .update({
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
          is_customizable: ingredientMappings.length > 0 || subItemMappings.length > 0,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Delete existing mappings and re-insert
      await supabase.from("item_ingredients").delete().eq("item_id", id);

      if (ingredientMappings.length > 0) {
        const mappingsToInsert = ingredientMappings.map((m, index) => ({
          item_id: id,
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

      // Delete existing sub-item mappings and re-insert — flatten slots + replacements
      await supabase.from("item_sub_items").delete().eq("item_id", id);

      if (formData.is_combo && subItemMappings.length > 0) {
        let sortCounter = 0;
        const subItemsToInsert = subItemMappings.flatMap((slot) => {
          sortCounter++;
          const defaultRow = {
            item_id: id,
            sub_item_id: slot.sub_item_id,
            quantity: slot.quantity,
            sort_order: sortCounter,
            is_default: true,
            replacement_price: 0,
            can_remove: slot.can_remove ?? false,
          };
          const replacementRows = (slot.replacements || []).map((r) => {
            sortCounter++;
            return {
              item_id: id,
              sub_item_id: r.item_id,
              quantity: slot.quantity,
              sort_order: sortCounter,
              is_default: false,
              replacement_price: r.extra_cost || 0,
              can_remove: false,
            };
          });
          return [defaultRow, ...replacementRows];
        });

        const { error: subItemError } = await supabase
          .from("item_sub_items")
          .insert(subItemsToInsert);

        if (subItemError) throw subItemError;
      }

      queryClient.invalidateQueries({ queryKey: ["items-master"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", id] });
      queryClient.invalidateQueries({ queryKey: ["item-ingredients", id] });
      queryClient.invalidateQueries({ queryKey: ["item-sub-items", id] });

      toast({ title: t("items.editItem"), description: `${formData.name_en} has been updated.` });
      setShowConfirmModal(false);
      navigate("/items");
    } catch (error: any) {
      console.error("Update error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update item", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/items");
  };

  if (itemLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Item not found</p>
        <Button onClick={() => navigate("/items")}>Back to Items</Button>
      </div>
    );
  }

  return (
    <div className="relative pb-24">
      <LoadingOverlay visible={isSaving} message={t("common.saving")} />

      <SectionNavigationBar
        sections={sections}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onBack={handleCancel}
      />

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
            <IngredientTable
              mappings={ingredientMappings}
              onRemove={handleIngredientRemove}
              onAdd={() => setShowAddIngredientModal(true)}
              onEdit={handleEditIngredient}
              onReorder={setIngredientMappings}
              isComplete={isIngredientsComplete}
            />
          </div>

          {/* Sub-Items Section (for combos) */}
          {formData.is_combo && (
            <div ref={sectionRefs.items} id="items">
              <ItemTable
                mappings={subItemMappings}
                onRemove={(id) => {
                  const mapping = subItemMappings.find((m) => m.id === id);
                  if (mapping) handleRequestRemove(id, mapping.sub_item_name, "item");
                }}
                onAdd={() => setShowAddItemModal(true)}
                onEdit={handleEditItem}
                onReorder={setSubItemMappings}
                onOpenReplacement={handleOpenReplacementModal}
                isCombo={formData.is_combo}
                isComplete={isItemsComplete}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
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
        onOpenChange={(open) => {
          setShowAddIngredientModal(open);
          if (!open) setEditIngredientData(null);
        }}
        onConfirm={editIngredientData ? handleEditIngredientConfirm : handleAddIngredient}
        ingredients={availableIngredients}
        mappedIds={mappedIngredientIds}
        currentLanguage={currentLanguage}
        editData={editIngredientData}
      />

      <AddItemModal
        open={showAddItemModal}
        onOpenChange={(open) => {
          setShowAddItemModal(open);
          if (!open) setEditItemData(null);
        }}
        onConfirm={editItemData ? handleEditItemConfirm : handleAddItem}
        items={availableItems}
        mappedIds={mappedSubItemIds}
        currentItemId={id || ""}
        currentLanguage={currentLanguage}
        editData={editItemData}
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
        availableItems={availableItems}
        currentLanguage={currentLanguage}
      />

      <ItemSaveConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
        isEdit={true}
        item={{
          name_en: formData.name_en,
          name_ar: formData.name_ar,
          name_ur: formData.name_ur,
          description_en: formData.description_en,
          image_url: formData.image_url,
          item_type: formData.item_type,
          category: categories?.find((c) => c.id === formData.category)?.name_en || "",
          subcategories: formData.subcategories.map(id => {
            const sub = subcategories?.find(s => s.id === id);
            return sub ? getLocalizedLabel(sub) : id;
          }),
          serving_times: formData.serving_times.map(id => {
            const st = servingTimes?.find(s => s.id === id);
            return st ? getLocalizedLabel(st) : id;
          }),
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
