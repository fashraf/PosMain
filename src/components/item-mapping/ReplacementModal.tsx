import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronDown, Star, Eye, X, ArrowRight } from "lucide-react";
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

export interface ReplacementItem {
  id: string;
  item_id: string;
  item_name: string;
  extra_cost: number;
  is_default: boolean;
}

interface ReplacementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentItemName: string;
  parentItemId: string;
  replacements: ReplacementItem[];
  onReplacementsChange: (replacements: ReplacementItem[]) => void;
  availableItems: AvailableItem[];
  currentLanguage: string;
}

export function ReplacementModal({
  open,
  onOpenChange,
  parentItemName,
  parentItemId,
  replacements,
  onReplacementsChange,
  availableItems,
  currentLanguage,
}: ReplacementModalProps) {
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);
  const [extraCost, setExtraCost] = useState(0);
  const [isDefault, setIsDefault] = useState(false);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  // Filter out already added replacements and the parent item
  const filteredItems = availableItems.filter(
    (item) =>
      !item.is_combo &&
      item.id !== parentItemId &&
      !replacements.some((r) => r.item_id === item.id)
  );

  const handleAddReplacement = () => {
    if (!selectedItem) return;

    const newReplacement: ReplacementItem = {
      id: `rep_${Date.now()}`,
      item_id: selectedItem.id,
      item_name: getLocalizedName(selectedItem),
      extra_cost: extraCost,
      is_default: isDefault || replacements.length === 0,
    };

    // If setting as default, remove default from others
    let updatedReplacements = [...replacements];
    if (newReplacement.is_default) {
      updatedReplacements = updatedReplacements.map((r) => ({
        ...r,
        is_default: false,
      }));
    }

    onReplacementsChange([...updatedReplacements, newReplacement]);
    setSelectedItem(null);
    setExtraCost(0);
    setIsDefault(false);
  };

  const handleRemoveReplacement = (id: string) => {
    const filtered = replacements.filter((r) => r.id !== id);
    // If we removed the default, make the first one default
    if (filtered.length > 0 && !filtered.some((r) => r.is_default)) {
      filtered[0].is_default = true;
    }
    onReplacementsChange(filtered);
  };

  const handleSetDefault = (id: string) => {
    onReplacementsChange(
      replacements.map((r) => ({
        ...r,
        is_default: r.id === id,
      }))
    );
  };

  const handleClose = () => {
    setDropdownOpen(false);
    setSelectedItem(null);
    setExtraCost(0);
    setIsDefault(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 rounded-lg overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border bg-background">
          <DialogTitle className="text-base font-semibold">
            {t("itemMapping.replacementsFor", { item: parentItemName })}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Add Replacement Section */}
          <div className="space-y-3">
            <div className="text-[13px] font-medium text-foreground">
              {t("itemMapping.addReplacement")}
            </div>

            {/* Item Dropdown */}
            <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  className="w-full justify-between h-9 text-[13px] font-normal border-border"
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
                  <CommandInput placeholder={t("itemMapping.searchItems")} className="h-9" />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty className="py-4 text-center text-[13px] text-muted-foreground">
                      {t("common.noData")}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredItems.map((item) => {
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

            {/* Config Section (only when item selected) */}
            {selectedItem && (
              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
                {/* 2-column: Extra Cost + Default */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground">
                      {t("itemMapping.extraCost")}
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
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground">
                      {t("itemMapping.setAsDefault")}
                    </label>
                    <div className="flex items-center gap-2 h-9">
                      <Checkbox
                        id="default"
                        checked={isDefault}
                        onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                      />
                      <label htmlFor="default" className="text-[13px] text-muted-foreground cursor-pointer">
                        {t("itemMapping.default")}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Live Preview Line */}
                <div className={cn(
                  "flex items-center gap-2 text-[13px] py-2 px-3 rounded-md border",
                  extraCost > 0 
                    ? "bg-[hsl(var(--success)/0.05)] border-[hsl(var(--success)/0.2)] text-[hsl(var(--success))]" 
                    : "bg-muted/50 border-border text-muted-foreground"
                )}>
                  <ArrowRight size={14} strokeWidth={1.5} />
                  <span className="font-medium">{getLocalizedName(selectedItem)}</span>
                  <span>(+SAR {extraCost.toFixed(2)})</span>
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddReplacement}
                    size="sm"
                    className="h-8 text-[13px] px-4"
                  >
                    {t("itemMapping.addReplacement")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Current Replacements */}
          <div className="space-y-3">
            <div className="text-[13px] font-medium text-foreground">
              {t("itemMapping.currentReplacements")} ({replacements.length})
            </div>

            {replacements.length === 0 ? (
              <div className="text-center py-5 text-muted-foreground text-[13px] border border-dashed border-border rounded-lg">
                {t("itemMapping.noReplacements")}
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                {replacements.map((rep, index) => (
                  <div
                    key={rep.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-[13px]",
                      index !== replacements.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {rep.is_default ? (
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      ) : (
                        <button
                          onClick={() => handleSetDefault(rep.id)}
                          className="p-0.5 text-muted-foreground hover:text-yellow-500 transition-colors"
                          title={t("itemMapping.setAsDefault")}
                        >
                          <Star size={14} strokeWidth={1.5} />
                        </button>
                      )}
                      <span className="font-medium">{rep.item_name}</span>
                      {rep.is_default && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                          {t("itemMapping.default")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-muted-foreground",
                        rep.extra_cost > 0 && "text-[hsl(var(--success))]"
                      )}>
                        {rep.extra_cost > 0 ? `+SAR ${rep.extra_cost.toFixed(2)}` : "+0"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title={t("itemMapping.viewReplacement")}
                        >
                          <Eye size={14} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleRemoveReplacement(rep.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title={t("common.remove")}
                        >
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t border-border bg-muted/30">
          <Button
            onClick={handleClose}
            className="h-9 px-6 text-[13px] bg-foreground text-background hover:bg-foreground/90"
          >
            {t("itemMapping.done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
