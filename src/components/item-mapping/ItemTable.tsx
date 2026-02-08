import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Plus, X, Eye, Star, Trash2, Pencil } from "lucide-react";
import { QuantityControl } from "./QuantityControl";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubItemMappingItem } from "./SubItemMappingList";
import { cn } from "@/lib/utils";

interface ItemTableProps {
  mappings: SubItemMappingItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onEdit?: (id: string) => void;
  onReplacement?: (id: string) => void;
  onRemoveReplacement?: (mappingId: string, replacementId: string) => void;
  onViewReplacement?: (mappingId: string, replacementId: string) => void;
  totalCost: number;
  totalComboPrice: number;
  isCombo: boolean;
}

export function ItemTable({
  mappings,
  onQuantityChange,
  onRemove,
  onAdd,
  onEdit,
  onReplacement,
  onRemoveReplacement,
  onViewReplacement,
  totalCost,
  totalComboPrice,
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
            <th className="h-9 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide w-[20%]">
              {t("common.name")}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide w-[10%]">
              {t("itemMapping.replacement")}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide w-[15%]">
              {t("itemMapping.quantity")}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide w-[10%]">
              {t("itemMapping.comboPrice")}
            </th>
            <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide w-[15%]">
              {t("itemMapping.actualCost")}
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide w-[8%]">
              Can Add
            </th>
            <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide w-[8%]">
              Can Remove
            </th>
            <th className="h-9 w-20"></th>
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
              const hasReplacements = mapping.replacements && mapping.replacements.length > 0;
              
              return (
                <>
                  {/* Main Item Row */}
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
                    <td className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => onReplacement?.(mapping.id)}
                              className={cn(
                                "inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-[12px] font-medium rounded transition-colors",
                                hasReplacements
                                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                              )}
                            >
                              {hasReplacements ? mapping.replacements!.length : <Plus size={14} strokeWidth={1.5} />}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{hasReplacements ? t("itemMapping.editReplacements") : t("itemMapping.addReplacement")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <QuantityControl
                          value={mapping.quantity}
                          onChange={(qty) => onQuantityChange(mapping.id, qty)}
                          min={1}
                          step={1}
                        />
                      </div>
                    </td>
                    <td className="text-center text-[13px]">
                      {mapping.combo_price?.toFixed(2) || "0"}
                    </td>
                    <td className="text-right">
                      <div className="text-[12px] text-muted-foreground">
                        SAR {mapping.unit_price.toFixed(2)} × {mapping.quantity}
                      </div>
                      <div className="font-medium">SAR {subtotal.toFixed(2)}</div>
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

                  {/* Replacement Sub-Rows */}
                  {mapping.replacements?.map((rep) => (
                    <tr key={rep.id} className="h-8 border-b border-border/50 bg-muted/20">
                      <td className="ps-6 text-[13px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="text-muted-foreground/60">→</span>
                          {rep.is_default && (
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          )}
                          {rep.item_name}
                          {rep.is_default && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded">
                              Def
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewReplacement?.(mapping.id, rep.id)}
                            className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Eye size={14} strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveReplacement?.(mapping.id, rep.id)}
                            className="p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                      <td></td>
                      <td className={cn(
                        "text-center text-[12px]",
                        rep.extra_cost > 0 ? "text-green-600" : "text-muted-foreground"
                      )}>
                        {rep.extra_cost > 0 ? `+SAR ${rep.extra_cost.toFixed(2)}` : "+0"}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </>
              );
            })
          )}
        </tbody>
        {mappings.length > 0 && (
          <tfoot>
            <tr>
              <td className="font-medium uppercase text-[12px]">
                {t("itemMapping.itemsTotal")}
              </td>
              <td></td>
              <td></td>
              <td className="text-center font-bold">SAR {totalComboPrice.toFixed(2)}</td>
              <td className="text-right font-bold">SAR {totalCost.toFixed(2)}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
