import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IngredientRow } from "./IngredientRow";
import { ReplacementPills } from "./ReplacementPills";
import { ChangesSummary } from "./ChangesSummary";
import { PriceAnimator } from "./PriceAnimator";
import { usePOSItemDetails } from "@/hooks/pos";
import type { POSMenuItem } from "@/lib/pos/types";
import type { POSCartHook } from "@/hooks/pos";
import { buildCustomizationData, calculateLivePrice } from "@/lib/pos/priceCalculations";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";

interface CustomizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: POSMenuItem | null;
  editingCartItemId?: string | null;
  cart: POSCartHook;
  onClose: () => void;
}

export function CustomizeModal({
  open,
  onOpenChange,
  menuItem,
  editingCartItemId,
  cart,
  onClose,
}: CustomizeModalProps) {
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [removals, setRemovals] = useState<Set<string>>(new Set());
  const [selectedReplacement, setSelectedReplacement] = useState<{
    id: string; group: string; name: string; priceDiff: number;
  } | null>(null);
  const [showDirtyWarning, setShowDirtyWarning] = useState(false);

  const { data: itemDetails, isLoading } = usePOSItemDetails(open ? menuItem?.id ?? null : null);

  const isDirty = extras.size > 0 || removals.size > 0 || selectedReplacement !== null;

  useEffect(() => {
    if (open && menuItem) {
      if (editingCartItemId) {
        const cartItem = cart.items.find((i) => i.id === editingCartItemId);
        if (cartItem) {
          setExtras(new Set(cartItem.customization.extras.map((e) => e.id)));
          setRemovals(new Set(cartItem.customization.removals.map((r) => r.id)));
          setSelectedReplacement(cartItem.customization.replacement || null);
          return;
        }
      }
      setExtras(new Set());
      setRemovals(new Set());
      setSelectedReplacement(null);
    }
  }, [open, menuItem, editingCartItemId, cart.items]);

  const livePrice = useMemo(() => {
    if (!itemDetails) return null;
    return calculateLivePrice(itemDetails.item, itemDetails.ingredients, extras, selectedReplacement);
  }, [itemDetails, extras, selectedReplacement]);

  const handleExtraToggle = useCallback((id: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else {
        next.add(id);
        setRemovals((r) => { const n = new Set(r); n.delete(id); return n; });
      }
      return next;
    });
  }, []);

  const handleRemovalToggle = useCallback((id: string) => {
    setRemovals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else {
        next.add(id);
        setExtras((e) => { const n = new Set(e); n.delete(id); return n; });
      }
      return next;
    });
  }, []);

  const handleReplacementSelect = useCallback((rep: any | null) => {
    if (!rep) {
      setSelectedReplacement(null);
    } else {
      setSelectedReplacement({
        id: rep.id,
        group: rep.replacement_group,
        name: rep.replacement_name_en,
        priceDiff: rep.price_difference,
      });
    }
  }, []);

  const handleAddToCart = () => {
    if (!itemDetails) return;
    const customization = buildCustomizationData(
      itemDetails.ingredients, extras, removals, selectedReplacement
    );
    if (editingCartItemId) {
      cart.updateItemCustomization(editingCartItemId, customization);
    } else {
      cart.addItem({
        menuItemId: itemDetails.item.id,
        name: itemDetails.item.name_en,
        basePrice: itemDetails.item.base_price,
        quantity: 1,
        customization,
      });
    }
    onClose();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDirty) {
      setShowDirtyWarning(true);
    } else {
      onOpenChange(nextOpen);
    }
  };

  const replacementGroups = useMemo(() => {
    if (!itemDetails?.replacements) return {};
    return itemDetails.replacements.reduce((acc, rep) => {
      if (!acc[rep.replacement_group]) acc[rep.replacement_group] = [];
      acc[rep.replacement_group].push(rep);
      return acc;
    }, {} as Record<string, typeof itemDetails.replacements>);
  }, [itemDetails?.replacements]);

  const hasIngredients = (itemDetails?.ingredients?.length ?? 0) > 0;
  const hasReplacements = Object.keys(replacementGroups).length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="pos-light max-w-[80vw] w-[80vw] max-h-[80vh] flex flex-col bg-card border-border p-0">
          {/* Header */}
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-card-foreground text-lg">
                Customize: {menuItem?.name_en}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Base <span className="font-semibold tabular-nums text-card-foreground">{menuItem?.base_price?.toFixed(2)} SAR</span>
                </span>
                {livePrice && (
                  <span className="text-muted-foreground">
                    Current{" "}
                    <PriceAnimator
                      value={livePrice.total}
                      className="text-primary font-bold tabular-nums"
                    />
                    <span className="text-primary font-bold"> SAR</span>
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Body: Two bordered cards */}
          <div className="flex-1 overflow-hidden px-5 py-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Left Card: Ingredients */}
                <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
                  <div className="border-b px-4 py-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Ingredients
                    </h3>
                  </div>
                  <ScrollArea className="flex-1 px-4 py-3">
                    {hasIngredients ? (
                      <div className="space-y-2">
                        {itemDetails!.ingredients.map((ing) => (
                          <IngredientRow
                            key={ing.id}
                            ingredient={ing}
                            isRemoved={removals.has(ing.id)}
                            isExtra={extras.has(ing.id)}
                            onRemoveToggle={() => handleRemovalToggle(ing.id)}
                            onExtraToggle={() => handleExtraToggle(ing.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No ingredients
                      </p>
                    )}
                  </ScrollArea>
                </div>

                {/* Right Card: Combo Replacements */}
                <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
                  <div className="border-b px-4 py-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Combo Replacements
                    </h3>
                  </div>
                  <ScrollArea className="flex-1 px-4 py-3">
                    {hasReplacements ? (
                      <div className="space-y-4">
                        {Object.entries(replacementGroups).map(([group, reps]) => (
                          <ReplacementPills
                            key={group}
                            groupName={group}
                            replacements={reps}
                            selectedId={selectedReplacement?.id ?? null}
                            onSelect={handleReplacementSelect}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No items
                      </p>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>

          {/* Footer: Changes Summary + Price Breakdown + Buttons */}
          <DialogFooter className="px-5 py-3 border-t border-border flex-row items-stretch gap-4">
            {/* Left: Changes summary */}
            <div className="flex-1 min-w-0">
              {livePrice && itemDetails && (
                <ChangesSummary
                  ingredients={itemDetails.ingredients}
                  extras={extras}
                  removals={removals}
                  selectedReplacement={selectedReplacement}
                  basePrice={livePrice.basePrice}
                  extrasTotal={livePrice.extrasTotal}
                  replacementDiff={livePrice.replacementDiff}
                  total={livePrice.total}
                />
              )}
            </div>

            {/* Right: Buttons stacked */}
            <div className="flex flex-col gap-2 justify-center min-w-[280px]">
              <button
                onClick={() => handleOpenChange(false)}
                className="h-11 rounded-lg border border-border text-muted-foreground font-medium text-sm active:scale-95 transition-transform hover:bg-muted/50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 shadow-md"
              >
                <ShoppingCart className="h-4 w-4" />
                {editingCartItemId ? "UPDATE CART" : "ADD TO CART"}
                {livePrice && ` — ${livePrice.total.toFixed(2)} SAR`}
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dirty state warning */}
      <AlertDialog open={showDirtyWarning} onOpenChange={setShowDirtyWarning}>
        <AlertDialogContent className="pos-light bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground">Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved customizations. Are you sure you want to close?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setShowDirtyWarning(false); onClose(); }}
              className="bg-destructive text-destructive-foreground"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
