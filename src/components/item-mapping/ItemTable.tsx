import { useLanguage } from "@/hooks/useLanguage";
import { Plus, X, Eye, Star } from "lucide-react";
import { QuantityControl } from "./QuantityControl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubItemMappingItem } from "./SubItemMappingList";
import { cn } from "@/lib/utils";

interface ItemTableProps {
  mappings: SubItemMappingItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
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
      <div className="border border-border rounded-[6px] overflow-hidden opacity-50">
        {/* Header */}
        <div className="flex items-center justify-between h-8 px-1.5 bg-muted border-b border-border">
          <span className="text-[13px] font-medium uppercase tracking-wide">
            {t("itemMapping.items")}
          </span>
        </div>
        <div className="p-4 text-center text-muted-foreground text-[13px]">
          {t("itemMapping.notComboItem")}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-[6px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-1.5 bg-muted border-b border-border">
        <span className="text-[13px] font-medium uppercase tracking-wide">
          {t("itemMapping.items")}
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
              <p>{t("itemMapping.addItem")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Table */}
      <table className="density-table">
        <thead>
          <tr>
            <th className="w-[25%]">{t("common.name")}</th>
            <th className="w-[12%] text-center">{t("itemMapping.replacement")}</th>
            <th className="w-[20%] text-center">{t("itemMapping.quantity")}</th>
            <th className="w-[15%] text-center">{t("itemMapping.comboPrice")}</th>
            <th className="w-[23%] text-right">{t("itemMapping.actualCost")}</th>
            <th className="w-[5%]"></th>
          </tr>
        </thead>
        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted-foreground py-4">
                {t("itemMapping.noItemsMapped")}
              </td>
            </tr>
          ) : (
            mappings.map((mapping) => {
              const subtotal = mapping.quantity * mapping.unit_price;
              const hasReplacements = mapping.replacements && mapping.replacements.length > 0;
              
              return (
                <>
                  {/* Main Item Row */}
                  <tr key={mapping.id}>
                    <td className="font-medium">{mapping.sub_item_name}</td>
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
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
