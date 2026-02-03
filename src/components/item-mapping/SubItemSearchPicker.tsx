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

export interface AvailableItem {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  base_cost: number;
  is_combo: boolean;
}

interface SubItemSearchPickerProps {
  items: AvailableItem[];
  mappedIds: string[];
  currentItemId: string;
  onSelect: (item: AvailableItem) => void;
}

export function SubItemSearchPicker({
  items,
  mappedIds,
  currentItemId,
  onSelect,
}: SubItemSearchPickerProps) {
  const { t, currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const getLocalizedName = (item: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof item;
    return item[key] || item.name_en;
  };

  // Filter out the current item and already mapped items
  const availableItems = items.filter(
    (item) => item.id !== currentItemId && !item.is_combo
  );

  const handleSelect = (item: AvailableItem) => {
    if (!mappedIds.includes(item.id)) {
      onSelect(item);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 me-2" />
          {t("itemMapping.addSubItem")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("itemMapping.searchItems")} />
          <CommandList>
            <CommandEmpty>{t("common.noData")}</CommandEmpty>
            <CommandGroup>
              {availableItems.map((item) => {
                const isMapped = mappedIds.includes(item.id);
                return (
                  <CommandItem
                    key={item.id}
                    value={getLocalizedName(item)}
                    onSelect={() => handleSelect(item)}
                    disabled={isMapped}
                    className={cn(isMapped && "opacity-50")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{getLocalizedName(item)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          ${item.base_cost.toFixed(2)}
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
