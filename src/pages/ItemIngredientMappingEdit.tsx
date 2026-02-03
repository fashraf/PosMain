import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Salad, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  IngredientMappingList,
  SubItemMappingList,
  IngredientSearchPicker,
  SubItemSearchPicker,
  DuplicateMappingWarning,
  type IngredientMappingItem,
  type SubItemMappingItem,
  type AvailableIngredient,
  type AvailableItem,
} from "@/components/item-mapping";
import {
  ConfirmChangesModal,
  type Change,
} from "@/components/shared/ConfirmChangesModal";

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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    ingredientName: string;
    quantity: number;
    unit: string;
  } | null>(null);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const mappedIngredientIds = ingredientMappings.map((m) => m.ingredient_id);
  const mappedSubItemIds = subItemMappings.map((m) => m.sub_item_id);

  const handleAddIngredient = (ingredient: AvailableIngredient) => {
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

    const newMapping: IngredientMappingItem = {
      id: `m${Date.now()}`,
      ingredient_id: ingredient.id,
      ingredient_name: getLocalizedName(ingredient),
      quantity: 0,
      unit: ingredient.unit,
      can_remove: false,
      can_add_extra: false,
      extra_cost: null,
      sort_order: ingredientMappings.length + 1,
    };

    setIngredientMappings([...ingredientMappings, newMapping]);
  };

  const handleAddSubItem = (subItem: AvailableItem) => {
    if (mappedSubItemIds.includes(subItem.id)) {
      return;
    }

    const newMapping: SubItemMappingItem = {
      id: `s${Date.now()}`,
      sub_item_id: subItem.id,
      sub_item_name: getLocalizedName(subItem),
      quantity: 1,
      unit_price: subItem.base_cost,
      sort_order: subItemMappings.length + 1,
    };

    setSubItemMappings([...subItemMappings, newMapping]);
  };

  const handleRemoveIngredient = (mappingId: string) => {
    setIngredientMappings(
      ingredientMappings
        .filter((m) => m.id !== mappingId)
        .map((m, index) => ({ ...m, sort_order: index + 1 }))
    );
  };

  const handleRemoveSubItem = (mappingId: string) => {
    setSubItemMappings(
      subItemMappings
        .filter((m) => m.id !== mappingId)
        .map((m, index) => ({ ...m, sort_order: index + 1 }))
    );
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
            field: t("itemMapping.addedSubItem"),
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
            field: t("itemMapping.removedSubItem"),
            oldValue: `${original.sub_item_name} ×${original.quantity}`,
            newValue: "-",
          });
        }
      });
    }

    return changeList;
  }, [ingredientMappings, subItemMappings, initialIngredients, initialSubItems, item, t]);

  const handleSave = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    // TODO: Save to database
    toast({
      title: t("common.saveChanges"),
      description: t("itemMapping.savedSuccessfully"),
    });
    setShowConfirmModal(false);
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

      {/* Ingredient Mappings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Salad className="h-5 w-5" />
            {t("itemMapping.ingredientMappings")}
          </CardTitle>
          <IngredientSearchPicker
            ingredients={mockAvailableIngredients}
            mappedIds={mappedIngredientIds}
            onSelect={handleAddIngredient}
          />
        </CardHeader>
        <CardContent>
          <IngredientMappingList
            mappings={ingredientMappings}
            onChange={setIngredientMappings}
            onRemove={handleRemoveIngredient}
          />
          {ingredientMappings.length > 0 && (
            <div className="flex justify-end mt-4 pt-4 border-t">
              <div className="text-sm">
                <span className="text-muted-foreground">{t("itemMapping.ingredientCostTotal")}:</span>
                <span className="font-semibold ms-2">${totalIngredientCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sub-Items (Combo Only) */}
      {item.is_combo && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("itemMapping.comboSubItems")}
            </CardTitle>
            <SubItemSearchPicker
              items={mockAvailableItems}
              mappedIds={mappedSubItemIds}
              currentItemId={id || ""}
              onSelect={handleAddSubItem}
            />
          </CardHeader>
          <CardContent>
            <SubItemMappingList
              mappings={subItemMappings}
              onChange={setSubItemMappings}
              onRemove={handleRemoveSubItem}
            />
            {subItemMappings.length > 0 && (
              <div className="flex justify-end mt-4 pt-4 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">{t("itemMapping.totalCost")}:</span>
                  <span className="font-semibold ms-2">
                    ${(totalIngredientCost + totalSubItemCost).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ConfirmChangesModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        changes={changes}
        title={t("itemMapping.confirmChanges")}
      />

      {duplicateWarning && (
        <DuplicateMappingWarning
          open={!!duplicateWarning}
          onOpenChange={() => setDuplicateWarning(null)}
          ingredientName={duplicateWarning.ingredientName}
          currentQuantity={duplicateWarning.quantity}
          unit={duplicateWarning.unit}
          onGoToExisting={() => {
            setDuplicateWarning(null);
            // Scroll to the existing mapping
          }}
        />
      )}
    </div>
  );
}
