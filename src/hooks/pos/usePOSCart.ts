import { useState, useCallback, useMemo } from "react";
import type { CartItem, CartState, CustomizationData } from "@/lib/pos/types";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  calculateCartTotals,
  createEmptyCustomization,
} from "@/lib/pos/cartUtils";

const DEFAULT_VAT_RATE = 15;

export function usePOSCart(vatRate: number = DEFAULT_VAT_RATE) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Add item to cart
  const addItem = useCallback(
    (item: {
      menuItemId: string;
      name: string;
      basePrice: number;
      quantity?: number;
      customization?: CustomizationData;
    }) => {
      setItems((prev) =>
        addToCart(prev, {
          menuItemId: item.menuItemId,
          name: item.name,
          basePrice: item.basePrice,
          quantity: item.quantity || 1,
          customization: item.customization || createEmptyCustomization(),
        })
      );
    },
    []
  );

  // Increment item quantity
  const incrementItem = useCallback((itemId: string) => {
    setItems((prev) => updateCartItemQuantity(prev, itemId, 1));
  }, []);

  // Decrement item quantity (removes if quantity becomes 0)
  const decrementItem = useCallback((itemId: string) => {
    setItems((prev) => updateCartItemQuantity(prev, itemId, -1));
  }, []);

  // Remove item completely
  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => removeFromCart(prev, itemId));
  }, []);

  // Update item customization
  const updateItemCustomization = useCallback(
    (itemId: string, customization: CustomizationData, newBasePrice?: number) => {
      setItems((prev) => {
        // Remove old item and add as new (in case customization changes hash)
        const oldItem = prev.find((i) => i.id === itemId);
        if (!oldItem) return prev;

        const filtered = prev.filter((i) => i.id !== itemId);
        return addToCart(filtered, {
          menuItemId: oldItem.menuItemId,
          name: oldItem.name,
          basePrice: newBasePrice ?? oldItem.basePrice,
          quantity: oldItem.quantity,
          customization,
        });
      });
    },
    []
  );

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate totals
  const cartState: CartState = useMemo(
    () => calculateCartTotals(items, vatRate),
    [items, vatRate]
  );

  return {
    items: cartState.items,
    subtotal: cartState.subtotal,
    vatRate: cartState.vatRate,
    vatAmount: cartState.vatAmount,
    total: cartState.total,
    itemCount: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    isEmpty: items.length === 0,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    updateItemCustomization,
    clearCart,
  };
}

export type POSCartHook = ReturnType<typeof usePOSCart>;
