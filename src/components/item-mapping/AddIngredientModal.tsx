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
import type { AvailableIngredient } from "./IngredientSearchPicker";

interface AddIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (ingredient: AvailableIngredient, quantity: number, extraCost: number, canAddExtra: boolean, canRemove: boolean) => void;
  ingredients: AvailableIngredient[];
  mappedIds: string[];
  currentLanguage: string;
  /** For edit mode */
  editData?: {
    ingredientId: string;
    quantity: number;
    extraCost: number;
    canAddExtra: boolean;
    canRemove: boolean;
  } | null;
}

export function AddIngredientModal({
  open,
  onOpenChange,
  onConfirm,
  ingredients,
  mappedIds,
  currentLanguage,
  editData,
}: AddIngredientModalProps) {
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<AvailableIngredient | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);
  const [canAddExtra, setCanAddExtra] = useState(false);
  const [canRemove, setCanRemove] = useState(false);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  // Initialize state when opening in edit mode
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && editData) {
      const ing = ingredients.find(i => i.id === editData.ingredientId);
      setSelectedIngredient(ing || null);
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

  // Filter out already mapped ingredients (but allow current in edit mode)
  const availableIngredients = ingredients.filter(
    (ing) => !mappedIds.includes(ing.id) || (editData && ing.id === editData.ingredientId)
  );

  const handleCanAddExtraChange = (checked: boolean) => {
    setCanAddExtra(checked);
    if (checked) {
      setCanRemove(false);
    } else {
      setExtraCost(0);
    }
  };

  const handleCanRemoveChange = (checked: boolean) => {
    setCanRemove(checked);
    if (checked) {
      setCanAddExtra(false);
      setExtraCost(0);
    }
  };

  const handleConfirm = () => {
    if (!selectedIngredient) return;
    if (quantity <= 0) return;
    onConfirm(selectedIngredient, quantity, canAddExtra ? extraCost : 0, canAddExtra, canRemove);
    handleClose();
  };

  const handleClose = () => {
    setDropdownOpen(false);
    setSelectedIngredient(null);
    setQuantity(1);
    setExtraCost(0);
    setCanAddExtra(false);
    setCanRemove(false);
    onOpenChange(false);
  };

  const isValid = selectedIngredient && quantity > 0 && (!canAddExtra || extraCost >= 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 rounded-lg overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border bg-background">
          <DialogTitle className="text-base font-semibold">
            {editData ? t("itemMapping.editIngredient") : t("itemMapping.addIngredient")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Ingredient Selection */}
          <div>
            <h4 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border/50">
              {t("itemMapping.ingredientSelection") || "Ingredient Selection"}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {/* Ingredient Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.selectIngredient")} <span className="text-destructive">*</span>
                  <TooltipInfo content="Select ingredient to be used in this item" />
                </label>
                <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={dropdownOpen}
                      disabled={!!editData}
                      className="w-full justify-between h-9 text-[13px] font-normal border-border"
                    >
                      {selectedIngredient ? (
                        <span className="truncate text-foreground">
                          {getLocalizedName(selectedIngredient)} ({selectedIngredient.unit})
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{t("common.select")}...</span>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("itemMapping.searchIngredients")} className="h-9" />
                      <CommandList className="max-h-[200px]">
                        <CommandEmpty className="py-4 text-center text-[13px] text-muted-foreground">
                          {t("common.noData")}
                        </CommandEmpty>
                        <CommandGroup>
                          {availableIngredients.map((ing) => {
                            const isSelected = selectedIngredient?.id === ing.id;
                            return (
                              <CommandItem
                                key={ing.id}
                                value={getLocalizedName(ing)}
                                onSelect={() => {
                                  setSelectedIngredient(ing);
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
                                <span className="flex-1">{getLocalizedName(ing)} ({ing.unit})</span>
                                <span className="text-muted-foreground ml-2">
                                  SAR {ing.cost_per_unit.toFixed(2)}/{ing.unit}
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

              {/* Unit Price (read-only) */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.unitPrice")}
                  <TooltipInfo content="Auto-fetched ingredient unit cost" />
                </label>
                <Input
                  value={selectedIngredient ? `SAR ${selectedIngredient.cost_per_unit.toFixed(2)}/${selectedIngredient.unit}` : ""}
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {/* Default Quantity */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.defaultQuantity") || "Default Quantity"} <span className="text-destructive">*</span>
                  <TooltipInfo content="Default quantity used in this item" />
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                    min={0.01}
                    step={0.01}
                    className="h-9 text-[13px] flex-1"
                  />
                  {selectedIngredient && (
                    <span className="text-[13px] text-muted-foreground whitespace-nowrap">
                      {selectedIngredient.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Can Add Extra */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.canAddExtra") || "Can Add Extra"}
                  <TooltipInfo content="Allows customer to add extra quantity" />
                </label>
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    checked={canAddExtra}
                    onCheckedChange={handleCanAddExtraChange}
                  />
                  <span className="text-[13px] text-muted-foreground">
                    {canAddExtra ? t("common.yes") || "Yes" : t("common.no") || "No"}
                  </span>
                </div>
              </div>

              {/* Extra Cost */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                  {t("itemMapping.extraCost")}
                  <TooltipInfo content="Additional cost per extra quantity" />
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
                  <TooltipInfo content="Allows customer to remove this ingredient" />
                </label>
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    checked={canRemove}
                    onCheckedChange={handleCanRemoveChange}
                  />
                  <span className="text-[13px] text-muted-foreground">
                    {canRemove ? t("common.yes") || "Yes" : t("common.no") || "No"}
                  </span>
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
