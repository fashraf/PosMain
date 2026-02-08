import type { CustomizationData, POSMenuItem, POSItemIngredient, ReplacementSelection } from "./types";

/**
 * Calculate the final price of an item with customizations
 */
export function calculateCustomizedPrice(
  basePrice: number,
  customization: CustomizationData
): number {
  const extrasTotal = customization.extras.reduce((sum, e) => sum + e.price, 0);
  const replacementsDiff = customization.replacements.reduce((sum, r) => sum + r.priceDiff, 0);
  return basePrice + extrasTotal + replacementsDiff;
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
  replacements: string[];
  additionalCost: number;
} {
  const extras = customization.extras.map(
    (e) => `+${e.name}${e.price > 0 ? ` (+${e.price.toFixed(2)})` : ""}`
  );
  const removals = customization.removals.map((r) => `-${r.name}`);
  const replacements = customization.replacements.map((r) => `Replace: ${r.name}`);

  const additionalCost =
    customization.extras.reduce((sum, e) => sum + e.price, 0) +
    customization.replacements.reduce((sum, r) => sum + r.priceDiff, 0);

  return {
    extras,
    removals,
    replacements,
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
  selectedReplacements: Map<string, ReplacementSelection>
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
    replacements: Array.from(selectedReplacements.values()),
  };
}

/**
 * Calculate live price preview in customization drawer
 */
export function calculateLivePrice(
  menuItem: POSMenuItem,
  ingredients: POSItemIngredient[],
  extras: Set<string>,
  selectedReplacements: Map<string, ReplacementSelection>
): {
  basePrice: number;
  extrasTotal: number;
  replacementsDiff: number;
  total: number;
} {
  const basePrice = menuItem.base_price;
  
  const extrasTotal = ingredients
    .filter((ing) => extras.has(ing.id))
    .reduce((sum, ing) => sum + ing.extra_price, 0);

  const replacementsDiff = Array.from(selectedReplacements.values())
    .reduce((sum, r) => sum + r.priceDiff, 0);

  return {
    basePrice,
    extrasTotal,
    replacementsDiff,
    total: basePrice + extrasTotal + replacementsDiff,
  };
}
