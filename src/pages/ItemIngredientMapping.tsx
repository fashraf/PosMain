import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { Link2, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  MappingSummaryTable,
  type ItemWithMappings,
} from "@/components/item-mapping";

// Mock data - items with mappings
const mockItemsWithMappings: ItemWithMappings[] = [
  {
    id: "1",
    name_en: "Margherita Pizza",
    name_ar: "بيتزا مارغريتا",
    name_ur: "مارگریٹا پیزا",
    item_type: "edible",
    is_combo: false,
    base_cost: 12.99,
    sort_order: 1,
    ingredient_count: 4,
    sub_item_count: 0,
    ingredients: [
      { id: "m1", ingredient_id: "1", ingredient_name: "Tomato", quantity: 0.2, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 1.50, cost: 1.00 },
      { id: "m2", ingredient_id: "2", ingredient_name: "Cheese", quantity: 0.15, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 2.00, cost: 1.80 },
      { id: "m3", ingredient_id: "4", ingredient_name: "Olive Oil", quantity: 0.05, unit: "L", can_remove: false, can_add_extra: false, extra_cost: null, cost: 0.25 },
      { id: "m4", ingredient_id: "5", ingredient_name: "Basil", quantity: 0.02, unit: "Kg", can_remove: true, can_add_extra: false, extra_cost: null, cost: 0.40 },
    ],
  },
  {
    id: "2",
    name_en: "Chicken Burger",
    name_ar: "برجر دجاج",
    name_ur: "چکن برگر",
    item_type: "edible",
    is_combo: false,
    base_cost: 8.99,
    sort_order: 2,
    ingredient_count: 3,
    sub_item_count: 0,
    ingredients: [
      { id: "m5", ingredient_id: "3", ingredient_name: "Chicken Breast", quantity: 0.2, unit: "Kg", can_remove: false, can_add_extra: true, extra_cost: 3.00, cost: 2.40 },
      { id: "m6", ingredient_id: "6", ingredient_name: "Lettuce", quantity: 2, unit: "Pcs", can_remove: true, can_add_extra: false, extra_cost: null, cost: 0.30 },
      { id: "m7", ingredient_id: "2", ingredient_name: "Cheese", quantity: 0.05, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 1.00, cost: 0.60 },
    ],
  },
  {
    id: "3",
    name_en: "Family Combo",
    name_ar: "كومبو عائلي",
    name_ur: "فیملی کومبو",
    item_type: "edible",
    is_combo: true,
    base_cost: 45.99,
    sort_order: 3,
    ingredient_count: 6,
    sub_item_count: 3,
    sub_items: [
      { id: "s1", sub_item_id: "1", sub_item_name: "Margherita Pizza", quantity: 2, unit_price: 12.99, subtotal: 25.98, sort_order: 1 },
      { id: "s2", sub_item_id: "2", sub_item_name: "Chicken Burger", quantity: 4, unit_price: 8.99, subtotal: 35.96, sort_order: 2 },
      { id: "s3", sub_item_id: "4", sub_item_name: "Soft Drink", quantity: 6, unit_price: 2.50, subtotal: 15.00, sort_order: 3 },
    ],
    ingredients: [
      { id: "m8", ingredient_id: "1", ingredient_name: "Tomato", quantity: 0.6, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 1.50, cost: 3.00 },
      { id: "m9", ingredient_id: "2", ingredient_name: "Cheese", quantity: 0.5, unit: "Kg", can_remove: true, can_add_extra: true, extra_cost: 2.00, cost: 6.00 },
      { id: "m10", ingredient_id: "3", ingredient_name: "Chicken Breast", quantity: 0.8, unit: "Kg", can_remove: false, can_add_extra: true, extra_cost: 3.00, cost: 9.60 },
      { id: "m11", ingredient_id: "4", ingredient_name: "Olive Oil", quantity: 0.1, unit: "L", can_remove: false, can_add_extra: false, extra_cost: null, cost: 0.50 },
      { id: "m12", ingredient_id: "5", ingredient_name: "Basil", quantity: 0.04, unit: "Kg", can_remove: true, can_add_extra: false, extra_cost: null, cost: 0.80 },
      { id: "m13", ingredient_id: "6", ingredient_name: "Lettuce", quantity: 8, unit: "Pcs", can_remove: true, can_add_extra: false, extra_cost: null, cost: 1.20 },
    ],
  },
  {
    id: "4",
    name_en: "Paper Napkins",
    name_ar: "مناديل ورقية",
    name_ur: "کاغذی نیپکن",
    item_type: "non_edible",
    is_combo: false,
    base_cost: 2.99,
    sort_order: 4,
    ingredient_count: 0,
    sub_item_count: 0,
  },
];

export default function ItemIngredientMapping() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemWithMappings[]>(mockItemsWithMappings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_ar.includes(searchQuery) ||
      item.name_ur.includes(searchQuery);

    const matchesFilter =
      filterType === "all" ||
      (filterType === "edible" && item.item_type === "edible" && !item.is_combo) ||
      (filterType === "combo" && item.is_combo) ||
      (filterType === "non_edible" && item.item_type === "non_edible");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("itemMapping.title")}</h1>
        <Button onClick={() => navigate("/items/add")}>
          <Plus className="h-4 w-4 me-2" />
          {t("items.addItem")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("common.filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("itemMapping.filterAll")}</SelectItem>
                <SelectItem value="edible">{t("items.edible")}</SelectItem>
                <SelectItem value="combo">{t("itemMapping.combosOnly")}</SelectItem>
                <SelectItem value="non_edible">{t("items.nonEdible")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {t("itemMapping.summaryGrid")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredItems.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Link2}
                title={t("itemMapping.noItems")}
                description={t("itemMapping.noItemsDescription")}
                action={
                  <Button onClick={() => navigate("/items/add")}>
                    <Plus className="h-4 w-4 me-2" />
                    {t("items.addItem")}
                  </Button>
                }
              />
            </div>
          ) : (
            <MappingSummaryTable items={filteredItems} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
