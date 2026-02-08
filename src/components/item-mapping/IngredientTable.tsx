import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { IngredientMappingItem } from "./IngredientMappingList";

interface IngredientTableProps {
  mappings: IngredientMappingItem[];
  onRemove: (id: string) => void;
  onAdd: () => void;
  onEdit?: (id: string) => void;
}

export function IngredientTable({
  mappings,
  onRemove,
  onAdd,
  onEdit,
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
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.canAddExtra") || "Can Add"}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.canRemove") || "Can Remove"}
            </th>
            <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.extraCost") || "Extra Cost"}
            </th>
            <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("common.cost")}
            </th>
            <th className="h-9 w-20 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted-foreground py-6 text-sm">
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
                <td className="px-3 text-center text-sm">
                  {mapping.quantity} {mapping.unit}
                </td>
                <td className="px-3 text-center">
                  {mapping.can_add_extra ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                      Yes
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 text-center">
                  {mapping.can_remove ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                      Yes
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 text-right text-sm">
                  {mapping.can_add_extra && mapping.extra_cost != null && mapping.extra_cost > 0 ? (
                    <span className="text-green-600 font-medium">SAR {mapping.extra_cost.toFixed(2)}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 text-right font-medium text-sm text-primary">
                  SAR {((mapping.quantity || 0) * 5).toFixed(2)}
                </td>
                <td className="px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {onEdit && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => onEdit(mapping.id)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Pencil size={14} strokeWidth={1.5} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("common.edit")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
