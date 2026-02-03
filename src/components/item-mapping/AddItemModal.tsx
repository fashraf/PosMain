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
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <DialogTitle className="text-[15px]">
            {t("itemMapping.addItem")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Step 1: Select via Dropdown */}
          <div className="space-y-2">
            <label className="text-[12px] font-medium uppercase text-muted-foreground">
              Step 1: {t("itemMapping.selectItem")}
            </label>
            <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  className="w-full justify-between h-9 text-[13px] font-normal"
                >
                  {selectedItem ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {getLocalizedName(selectedItem)} - SAR {selectedItem.base_cost.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{t("itemMapping.selectItem")}...</span>
                  )}
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("itemMapping.searchItems")} className="h-9" />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty>{t("common.noData")}</CommandEmpty>
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
                              "text-[13px] cursor-pointer",
                              isAlreadyMapped && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100 text-green-500" : "opacity-0"
                              )}
                            />
                            <span className="flex-1">{getLocalizedName(item)}</span>
                            <span className="text-muted-foreground ml-2">
                              SAR {item.base_cost.toFixed(2)}
                            </span>
                            {isAlreadyMapped && (
                              <span className="ml-2 text-[11px] bg-muted px-1.5 py-0.5 rounded">
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

          {/* Step 2: Preview */}
          {selectedItem && (
            <div className="space-y-2">
              <label className="text-[12px] font-medium uppercase text-muted-foreground">
                Step 2: {t("common.view")}
              </label>
              <div className="border border-border rounded-[6px] p-3 bg-muted text-[13px] space-y-1">
                <div><strong>{t("common.name")}:</strong> {getLocalizedName(selectedItem)}</div>
                <div><strong>{t("items.baseCost")}:</strong> SAR {selectedItem.base_cost.toFixed(2)}</div>
                <div><strong>{t("common.type")}:</strong> Non-Combo</div>
              </div>
            </div>
          )}

          {/* Step 3: Configure */}
          {selectedItem && (
            <div className="space-y-2">
              <label className="text-[12px] font-medium uppercase text-muted-foreground">
                Step 3: Configure
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] text-muted-foreground">
                    {t("itemMapping.quantity")}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      step={1}
                      className="h-8 text-[13px]"
                    />
                    <span className="text-[13px] text-muted-foreground">PCS</span>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] text-muted-foreground">
                    {t("itemMapping.extraCost")} ({t("common.optional")})
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[13px] text-muted-foreground">SAR</span>
                    <Input
                      type="number"
                      value={extraCost}
                      onChange={(e) => setExtraCost(Math.max(0, parseFloat(e.target.value) || 0))}
                      min={0}
                      step={0.01}
                      className="h-8 text-[13px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 pt-0 border-t border-border gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 text-[13px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!selectedItem}
            className="h-8 text-[13px]"
          >
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
