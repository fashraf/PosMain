import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Link2, Save } from "lucide-react";

// Mock data - items
const mockItems = [
  { id: "1", name_en: "Margherita Pizza", name_ar: "بيتزا مارغريتا", name_ur: "مارگریٹا پیزا" },
  { id: "2", name_en: "Chicken Burger", name_ar: "برجر دجاج", name_ur: "چکن برگر" },
  { id: "3", name_en: "Family Meal Combo", name_ar: "كومبو وجبة عائلية", name_ur: "فیملی میل کومبو" },
];

// Mock data - ingredients
const mockIngredients = [
  { id: "1", name_en: "Tomato", name_ar: "طماطم", name_ur: "ٹماٹر", base_unit: "kg" },
  { id: "2", name_en: "Cheese", name_ar: "جبنة", name_ur: "پنیر", base_unit: "kg" },
  { id: "3", name_en: "Chicken Breast", name_ar: "صدر دجاج", name_ur: "چکن بریسٹ", base_unit: "kg" },
  { id: "4", name_en: "Olive Oil", name_ar: "زيت زيتون", name_ur: "زیتون کا تیل", base_unit: "liters" },
  { id: "5", name_en: "Lettuce", name_ar: "خس", name_ur: "سلاد پتہ", base_unit: "pieces" },
];

interface IngredientMapping {
  id: string;
  ingredient_id: string;
  quantity_used: number;
  can_remove: boolean;
  can_add_extra: boolean;
  extra_quantity_limit: number | null;
  extra_cost: number | null;
}

// Initial mappings for items
const initialMappings: Record<string, IngredientMapping[]> = {
  "1": [
    { id: "m1", ingredient_id: "1", quantity_used: 0.2, can_remove: true, can_add_extra: true, extra_quantity_limit: 0.3, extra_cost: 1.50 },
    { id: "m2", ingredient_id: "2", quantity_used: 0.15, can_remove: true, can_add_extra: true, extra_quantity_limit: 0.2, extra_cost: 2.00 },
    { id: "m3", ingredient_id: "4", quantity_used: 0.05, can_remove: false, can_add_extra: false, extra_quantity_limit: null, extra_cost: null },
  ],
  "2": [
    { id: "m4", ingredient_id: "3", quantity_used: 0.2, can_remove: false, can_add_extra: true, extra_quantity_limit: 0.15, extra_cost: 3.00 },
    { id: "m5", ingredient_id: "5", quantity_used: 2, can_remove: true, can_add_extra: false, extra_quantity_limit: null, extra_cost: null },
    { id: "m6", ingredient_id: "2", quantity_used: 0.05, can_remove: true, can_add_extra: true, extra_quantity_limit: 0.1, extra_cost: 1.00 },
  ],
};

export default function ItemIngredientMapping() {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [mappings, setMappings] = useState<Record<string, IngredientMapping[]>>(initialMappings);

  const getLocalizedName = (item: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof item;
    return item[key] || item.name_en;
  };

  const currentMappings = selectedItemId ? (mappings[selectedItemId] || []) : [];
  const usedIngredientIds = currentMappings.map((m) => m.ingredient_id);
  const availableIngredients = mockIngredients.filter((i) => !usedIngredientIds.includes(i.id));

  const handleAddMapping = () => {
    if (!selectedItemId || availableIngredients.length === 0) return;
    
    const newMapping: IngredientMapping = {
      id: `m${Date.now()}`,
      ingredient_id: availableIngredients[0].id,
      quantity_used: 0,
      can_remove: false,
      can_add_extra: false,
      extra_quantity_limit: null,
      extra_cost: null,
    };

    setMappings((prev) => ({
      ...prev,
      [selectedItemId]: [...(prev[selectedItemId] || []), newMapping],
    }));
  };

  const handleRemoveMapping = (mappingId: string) => {
    setMappings((prev) => ({
      ...prev,
      [selectedItemId]: prev[selectedItemId].filter((m) => m.id !== mappingId),
    }));
  };

  const handleUpdateMapping = (mappingId: string, updates: Partial<IngredientMapping>) => {
    setMappings((prev) => ({
      ...prev,
      [selectedItemId]: prev[selectedItemId].map((m) =>
        m.id === mappingId ? { ...m, ...updates } : m
      ),
    }));
  };

  const handleSave = () => {
    toast({
      title: t("common.saveChanges"),
      description: "Ingredient mappings saved successfully.",
    });
  };

  const selectedItem = mockItems.find((i) => i.id === selectedItemId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("itemIngredients.title")}</h1>
        {selectedItemId && currentMappings.length > 0 && (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 me-2" />
            {t("common.saveChanges")}
          </Button>
        )}
      </div>

      {/* Item Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>{t("itemIngredients.selectItem")}</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder={t("common.selectItem")} />
              </SelectTrigger>
              <SelectContent>
                {mockItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {getLocalizedName(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mapping List */}
      {!selectedItemId ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Link2}
              title={t("itemIngredients.selectItem")}
              description={t("itemIngredients.noItemSelected")}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {getLocalizedName(selectedItem!)} - {t("items.ingredientMapping")}
            </CardTitle>
            <Button
              onClick={handleAddMapping}
              disabled={availableIngredients.length === 0}
              size="sm"
            >
              <Plus className="h-4 w-4 me-2" />
              {t("itemIngredients.addIngredient")}
            </Button>
          </CardHeader>
          <CardContent>
            {currentMappings.length === 0 ? (
              <EmptyState
                icon={Link2}
                title={t("common.noData")}
                description={t("itemIngredients.noMappings")}
                action={
                  <Button onClick={handleAddMapping} disabled={availableIngredients.length === 0}>
                    <Plus className="h-4 w-4 me-2" />
                    {t("itemIngredients.addIngredient")}
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {currentMappings.map((mapping) => {
                  const ingredient = mockIngredients.find((i) => i.id === mapping.ingredient_id);
                  if (!ingredient) return null;

                  return (
                    <div
                      key={mapping.id}
                      className="border rounded-lg p-4 space-y-4 bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Ingredient Selector */}
                          <div className="space-y-2">
                            <Label>{t("common.selectIngredient")}</Label>
                            <Select
                              value={mapping.ingredient_id}
                              onValueChange={(value) =>
                                handleUpdateMapping(mapping.id, { ingredient_id: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={mapping.ingredient_id}>
                                  {getLocalizedName(ingredient)}
                                </SelectItem>
                                {availableIngredients.map((ing) => (
                                  <SelectItem key={ing.id} value={ing.id}>
                                    {getLocalizedName(ing)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Quantity */}
                          <div className="space-y-2">
                            <Label>{t("itemIngredients.quantityUsed")} ({ingredient.base_unit})</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={mapping.quantity_used}
                              onChange={(e) =>
                                handleUpdateMapping(mapping.id, {
                                  quantity_used: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>

                          {/* Toggles */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">{t("itemIngredients.canRemove")}</Label>
                              <Switch
                                checked={mapping.can_remove}
                                onCheckedChange={(checked) =>
                                  handleUpdateMapping(mapping.id, { can_remove: checked })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">{t("itemIngredients.canAddExtra")}</Label>
                              <Switch
                                checked={mapping.can_add_extra}
                                onCheckedChange={(checked) =>
                                  handleUpdateMapping(mapping.id, {
                                    can_add_extra: checked,
                                    extra_quantity_limit: checked ? mapping.extra_quantity_limit : null,
                                    extra_cost: checked ? mapping.extra_cost : null,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMapping(mapping.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Extra Options */}
                      {mapping.can_add_extra && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                          <div className="space-y-2">
                            <Label>{t("itemIngredients.extraQuantityLimit")} ({ingredient.base_unit})</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={mapping.extra_quantity_limit || ""}
                              onChange={(e) =>
                                handleUpdateMapping(mapping.id, {
                                  extra_quantity_limit: e.target.value
                                    ? parseFloat(e.target.value)
                                    : null,
                                })
                              }
                              placeholder="Max extra amount"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t("itemIngredients.extraCost")}</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={mapping.extra_cost || ""}
                              onChange={(e) =>
                                handleUpdateMapping(mapping.id, {
                                  extra_cost: e.target.value ? parseFloat(e.target.value) : null,
                                })
                              }
                              placeholder="Extra charge ($)"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
