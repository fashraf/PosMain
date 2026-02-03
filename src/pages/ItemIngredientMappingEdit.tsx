import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Salad, Save, ShoppingBag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  IngredientSearchPicker,
  SubItemSearchPicker,
  DuplicateMappingWarning,
  IngredientCard,
  ItemCard,
  DuplicateSaveWarningModal,
  type IngredientMappingItem,
  type SubItemMappingItem,
  type AvailableIngredient,
  type AvailableItem,
} from "@/components/item-mapping";
import {
  ConfirmChangesModal,
  type Change,
} from "@/components/shared/ConfirmChangesModal";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";

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
    { id: "s1", sub_item_id: "1", sub_item_name: "Margherita Pizza", quantity: 2, unit_price: 12.99, sort_order: 1 },
    { id: "s2", sub_item_id: "2", sub_item_name: "Chicken Burger", quantity: 4, unit_price: 8.99, sort_order: 2 },
    { id: "s3", sub_item_id: "4", sub_item_name: "Soft Drink", quantity: 6, unit_price: 2.50, sort_order: 3 },
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

  const [initialIngredients] = useState<IngredientMappingItem[]>(
    id ? initialIngredientMappings[id] || [] : []
  );
  const [initialSubItems] = useState<SubItemMappingItem[]>(
    id ? initialSubItemMappings[id] || [] : []
  );

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDuplicateSaveWarning, setShowDuplicateSaveWarning] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    ingredientName: string;
    quantity: number;
    unit: string;
  } | null>(null);

  // Confirmation modal states
  const [pendingAddIngredient, setPendingAddIngredient] = useState<AvailableIngredient | null>(null);
  const [pendingAddItem, setPendingAddItem] = useState<AvailableItem | null>(null);
  const [pendingRemoveIngredient, setPendingRemoveIngredient] = useState<string | null>(null);
  const [pendingRemoveItem, setPendingRemoveItem] = useState<string | null>(null);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const mappedIngredientIds = ingredientMappings.map((m) => m.ingredient_id);
  const mappedSubItemIds = subItemMappings.map((m) => m.sub_item_id);

  // Add Ingredient Flow
  const handleSelectIngredient = (ingredient: AvailableIngredient) => {
    if (mappedIngredientIds.includes(ingredient.id)) {
      const existing = ingredientMappings.find((m) => m.ingredient_id === ingredient.id);
      if (existing) {
        setDuplicateWarning({
          ingredientName: getLocalizedName(ingredient),
          quantity: existing.quantity,
          unit: existing.unit,
        });
      }
      return;
    }
    setPendingAddIngredient(ingredient);
  };

  const confirmAddIngredient = () => {
    if (!pendingAddIngredient) return;
    
    const newMapping: IngredientMappingItem = {
      id: `m${Date.now()}`,
      ingredient_id: pendingAddIngredient.id,
      ingredient_name: getLocalizedName(pendingAddIngredient),
      quantity: 1,
      unit: pendingAddIngredient.unit,
      can_remove: false,
      can_add_extra: false,
      extra_cost: null,
      sort_order: ingredientMappings.length + 1,
    };

    setIngredientMappings([...ingredientMappings, newMapping]);
    setPendingAddIngredient(null);
  };

  // Add Item Flow
  const handleSelectItem = (subItem: AvailableItem) => {
    if (mappedSubItemIds.includes(subItem.id)) {
      return;
    }
    setPendingAddItem(subItem);
  };

  const confirmAddItem = () => {
    if (!pendingAddItem) return;
    
    const newMapping: SubItemMappingItem = {
      id: `s${Date.now()}`,
      sub_item_id: pendingAddItem.id,
      sub_item_name: getLocalizedName(pendingAddItem),
      quantity: 1,
      unit_price: pendingAddItem.base_cost,
      sort_order: subItemMappings.length + 1,
    };

    setSubItemMappings([...subItemMappings, newMapping]);
    setPendingAddItem(null);
  };

  // Remove Ingredient Flow
  const handleRequestRemoveIngredient = (mappingId: string) => {
    setPendingRemoveIngredient(mappingId);
  };

  const confirmRemoveIngredient = () => {
    if (!pendingRemoveIngredient) return;
    
    setIngredientMappings(
      ingredientMappings
        .filter((m) => m.id !== pendingRemoveIngredient)
        .map((m, index) => ({ ...m, sort_order: index + 1 }))
    );
    setPendingRemoveIngredient(null);
  };

  // Remove Item Flow
  const handleRequestRemoveItem = (mappingId: string) => {
    setPendingRemoveItem(mappingId);
  };

  const confirmRemoveItem = () => {
    if (!pendingRemoveItem) return;
    
    setSubItemMappings(
      subItemMappings
        .filter((m) => m.id !== pendingRemoveItem)
        .map((m, index) => ({ ...m, sort_order: index + 1 }))
    );
    setPendingRemoveItem(null);
  };

  // Update handlers
  const handleIngredientQuantityChange = (mappingId: string, quantity: number) => {
    setIngredientMappings(
      ingredientMappings.map((m) => (m.id === mappingId ? { ...m, quantity } : m))
    );
  };

  const handleIngredientCanRemoveChange = (mappingId: string, value: boolean) => {
    setIngredientMappings(
      ingredientMappings.map((m) => (m.id === mappingId ? { ...m, can_remove: value } : m))
    );
  };

  const handleIngredientCanExtraChange = (mappingId: string, value: boolean) => {
    setIngredientMappings(
      ingredientMappings.map((m) => (m.id === mappingId ? { ...m, can_add_extra: value, extra_cost: value ? m.extra_cost || 0 : null } : m))
    );
  };

  const handleIngredientExtraCostChange = (mappingId: string, cost: number | null) => {
    setIngredientMappings(
      ingredientMappings.map((m) => (m.id === mappingId ? { ...m, extra_cost: cost } : m))
    );
  };

  const handleItemQuantityChange = (mappingId: string, quantity: number) => {
    setSubItemMappings(
      subItemMappings.map((m) => (m.id === mappingId ? { ...m, quantity } : m))
    );
  };

  // Detect duplicates
  const findDuplicates = () => {
    const duplicates: { name: string; count: number; type: "ingredient" | "item" }[] = [];
    
    // Check ingredient duplicates
    const ingredientCounts = new Map<string, { name: string; count: number }>();
    ingredientMappings.forEach((m) => {
      const existing = ingredientCounts.get(m.ingredient_id);
      if (existing) {
        existing.count++;
      } else {
        ingredientCounts.set(m.ingredient_id, { name: m.ingredient_name, count: 1 });
      }
    });
    ingredientCounts.forEach(({ name, count }) => {
      if (count > 1) {
        duplicates.push({ name, count, type: "ingredient" });
      }
    });

    // Check item duplicates
    const itemCounts = new Map<string, { name: string; count: number }>();
    subItemMappings.forEach((m) => {
      const existing = itemCounts.get(m.sub_item_id);
      if (existing) {
        existing.count++;
      } else {
        itemCounts.set(m.sub_item_id, { name: m.sub_item_name, count: 1 });
      }
    });
    itemCounts.forEach(({ name, count }) => {
      if (count > 1) {
        duplicates.push({ name, count, type: "item" });
      }
    });

    return duplicates;
  };

  // Calculate changes for confirmation modal
  const changes = useMemo(() => {
    const changeList: Change[] = [];

    // Check for added ingredients
    ingredientMappings.forEach((mapping) => {
      const original = initialIngredients.find((m) => m.id === mapping.id);
      if (!original) {
        changeList.push({
          field: t("itemMapping.addedIngredient"),
          oldValue: null,
          newValue: `${mapping.ingredient_name} (${mapping.quantity} ${mapping.unit})`,
        });
      } else {
        if (original.quantity !== mapping.quantity) {
          changeList.push({
            field: `${mapping.ingredient_name} ${t("itemMapping.quantity")}`,
            oldValue: `${original.quantity} ${mapping.unit}`,
            newValue: `${mapping.quantity} ${mapping.unit}`,
          });
        }
        if (original.can_remove !== mapping.can_remove) {
          changeList.push({
            field: `${mapping.ingredient_name} ${t("itemMapping.canRemove")}`,
            oldValue: original.can_remove ? t("common.yes") : t("common.no"),
            newValue: mapping.can_remove ? t("common.yes") : t("common.no"),
          });
        }
        if (original.can_add_extra !== mapping.can_add_extra) {
          changeList.push({
            field: `${mapping.ingredient_name} ${t("itemMapping.canAddExtra")}`,
            oldValue: original.can_add_extra ? t("common.yes") : t("common.no"),
            newValue: mapping.can_add_extra ? t("common.yes") : t("common.no"),
          });
        }
        if (original.extra_cost !== mapping.extra_cost) {
          changeList.push({
            field: `${mapping.ingredient_name} ${t("itemMapping.extraCost")}`,
            oldValue: original.extra_cost ? `$${original.extra_cost}` : "-",
            newValue: mapping.extra_cost ? `$${mapping.extra_cost}` : "-",
          });
        }
      }
    });

    // Check for removed ingredients
    initialIngredients.forEach((original) => {
      if (!ingredientMappings.find((m) => m.id === original.id)) {
        changeList.push({
          field: t("itemMapping.removedIngredient"),
          oldValue: `${original.ingredient_name} (${original.quantity} ${original.unit})`,
          newValue: "-",
        });
      }
    });

    // Check for sub-items changes (for combos)
    if (item?.is_combo) {
      subItemMappings.forEach((mapping) => {
        const original = initialSubItems.find((m) => m.id === mapping.id);
        if (!original) {
          changeList.push({
            field: t("itemMapping.addedItem"),
            oldValue: null,
            newValue: `${mapping.sub_item_name} ×${mapping.quantity}`,
          });
        } else if (original.quantity !== mapping.quantity) {
          changeList.push({
            field: `${mapping.sub_item_name} ${t("itemMapping.quantity")}`,
            oldValue: `×${original.quantity}`,
            newValue: `×${mapping.quantity}`,
          });
        }
      });

      initialSubItems.forEach((original) => {
        if (!subItemMappings.find((m) => m.id === original.id)) {
          changeList.push({
            field: t("itemMapping.removedItem"),
            oldValue: `${original.sub_item_name} ×${original.quantity}`,
            newValue: "-",
          });
        }
      });
    }

    return changeList;
  }, [ingredientMappings, subItemMappings, initialIngredients, initialSubItems, item, t]);

  const handleSave = () => {
    const duplicates = findDuplicates();
    if (duplicates.length > 0) {
      setShowDuplicateSaveWarning(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = () => {
    // TODO: Save to database
    toast({
      title: t("common.saveChanges"),
      description: t("itemMapping.savedSuccessfully"),
    });
    setShowConfirmModal(false);
    setShowDuplicateSaveWarning(false);
    navigate("/item-ingredient-mapping");
  };

  const totalIngredientCost = ingredientMappings.reduce((sum, m) => {
    const ingredient = mockAvailableIngredients.find((i) => i.id === m.ingredient_id);
    return sum + (ingredient ? m.quantity * ingredient.cost_per_unit : 0);
  }, 0);

  const totalSubItemCost = subItemMappings.reduce(
    (sum, m) => sum + m.quantity * m.unit_price,
    0
  );

  // Get names for confirmation modals
  const pendingAddIngredientName = pendingAddIngredient ? getLocalizedName(pendingAddIngredient) : "";
  const pendingAddItemName = pendingAddItem ? getLocalizedName(pendingAddItem) : "";
  const pendingRemoveIngredientName = pendingRemoveIngredient 
    ? ingredientMappings.find((m) => m.id === pendingRemoveIngredient)?.ingredient_name || ""
    : "";
  const pendingRemoveItemName = pendingRemoveItem
    ? subItemMappings.find((m) => m.id === pendingRemoveItem)?.sub_item_name || ""
    : "";

  if (!item) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/item-ingredient-mapping")}>
          <ArrowLeft className="h-4 w-4 me-2" />
          {t("common.back")}
        </Button>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("itemMapping.itemNotFound")}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/item-ingredient-mapping")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("itemMapping.editMapping")}</h1>
            <p className="text-muted-foreground">{getLocalizedName(item)}</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 me-2" />
          {t("common.saveChanges")}
        </Button>
      </div>

      {/* Item Details (Read-Only) */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("itemMapping.itemDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-sm text-muted-foreground">{t("common.name")}</span>
              <p className="font-medium">{getLocalizedName(item)}</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <span className="text-sm text-muted-foreground">{t("common.type")}</span>
              <div className="flex items-center gap-2">
                <Badge variant={item.item_type === "edible" ? "default" : "outline"}>
                  {item.item_type === "edible" ? t("items.edible") : t("items.nonEdible")}
                </Badge>
                {item.is_combo && (
                  <Badge variant="secondary">
                    <Package className="h-3 w-3 me-1" />
                    {t("itemMapping.combo")}
                  </Badge>
                )}
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <span className="text-sm text-muted-foreground">{t("items.baseCost")}</span>
              <p className="font-medium">${item.base_cost.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Ingredients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Salad className="h-5 w-5" />
              {t("itemMapping.ingredients")}
            </CardTitle>
            <IngredientSearchPicker
              ingredients={mockAvailableIngredients}
              mappedIds={mappedIngredientIds}
              onSelect={handleSelectIngredient}
            />
          </CardHeader>
          <CardContent className="space-y-3">
            {ingredientMappings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                {t("itemMapping.noIngredientsMapped")}
              </div>
            ) : (
              ingredientMappings.map((mapping) => (
                <IngredientCard
                  key={mapping.id}
                  mapping={mapping}
                  onQuantityChange={(qty) => handleIngredientQuantityChange(mapping.id, qty)}
                  onRemove={() => handleRequestRemoveIngredient(mapping.id)}
                  onToggleCanRemove={(val) => handleIngredientCanRemoveChange(mapping.id, val)}
                  onToggleCanExtra={(val) => handleIngredientCanExtraChange(mapping.id, val)}
                  onExtraCostChange={(cost) => handleIngredientExtraCostChange(mapping.id, cost)}
                />
              ))
            )}
            {ingredientMappings.length > 0 && (
              <div className="flex justify-end pt-3 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">{t("itemMapping.ingredientCostTotal")}:</span>
                  <span className="font-semibold ms-2">${totalIngredientCost.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Items (Combo Only) */}
        <Card className={!item.is_combo ? "opacity-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t("itemMapping.items")}
            </CardTitle>
            {item.is_combo && (
              <SubItemSearchPicker
                items={mockAvailableItems}
                mappedIds={mappedSubItemIds}
                currentItemId={id || ""}
                onSelect={handleSelectItem}
              />
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {!item.is_combo ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                {t("itemMapping.notComboItem")}
              </div>
            ) : subItemMappings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                {t("itemMapping.noItemsMapped")}
              </div>
            ) : (
              subItemMappings.map((mapping) => (
                <ItemCard
                  key={mapping.id}
                  mapping={mapping}
                  onQuantityChange={(qty) => handleItemQuantityChange(mapping.id, qty)}
                  onRemove={() => handleRequestRemoveItem(mapping.id)}
                />
              ))
            )}
            {item.is_combo && subItemMappings.length > 0 && (
              <div className="flex justify-end pt-3 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">{t("itemMapping.itemsTotal")}:</span>
                  <span className="font-semibold ms-2">${totalSubItemCost.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer with totals */}
      {item.is_combo && (
        <Card>
          <CardContent className="py-4">
            <div className="flex justify-end">
              <div className="text-sm">
                <span className="text-muted-foreground">{t("itemMapping.totalCost")}:</span>
                <span className="font-bold text-lg ms-2">
                  ${(totalIngredientCost + totalSubItemCost).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modals */}
      <ConfirmActionModal
        open={!!pendingAddIngredient}
        onOpenChange={() => setPendingAddIngredient(null)}
        onConfirm={confirmAddIngredient}
        message={t("confirmAction.addIngredientMessage", { name: pendingAddIngredientName })}
      />

      <ConfirmActionModal
        open={!!pendingAddItem}
        onOpenChange={() => setPendingAddItem(null)}
        onConfirm={confirmAddItem}
        message={t("confirmAction.addItemMessage", { name: pendingAddItemName })}
      />

      <ConfirmActionModal
        open={!!pendingRemoveIngredient}
        onOpenChange={() => setPendingRemoveIngredient(null)}
        onConfirm={confirmRemoveIngredient}
        message={t("confirmAction.removeIngredientMessage", { name: pendingRemoveIngredientName })}
        confirmLabel={t("common.remove")}
        variant="destructive"
      />

      <ConfirmActionModal
        open={!!pendingRemoveItem}
        onOpenChange={() => setPendingRemoveItem(null)}
        onConfirm={confirmRemoveItem}
        message={t("confirmAction.removeItemMessage", { name: pendingRemoveItemName })}
        confirmLabel={t("common.remove")}
        variant="destructive"
      />

      {/* Save Confirmation */}
      <ConfirmChangesModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        changes={changes}
        title={t("itemMapping.confirmChanges")}
      />

      {/* Duplicate Warning */}
      <DuplicateSaveWarningModal
        open={showDuplicateSaveWarning}
        onOpenChange={setShowDuplicateSaveWarning}
        onConfirm={handleConfirmSave}
        duplicates={findDuplicates()}
      />

      {/* Existing mapping warning */}
      {duplicateWarning && (
        <DuplicateMappingWarning
          open={!!duplicateWarning}
          onOpenChange={() => setDuplicateWarning(null)}
          ingredientName={duplicateWarning.ingredientName}
          currentQuantity={duplicateWarning.quantity}
          unit={duplicateWarning.unit}
          onGoToExisting={() => setDuplicateWarning(null)}
        />
      )}
    </div>
  );
}
