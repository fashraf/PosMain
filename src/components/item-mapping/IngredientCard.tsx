import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { IngredientMappingItem } from "./IngredientMappingList";

interface IngredientCardProps {
  mapping: IngredientMappingItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onToggleCanRemove: (value: boolean) => void;
  onToggleCanExtra: (value: boolean) => void;
  onExtraCostChange: (cost: number | null) => void;
}

export function IngredientCard({
  mapping,
  onQuantityChange,
  onRemove,
  onToggleCanRemove,
  onToggleCanExtra,
  onExtraCostChange,
}: IngredientCardProps) {
  const { t } = useLanguage();

  const handleIncrement = () => {
    const step = mapping.unit === "Pcs" ? 1 : 0.01;
    const newValue = Math.round((mapping.quantity + step) * 100) / 100;
    onQuantityChange(newValue);
  };

  const handleDecrement = () => {
    const step = mapping.unit === "Pcs" ? 1 : 0.01;
    const newValue = Math.round((mapping.quantity - step) * 100) / 100;
    onQuantityChange(Math.max(0.01, newValue));
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      {/* Header Row: Name + Remove */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{mapping.ingredient_name}</h4>
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
                  disabled={mapping.quantity <= 0.01}
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
            min="0.01"
            step={mapping.unit === "Pcs" ? "1" : "0.01"}
            value={mapping.quantity}
            onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0.01)}
            className="w-20 h-8 text-center text-sm"
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
          <span className="text-sm text-muted-foreground ms-1">{mapping.unit}</span>
        </div>
      </div>

      {/* Options Row */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`remove-${mapping.id}`}
            checked={mapping.can_remove}
            onCheckedChange={(checked) => onToggleCanRemove(checked as boolean)}
          />
          <label
            htmlFor={`remove-${mapping.id}`}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            {t("itemMapping.customerCanRemove")}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`extra-${mapping.id}`}
            checked={mapping.can_add_extra}
            onCheckedChange={(checked) => onToggleCanExtra(checked as boolean)}
          />
          <label
            htmlFor={`extra-${mapping.id}`}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            {t("itemMapping.customerCanAddExtra")}
          </label>
        </div>

        {mapping.can_add_extra && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("itemMapping.extraCost")}:</span>
            <div className="flex items-center gap-1">
              <span className="text-sm">$</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={mapping.extra_cost || ""}
                onChange={(e) =>
                  onExtraCostChange(e.target.value ? parseFloat(e.target.value) : null)
                }
                className="w-20 h-8 text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
