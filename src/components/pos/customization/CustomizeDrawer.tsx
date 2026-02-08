import React, { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { TouchButton } from "@/components/pos/shared";
import { ItemImage } from "@/components/pos/shared";
import { IngredientCard } from "./IngredientCard";
import { ReplacementSection } from "./ReplacementSection";
import { PriceSummary } from "./PriceSummary";
import { usePOSItemDetails } from "@/hooks/pos";
import type { POSMenuItem, CustomizationData } from "@/lib/pos/types";
import type { POSCartHook } from "@/hooks/pos";
import { buildCustomizationData, calculateLivePrice } from "@/lib/pos/priceCalculations";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomizeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: POSMenuItem | null;
  editingCartItemId: string | null;
  cart: POSCartHook;
  onClose: () => void;
}

export function CustomizeDrawer({
  open,
  onOpenChange,
  menuItem,
  editingCartItemId,
  cart,
  onClose,
}: CustomizeDrawerProps) {
  // State for ingredient selections
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [removals, setRemovals] = useState<Set<string>>(new Set());
  const [selectedReplacement, setSelectedReplacement] = useState<{
    id: string;
    group: string;
    name: string;
    priceDiff: number;
  } | null>(null);

  // Fetch item details
  const { data: itemDetails, isLoading } = usePOSItemDetails(menuItem?.id || null);

  // Reset state when item changes
  useEffect(() => {
    if (open && menuItem) {
      // If editing, populate from existing customization
      if (editingCartItemId) {
        const cartItem = cart.items.find((i) => i.id === editingCartItemId);
        if (cartItem) {
          setExtras(new Set(cartItem.customization.extras.map((e) => e.id)));
          setRemovals(new Set(cartItem.customization.removals.map((r) => r.id)));
          setSelectedReplacement(cartItem.customization.replacement || null);
          return;
        }
      }
      // New customization - start fresh
      setExtras(new Set());
      setRemovals(new Set());
      setSelectedReplacement(null);
    }
  }, [open, menuItem, editingCartItemId, cart.items]);

  // Calculate live price
  const livePrice = useMemo(() => {
    if (!itemDetails) return null;
    return calculateLivePrice(
      itemDetails.item,
      itemDetails.ingredients,
      extras,
      selectedReplacement
    );
  }, [itemDetails, extras, selectedReplacement]);

  // Handlers
  const handleExtraToggle = (ingredientId: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
        // Remove from removals if present
        setRemovals((r) => {
          const newRemovals = new Set(r);
          newRemovals.delete(ingredientId);
          return newRemovals;
        });
      }
      return next;
    });
  };

  const handleRemovalToggle = (ingredientId: string) => {
    setRemovals((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
        // Remove from extras if present
        setExtras((e) => {
          const newExtras = new Set(e);
          newExtras.delete(ingredientId);
          return newExtras;
        });
      }
      return next;
    });
  };

  const handleReplacementSelect = (replacement: {
    id: string;
    group: string;
    name: string;
    priceDiff: number;
  } | null) => {
    setSelectedReplacement(replacement);
  };

  const handleAddToCart = () => {
    if (!itemDetails) return;

    const customization = buildCustomizationData(
      itemDetails.ingredients,
      extras,
      removals,
      selectedReplacement
    );

    if (editingCartItemId) {
      // Update existing item
      cart.updateItemCustomization(editingCartItemId, customization);
    } else {
      // Add new item
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

  // Group replacements by group
  const replacementGroups = useMemo(() => {
    if (!itemDetails?.replacements) return {};
    return itemDetails.replacements.reduce((acc, rep) => {
      if (!acc[rep.replacement_group]) {
        acc[rep.replacement_group] = [];
      }
      acc[rep.replacement_group].push(rep);
      return acc;
    }, {} as Record<string, typeof itemDetails.replacements>);
  }, [itemDetails?.replacements]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[75vh]">
        {/* Header */}
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-3">
            <ItemImage
              src={menuItem?.image_url}
              alt={menuItem?.name_en || ""}
              size="lg"
            />
            <DrawerTitle className="text-lg">
              CUSTOMIZE: {menuItem?.name_en}
            </DrawerTitle>
          </div>
        </DrawerHeader>

        {/* Scrollable content - Two card layout */}
        <div className="flex-1 overflow-auto px-4 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Left Card - Ingredients */}
              <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                    Ingredients
                  </h3>
                </div>
                <ScrollArea className="flex-1 px-4 py-3">
                  {itemDetails && itemDetails.ingredients.length > 0 ? (
                    <div className="space-y-3">
                      {itemDetails.ingredients.map((ingredient) => (
                        <IngredientCard
                          key={ingredient.id}
                          ingredient={ingredient}
                          isExtra={extras.has(ingredient.id)}
                          isRemoved={removals.has(ingredient.id)}
                          onExtraToggle={() => handleExtraToggle(ingredient.id)}
                          onRemovalToggle={() => handleRemovalToggle(ingredient.id)}
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

              {/* Right Card - Items (Sub-items / Replacements) */}
              <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                    Items
                  </h3>
                </div>
                <ScrollArea className="flex-1 px-4 py-3">
                  {Object.keys(replacementGroups).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(replacementGroups).map(([group, replacements]) => (
                        <ReplacementSection
                          key={group}
                          groupName={group}
                          replacements={replacements}
                          selectedId={selectedReplacement?.id || null}
                          onSelect={(rep) =>
                            handleReplacementSelect(
                              rep
                                ? {
                                    id: rep.id,
                                    group: rep.replacement_group,
                                    name: rep.replacement_name_en,
                                    priceDiff: rep.price_difference,
                                  }
                                : null
                            )
                          }
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

        {/* Price Summary */}
        {livePrice && (
          <div className="border-t px-4 py-3">
            <PriceSummary
              basePrice={livePrice.basePrice}
              extrasTotal={livePrice.extrasTotal}
              replacementDiff={livePrice.replacementDiff}
              total={livePrice.total}
            />
          </div>
        )}

        {/* Footer */}
        <DrawerFooter className="border-t">
          <TouchButton
            onClick={handleAddToCart}
            className="h-14 w-full text-base font-semibold"
            disabled={isLoading}
          >
            {editingCartItemId ? "UPDATE CART" : "ADD TO CART"}
          </TouchButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
