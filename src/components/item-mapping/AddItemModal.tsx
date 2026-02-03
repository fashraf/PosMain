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

  // Filter out combos and the current item
  const availableItems = useMemo(() => {
    return items.filter((item) => !item.is_combo && item.id !== currentItemId);
  }, [items, currentItemId]);

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
        {/* Clean Header */}
        <DialogHeader className="px-5 py-4 border-b border-border bg-background">
          <DialogTitle className="text-base font-semibold">
            {t("itemMapping.addItem")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-5">
          {/* Select Item */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-foreground">
              {t("itemMapping.selectItem")}
            </label>
            <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  className="w-full justify-between h-10 text-[13px] font-normal border-border"
                >
                  {selectedItem ? (
                    <span className="flex items-center gap-2 text-foreground">
                      {getLocalizedName(selectedItem)}
                      <span className="text-muted-foreground">
                        · SAR {selectedItem.base_cost.toFixed(2)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{t("itemMapping.selectItem")}...</span>
                  )}
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("itemMapping.searchItems")} className="h-10" />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty className="py-4 text-center text-[13px] text-muted-foreground">
                      {t("common.noData")}
                    </CommandEmpty>
                    <CommandGroup>
                      {availableItems.map((item) => {
                        const isAlreadyMapped = mappedIds.includes(item.id);
                        const isSelected = selectedItem?.id === item.id;
                        return (
                          <CommandItem
                            key={item.id}
                            value={getLocalizedName(item)}
                            disabled={isAlreadyMapped}
                            onSelect={() => {
                              if (!isAlreadyMapped) {
                                setSelectedItem(item);
                                setDropdownOpen(false);
                              }
                            }}
                            className={cn(
                              "text-[13px] cursor-pointer py-2.5",
                              isAlreadyMapped && "opacity-50 cursor-not-allowed"
                            )}
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
                            {isAlreadyMapped && (
                              <span className="ml-2 text-[11px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                {t("itemMapping.alreadyMapped")}
                              </span>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Preview Card */}
          {selectedItem && (
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-[12px] font-medium uppercase text-muted-foreground tracking-wide">
                {t("common.view")}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                <div className="text-muted-foreground">{t("common.name")}</div>
                <div className="font-medium text-foreground">{getLocalizedName(selectedItem)}</div>
                <div className="text-muted-foreground">{t("items.baseCost")}</div>
                <div className="font-medium text-foreground">SAR {selectedItem.base_cost.toFixed(2)}</div>
                <div className="text-muted-foreground">{t("common.type")}</div>
                <div className="font-medium text-foreground">Non-Combo</div>
              </div>
            </div>
          )}

          {/* Configure Inputs */}
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-foreground">
                  {t("itemMapping.quantity")}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    step={1}
                    className="h-10 text-[13px]"
                  />
                  <span className="text-[13px] text-muted-foreground whitespace-nowrap">PCS</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-foreground">
                  {t("itemMapping.extraCost")}
                  <span className="font-normal text-muted-foreground ml-1">({t("common.optional")})</span>
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
                      "h-10 text-[13px]",
                      extraCost > 0 && "bg-green-50 border-green-200"
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t border-border bg-muted/30 gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-10 px-5 text-[13px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedItem}
            className="h-10 px-5 text-[13px] bg-primary hover:bg-primary/90"
          >
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
