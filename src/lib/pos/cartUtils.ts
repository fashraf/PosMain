import type { CartItem, CustomizationData, CartState } from "./types";

/**
 * Generate a hash for customization to identify identical cart items
 */
export function generateCustomizationHash(customization: CustomizationData): string {
  const sortedExtras = [...customization.extras]
    .map((e) => e.id)
    .sort()
    .join(",");
  const sortedRemovals = [...customization.removals]
    .map((r) => r.id)
    .sort()
    .join(",");
  const sortedReplacements = [...customization.replacements]
    .map((r) => r.id)
    .sort()
    .join(",");

  return `E:${sortedExtras}|R:${sortedRemovals}|REP:${sortedReplacements}`;
}

/**
 * Calculate item price including extras and replacement price differences
 */
export function calculateItemPrice(
  basePrice: number,
  customization: CustomizationData
): number {
  const extrasTotal = customization.extras.reduce((sum, e) => sum + e.price, 0);
  const replacementsDiff = customization.replacements.reduce((sum, r) => sum + r.priceDiff, 0);
  return basePrice + extrasTotal + replacementsDiff;
}

/**
 * Calculate line total for a cart item
 */
export function calculateLineTotal(item: CartItem): number {
  const unitPrice = calculateItemPrice(item.basePrice, item.customization);
  return unitPrice * item.quantity;
}

/**
 * Add item to cart, merging if same item + customization exists
 */
export function addToCart(
  cart: CartItem[],
  newItem: Omit<CartItem, "id" | "customizationHash" | "lineTotal">
): CartItem[] {
  const customizationHash = generateCustomizationHash(newItem.customization);
  const unitPrice = calculateItemPrice(newItem.basePrice, newItem.customization);

  const existingIndex = cart.findIndex(
    (item) =>
      item.menuItemId === newItem.menuItemId &&
      item.customizationHash === customizationHash
  );

  if (existingIndex !== -1) {
    const updatedCart = [...cart];
    const existingItem = updatedCart[existingIndex];
    const newQuantity = existingItem.quantity + newItem.quantity;
    updatedCart[existingIndex] = {
      ...existingItem,
      quantity: newQuantity,
      lineTotal: unitPrice * newQuantity,
    };
    return updatedCart;
  }

  const cartItem: CartItem = {
    id: crypto.randomUUID(),
    menuItemId: newItem.menuItemId,
    name: newItem.name,
    basePrice: newItem.basePrice,
    quantity: newItem.quantity,
    customization: newItem.customization,
    customizationHash,
    lineTotal: unitPrice * newItem.quantity,
  };

  return [...cart, cartItem];
}

/**
 * Update item quantity in cart
 */
export function updateCartItemQuantity(
  cart: CartItem[],
  itemId: string,
  delta: number
): CartItem[] {
  return cart
    .map((item) => {
      if (item.id !== itemId) return item;

      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) return null;

      const unitPrice = calculateItemPrice(item.basePrice, item.customization);
      return {
        ...item,
        quantity: newQuantity,
        lineTotal: unitPrice * newQuantity,
      };
    })
    .filter((item): item is CartItem => item !== null);
}

/**
 * Remove item from cart
 */
export function removeFromCart(cart: CartItem[], itemId: string): CartItem[] {
  return cart.filter((item) => item.id !== itemId);
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(
  items: CartItem[],
  vatRate: number = 15
): CartState {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  return {
    items,
    subtotal,
    vatRate,
    vatAmount,
    total,
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Check if an item has any customization
 */
export function hasCustomization(customization: CustomizationData): boolean {
  return (
    customization.extras.length > 0 ||
    customization.removals.length > 0 ||
    customization.replacements.length > 0
  );
}

/**
 * Create empty customization object
 */
export function createEmptyCustomization(): CustomizationData {
  return {
    extras: [],
    removals: [],
    replacements: [],
  };
}
