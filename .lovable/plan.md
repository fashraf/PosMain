
# Implementation Plan: Dynamic Dropdowns & Toggle Confirmations

## Problem Summary

The Item Master Add/Edit forms (`ItemsAdd.tsx`, `ItemsEdit.tsx`) and Ingredient Master forms (`IngredientMasterAdd.tsx`, `IngredientMasterEdit.tsx`) are using **hardcoded dropdown arrays** instead of fetching from maintenance tables. Changes made in maintenance pages (e.g., renaming "Vegetarian" to "Vegetarian1") are NOT reflected in these forms.

---

## Current State (Hardcoded Arrays Found)

| File | Hardcoded Arrays |
|------|-----------------|
| `ItemsAdd.tsx` (lines 46-72) | `CATEGORIES`, `SUBCATEGORIES`, `SERVING_TIMES` |
| `ItemsEdit.tsx` (lines 46-72) | `CATEGORIES`, `SUBCATEGORIES`, `SERVING_TIMES` |
| `IngredientMasterAdd.tsx` (lines 30-66) | `INGREDIENT_TYPES`, `UNITS`, `STORAGE_TYPES`, `INGREDIENT_CATEGORIES` |
| `IngredientMasterEdit.tsx` (lines 30-66) | `INGREDIENT_TYPES`, `UNITS`, `STORAGE_TYPES`, `INGREDIENT_CATEGORIES` |

---

## Solution Overview

1. **Replace all hardcoded arrays** with dynamic data from `useMaintenanceData.ts` hooks
2. **Use `SearchableSelect`** for single-select dropdowns (Category, Item Type, Unit, Storage Type)
3. **Use `SearchableMultiSelect`** for multi-select fields (Subcategory, Serving Times)
4. **Implement cascading logic** - Subcategory filters by selected Category
5. **Add confirmation modals** for important toggle changes (Is Combo, Status)
6. **Add comprehensive tooltips** to all fields

---

## Files to Modify

### Item Forms (Primary Changes)

| File | Changes |
|------|---------|
| `src/pages/ItemsAdd.tsx` | Remove hardcoded arrays, import hooks, replace Select with SearchableSelect, add cascading subcategory logic, add toggle confirmations |
| `src/pages/ItemsEdit.tsx` | Same changes as ItemsAdd.tsx |

### Ingredient Forms

| File | Changes |
|------|---------|
| `src/pages/inventory/IngredientMasterAdd.tsx` | Remove hardcoded arrays, import hooks, replace all dropdowns with SearchableSelect using dynamic data |
| `src/pages/inventory/IngredientMasterEdit.tsx` | Same changes as IngredientMasterAdd.tsx |

### Translations

| File | Changes |
|------|---------|
| `src/lib/i18n/translations.ts` | Add confirmation modal messages for toggle actions |

---

## Detailed Implementation

### Phase 1: ItemsAdd.tsx Changes

**1. Remove hardcoded arrays** (lines 46-72):
```typescript
// DELETE these lines:
const CATEGORIES = [...];
const SUBCATEGORIES = [...];
const SERVING_TIMES = [...];
```

**2. Add imports for hooks and components**:
```typescript
import { 
  useCategories, 
  useSubcategories, 
  useServingTimes,
  useItemTypes,
  useLocalizedLabel 
} from "@/hooks/useMaintenanceData";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { SearchableMultiSelect } from "@/components/shared/SearchableMultiSelect";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
```

**3. Add hook calls inside component**:
```typescript
// Dynamic data hooks
const { data: categories, isLoading: categoriesLoading } = useCategories();
const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(formData.category);
const { data: servingTimes, isLoading: servingTimesLoading } = useServingTimes();
const { data: itemTypes, isLoading: itemTypesLoading } = useItemTypes();
const getLocalizedLabel = useLocalizedLabel();
```

**4. Add confirmation modal states**:
```typescript
const [comboConfirm, setComboConfirm] = useState<{open: boolean; newValue: boolean}>({open: false, newValue: false});
const [statusConfirm, setStatusConfirm] = useState<{open: boolean; newValue: boolean}>({open: false, newValue: false});
```

**5. Transform data for dropdowns**:
```typescript
const categoryOptions = useMemo(() => 
  (categories || []).map(c => ({ id: c.id, label: getLocalizedLabel(c) })), 
  [categories, getLocalizedLabel]
);

const subcategoryOptions = useMemo(() => 
  (subcategories || []).map(s => ({ id: s.id, label: getLocalizedLabel(s) })), 
  [subcategories, getLocalizedLabel]
);

const servingTimeOptions = useMemo(() => 
  (servingTimes || []).map(s => ({ id: s.id, label: getLocalizedLabel(s) })), 
  [servingTimes, getLocalizedLabel]
);

const itemTypeOptions = useMemo(() => 
  (itemTypes || []).map(i => ({ id: i.id, label: getLocalizedLabel(i) })), 
  [itemTypes, getLocalizedLabel]
);
```

**6. Reset subcategories when category changes**:
```typescript
useEffect(() => {
  // Clear subcategory selection when category changes
  if (formData.category) {
    setFormData(prev => ({ ...prev, subcategories: [] }));
  }
}, [formData.category]);
```

**7. Replace Category dropdown** (around line 608-622):
```typescript
<SearchableSelect
  value={formData.category}
  onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
  options={categoryOptions}
  placeholder={t("items.selectCategory")}
  searchPlaceholder={t("common.search")}
  emptyText={t("common.noResults")}
  isLoading={categoriesLoading}
/>
```

**8. Replace Subcategory dropdown** with multi-select:
```typescript
<SearchableMultiSelect
  value={formData.subcategories}
  onChange={(value) => setFormData((prev) => ({ ...prev, subcategories: value }))}
  options={subcategoryOptions}
  placeholder={formData.category ? t("items.selectSubcategories") : t("items.selectCategoryFirst")}
  searchPlaceholder={t("common.search")}
  emptyText={t("common.noResults")}
  isLoading={subcategoriesLoading}
  disabled={!formData.category}
/>
```

**9. Replace Serving Times** with multi-select checkboxes:
```typescript
<SearchableMultiSelect
  value={formData.serving_times}
  onChange={(value) => setFormData((prev) => ({ ...prev, serving_times: value }))}
  options={servingTimeOptions}
  placeholder={t("items.selectServingTimes")}
  searchPlaceholder={t("common.search")}
  emptyText={t("common.noResults")}
  isLoading={servingTimesLoading}
/>
```

**10. Replace Item Type dropdown** (around line 539-552):
```typescript
<SearchableSelect
  value={formData.item_type}
  onChange={(value) => setFormData((prev) => ({ ...prev, item_type: value }))}
  options={itemTypeOptions}
  placeholder={t("common.select")}
  searchPlaceholder={t("common.search")}
  emptyText={t("common.noResults")}
  isLoading={itemTypesLoading}
/>
```

**11. Add toggle confirmation handlers**:
```typescript
const handleComboToggle = (checked: boolean) => {
  if (checked) {
    // Enabling combo - show confirmation
    setComboConfirm({ open: true, newValue: true });
  } else {
    // Disabling - direct change
    setFormData((prev) => ({ ...prev, is_combo: false }));
  }
};

const confirmComboChange = () => {
  setFormData((prev) => ({ ...prev, is_combo: comboConfirm.newValue }));
  setComboConfirm({ open: false, newValue: false });
};

const handleStatusToggle = (checked: boolean) => {
  if (!checked) {
    // Deactivating - show confirmation
    setStatusConfirm({ open: true, newValue: false });
  } else {
    setFormData((prev) => ({ ...prev, is_active: true }));
  }
};

const confirmStatusChange = () => {
  setFormData((prev) => ({ ...prev, is_active: statusConfirm.newValue }));
  setStatusConfirm({ open: false, newValue: false });
};
```

**12. Update Switch components to use confirmation**:
```typescript
<Switch
  id="isCombo"
  checked={formData.is_combo}
  onCheckedChange={handleComboToggle}
/>

<Switch
  id="status"
  checked={formData.is_active}
  onCheckedChange={handleStatusToggle}
/>
```

**13. Add confirmation modals at end of JSX**:
```typescript
{/* Combo Confirmation */}
<ConfirmActionModal
  open={comboConfirm.open}
  onOpenChange={(open) => !open && setComboConfirm({ open: false, newValue: false })}
  onConfirm={confirmComboChange}
  title={t("items.enableComboTitle")}
  message={t("items.enableComboMessage")}
  confirmLabel={t("common.confirm")}
/>

{/* Status Confirmation */}
<ConfirmActionModal
  open={statusConfirm.open}
  onOpenChange={(open) => !open && setStatusConfirm({ open: false, newValue: false })}
  onConfirm={confirmStatusChange}
  title={t("items.deactivateItemTitle")}
  message={t("items.deactivateItemMessage")}
  confirmLabel={t("common.confirm")}
  variant="destructive"
/>
```

**14. Update confirmModalItem to use dynamic labels**:
```typescript
const confirmModalItem = useMemo(() => ({
  // ...
  category: categories?.find((c) => c.id === formData.category)?.name_en || "",
  subcategories: formData.subcategories.map((id) => 
    subcategories?.find((s) => s.id === id)?.name_en || ""
  ).filter(Boolean),
  serving_times: formData.serving_times.map((id) => 
    servingTimes?.find((s) => s.id === id)?.name_en || ""
  ).filter(Boolean),
  item_type: itemTypes?.find((i) => i.id === formData.item_type)?.name_en || formData.item_type,
  // ...
}), [formData, categories, subcategories, servingTimes, itemTypes, ...]);
```

---

### Phase 2: ItemsEdit.tsx Changes

Apply identical changes as ItemsAdd.tsx:
- Remove hardcoded arrays
- Import hooks and components
- Add hook calls
- Add confirmation modals
- Replace all dropdowns
- Update category-subcategory cascading

---

### Phase 3: IngredientMasterAdd.tsx Changes

**1. Remove hardcoded arrays** (lines 30-66):
```typescript
// DELETE these lines:
const INGREDIENT_TYPES = [...];
const UNITS = [...];
const STORAGE_TYPES = [...];
const INGREDIENT_CATEGORIES = [...];
```

**2. Add imports**:
```typescript
import { 
  useUnits, 
  useStorageTypes, 
  useIngredientGroups,
  useLocalizedLabel 
} from "@/hooks/useMaintenanceData";
import { SearchableMultiSelect } from "@/components/shared/SearchableMultiSelect";
```

**3. Add hook calls**:
```typescript
const { data: units, isLoading: unitsLoading } = useUnits();
const { data: storageTypes, isLoading: storageTypesLoading } = useStorageTypes();
const { data: ingredientGroups, isLoading: groupsLoading } = useIngredientGroups();
const getLocalizedLabel = useLocalizedLabel();

// Keep ingredient types as static (Solid/Liquid/Powder/Other is standard)
const INGREDIENT_TYPES = [
  { id: "solid", label: t("ingredients.solid") },
  { id: "liquid", label: t("ingredients.liquid") },
  { id: "powder", label: t("ingredients.powder") },
  { id: "other", label: t("ingredients.other") },
];
```

**4. Transform data for dropdowns**:
```typescript
const unitOptions = useMemo(() => 
  (units || []).map(u => ({ 
    id: u.id, 
    label: `${getLocalizedLabel(u)} (${u.symbol})` 
  })), 
  [units, getLocalizedLabel]
);

const storageTypeOptions = useMemo(() => 
  (storageTypes || []).map(s => ({ 
    id: s.id, 
    label: `${getLocalizedLabel(s)}${s.temp_range ? ` (${s.temp_range})` : ''}` 
  })), 
  [storageTypes, getLocalizedLabel]
);

const ingredientGroupOptions = useMemo(() => 
  (ingredientGroups || []).map(g => ({ id: g.id, label: getLocalizedLabel(g) })), 
  [ingredientGroups, getLocalizedLabel]
);
```

**5. Replace Unit dropdown**:
```typescript
<SearchableSelect
  value={formData.unit}
  onChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
  options={unitOptions}
  placeholder={t("common.select")}
  searchPlaceholder={t("common.search")}
  emptyText={t("common.noResults")}
  isLoading={unitsLoading}
/>
```

**6. Replace Storage Type dropdown**:
```typescript
<SearchableSelect
  value={formData.storage_type}
  onChange={(value) => setFormData((prev) => ({ ...prev, storage_type: value }))}
  options={storageTypeOptions}
  placeholder={t("common.select")}
  searchPlaceholder={t("common.search")}
  emptyText={t("common.noResults")}
  isLoading={storageTypesLoading}
/>
```

**7. Replace Category chips with SearchableMultiSelect**:
```typescript
<SearchableMultiSelect
  value={formData.categories}
  onChange={(value) => setFormData((prev) => ({ ...prev, categories: value }))}
  options={ingredientGroupOptions}
  placeholder={t("common.select")}
  searchPlaceholder={t("common.search")}
  emptyText={t("common.noResults")}
  isLoading={groupsLoading}
/>
```

**8. Update ingredientSummary to use dynamic labels**:
```typescript
const ingredientSummary = {
  name: formData.name_en,
  type: INGREDIENT_TYPES.find((t) => t.id === formData.ingredient_type)?.label || "",
  unit: units?.find((u) => u.id === formData.unit)?.name_en || "",
  storageType: storageTypes?.find((s) => s.id === formData.storage_type)?.name_en || "",
  categories: formData.categories.map(
    (cId) => ingredientGroups?.find((g) => g.id === cId)?.name_en || cId
  ),
  costPrice: formData.cost_price,
};
```

---

### Phase 4: IngredientMasterEdit.tsx Changes

Apply identical changes as IngredientMasterAdd.tsx.

---

### Phase 5: Add Translations

Add to `src/lib/i18n/translations.ts`:

```typescript
// English
items: {
  // ... existing
  selectCategoryFirst: "Select category first",
  selectServingTimes: "Select serving times",
  enableComboTitle: "Enable Combo?",
  enableComboMessage: "Enabling combo allows sub-item mapping. This will change how this item is configured. Continue?",
  deactivateItemTitle: "Deactivate Item?",
  deactivateItemMessage: "Deactivating this item will remove it from POS and menu display. It can be reactivated later.",
},
ingredients: {
  // ... existing
  solid: "Solid",
  liquid: "Liquid", 
  powder: "Powder",
  other: "Other",
},

// Arabic
items: {
  selectCategoryFirst: "اختر الفئة أولاً",
  selectServingTimes: "اختر أوقات التقديم",
  enableComboTitle: "تفعيل الكومبو؟",
  enableComboMessage: "تفعيل الكومبو يسمح بربط العناصر الفرعية. سيغير هذا كيفية تكوين هذا العنصر. متابعة؟",
  deactivateItemTitle: "إلغاء تنشيط العنصر؟",
  deactivateItemMessage: "إلغاء تنشيط هذا العنصر سيزيله من نقطة البيع وعرض القائمة. يمكن إعادة تنشيطه لاحقًا.",
},
ingredients: {
  solid: "صلب",
  liquid: "سائل",
  powder: "مسحوق",
  other: "أخرى",
},

// Urdu
items: {
  selectCategoryFirst: "پہلے زمرہ منتخب کریں",
  selectServingTimes: "سروس کے اوقات منتخب کریں",
  enableComboTitle: "کومبو فعال کریں؟",
  enableComboMessage: "کومبو کو فعال کرنے سے ذیلی آئٹم میپنگ ممکن ہو جائے گی۔ یہ اس آئٹم کی تشکیل کو تبدیل کر دے گا۔ جاری رکھیں؟",
  deactivateItemTitle: "آئٹم غیر فعال کریں؟",
  deactivateItemMessage: "اس آئٹم کو غیر فعال کرنے سے یہ POS اور مینو سے ہٹ جائے گا۔ بعد میں دوبارہ فعال کیا جا سکتا ہے۔",
},
ingredients: {
  solid: "ٹھوس",
  liquid: "مائع",
  powder: "پاؤڈر",
  other: "دیگر",
},
```

---

## Tooltip Additions

Add tooltips to all dropdowns using `TooltipInfo`:

| Field | Tooltip |
|-------|---------|
| Category | "Main grouping used for filtering, reports, and kitchen routing (pulled live from maintenance)" |
| Subcategory | "More specific tag filtered by category - multi-select allowed" |
| Serving Time | "When this item is typically available - select multiple if needed" |
| Item Type | "Classification affecting inventory and preparation workflow" |
| Unit | "Base measurement unit for tracking and recipes" |
| Storage Type | "Required storage conditions - affects warehouse organization" |
| Category/Group | "Grouping for purchasing and inventory reports" |

---

## Summary of Changes

| File | Action |
|------|--------|
| `src/pages/ItemsAdd.tsx` | Replace 3 hardcoded arrays with hooks, use SearchableSelect/MultiSelect, add cascading logic, add toggle confirmations |
| `src/pages/ItemsEdit.tsx` | Same as ItemsAdd.tsx |
| `src/pages/inventory/IngredientMasterAdd.tsx` | Replace 3 hardcoded arrays (keep type static), use SearchableSelect/MultiSelect |
| `src/pages/inventory/IngredientMasterEdit.tsx` | Same as IngredientMasterAdd.tsx |
| `src/lib/i18n/translations.ts` | Add confirmation modal messages and ingredient type labels |

---

## Expected Behavior After Implementation

1. **Category dropdown** shows live data from `maintenance_categories` table
2. **Subcategory dropdown** filters based on selected Category
3. **Serving Times** uses multi-select from `serving_times` table
4. **Item Type** uses searchable dropdown from `item_types` table
5. **Unit/Storage Type** in ingredients use live data
6. **Toggling "Is Combo"** shows confirmation modal
7. **Toggling Status to inactive** shows warning modal
8. All dropdowns have **search functionality**
9. All dropdowns show **loading skeletons** while fetching
10. Changes in maintenance (e.g., "Vegetarian" → "Vegetarian1") **reflect immediately**
