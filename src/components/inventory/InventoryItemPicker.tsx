import { useState } from "react";
import { Check, ChevronsUpDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useLanguage } from "@/hooks/useLanguage";
import { StockLevelBadge } from "./StockLevelIndicator";

interface InventoryItem {
  id: string;
  item_code: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  current_stock: number;
  min_stock_level: number;
  reorder_level: number;
  base_unit: string;
}

interface InventoryItemPickerProps {
  value: string;
  onChange: (itemId: string) => void;
  items: InventoryItem[];
  showStock?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function InventoryItemPicker({
  value,
  onChange,
  items,
  showStock = true,
  placeholder,
  disabled = false,
  className,
}: InventoryItemPickerProps) {
  const [open, setOpen] = useState(false);
  const { t, currentLanguage } = useLanguage();

  const selectedItem = items.find((item) => item.id === value);

  const getItemName = (item: InventoryItem) => {
    switch (currentLanguage) {
      case "ar":
        return item.name_ar || item.name_en;
      case "ur":
        return item.name_ur || item.name_en;
      default:
        return item.name_en;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem ? (
            <div className="flex items-center gap-2 truncate">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">
                {selectedItem.item_code} - {getItemName(selectedItem)}
              </span>
              {showStock && (
                <StockLevelBadge
                  current={selectedItem.current_stock}
                  min={selectedItem.min_stock_level}
                  reorder={selectedItem.reorder_level}
                  unit={selectedItem.base_unit}
                />
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">
              {placeholder || t("inventory.selectItem")}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={t("common.search")} />
          <CommandList>
            <CommandEmpty>{t("inventory.noStockItems")}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.item_code} ${getItemName(item)}`}
                  onSelect={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between flex-1 gap-2">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.item_code} - {getItemName(item)}
                      </span>
                    </div>
                    {showStock && (
                      <StockLevelBadge
                        current={item.current_stock}
                        min={item.min_stock_level}
                        reorder={item.reorder_level}
                        unit={item.base_unit}
                      />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
