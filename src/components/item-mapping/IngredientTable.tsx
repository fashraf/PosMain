import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Trash2 } from "lucide-react";
import { QuantityControl } from "./QuantityControl";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { IngredientMappingItem } from "./IngredientMappingList";

interface IngredientTableProps {
  mappings: IngredientMappingItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  totalCost: number;
}

export function IngredientTable({
  mappings,
  onQuantityChange,
  onRemove,
  onAdd,
  totalCost,
}: IngredientTableProps) {
  const { t } = useLanguage();

  return (
    <div className="border-2 border-dashed border-green-300/50 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between h-10 px-3 bg-green-50 border-b border-green-200/50">
        <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">
          {t("itemMapping.ingredients")}
        </span>
        <Button
          type="button"
          onClick={onAdd}
          size="sm"
          className="h-7 px-3 rounded-full bg-primary hover:bg-primary/90 text-xs"
        >
          <PlusCircle className="h-3.5 w-3.5 me-1" />
          Add Ingredient
        </Button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="h-9 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("common.name")}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.quantity")}
            </th>
            <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("common.cost")}
            </th>
            <th className="h-9 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-muted-foreground py-6 text-sm">
                {t("itemMapping.noIngredientsMapped")}
              </td>
            </tr>
          ) : (
            mappings.map((mapping, index) => (
              <tr 
                key={mapping.id}
                className={cn(
                  "h-11 border-b border-border/50 transition-all duration-200",
                  "animate-in fade-in slide-in-from-top-2",
                  index % 2 === 0 ? "bg-background" : "bg-muted/30",
                  "hover:bg-primary/5 hover:shadow-sm"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-3 font-medium text-sm">{mapping.ingredient_name}</td>
                <td className="px-3">
                  <div className="flex justify-center">
                    <QuantityControl
                      value={mapping.quantity}
                      onChange={(qty) => onQuantityChange(mapping.id, qty)}
                      min={0.01}
                      step={mapping.unit === "Pcs" ? 1 : 0.01}
                      unit={mapping.unit}
                    />
                  </div>
                </td>
                <td className="px-3 text-right font-medium text-sm text-primary">
                  SAR {((mapping.quantity || 0) * 5).toFixed(2)}
                </td>
                <td className="px-3 text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => onRemove(mapping.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("common.remove")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </tr>
            ))
          )}
        </tbody>
        {mappings.length > 0 && (
          <tfoot className="bg-muted/40 border-t-2 border-primary/20">
            <tr>
              <td colSpan={2} className="h-10 px-3 text-right text-xs font-semibold uppercase tracking-wide">
                {t("itemMapping.ingredientCostTotal")}
              </td>
              <td className="h-10 px-3 text-right font-bold text-primary text-sm">
                SAR {totalCost.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
