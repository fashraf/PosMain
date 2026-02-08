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
import { PriceAnimator } from "./PriceAnimator";
import { usePOSItemDetails } from "@/hooks/pos";
import type { POSMenuItem } from "@/lib/pos/types";
import type { POSCartHook } from "@/hooks/pos";
import { buildCustomizationData, calculateLivePrice } from "@/lib/pos/priceCalculations";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, X } from "lucide-react";

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

  // Track dirty state
  const isDirty = extras.size > 0 || removals.size > 0 || selectedReplacement !== null;

  // Reset state when item changes
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
        <DialogContent className="pos-dark max-w-[750px] w-[92vw] max-h-[85vh] flex flex-col bg-card border-border p-0">
          {/* Header */}
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-card-foreground text-lg">
                Customize: {menuItem?.name_en}
              </DialogTitle>
              {livePrice && (
                <PriceAnimator
                  value={livePrice.total}
                  className="text-lg text-[hsl(38,92%,50%)]"
                />
              )}
            </div>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Ingredients */}
                {hasIngredients && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Ingredients
                    </h3>
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
                  </div>
                )}

                {/* Right: Replacements */}
                {hasReplacements && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Replacements
                    </h3>
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
                  </div>
                )}

                {!hasIngredients && !hasReplacements && (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No customization options available.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <DialogFooter className="px-5 py-3 border-t border-border flex-row gap-2">
            <button
              onClick={() => handleOpenChange(false)}
              className="flex-1 h-12 rounded-lg border border-border text-muted-foreground font-medium text-sm active:scale-95 transition-transform"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-[2] h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {editingCartItemId ? "UPDATE CART" : "ADD TO CART"}
              {livePrice && ` — Rs. ${livePrice.total.toFixed(2)}`}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dirty state warning */}
      <AlertDialog open={showDirtyWarning} onOpenChange={setShowDirtyWarning}>
        <AlertDialogContent className="pos-dark bg-card border-border">
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
