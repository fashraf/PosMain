import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
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
        <DialogContent
          className="w-[85vw] max-w-[85vw] h-[85vh] max-h-[85vh] flex flex-col rounded-2xl border-0 bg-[#0f1217] text-white p-0 shadow-2xl gap-0 [&>button]:hidden"
        >
          {/* Close button */}
          <button
            onClick={() => handleOpenChange(false)}
            className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
            <h2 className="text-2xl font-bold text-white">
              Customize: {menuItem?.name_en}
            </h2>
            <div className="flex items-center gap-5 text-sm mr-10">
              <span className="text-gray-400">
                Base{" "}
                <span className="font-semibold tabular-nums text-white">
                  {menuItem?.base_price?.toFixed(2)} SAR
                </span>
              </span>
              {livePrice && (
                <span className="text-gray-400">
                  Current{" "}
                  <PriceAnimator
                    value={livePrice.total}
                    className={
                      livePrice.total > (menuItem?.base_price ?? 0)
                        ? "text-emerald-400 font-bold tabular-nums"
                        : "text-white font-bold tabular-nums"
                    }
                  />
                  <span
                    className={
                      livePrice.total > (menuItem?.base_price ?? 0)
                        ? "text-emerald-400 font-bold"
                        : "text-white font-bold"
                    }
                  >
                    {" "}SAR
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden px-6 py-5">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full bg-gray-800" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 h-full">
                {/* Left Card: Ingredients */}
                <div className="rounded-xl bg-[#1a1f2e] flex flex-col overflow-hidden">
                  <div className="border-b border-gray-700/50 px-5 py-3">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">
                      Ingredients
                    </h3>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="px-5 py-4">
                      {hasIngredients ? (
                        <div className="space-y-3">
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
                        <p className="text-sm text-gray-500 text-center py-8">
                          No ingredients available
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right Card: Combo Replacements */}
                <div className="rounded-xl bg-[#1a1f2e] flex flex-col overflow-hidden">
                  <div className="border-b border-gray-700/50 px-5 py-3">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">
                      Combo Replacements
                    </h3>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="px-5 py-4">
                      {hasReplacements ? (
                        <div className="space-y-5">
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
                        <p className="text-sm text-gray-500 text-center py-8">
                          No combo replacements
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-800 flex items-stretch gap-6 shrink-0">
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
                className="h-12 rounded-xl border border-gray-600 text-gray-400 font-medium text-base active:scale-95 transition-all duration-150 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="h-14 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 disabled:opacity-50 shadow-lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {editingCartItemId ? "UPDATE CART" : "ADD TO CART"}
                {livePrice && ` — ${livePrice.total.toFixed(2)} SAR`}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dirty state warning */}
      <AlertDialog open={showDirtyWarning} onOpenChange={setShowDirtyWarning}>
        <AlertDialogContent className="bg-[#1a1f2e] border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Discard changes?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You have unsaved customizations. Are you sure you want to close?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800">
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setShowDirtyWarning(false); onClose(); }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
