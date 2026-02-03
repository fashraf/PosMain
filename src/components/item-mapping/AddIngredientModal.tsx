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
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [search, setSearch] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<AvailableIngredient | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const name = getLocalizedName(ing).toLowerCase();
      return name.includes(search.toLowerCase());
    });
  }, [ingredients, search, currentLanguage]);

  const handleConfirm = () => {
    if (!selectedIngredient) return;
    onConfirm(selectedIngredient, quantity, extraCost);
    handleClose();
  };

  const handleClose = () => {
    setSearch("");
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
          {/* Step 1: Search & Select */}
          <div className="space-y-2">
            <label className="text-[12px] font-medium uppercase text-muted-foreground">
              Step 1: {t("itemMapping.selectIngredient")}
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("itemMapping.searchIngredients")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-[13px]"
              />
            </div>
            <div className="border border-border rounded-[6px] max-h-[160px] overflow-y-auto">
              {filteredIngredients.length === 0 ? (
                <div className="p-3 text-center text-muted-foreground text-[13px]">
                  {t("common.noData")}
                </div>
              ) : (
                filteredIngredients.map((ing) => {
                  const isAlreadyMapped = mappedIds.includes(ing.id);
                  const isSelected = selectedIngredient?.id === ing.id;
                  return (
                    <button
                      key={ing.id}
                      type="button"
                      disabled={isAlreadyMapped}
                      onClick={() => setSelectedIngredient(ing)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-[13px] border-b border-border last:border-b-0",
                        "hover:bg-accent transition-colors",
                        isAlreadyMapped && "opacity-50 cursor-not-allowed",
                        isSelected && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center",
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                        )}>
                          {isSelected && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span>{getLocalizedName(ing)} ({ing.unit})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          SAR {ing.cost_per_unit.toFixed(2)}/{ing.unit}
                        </span>
                        {isAlreadyMapped && (
                          <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded">
                            {t("itemMapping.alreadyMapped")}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
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
