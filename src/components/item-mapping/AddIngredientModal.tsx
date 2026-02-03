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
import type { AvailableIngredient } from "./IngredientSearchPicker";

interface AddIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (ingredient: AvailableIngredient, quantity: number, extraCost: number) => void;
  ingredients: AvailableIngredient[];
  mappedIds: string[];
  currentLanguage: string;
}

export function AddIngredientModal({
  open,
  onOpenChange,
  onConfirm,
  ingredients,
  mappedIds,
  currentLanguage,
}: AddIngredientModalProps) {
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<AvailableIngredient | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const handleConfirm = () => {
    if (!selectedIngredient) return;
    onConfirm(selectedIngredient, quantity, extraCost);
    handleClose();
  };

  const handleClose = () => {
    setDropdownOpen(false);
    setSelectedIngredient(null);
    setQuantity(1);
    setExtraCost(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <DialogTitle className="text-[15px]">
            {t("itemMapping.addIngredient")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Step 1: Select via Dropdown */}
          <div className="space-y-2">
            <label className="text-[12px] font-medium uppercase text-muted-foreground">
              Step 1: {t("itemMapping.selectIngredient")}
            </label>
            <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  className="w-full justify-between h-9 text-[13px] font-normal"
                >
                  {selectedIngredient ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {getLocalizedName(selectedIngredient)} - SAR {selectedIngredient.cost_per_unit.toFixed(2)}/{selectedIngredient.unit}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{t("itemMapping.selectIngredient")}...</span>
                  )}
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("itemMapping.searchIngredients")} className="h-9" />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty>{t("common.noData")}</CommandEmpty>
                    <CommandGroup>
                      {ingredients.map((ing) => {
                        const isAlreadyMapped = mappedIds.includes(ing.id);
                        const isSelected = selectedIngredient?.id === ing.id;
                        return (
                          <CommandItem
                            key={ing.id}
                            value={getLocalizedName(ing)}
                            disabled={isAlreadyMapped}
                            onSelect={() => {
                              if (!isAlreadyMapped) {
                                setSelectedIngredient(ing);
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
                            <span className="flex-1">{getLocalizedName(ing)} ({ing.unit})</span>
                            <span className="text-muted-foreground ml-2">
                              SAR {ing.cost_per_unit.toFixed(2)}/{ing.unit}
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
          {selectedIngredient && (
            <div className="space-y-2">
              <label className="text-[12px] font-medium uppercase text-muted-foreground">
                Step 2: {t("common.view")}
              </label>
              <div className="border border-border rounded-[6px] p-3 bg-muted text-[13px] space-y-1">
                <div><strong>{t("common.name")}:</strong> {getLocalizedName(selectedIngredient)}</div>
                <div><strong>{t("common.unit")}:</strong> {selectedIngredient.unit}</div>
                <div><strong>{t("items.baseCost")}:</strong> SAR {selectedIngredient.cost_per_unit.toFixed(2)}/{selectedIngredient.unit}</div>
                <div><strong>{t("inventory.currentStock")}:</strong> {selectedIngredient.current_stock} {selectedIngredient.unit}</div>
              </div>
            </div>
          )}

          {/* Step 3: Configure */}
          {selectedIngredient && (
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
                      onChange={(e) => setQuantity(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                      min={0.01}
                      step={0.01}
                      className="h-8 text-[13px]"
                    />
                    <span className="text-[13px] text-muted-foreground">
                      {selectedIngredient.unit}
                    </span>
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
            disabled={!selectedIngredient}
            className="h-8 text-[13px]"
          >
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
