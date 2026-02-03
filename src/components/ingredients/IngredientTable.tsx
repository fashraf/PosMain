import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusBadge, YesNoBadge, TypeBadge } from "@/components/shared/StatusBadge";
import { useLanguage } from "@/hooks/useLanguage";
import { Edit, AlertTriangle } from "lucide-react";

export interface Ingredient {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  type: "liquid" | "solid";
  base_unit: string;
  current_quantity: number;
  alert_threshold: number;
  cost_price: number;
  selling_price: number | null;
  can_sell_individually: boolean;
  can_add_extra: boolean;
  extra_cost: number | null;
  is_active: boolean;
}

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onToggleStatus: (ingredient: Ingredient) => void;
}

export function IngredientTable({
  ingredients,
  onEdit,
  onToggleStatus,
}: IngredientTableProps) {
  const { t, currentLanguage } = useLanguage();

  const getLocalizedName = (ingredient: Ingredient) => {
    const nameKey = `name_${currentLanguage}` as keyof Ingredient;
    return (ingredient[nameKey] as string) || ingredient.name_en;
  };

  const getUnitLabel = (unit: string) => {
    const unitKey = unit as keyof typeof translations;
    return t(`ingredients.units.${unit}` as any) || unit;
  };

  const isLowStock = (ingredient: Ingredient) => {
    return ingredient.current_quantity <= ingredient.alert_threshold;
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">{t("common.name")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.type")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.baseUnit")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.currentStock")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.alertThreshold")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.costPerUnit")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.sellingPrice")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.canSellIndividually")}</TableHead>
            <TableHead className="font-semibold">{t("ingredients.canAddAsExtra")}</TableHead>
            <TableHead className="font-semibold">{t("common.status")}</TableHead>
            <TableHead className="font-semibold text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getLocalizedName(ingredient)}
                  {isLowStock(ingredient) && (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <TypeBadge 
                  type={ingredient.type === "liquid" ? t("ingredients.liquid") : t("ingredients.solid")} 
                />
              </TableCell>
              <TableCell>{ingredient.base_unit}</TableCell>
              <TableCell className={isLowStock(ingredient) ? "text-warning font-medium" : ""}>
                {ingredient.current_quantity}
              </TableCell>
              <TableCell>{ingredient.alert_threshold}</TableCell>
              <TableCell>${ingredient.cost_price.toFixed(2)}</TableCell>
              <TableCell>
                {ingredient.selling_price ? `$${ingredient.selling_price.toFixed(2)}` : "-"}
              </TableCell>
              <TableCell>
                <YesNoBadge value={ingredient.can_sell_individually} />
              </TableCell>
              <TableCell>
                <YesNoBadge value={ingredient.can_add_extra} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={ingredient.is_active}
                    onCheckedChange={() => onToggleStatus(ingredient)}
                  />
                  <StatusBadge isActive={ingredient.is_active} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(ingredient)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const translations = {
  kg: "kg",
  g: "g",
  pieces: "pcs",
  liters: "L",
  ml: "mL",
};
