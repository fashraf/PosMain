import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  IngredientTable,
  ItemTable,
  LiveCostSummary,
  AddIngredientModal,
  AddItemModal,
  RemoveConfirmModal,
  SaveSummaryModal,
  DuplicateSaveWarningModal,
  ReplacementModal,
  type IngredientMappingItem,
  type SubItemMappingItem,
  type AvailableIngredient,
  type AvailableItem,
  type ReplacementItem,
} from "@/components/item-mapping";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data
const mockItems: Record<string, {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  item_type: "edible" | "non_edible";
  is_combo: boolean;
  base_cost: number;
}> = {
  "1": { id: "1", name_en: "Margherita Pizza", name_ar: "بيتزا مارغريتا", name_ur: "مارگریٹا پیزا", item_type: "edible", is_combo: false, base_cost: 12.99 },
  "2": { id: "2", name_en: "Chicken Burger", name_ar: "برجر دجاج", name_ur: "چکن برگر", item_type: "edible", is_combo: false, base_cost: 8.99 },
  "3": { id: "3", name_en: "Family Combo", name_ar: "كومبو عائلي", name_ur: "فیملی کومبو", item_type: "edible", is_combo: true, base_cost: 45.99 },
};

const mockAvailableIngredients: AvailableIngredient[] = [
  { id: "1", name_en: "Tomato", name_ar: "طماطم", name_ur: "ٹماٹر", unit: "Kg", cost_per_unit: 5.00, current_stock: 150, min_stock: 10, reorder_level: 25 },
  { id: "2", name_en: "Cheese", name_ar: "جبنة", name_ur: "پنیر", unit: "Kg", cost_per_unit: 12.00, current_stock: 25, min_stock: 5, reorder_level: 15 },
  { id: "3", name_en: "Chicken Breast", name_ar: "صدر دجاج", name_ur: "چکن بریسٹ", unit: "Kg", cost_per_unit: 12.00, current_stock: 5, min_stock: 10, reorder_level: 20 },
  { id: "4", name_en: "Olive Oil", name_ar: "زيت زيتون", name_ur: "زیتون کا تیل", unit: "L", cost_per_unit: 5.00, current_stock: 20, min_stock: 5, reorder_level: 10 },
  { id: "5", name_en: "Basil", name_ar: "ريحان", name_ur: "تلسی", unit: "Kg", cost_per_unit: 20.00, current_stock: 8, min_stock: 2, reorder_level: 5 },
  { id: "6", name_en: "Lettuce", name_ar: "خس", name_ur: "سلاد پتہ", unit: "Pcs", cost_per_unit: 0.15, current_stock: 100, min_stock: 20, reorder_level: 50 },
  { id: "7", name_en: "Mushrooms", name_ar: "فطر", name_ur: "مشروم", unit: "Kg", cost_per_unit: 8.00, current_stock: 15, min_stock: 5, reorder_level: 10 },
];

const mockAvailableItems: AvailableItem[] = [
  { id: "1", name_en: "Margherita Pizza", name_ar: "بيتزا مارغريتا", name_ur: "مارگریٹا پیزا", base_cost: 12.99, is_combo: false },
  { id: "2", name_en: "Chicken Burger", name_ar: "برجر دجاج", name_ur: "چکن برگر", base_cost: 8.99, is_combo: false },
  { id: "4", name_en: "Soft Drink", name_ar: "مشروب غازي", name_ur: "سافٹ ڈرنک", base_cost: 2.50, is_combo: false },
  { id: "5", name_en: "French Fries", name_ar: "بطاطس مقلية", name_ur: "فرنچ فرائز", base_cost: 3.99, is_combo: false },
  { id: "6", name_en: "Cola", name_ar: "كولا", name_ur: "کولا", base_cost: 2.00, is_combo: false },
  { id: "7", name_en: "Sprite", name_ar: "سبرايت", name_ur: "سپرائٹ", base_cost: 2.00, is_combo: false },
  { id: "8", name_en: "Fanta", name_ar: "فانتا", name_ur: "فانٹا", base_cost: 2.00, is_combo: false },
];

// Initial mappings per item
const initialIngredientMappings: Record<string, IngredientMappingItem[]> = {
  "1": [
    { id: "m1", ingredient_id: "1", ingredient_name: "Tomato", quantity: 0.2, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 1.50, sort_order: 1 },
    { id: "m2", ingredient_id: "2", ingredient_name: "Cheese", quantity: 0.15, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 2.00, sort_order: 2 },
    { id: "m3", ingredient_id: "4", ingredient_name: "Olive Oil", quantity: 0.05, unit: "L", can_remove: false, can_add_extra: false, extra_cost: null, sort_order: 3 },
  ],
  "2": [
    { id: "m4", ingredient_id: "3", ingredient_name: "Chicken Breast", quantity: 0.2, unit: "Kg", can_remove: false, can_add_extra: true, extra_cost: 3.00, sort_order: 1 },
    { id: "m5", ingredient_id: "6", ingredient_name: "Lettuce", quantity: 2, unit: "Pcs", can_remove: true, can_add_extra: false, extra_cost: null, sort_order: 2 },
  ],
  "3": [],
};

const initialSubItemMappings: Record<string, SubItemMappingItem[]> = {
  "3": [
    { id: "s1", sub_item_id: "1", sub_item_name: "Margherita Pizza", quantity: 2, unit_price: 12.99, sort_order: 1, combo_price: 0, replacements: [] },
    { id: "s2", sub_item_id: "2", sub_item_name: "Chicken Burger", quantity: 4, unit_price: 8.99, sort_order: 2, combo_price: 0, replacements: [] },
    { 
      id: "s3", 
      sub_item_id: "4", 
      sub_item_name: "Soft Drink", 
      quantity: 6, 
      unit_price: 2.50, 
      sort_order: 3, 
      combo_price: 0,
      replacements: [
        { id: "rep1", item_id: "6", item_name: "Cola", extra_cost: 0, is_default: true },
        { id: "rep2", item_id: "7", item_name: "Sprite", extra_cost: 1.00, is_default: false },
        { id: "rep3", item_id: "8", item_name: "Fanta", extra_cost: 1.00, is_default: false },
      ]
    },
  ],
};

export default function ItemIngredientMappingEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const item = id ? mockItems[id] : null;

  const [ingredientMappings, setIngredientMappings] = useState<IngredientMappingItem[]>(
    id ? initialIngredientMappings[id] || [] : []
  );
  const [subItemMappings, setSubItemMappings] = useState<SubItemMappingItem[]>(
    id ? initialSubItemMappings[id] || [] : []
  );

  // Modal states
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<{
    id: string;
    name: string;
    type: "ingredient" | "item";
  } | null>(null);

  // Replacement modal state
  const [replacementModalState, setReplacementModalState] = useState<{
    open: boolean;
    mappingId: string;
    parentName: string;
  }>({ open: false, mappingId: "", parentName: "" });

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const mappedIngredientIds = ingredientMappings.map((m) => m.ingredient_id);
  const mappedSubItemIds = subItemMappings.map((m) => m.sub_item_id);

  // Add Ingredient
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

  // Add Item
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

  // Remove handlers
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

  // Quantity handlers
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

  // Replacement handlers
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
    setSubItemMappings(
      subItemMappings.map((m) =>
        m.id === replacementModalState.mappingId
          ? { ...m, replacements }
          : m
      )
    );
  };

  const handleRemoveReplacement = (mappingId: string, replacementId: string) => {
    setSubItemMappings(
      subItemMappings.map((m) => {
        if (m.id === mappingId && m.replacements) {
          const filtered = m.replacements.filter((r) => r.id !== replacementId);
          // If we removed the default, make the first one default
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
    // Open the replacement modal for editing
    handleOpenReplacementModal(mappingId);
  };

  // Get current replacements for modal
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

  const totalComboPrice = useMemo(() => {
    return subItemMappings.reduce((sum, m) => sum + (m.combo_price || 0), 0);
  }, [subItemMappings]);

  const totalReplacements = useMemo(() => {
    return subItemMappings.reduce((sum, m) => sum + (m.replacements?.length || 0), 0);
  }, [subItemMappings]);

  const baseCost = totalIngredientCost + totalSubItemCost;
  const comboPrice = item?.base_cost || 0;
  const sellingPrice = comboPrice * 1.1; // 10% markup
  const profit = sellingPrice - baseCost;

  // Duplicate detection
  const findDuplicates = () => {
    const duplicates: { name: string; count: number; type: "ingredient" | "item" }[] = [];
    
    const ingredientCounts = new Map<string, { name: string; count: number }>();
    ingredientMappings.forEach((m) => {
      const existing = ingredientCounts.get(m.ingredient_id);
      if (existing) existing.count++;
      else ingredientCounts.set(m.ingredient_id, { name: m.ingredient_name, count: 1 });
    });
    ingredientCounts.forEach(({ name, count }) => {
      if (count > 1) duplicates.push({ name, count, type: "ingredient" });
    });

    const itemCounts = new Map<string, { name: string; count: number }>();
    subItemMappings.forEach((m) => {
      const existing = itemCounts.get(m.sub_item_id);
      if (existing) existing.count++;
      else itemCounts.set(m.sub_item_id, { name: m.sub_item_name, count: 1 });
    });
    itemCounts.forEach(({ name, count }) => {
      if (count > 1) duplicates.push({ name, count, type: "item" });
    });

    return duplicates;
  };

  const handleSave = () => {
    const duplicates = findDuplicates();
    if (duplicates.length > 0) {
      setShowDuplicateWarning(true);
    } else {
      setShowSaveModal(true);
    }
  };

  const handleConfirmSave = () => {
    toast({
      title: t("common.saveChanges"),
      description: t("itemMapping.savedSuccessfully"),
    });
    setShowSaveModal(false);
    setShowDuplicateWarning(false);
    navigate("/item-ingredient-mapping");
  };

  if (!item) {
    return (
      <div className="density-ui p-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/item-ingredient-mapping")} className="h-8">
          <ArrowLeft className="h-4 w-4 me-2" />
          {t("common.back")}
        </Button>
        <div className="mt-4 text-center text-muted-foreground text-[13px]">
          {t("itemMapping.itemNotFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="density-ui space-y-0">
      {/* Compact Header - 36px */}
      <div className="flex items-center justify-between h-9 px-2 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => navigate("/item-ingredient-mapping")}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft size={18} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("common.back")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="font-medium text-[14px]">{getLocalizedName(item)}</span>
          <div className="h-4 w-px bg-border" />
          <span className="text-[13px] text-muted-foreground">
            {t("common.type")}: {item.is_combo ? t("itemMapping.combo") : t("items.edible")}
          </span>
          {item.is_combo && (
            <Package size={14} strokeWidth={1.5} className="text-primary" />
          )}
          <div className="h-4 w-px bg-border" />
          <span className="text-[13px] text-muted-foreground">
            {t("items.baseCost")}: SAR {item.base_cost.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/item-ingredient-mapping")}
            className="h-7 text-[13px] px-2"
          >
            {t("common.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 text-[13px] px-3"
          >
            <Check size={14} strokeWidth={1.5} className="me-1" />
            {t("common.saveChanges")}
          </Button>
        </div>
      </div>

      {/* Live Cost Summary */}
      <div className="px-2 py-1.5 border-b border-border bg-muted/30">
        <LiveCostSummary
          comboPrice={comboPrice}
          costPrice={baseCost}
          sellingPrice={sellingPrice}
          profit={profit}
        />
      </div>

      {/* Two Column Grid - 50/50 Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border">
        {/* Left: Ingredients */}
        <div className="p-2">
          <IngredientTable
            mappings={ingredientMappings}
            onRemove={(id) => {
              const mapping = ingredientMappings.find((m) => m.id === id);
              if (mapping) handleRequestRemove(id, mapping.ingredient_name, "ingredient");
            }}
            onAdd={() => setShowAddIngredientModal(true)}
            onEdit={(id) => {
              // TODO: wire up edit modal for this page
            }}
          />
        </div>

        {/* Right: Items */}
        <div className="p-2">
          <ItemTable
            mappings={subItemMappings}
            onRemove={(id) => {
              const mapping = subItemMappings.find((m) => m.id === id);
              if (mapping) handleRequestRemove(id, mapping.sub_item_name, "item");
            }}
            onAdd={() => setShowAddItemModal(true)}
            isCombo={item.is_combo}
          />
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
        onConfirm={handleAddItem}
        items={mockAvailableItems}
        mappedIds={mappedSubItemIds}
        currentItemId={id || ""}
        currentLanguage={currentLanguage}
      />

      <ReplacementModal
        open={replacementModalState.open}
        onOpenChange={(open) => setReplacementModalState({ ...replacementModalState, open })}
        parentItemName={replacementModalState.parentName}
        parentItemId={replacementModalState.mappingId}
        replacements={currentReplacements}
        onReplacementsChange={handleReplacementsChange}
        availableItems={mockAvailableItems}
        currentLanguage={currentLanguage}
      />

      <RemoveConfirmModal
        open={!!removeConfirm}
        onOpenChange={() => setRemoveConfirm(null)}
        onConfirm={confirmRemove}
        itemName={removeConfirm?.name || ""}
        itemType={removeConfirm?.type || "ingredient"}
      />

      <SaveSummaryModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onConfirm={handleConfirmSave}
        ingredientCount={ingredientMappings.length}
        ingredientTotal={totalIngredientCost}
        itemCount={subItemMappings.length}
        itemTotal={totalSubItemCost}
        baseCost={baseCost}
        comboPrice={comboPrice}
        sellingPrice={sellingPrice}
        profit={profit}
        ingredientMappings={ingredientMappings}
        itemMappings={subItemMappings}
        totalReplacements={totalReplacements}
      />

      <DuplicateSaveWarningModal
        open={showDuplicateWarning}
        onOpenChange={setShowDuplicateWarning}
        onConfirm={handleConfirmSave}
        duplicates={findDuplicates()}
      />
    </div>
  );
}
