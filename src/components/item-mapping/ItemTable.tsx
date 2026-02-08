import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubItemMappingItem } from "./SubItemMappingList";
import { cn } from "@/lib/utils";

interface ItemTableProps {
  mappings: SubItemMappingItem[];
  onRemove: (id: string) => void;
  onAdd: () => void;
  onEdit?: (id: string) => void;
  isCombo: boolean;
}

export function ItemTable({
  mappings,
  onRemove,
  onAdd,
  onEdit,
  isCombo,
}: ItemTableProps) {
  const { t } = useLanguage();

  if (!isCombo) {
    return (
      <div className="border-2 border-dashed border-amber-300/50 rounded-lg overflow-hidden opacity-50">
        <div className="flex items-center justify-between h-10 px-3 bg-amber-50 border-b border-amber-200/50">
          <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
            {t("itemMapping.items")}
          </span>
        </div>
        <div className="p-6 text-center text-muted-foreground text-sm">
          {t("itemMapping.notComboItem")}
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-amber-300/50 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between h-10 px-3 bg-amber-50 border-b border-amber-200/50">
        <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
          {t("itemMapping.items")}
        </span>
        <Button
          type="button"
          onClick={onAdd}
          size="sm"
          className="h-7 px-3 rounded-full bg-primary hover:bg-primary/90 text-xs"
        >
          <PlusCircle className="h-3.5 w-3.5 me-1" />
          Add Item
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
              {t("itemMapping.replacement")}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.quantity")}
            </th>
            <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.comboPrice")}
            </th>
            <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.actualCost")}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.canAddExtra") || "Can Add"}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("itemMapping.canRemove") || "Can Remove"}
            </th>
            <th className="h-9 w-20 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted-foreground py-6 text-sm">
                {t("itemMapping.noItemsMapped")}
              </td>
            </tr>
          ) : (
            mappings.map((mapping, index) => {
              const subtotal = mapping.quantity * mapping.unit_price;

              return (
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
                  <td className="px-3 font-medium text-sm">{mapping.sub_item_name}</td>
                  <td className="px-3 text-center text-sm text-muted-foreground">
                    {mapping.replacement_item_name || "—"}
                  </td>
                  <td className="px-3 text-center text-sm">
                    {mapping.quantity}
                  </td>
                  <td className="px-3 text-right text-sm">
                    SAR {(mapping.combo_price || 0).toFixed(2)}
                  </td>
                  <td className="px-3 text-right font-medium text-sm text-primary">
                    SAR {subtotal.toFixed(2)}
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
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
