import { useLanguage } from "@/hooks/useLanguage";
import { Plus, X } from "lucide-react";
import { QuantityControl } from "./QuantityControl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubItemMappingItem } from "./SubItemMappingList";

interface ItemTableProps {
  mappings: SubItemMappingItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  totalCost: number;
  isCombo: boolean;
}

export function ItemTable({
  mappings,
  onQuantityChange,
  onRemove,
  onAdd,
  totalCost,
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
            <th className="w-[45%]">{t("common.name")}</th>
            <th className="w-[25%] text-center">{t("itemMapping.quantity")}</th>
            <th className="w-[25%] text-right">{t("common.price")}</th>
            <th className="w-[5%]"></th>
          </tr>
        </thead>
        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-muted-foreground py-4">
                {t("itemMapping.noItemsMapped")}
              </td>
            </tr>
          ) : (
            mappings.map((mapping) => {
              const subtotal = mapping.quantity * mapping.unit_price;
              return (
                <tr key={mapping.id}>
                  <td className="font-medium">{mapping.sub_item_name}</td>
                  <td>
                    <div className="flex justify-center">
                      <QuantityControl
                        value={mapping.quantity}
                        onChange={(qty) => onQuantityChange(mapping.id, qty)}
                        min={1}
                        step={1}
                        unit="PCS"
                      />
                    </div>
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
              );
            })
          )}
        </tbody>
        {mappings.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={2} className="text-right font-medium uppercase text-[12px]">
                {t("itemMapping.itemsTotal")}
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
