import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { AvailableItem } from "./SubItemSearchPicker";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: AvailableItem, quantity: number, extraCost: number) => void;
  items: AvailableItem[];
  mappedIds: string[];
  currentItemId: string;
  currentLanguage: string;
}

export function AddItemModal({
  open,
  onOpenChange,
  onConfirm,
  items,
  mappedIds,
  currentItemId,
  currentLanguage,
}: AddItemModalProps) {
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  // Filter out combos, current item, and already mapped items
  const availableItems = useMemo(() => {
    return items.filter(
      (item) => !item.is_combo && item.id !== currentItemId && !mappedIds.includes(item.id)
    );
  }, [items, currentItemId, mappedIds]);

  const handleConfirm = () => {
    if (!selectedItem) return;
    onConfirm(selectedItem, quantity, extraCost);
    handleClose();
  };

  const handleClose = () => {
    setDropdownOpen(false);
    setSelectedItem(null);
    setQuantity(1);
    setExtraCost(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-lg overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border bg-background">
          <DialogTitle className="text-base font-semibold">
            {t("itemMapping.addItem")}
          </DialogTitle>
        </DialogHeader>

        {/* 2x2 Grid Form */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {/* Row 1: Select Item */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground">
                {t("itemMapping.selectItem")} <span className="text-destructive">*</span>
              </label>
              <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={dropdownOpen}
                    className="w-full justify-between h-9 text-[13px] font-normal border-border"
                  >
                    {selectedItem ? (
                      <span className="truncate text-foreground">
                        {getLocalizedName(selectedItem)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">{t("common.select")}...</span>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t("itemMapping.searchItems")} className="h-9" />
                    <CommandList className="max-h-[200px]">
                      <CommandEmpty className="py-4 text-center text-[13px] text-muted-foreground">
                        {t("common.noData")}
                      </CommandEmpty>
                      <CommandGroup>
                        {availableItems.map((item) => {
                          const isSelected = selectedItem?.id === item.id;
                          return (
                            <CommandItem
                              key={item.id}
                              value={getLocalizedName(item)}
                              onSelect={() => {
                                setSelectedItem(item);
                                setDropdownOpen(false);
                              }}
                              className="text-[13px] cursor-pointer py-2"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primary",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="flex-1">{getLocalizedName(item)}</span>
                              <span className="text-muted-foreground ml-2">
                                SAR {item.base_cost.toFixed(2)}
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Row 1: Item Price (read-only) */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground">
                {t("itemMapping.itemPrice")}
              </label>
              <Input
                value={selectedItem ? `SAR ${selectedItem.base_cost.toFixed(2)}` : ""}
                readOnly
                placeholder="—"
                className="h-9 text-[13px] bg-muted cursor-not-allowed"
              />
            </div>

            {/* Row 2: Quantity */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground">
                {t("itemMapping.quantity")} <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                step={1}
                className="h-9 text-[13px]"
              />
            </div>

            {/* Row 2: Extra Cost */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground">
                {t("itemMapping.extraCost")}
                <span className="font-normal text-muted-foreground ml-1 text-[12px]">({t("common.optional")})</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted-foreground">SAR</span>
                <Input
                  type="number"
                  value={extraCost}
                  onChange={(e) => setExtraCost(Math.max(0, parseFloat(e.target.value) || 0))}
                  min={0}
                  step={0.01}
                  className={cn(
                    "h-9 text-[13px] flex-1",
                    extraCost > 0 && "bg-[hsl(var(--success)/0.1)] border-[hsl(var(--success)/0.3)]"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t border-border bg-muted/30">
          <Button
            onClick={handleConfirm}
            disabled={!selectedItem}
            className="h-9 px-6 text-[13px] bg-foreground text-background hover:bg-foreground/90"
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
