import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientTable, type Ingredient } from "@/components/ingredients/IngredientTable";
import { IngredientDialog } from "@/components/ingredients/IngredientDialog";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Package } from "lucide-react";

// Mock data
const initialIngredients: Ingredient[] = [
  {
    id: "1",
    name_en: "Tomato",
    name_ar: "طماطم",
    name_ur: "ٹماٹر",
    type: "solid",
    base_unit: "kg",
    current_quantity: 50,
    alert_threshold: 10,
    cost_price: 2.50,
    selling_price: null,
    can_sell_individually: false,
    can_add_extra: true,
    extra_cost: 0.50,
    is_active: true,
  },
  {
    id: "2",
    name_en: "Olive Oil",
    name_ar: "زيت زيتون",
    name_ur: "زیتون کا تیل",
    type: "liquid",
    base_unit: "liters",
    current_quantity: 5,
    alert_threshold: 3,
    cost_price: 15.00,
    selling_price: null,
    can_sell_individually: false,
    can_add_extra: false,
    extra_cost: null,
    is_active: true,
  },
  {
    id: "3",
    name_en: "Chicken Breast",
    name_ar: "صدر دجاج",
    name_ur: "چکن بریسٹ",
    type: "solid",
    base_unit: "kg",
    current_quantity: 8,
    alert_threshold: 10,
    cost_price: 8.00,
    selling_price: null,
    can_sell_individually: false,
    can_add_extra: true,
    extra_cost: 2.00,
    is_active: true,
  },
  {
    id: "4",
    name_en: "Cheese",
    name_ar: "جبنة",
    name_ur: "پنیر",
    type: "solid",
    base_unit: "kg",
    current_quantity: 15,
    alert_threshold: 5,
    cost_price: 12.00,
    selling_price: 15.00,
    can_sell_individually: true,
    can_add_extra: true,
    extra_cost: 1.50,
    is_active: true,
  },
  {
    id: "5",
    name_en: "Milk",
    name_ar: "حليب",
    name_ur: "دودھ",
    type: "liquid",
    base_unit: "liters",
    current_quantity: 20,
    alert_threshold: 10,
    cost_price: 1.50,
    selling_price: null,
    can_sell_individually: false,
    can_add_extra: false,
    extra_cost: null,
    is_active: true,
  },
];

export default function Ingredients() {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter ingredients
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ingredient) => {
      const nameKey = `name_${currentLanguage}` as keyof Ingredient;
      const name = (ingredient[nameKey] as string) || ingredient.name_en;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || ingredient.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [ingredients, searchQuery, typeFilter, currentLanguage]);

  // Paginate
  const paginatedIngredients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIngredients.slice(start, start + pageSize);
  }, [filteredIngredients, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredIngredients.length / pageSize);

  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setDialogOpen(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setDialogOpen(true);
  };

  const handleToggleStatus = (ingredient: Ingredient) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredient.id ? { ...i, is_active: !i.is_active } : i
      )
    );
    toast({
      title: ingredient.is_active ? t("common.deactivate") : t("common.activate"),
      description: `${ingredient.name_en} has been ${ingredient.is_active ? "deactivated" : "activated"}.`,
    });
  };

  const handleSaveIngredient = (ingredientData: Omit<Ingredient, "id"> & { id?: string }) => {
    if (ingredientData.id) {
      setIngredients((prev) =>
        prev.map((i) =>
          i.id === ingredientData.id ? { ...i, ...ingredientData } as Ingredient : i
        )
      );
      toast({
        title: t("ingredients.editIngredient"),
        description: `${ingredientData.name_en} has been updated.`,
      });
    } else {
      const newIngredient: Ingredient = {
        ...ingredientData,
        id: Date.now().toString(),
      };
      setIngredients((prev) => [...prev, newIngredient]);
      toast({
        title: t("ingredients.addIngredient"),
        description: `${ingredientData.name_en} has been added.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {t("ingredients.title")}
        </h1>
        <Button onClick={handleAddIngredient}>
          <Plus className="h-4 w-4 me-2" />
          {t("ingredients.addIngredient")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="ps-10"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("common.filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.filter")}: All</SelectItem>
                <SelectItem value="solid">{t("ingredients.solid")}</SelectItem>
                <SelectItem value="liquid">{t("ingredients.liquid")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredIngredients.length === 0 ? (
            <EmptyState
              icon={Package}
              title={t("common.noData")}
              description={searchQuery || typeFilter !== "all" 
                ? "No ingredients match your filters."
                : t("ingredients.noIngredients")}
              action={
                !searchQuery && typeFilter === "all" && (
                  <Button onClick={handleAddIngredient}>
                    <Plus className="h-4 w-4 me-2" />
                    {t("ingredients.addIngredient")}
                  </Button>
                )
              }
            />
          ) : (
            <>
              <IngredientTable
                ingredients={paginatedIngredients}
                onEdit={handleEditIngredient}
                onToggleStatus={handleToggleStatus}
              />
              {totalPages > 1 && (
                <DataTablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredIngredients.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <IngredientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ingredient={editingIngredient}
        onSave={handleSaveIngredient}
      />
    </div>
  );
}
