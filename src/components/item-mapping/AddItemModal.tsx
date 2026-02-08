import { useState, useMemo, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
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
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import type { AvailableItem } from "./SubItemSearchPicker";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: AvailableItem, quantity: number, extraCost: number, canAddExtra: boolean, canRemove: boolean) => void;
  items: AvailableItem[];
  mappedIds: string[];
  currentItemId: string;
  currentLanguage: string;
  editData?: {
    itemId: string;
    quantity: number;
    extraCost: number;
    canAddExtra: boolean;
    canRemove: boolean;
  } | null;
}

export function AddItemModal({
  open,
  onOpenChange,
  onConfirm,
  items,
  mappedIds,
  currentItemId,
  currentLanguage,
  editData,
}: AddItemModalProps) {
  const { t } = useLanguage();
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);
  const [canAddExtra, setCanAddExtra] = useState(false);
  const [canRemove, setCanRemove] = useState(false);

  // Pre-fill state when opening in edit mode
  useEffect(() => {
    if (open && editData) {
      const item = items.find(i => i.id === editData.itemId);
      setSelectedItem(item || null);
      setQuantity(editData.quantity);
      setExtraCost(editData.extraCost);
      setCanAddExtra(editData.canAddExtra);
      setCanRemove(editData.canRemove);
    }
  }, [open, editData, items]);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && editData) {
      const item = items.find(i => i.id === editData.itemId);
      setSelectedItem(item || null);
      setQuantity(editData.quantity);
      setExtraCost(editData.extraCost);
      setCanAddExtra(editData.canAddExtra);
      setCanRemove(editData.canRemove);
    } else if (!isOpen) {
      handleClose();
      return;
    }
    onOpenChange(isOpen);
  };

  // Filter out combos, current item, and already mapped items
  const availableItems = useMemo(() => {
    return items.filter(
      (item) => !item.is_combo && item.id !== currentItemId && (!mappedIds.includes(item.id) || (editData && item.id === editData.itemId))
    );
  }, [items, currentItemId, mappedIds, editData]);

  const handleCanAddExtraChange = (checked: boolean) => {
    setCanAddExtra(checked);
    if (checked) setCanRemove(false);
    else setExtraCost(0);
  };

  const handleCanRemoveChange = (checked: boolean) => {
    setCanRemove(checked);
    if (checked) {
      setCanAddExtra(false);
      setExtraCost(0);
    }
  };

  const handleConfirm = () => {
    if (!selectedItem || quantity <= 0) return;
    onConfirm(selectedItem, quantity, canAddExtra ? extraCost : 0, canAddExtra, canRemove);
    handleClose();
  };

  const handleClose = () => {
    setItemDropdownOpen(false);
    setSelectedItem(null);
    setQuantity(1);
    setExtraCost(0);
    setCanAddExtra(false);
    setCanRemove(false);
    onOpenChange(false);
  };

  const isValid = selectedItem && quantity > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[65vw] p-0 gap-0 rounded-lg overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border bg-background">
          <DialogTitle className="text-base font-semibold">
            {editData ? t("itemMapping.editItem") : t("itemMapping.addItem")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Item Selection */}
          <div>
            <h4 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border/50">
              {t("itemMapping.itemSelection") || "Item Selection"}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {/* Item Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.selectItem")} <span className="text-destructive">*</span>
                  <TooltipInfo content="Select item to include or replace" />
                </label>
                <Popover open={itemDropdownOpen} onOpenChange={setItemDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!!editData}
                      className="w-full justify-between h-9 text-[13px] font-normal border-border"
                    >
                      {selectedItem ? (
                        <span className="truncate text-foreground">{getLocalizedName(selectedItem)}</span>
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
                          {availableItems.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={getLocalizedName(item)}
                              onSelect={() => {
                                setSelectedItem(item);
                                setItemDropdownOpen(false);
                              }}
                              className="text-[13px] cursor-pointer py-2"
                            >
                              <Check className={cn("mr-2 h-4 w-4 text-primary", selectedItem?.id === item.id ? "opacity-100" : "opacity-0")} />
                              <span className="flex-1">{getLocalizedName(item)}</span>
                              <span className="text-muted-foreground ml-2">SAR {item.base_cost.toFixed(2)}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Item Price (read-only) */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.itemPrice")}
                  <TooltipInfo content="Auto-fetched item selling price" />
                </label>
                <Input
                  value={selectedItem ? `SAR ${selectedItem.base_cost.toFixed(2)}` : ""}
                  readOnly
                  placeholder="—"
                  className="h-9 text-[13px] bg-muted cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Quantity & Rules */}
          <div>
            <h4 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border/50">
              {t("itemMapping.quantityAndRules") || "Quantity & Rules"}
            </h4>
            <div className="grid grid-cols-4 gap-x-4 gap-y-4">
              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.quantity") || "Quantity"} <span className="text-destructive">*</span>
                  <TooltipInfo content="Default quantity of this item" />
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

              {/* Can Add Extra */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.canAddExtra") || "Can Add Extra"}
                  <TooltipInfo content="Allows customer to add more of this item" />
                </label>
                <div className="flex items-center gap-2 h-9">
                  <Switch checked={canAddExtra} onCheckedChange={handleCanAddExtraChange} />
                  <span className="text-[13px] text-muted-foreground">{canAddExtra ? "Yes" : "No"}</span>
                </div>
              </div>

              {/* Extra Cost */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.extraCost")}
                  <TooltipInfo content="Extra charge for additional quantity" />
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-muted-foreground">SAR</span>
                  <Input
                    type="number"
                    value={extraCost}
                    onChange={(e) => setExtraCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    min={0}
                    step={0.01}
                    disabled={!canAddExtra}
                    className={cn(
                      "h-9 text-[13px] flex-1",
                      !canAddExtra && "bg-muted cursor-not-allowed opacity-50",
                      canAddExtra && extraCost > 0 && "bg-[hsl(var(--success)/0.1)] border-[hsl(var(--success)/0.3)]"
                    )}
                  />
                </div>
              </div>

              {/* Can Remove */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.canRemove") || "Can Remove"}
                  <TooltipInfo content="Allows removal of this item from combo" />
                </label>
                <div className="flex items-center gap-2 h-9">
                  <Switch checked={canRemove} onCheckedChange={handleCanRemoveChange} />
                  <span className="text-[13px] text-muted-foreground">{canRemove ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={handleClose} className="h-9 px-6 text-[13px]">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="h-9 px-6 text-[13px] bg-foreground text-background hover:bg-foreground/90"
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
