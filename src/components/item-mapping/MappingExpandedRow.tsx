import { useLanguage } from "@/hooks/useLanguage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Check, X, Package } from "lucide-react";
import type { ItemWithMappings } from "./MappingSummaryTable";

interface MappingExpandedRowProps {
  item: ItemWithMappings;
}

export function MappingExpandedRow({ item }: MappingExpandedRowProps) {
  const { t } = useLanguage();

  const totalIngredientCost = item.ingredients?.reduce((sum, ing) => sum + ing.cost, 0) || 0;
  const totalSubItemsCost = item.sub_items?.reduce((sum, sub) => sum + sub.subtotal, 0) || 0;

  return (
    <div className="p-4 space-y-4">
      {/* Sub-Items Section (for combos) */}
      {item.is_combo && item.sub_items && item.sub_items.length > 0 && (
        <Card className="border-dashed">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t("itemMapping.subItems")} ({item.sub_items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-8"></TableHead>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead className="text-center">{t("itemMapping.quantity")}</TableHead>
                  <TableHead className="text-end">{t("itemMapping.unitPrice")}</TableHead>
                  <TableHead className="text-end">{t("itemMapping.subtotal")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.sub_items.map((subItem) => (
                  <TableRow key={subItem.id}>
                    <TableCell>
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{subItem.sub_item_name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{subItem.quantity}×</Badge>
                    </TableCell>
                    <TableCell className="text-end">${subItem.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-end font-medium">
                      ${subItem.subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell colSpan={4} className="text-end">
                    {t("itemMapping.subItemsTotal")}:
                  </TableCell>
                  <TableCell className="text-end">${totalSubItemsCost.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Ingredients Section */}
      {item.ingredients && item.ingredients.length > 0 && (
        <Card className="border-dashed">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">
              {item.is_combo
                ? t("itemMapping.aggregatedIngredients")
                : t("itemMapping.ingredients")}{" "}
              ({item.ingredients.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead className="text-center">{t("itemMapping.quantity")}</TableHead>
                  <TableHead className="text-center">{t("common.unit")}</TableHead>
                  <TableHead className="text-center">{t("itemMapping.canRemove")}</TableHead>
                  <TableHead className="text-center">{t("itemMapping.canAddExtra")}</TableHead>
                  <TableHead className="text-end">{t("common.cost")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.ingredient_name}</TableCell>
                    <TableCell className="text-center">{ingredient.quantity}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {ingredient.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      {ingredient.can_remove ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {ingredient.can_add_extra ? (
                        <span className="flex items-center justify-center gap-1">
                          <Check className="h-4 w-4 text-green-600" />
                          {ingredient.extra_cost && (
                            <span className="text-xs text-muted-foreground">
                              +${ingredient.extra_cost.toFixed(2)}
                            </span>
                          )}
                        </span>
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-end">${ingredient.cost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell colSpan={5} className="text-end">
                    {t("itemMapping.ingredientCostTotal")}:
                  </TableCell>
                  <TableCell className="text-end">${totalIngredientCost.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {(!item.ingredients || item.ingredients.length === 0) &&
        (!item.sub_items || item.sub_items.length === 0) && (
          <div className="text-center py-6 text-muted-foreground">
            {t("itemMapping.noMappings")}
          </div>
        )}
    </div>
  );
}
