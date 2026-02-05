

# Implementation Plan: Dynamic Dropdowns, Tooltips, and Navigation Enhancement

## Overview

This plan addresses the comprehensive update to replace hardcoded dropdown values with dynamic data from maintenance tables, add helpful tooltips throughout forms, and reorganize navigation for better accessibility.

---

## Current State Analysis

| Component | Current State | Target State |
|-----------|---------------|--------------|
| Category dropdown | Hardcoded array `CATEGORIES` in ItemsAdd.tsx | Dynamic from `maintenance_categories` table |
| Subcategory dropdown | Hardcoded array `SUBCATEGORIES` | Dynamic from `maintenance_subcategories`, filtered by selected Category |
| Serving Time | Hardcoded array `SERVING_TIMES` | Dynamic from `serving_times` table |
| Unit dropdown | Hardcoded array `UNITS` | Dynamic from `units` table |
| Storage Type | Hardcoded array `STORAGE_TYPES` | Dynamic from `storage_types` table |
| Allergens | Hardcoded array `ALLERGENS` in AllergenPicker | Dynamic from `allergens` table |
| Item Types | Hardcoded `edible/non_edible` | Dynamic from `item_types` table |
| Ingredient Groups | Hardcoded `INGREDIENT_CATEGORIES` | Dynamic from `ingredient_groups` table |
| Navigation | Ingredient Master under Inventory submenu | Add as top-level "Ingredients" menu item |
| Tooltips | Minimal usage | Comprehensive tooltips on all fields |

---

## Solution Architecture

### 1. Create Reusable Data Hooks

Create custom hooks to fetch and cache maintenance data using TanStack Query:

**New Files:**
```text
src/hooks/
├── useMaintenanceData.ts          # Main hook with all maintenance queries
```

**Hook Structure:**
```typescript
// useMaintenanceData.ts
export function useCategories() {
  return useQuery({
    queryKey: ['maintenance_categories'],
    queryFn: () => supabase.from('maintenance_categories')
      .select('id, name_en, name_ar, name_ur')
      .eq('is_active', true)
      .order('sort_order'),
  });
}

export function useSubcategories(categoryId?: string) {
  return useQuery({
    queryKey: ['maintenance_subcategories', categoryId],
    queryFn: () => {
      let query = supabase.from('maintenance_subcategories')
        .select('id, name_en, name_ar, name_ur, parent_category_id')
        .eq('is_active', true);
      if (categoryId) query = query.eq('parent_category_id', categoryId);
      return query.order('name_en');
    },
    enabled: !categoryId || categoryId.length > 0,
  });
}

// Similar for: useServingTimes, useUnits, useStorageTypes, useAllergens, useItemTypes, useIngredientGroups
```

### 2. Enhance SearchableSelect Component

Update `SearchableSelect` to support:
- Loading state
- Dynamic options refresh
- Multi-language label display

**Modified File:** `src/components/shared/SearchableSelect.tsx`

```typescript
interface SearchableSelectProps {
  // ... existing props
  isLoading?: boolean;  // NEW: Show loading spinner
  onRefresh?: () => void;  // NEW: Refresh button callback
}
```

### 3. Create SearchableMultiSelect Component

For multi-select dropdowns (Subcategory, Serving Times, Allergens):

**New File:** `src/components/shared/SearchableMultiSelect.tsx`

Features:
- Searchable dropdown with checkboxes
- Badge display for selected items
- Remove individual selections
- Loading state support

---

## Files to Modify

### Forms - Replace Hardcoded Arrays

| File | Changes |
|------|---------|
| `src/pages/ItemsAdd.tsx` | Replace CATEGORIES, SUBCATEGORIES, SERVING_TIMES with hooks; add cascading logic; add tooltips |
| `src/pages/ItemsEdit.tsx` | Same as ItemsAdd.tsx |
| `src/pages/inventory/IngredientMasterAdd.tsx` | Replace INGREDIENT_TYPES, UNITS, STORAGE_TYPES, INGREDIENT_CATEGORIES with hooks; add tooltips |
| `src/pages/inventory/IngredientMasterEdit.tsx` | Same as IngredientMasterAdd.tsx |
| `src/pages/inventory/ItemMasterAdd.tsx` | Replace hardcoded categories, storageTypes, units arrays with hooks |
| `src/pages/inventory/ItemMasterEdit.tsx` | Same as ItemMasterAdd.tsx |
| `src/components/shared/AllergenPicker.tsx` | Fetch from `allergens` table instead of hardcoded array |

### Navigation

| File | Changes |
|------|---------|
| `src/components/AppSidebar.tsx` | Add top-level "Ingredients" menu with Carrot icon pointing to `/inventory/ingredients` |

### Shared Components

| File | Changes |
|------|---------|
| `src/components/shared/SearchableSelect.tsx` | Add loading state, refresh button |
| `src/components/shared/TooltipInfo.tsx` | Already exists, ensure consistent styling |
| `src/components/shared/FormField.tsx` | Already supports tooltip prop |

### Translations

| File | Changes |
|------|---------|
| `src/lib/i18n/translations.ts` | Add comprehensive tooltip translations |

---

## Tooltip Additions

### Item Form Tooltips

| Field | Tooltip Text |
|-------|-------------|
| Item Name | "Primary name shown on POS, menu boards, and receipts (English required)" |
| Category | "Main grouping used for filtering, reports, and kitchen routing (from maintenance)" |
| Subcategory | "More specific tag (e.g., Pizza under Vegetarian) - multi-select allowed, filtered by category" |
| Serving Time | "When this item is typically available - select multiple time slots if needed" |
| Is Combo | "Bundle multiple items at special price - enables sub-items mapping section" |
| Item Type | "Classification affecting inventory and preparation workflow (from maintenance)" |
| Base Cost | "Cost to produce this item - used for profit margin calculations" |
| Preparation Time | "Estimated minutes to prepare in kitchen - used for KDS and delivery ETA" |
| Calories | "Optional nutritional info for health-conscious customers" |
| Allergens | "Select allergens present - shown for customer safety on menu and receipts" |
| Highlights | "Comma-separated tags like 'Spicy', 'Best Seller', 'Chef Special'" |
| Current Stock | "Available inventory count - updated by stock operations" |
| Low Stock Threshold | "Triggers low-stock warning when quantity falls below this value" |
| Image | "Square image (PNG/JPG, max 2MB) - shown on POS grid and customer menu" |

### Ingredient Form Tooltips

| Field | Tooltip Text |
|-------|-------------|
| Ingredient Name | "Name used in recipes and inventory reports (English required)" |
| Ingredient Type | "Physical form affecting storage and handling requirements" |
| Unit | "Base measurement unit for tracking and recipes (from maintenance)" |
| Storage Type | "Required storage conditions - affects warehouse organization and FIFO" |
| Category/Group | "Grouping for purchasing and inventory reports (multi-select)" |
| Min Stock Alert | "Triggers low-stock notification when quantity falls below this level" |
| Shelf Life Days | "Typical days before expiry/spoilage - helps with FIFO rotation" |
| PAR Level | "Ideal minimum quantity to maintain - triggers reorder when reached" |
| Cost Price | "Latest purchase cost per unit - used for recipe costing" |
| Selling Price | "Optional direct sale price if ingredient is sold individually" |
| Yield % | "Usable portion after prep/trimming (e.g., 85% for chicken after bones)" |
| Can Purchase | "Available for purchase orders to suppliers" |
| Return on Cancel | "Can this ingredient be returned/credited if order is canceled?" |
| Allergen Flags | "Select allergens present - automatically reflected in items using this ingredient" |
| Supplier | "Preferred vendor for this ingredient" |

---

## Cascading Dropdown Logic

### Category -> Subcategory Flow

```typescript
// In ItemsAdd.tsx
const [selectedCategory, setSelectedCategory] = useState<string>("");
const { data: subcategories, isLoading: subcatLoading } = useSubcategories(selectedCategory);

// When category changes, reset subcategory selection
useEffect(() => {
  if (selectedCategory) {
    setFormData(prev => ({ ...prev, subcategories: [] }));
  }
}, [selectedCategory]);

// Subcategory dropdown shows filtered results
<SearchableMultiSelect
  options={subcategories?.map(s => ({ id: s.id, label: s.name_en })) || []}
  isLoading={subcatLoading}
  disabled={!selectedCategory}
  placeholder={selectedCategory ? "Select subcategories..." : "Select category first"}
/>
```

---

## Navigation Update

### Add Top-Level Ingredients Menu

**In `src/components/AppSidebar.tsx`:**

```typescript
const mainNavItems = [
  { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "nav.salesChannels", url: "/sales-channels", icon: Store },
  { titleKey: "nav.ingredients", url: "/inventory/ingredients", icon: Carrot },  // NEW
];
```

The Ingredients page already exists at `/inventory/ingredients` with Add/Edit routes. This simply adds a prominent top-level shortcut.

---

## Implementation Phases

### Phase 1: Create Data Hooks
1. Create `src/hooks/useMaintenanceData.ts` with all maintenance queries
2. Export individual hooks: `useCategories`, `useSubcategories`, `useServingTimes`, `useUnits`, `useStorageTypes`, `useAllergens`, `useItemTypes`, `useIngredientGroups`

### Phase 2: Update Shared Components
1. Add loading state to `SearchableSelect`
2. Create `SearchableMultiSelect` component for multi-select fields
3. Update `AllergenPicker` to use `useAllergens()` hook

### Phase 3: Update Item Forms
1. Replace hardcoded arrays in `ItemsAdd.tsx` and `ItemsEdit.tsx`
2. Implement cascading Category -> Subcategory logic
3. Add comprehensive tooltips to all fields

### Phase 4: Update Ingredient Forms
1. Replace hardcoded arrays in `IngredientMasterAdd.tsx` and `IngredientMasterEdit.tsx`
2. Replace hardcoded arrays in `ItemMasterAdd.tsx` and `ItemMasterEdit.tsx`
3. Add comprehensive tooltips to all fields

### Phase 5: Navigation & Translations
1. Add top-level "Ingredients" menu item to sidebar
2. Add all tooltip translations to `translations.ts` (EN, AR, UR)

---

## Technical Details

### Query Key Structure for Cache

```typescript
// Standardized query keys for consistent caching
const QUERY_KEYS = {
  categories: ['maintenance', 'categories'],
  subcategories: (categoryId?: string) => ['maintenance', 'subcategories', categoryId],
  servingTimes: ['maintenance', 'serving_times'],
  units: ['maintenance', 'units'],
  storageTypes: ['maintenance', 'storage_types'],
  allergens: ['maintenance', 'allergens'],
  itemTypes: ['maintenance', 'item_types'],
  ingredientGroups: ['maintenance', 'ingredient_groups'],
};
```

### Loading States

All dropdowns will show:
- Skeleton/spinner while loading
- Empty state if no data
- Error toast if fetch fails

### Multi-Language Label Display

When displaying options, use current language:
```typescript
const { currentLanguage } = useLanguage();

const getLocalizedLabel = (item: { name_en: string; name_ar?: string; name_ur?: string }) => {
  const key = `name_${currentLanguage}` as keyof typeof item;
  return (item[key] as string) || item.name_en;
};
```

---

## Files Summary

### New Files
| File | Purpose |
|------|---------|
| `src/hooks/useMaintenanceData.ts` | Centralized maintenance data hooks |
| `src/components/shared/SearchableMultiSelect.tsx` | Multi-select searchable dropdown |

### Modified Files
| File | Purpose |
|------|---------|
| `src/pages/ItemsAdd.tsx` | Dynamic dropdowns + tooltips |
| `src/pages/ItemsEdit.tsx` | Dynamic dropdowns + tooltips |
| `src/pages/inventory/IngredientMasterAdd.tsx` | Dynamic dropdowns + tooltips |
| `src/pages/inventory/IngredientMasterEdit.tsx` | Dynamic dropdowns + tooltips |
| `src/pages/inventory/ItemMasterAdd.tsx` | Dynamic dropdowns + tooltips |
| `src/pages/inventory/ItemMasterEdit.tsx` | Dynamic dropdowns + tooltips |
| `src/components/shared/SearchableSelect.tsx` | Loading state support |
| `src/components/shared/AllergenPicker.tsx` | Dynamic allergens from DB |
| `src/components/AppSidebar.tsx` | Top-level Ingredients menu |
| `src/lib/i18n/translations.ts` | Tooltip translations (EN/AR/UR) |

---

## Tooltip Location Summary

| Form Section | Fields with Tooltips |
|--------------|---------------------|
| Item Basics | Item Name, Image Upload, Description |
| Item Type & Cost | Item Type, Base Cost, Is Combo |
| Classification | Category, Subcategory, Serving Time |
| Details | Prep Time, Calories, Allergens, Highlights |
| Inventory | Current Stock, Low Stock Threshold |
| Ingredient Basics | Ingredient Name, Description |
| Ingredient Classification | Type, Unit, Storage Type, Category/Group |
| Ingredient Inventory | Min Stock Alert, Shelf Life, PAR Level, Current Stock |
| Ingredient Pricing | Cost Price, Selling Price, Can Purchase, Return on Cancel |
| Ingredient Details | Yield %, Allergens, Supplier |

