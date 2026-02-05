import type { CustomizationData, POSMenuItem, POSItemIngredient } from "./types";

/**
 * Calculate the final price of an item with customizations
 */
export function calculateCustomizedPrice(
  basePrice: number,
  customization: CustomizationData
): number {
  const extrasTotal = customization.extras.reduce((sum, e) => sum + e.price, 0);
  const replacementDiff = customization.replacement?.priceDiff || 0;
  return basePrice + extrasTotal + replacementDiff;
}

/**
 * Calculate VAT amount
 */
export function calculateVAT(subtotal: number, vatRate: number = 15): number {
  return subtotal * (vatRate / 100);
}

/**
 * Calculate order total including VAT
 */
export function calculateOrderTotal(subtotal: number, vatRate: number = 15): {
  subtotal: number;
  vatAmount: number;
  total: number;
} {
  const vatAmount = calculateVAT(subtotal, vatRate);
  const total = subtotal + vatAmount;

  return {
    subtotal,
    vatAmount,
    total,
  };
}

/**
 * Get customization summary for display
 */
export function getCustomizationSummary(
  customization: CustomizationData
): {
  extras: string[];
  removals: string[];
  replacement: string | null;
  additionalCost: number;
} {
  const extras = customization.extras.map(
    (e) => `+${e.name}${e.price > 0 ? ` (+${e.price.toFixed(2)})` : ""}`
  );
  const removals = customization.removals.map((r) => `-${r.name}`);
  const replacement = customization.replacement
    ? `Replace: ${customization.replacement.name}`
    : null;

  const additionalCost =
    customization.extras.reduce((sum, e) => sum + e.price, 0) +
    (customization.replacement?.priceDiff || 0);

  return {
    extras,
    removals,
    replacement,
    additionalCost,
  };
}

/**
 * Build customization data from ingredient states
 */
export function buildCustomizationData(
  ingredients: POSItemIngredient[],
  extras: Set<string>,
  removals: Set<string>,
  selectedReplacement: { id: string; group: string; name: string; priceDiff: number } | null
): CustomizationData {
  const extrasData = ingredients
    .filter((ing) => extras.has(ing.id))
    .map((ing) => ({
      id: ing.id,
      name: ing.ingredient_name_en,
      price: ing.extra_price,
    }));

  const removalsData = ingredients
    .filter((ing) => removals.has(ing.id))
    .map((ing) => ({
      id: ing.id,
      name: ing.ingredient_name_en,
    }));

  return {
    extras: extrasData,
    removals: removalsData,
    replacement: selectedReplacement,
  };
}

/**
 * Calculate live price preview in customization drawer
 */
export function calculateLivePrice(
  menuItem: POSMenuItem,
  ingredients: POSItemIngredient[],
  extras: Set<string>,
  selectedReplacement: { priceDiff: number } | null
): {
  basePrice: number;
  extrasTotal: number;
  replacementDiff: number;
  total: number;
} {
  const basePrice = menuItem.base_price;
  
  const extrasTotal = ingredients
    .filter((ing) => extras.has(ing.id))
    .reduce((sum, ing) => sum + ing.extra_price, 0);

  const replacementDiff = selectedReplacement?.priceDiff || 0;

  return {
    basePrice,
    extrasTotal,
    replacementDiff,
    total: basePrice + extrasTotal + replacementDiff,
  };
}
