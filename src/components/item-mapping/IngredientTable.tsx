import { useLanguage } from "@/hooks/useLanguage";
import { Plus, X } from "lucide-react";
import { QuantityControl } from "./QuantityControl";
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
    <div className="border border-border rounded-[6px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-1.5 bg-muted border-b border-border">
        <span className="text-[13px] font-medium uppercase tracking-wide">
          {t("itemMapping.ingredients")}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onAdd}
                className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{t("itemMapping.addIngredient")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Table */}
      <table className="density-table">
        <thead>
          <tr>
            <th className="w-[40%]">{t("common.name")}</th>
            <th className="w-[35%] text-center">{t("itemMapping.quantity")}</th>
            <th className="w-[20%] text-right">{t("common.cost")}</th>
            <th className="w-[5%]"></th>
          </tr>
        </thead>
        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-muted-foreground py-4">
                {t("itemMapping.noIngredientsMapped")}
              </td>
            </tr>
          ) : (
            mappings.map((mapping) => (
              <tr key={mapping.id}>
                <td className="font-medium">{mapping.ingredient_name}</td>
                <td>
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
                <td className="text-right font-medium">
                  SAR {((mapping.quantity || 0) * 5).toFixed(2)}
                </td>
                <td className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => onRemove(mapping.id)}
                          className="p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={16} strokeWidth={1.5} />
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
          <tfoot>
            <tr>
              <td colSpan={2} className="text-right font-medium uppercase text-[12px]">
                {t("itemMapping.ingredientCostTotal")}
              </td>
              <td className="text-right font-bold">SAR {totalCost.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
