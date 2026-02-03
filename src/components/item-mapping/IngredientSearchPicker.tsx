import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StockLevelBadge } from "@/components/inventory/StockLevelIndicator";

export interface AvailableIngredient {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  unit: string;
  cost_per_unit: number;
  current_stock: number;
  min_stock: number;
  reorder_level: number;
}

interface IngredientSearchPickerProps {
  ingredients: AvailableIngredient[];
  mappedIds: string[];
  onSelect: (ingredient: AvailableIngredient) => void;
}

export function IngredientSearchPicker({
  ingredients,
  mappedIds,
  onSelect,
}: IngredientSearchPickerProps) {
  const { t, currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const getLocalizedName = (item: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof item;
    return item[key] || item.name_en;
  };

  const handleSelect = (ingredient: AvailableIngredient) => {
    if (!mappedIds.includes(ingredient.id)) {
      onSelect(ingredient);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 me-2" />
          {t("itemMapping.addIngredient")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("itemMapping.searchIngredients")} />
          <CommandList>
            <CommandEmpty>{t("common.noData")}</CommandEmpty>
            <CommandGroup>
              {ingredients.map((ingredient) => {
                const isMapped = mappedIds.includes(ingredient.id);
                return (
                  <CommandItem
                    key={ingredient.id}
                    value={getLocalizedName(ingredient)}
                    onSelect={() => handleSelect(ingredient)}
                    disabled={isMapped}
                    className={cn(isMapped && "opacity-50")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <StockLevelBadge
                          current={ingredient.current_stock}
                          min={ingredient.min_stock}
                          reorder={ingredient.reorder_level}
                          unit={ingredient.unit}
                        />
                        <span>{getLocalizedName(ingredient)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({ingredient.unit})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          ${ingredient.cost_per_unit.toFixed(2)}/{ingredient.unit}
                        </span>
                        {isMapped && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="h-3 w-3 me-1" />
                            {t("itemMapping.alreadyMapped")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
