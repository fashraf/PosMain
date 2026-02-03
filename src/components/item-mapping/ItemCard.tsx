import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubItemMappingItem } from "./SubItemMappingList";

interface ItemCardProps {
  mapping: SubItemMappingItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function ItemCard({
  mapping,
  onQuantityChange,
  onRemove,
}: ItemCardProps) {
  const { t } = useLanguage();

  const subtotal = mapping.quantity * mapping.unit_price;

  const handleIncrement = () => {
    onQuantityChange(mapping.quantity + 1);
  };

  const handleDecrement = () => {
    onQuantityChange(Math.max(1, mapping.quantity - 1));
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      {/* Header Row: Name + Remove */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{mapping.sub_item_name}</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={onRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("common.remove")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Quantity Row */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{t("itemMapping.quantity")}:</span>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDecrement}
                  disabled={mapping.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("itemMapping.decrement")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            type="number"
            min="1"
            step="1"
            value={mapping.quantity}
            onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-8 text-center text-sm"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleIncrement}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("itemMapping.increment")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm text-muted-foreground ms-1">pcs</span>
        </div>
      </div>

      {/* Price Row */}
      <div className="flex items-center justify-between pt-2 border-t text-sm">
        <span className="text-muted-foreground">
          ${mapping.unit_price.toFixed(2)} × {mapping.quantity}
        </span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
