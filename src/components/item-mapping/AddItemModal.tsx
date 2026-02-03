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
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);

  const getLocalizedName = (obj: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof obj;
    return obj[key] || obj.name_en;
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Exclude combos and current item
      if (item.is_combo || item.id === currentItemId) return false;
      const name = getLocalizedName(item).toLowerCase();
      return name.includes(search.toLowerCase());
    });
  }, [items, search, currentLanguage, currentItemId]);

  const handleConfirm = () => {
    if (!selectedItem) return;
    onConfirm(selectedItem, quantity, extraCost);
    handleClose();
  };

  const handleClose = () => {
    setSearch("");
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
          {/* Step 1: Search & Select */}
          <div className="space-y-2">
            <label className="text-[12px] font-medium uppercase text-muted-foreground">
              Step 1: {t("itemMapping.selectItem")}
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("itemMapping.searchItems")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-[13px]"
              />
            </div>
            <div className="border border-border rounded-[6px] max-h-[160px] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="p-3 text-center text-muted-foreground text-[13px]">
                  {t("common.noData")}
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isAlreadyMapped = mappedIds.includes(item.id);
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isAlreadyMapped}
                      onClick={() => setSelectedItem(item)}
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
                        <span>{getLocalizedName(item)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          SAR {item.base_cost.toFixed(2)}
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
