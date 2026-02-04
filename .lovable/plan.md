

# Implementation Plan: Maintenance Pages for Master Data

## Overview

Create a complete set of **9 maintenance pages** for centralized management of enumerable data used across the system. Each page follows a consistent **single-table + modal CRUD** pattern matching existing project standards.

---

## Architecture Decision

| Approach | Single-Table + Modal CRUD |
|----------|---------------------------|
| Pattern | List page with inline toggle + modal for Add/Edit |
| Navigation | All pages accessible via sidebar under "Maintenance" submenu |
| Components | Reuse existing `Dialog`, `Table`, `Switch`, `StatusBadge`, `CompactMultiLanguageInput`, `ConfirmActionModal` |
| Styling | Tailwind + shadcn/ui, dotted borders on modals, 13px text, lavender hover effects |

---

## Sidebar Navigation Update

Add new "Maintenance" collapsible menu in `AppSidebar.tsx`:

```text
📂 Maintenance
  ├── Categories
  ├── Subcategories
  ├── Serving Times
  ├── Allergens
  ├── Item Types
  ├── Classification Types
  ├── Units
  ├── Storage Types
  └── Ingredient Groups
```

---

## Database Tables Required

| Table | Key Fields |
|-------|------------|
| `maintenance_categories` | id, name_en, name_ar, name_ur, description, icon_class, sort_order, is_active |
| `maintenance_subcategories` | id, name_en, name_ar, name_ur, parent_category_id (FK), description, is_active |
| `serving_times` | id, name_en, name_ar, name_ur, sort_order, icon_class, is_active |
| `allergens` | id, name_en, name_ar, name_ur, icon_class, severity (low/medium/high), is_active |
| `item_types` | id, name_en, name_ar, name_ur, description, is_active |
| `classification_types` | id, name_en, name_ar, name_ur, is_active |
| `units` | id, name_en, name_ar, name_ur, symbol, conversion_factor, is_active |
| `storage_types` | id, name_en, name_ar, name_ur, icon_class, temp_range, is_active |
| `ingredient_groups` | id, name_en, name_ar, name_ur, description, is_active |

---

## Shared Components to Create

### 1. MaintenanceDialog Component
Reusable modal for Add/Edit with:
- Dotted border styling (`border-2 border-dotted`)
- 13px font, Title Case labels
- CompactMultiLanguageInput for EN/AR/UR
- Status toggle
- Validation with focus-on-error
- Confirmation modal on save

### 2. MaintenanceTable Component
Standardized table with:
- 42px row height
- Zebra striping (#F9FAFB/white)
- Lavender hover (#F3F0FF)
- Inline status toggle
- Actions: View, Edit
- Auto-incrementing serial numbers

### 3. DeleteConfirmModal
Styled confirmation modal:
- Warning icon
- Impact message ("This may affect X items")
- Soft delete option

---

## Page-by-Page Specification

### 1. Categories (/maintenance/categories)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Description | Textarea | No |
| Icon Class | Input (e.g., `utensils`, `cup-straw`) | No |
| Sort Order | Number | No |
| Status | Toggle | Yes (default: Active) |

**Mock Data:**
- Vegetarian, Non-Vegetarian, Drinks, Sheesha, Desserts

**Table Columns:**
| # | Name | Icon | Sort | Status | Actions |

---

### 2. Subcategories (/maintenance/subcategories)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Parent Category | SearchableSelect | Yes |
| Description | Textarea | No |
| Status | Toggle | Yes |

**Mock Data:**
- Sea Food, Pan Cake, Pizza, Soft Drinks, Tea and Coffee, BBQ, Shawarma, Smoking Zone

**Table Columns:**
| # | Name | Parent Category | Status | Actions |

---

### 3. Serving Times (/maintenance/serving-times)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Time Range | Input (e.g., "6:00 - 11:00") | No |
| Sort Order | Number | No |
| Icon Class | Input | No |
| Status | Toggle | Yes |

**Mock Data:**
- Breakfast (6:00 - 11:00), Lunch Specials (11:00 - 16:00), Dinner (16:00 - 23:00), Snacks (All Day)

**Table Columns:**
| # | Name | Time Range | Sort | Status | Actions |

---

### 4. Allergens (/maintenance/allergens)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Icon Class | Input | No |
| Severity | Select (Low/Medium/High) | Yes |
| Status | Toggle | Yes |

**Mock Data:**
- Nuts (High), Dairy (Medium), Gluten (Medium), Eggs (Low), Soy (Low), Shellfish (High), Wheat (Medium)

**Table Columns:**
| # | Name | Icon | Severity | Status | Actions |

**Special:** Severity badge with color coding:
- High: Red pill
- Medium: Yellow pill
- Low: Gray pill

---

### 5. Item Types (/maintenance/item-types)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Description | Textarea | No |
| Status | Toggle | Yes |

**Mock Data:**
- Edible, Drink, Sheesha, Accessory

**Table Columns:**
| # | Name | Description | Status | Actions |

---

### 6. Classification Types (/maintenance/classification-types)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Status | Toggle | Yes |

**Mock Data:**
- Food, Beverage, Consumable, Accessory

**Table Columns:**
| # | Name | Status | Actions |

---

### 7. Units (/maintenance/units)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Symbol | Input (e.g., kg, g, L) | Yes |
| Base Unit | Select (reference to another unit or "self") | No |
| Conversion Factor | Number (e.g., 1000 for g→kg) | No |
| Status | Toggle | Yes |

**Mock Data:**
- Kilogram (kg, base), Gram (g, 0.001 kg), Liter (L, base), Milliliter (mL, 0.001 L), Piece (pcs), Pack, Box

**Table Columns:**
| # | Name | Symbol | Conversion | Status | Actions |

---

### 8. Storage Types (/maintenance/storage-types)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Icon Class | Input (e.g., `snowflake`, `thermometer`) | No |
| Temperature Range | Input (e.g., "-18°C", "0-4°C") | No |
| Status | Toggle | Yes |

**Mock Data:**
- Freezer (-18°C), Fridge/Chiller (0-4°C), Dry/Ambient (15-25°C), Room Temp

**Table Columns:**
| # | Name | Icon | Temp Range | Status | Actions |

---

### 9. Ingredient Groups (/maintenance/ingredient-groups)

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Name (EN/AR/UR) | MultiLanguage Input | EN required |
| Description | Textarea | No |
| Status | Toggle | Yes |

**Mock Data:**
- Meat & Poultry, Dairy, Produce/Vegetables, Spices & Herbs, Dry Goods, Oils & Fats, Beverages/Base, Seafood, Bakery Items, Packaging

**Table Columns:**
| # | Name | Description | Status | Actions |

---

## Files to Create

```text
src/pages/maintenance/
├── Categories.tsx
├── Subcategories.tsx
├── ServingTimes.tsx
├── Allergens.tsx
├── ItemTypes.tsx
├── ClassificationTypes.tsx
├── Units.tsx
├── StorageTypes.tsx
└── IngredientGroups.tsx

src/components/maintenance/
├── MaintenanceDialog.tsx        # Reusable Add/Edit modal
├── MaintenanceTable.tsx         # Standardized table component
├── DeleteConfirmModal.tsx       # Deletion confirmation
└── SeverityBadge.tsx            # For allergens severity display
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add routes for all 9 maintenance pages |
| `src/components/AppSidebar.tsx` | Add "Maintenance" collapsible menu |
| `src/lib/i18n/translations.ts` | Add translation keys for maintenance pages |
| Database migrations | Create 9 new tables with RLS policies |

---

## UI Pattern for Each Page

```text
┌─────────────────────────────────────────────────────────────┐
│ Maintenance - [Page Title]                    [+ Add Button] │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search...          [Status Filter ▼]                      │
├─────────────────────────────────────────────────────────────┤
│ # │ Name        │ [Other Cols]  │ Status  │ Actions          │
├───┼─────────────┼───────────────┼─────────┼──────────────────┤
│ 1 │ Vegetarian  │ ...           │ 🟢 Active │ 👁 ✏           │
│ 2 │ Non-Veg     │ ...           │ ⚪ Inactive│ 👁 ✏          │
└───┴─────────────┴───────────────┴─────────┴──────────────────┘
│                    ← 1 2 3 ... →  (15 per page)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Modal Design

```text
┌─────────────────────────────────────────┐
│ ╭╴Add/Edit [Entity Name]╶╮   [✕ Close] │  ← Dotted border
├─────────────────────────────────────────┤
│ Name *                                  │
│ ┌────────────────────────────────────┐  │
│ │ [EN] [AR] [UR]                     │  │  ← Tab switcher
│ │ ┌────────────────────────────────┐ │  │
│ │ │ Enter name...                  │ │  │
│ │ └────────────────────────────────┘ │  │
│ └────────────────────────────────────┘  │
│                                         │
│ [Other Fields...]                       │
│                                         │
│ Status        ○ Active  ● Inactive      │
├─────────────────────────────────────────┤
│                    [Cancel] [Save]      │  ← 13px, Title Case
└─────────────────────────────────────────┘
```

---

## Confirmation Modal Pattern

On Save click, show confirmation:

```text
┌─────────────────────────────────────────┐
│         ✓ Ready to save?                │
├─────────────────────────────────────────┤
│  You are about to add "Vegetarian"      │
│  as a new category.                     │
│                                         │
│  This will be available immediately     │
│  across all item forms.                 │
├─────────────────────────────────────────┤
│              [Cancel]  [Confirm & Save] │
└─────────────────────────────────────────┘
```

---

## Translation Keys to Add

```typescript
maintenance: {
  title: "Maintenance",
  categories: "Categories",
  subcategories: "Subcategories",
  servingTimes: "Serving Times",
  allergens: "Allergens",
  itemTypes: "Item Types",
  classificationTypes: "Classification Types",
  units: "Units",
  storageTypes: "Storage Types",
  ingredientGroups: "Ingredient Groups",
  addNew: "Add New",
  editEntry: "Edit Entry",
  deleteConfirm: "Are you sure you want to delete this entry?",
  deleteWarning: "This action cannot be undone. Existing items using this may be affected.",
  parentCategory: "Parent Category",
  iconClass: "Icon Class",
  sortOrder: "Sort Order",
  symbol: "Symbol",
  conversionFactor: "Conversion Factor",
  temperatureRange: "Temperature Range",
  severity: "Severity",
  severityLow: "Low",
  severityMedium: "Medium",
  severityHigh: "High",
  timeRange: "Time Range",
  noData: "No entries found",
  addFirst: "Add your first entry to get started",
}
```

---

## Best Practice Checklist

| Requirement | Implementation |
|-------------|----------------|
| ✅ Multilingual EN/AR/UR | CompactMultiLanguageInput with 12px indicators |
| ✅ Status Toggle | Inline Switch + StatusBadge |
| ✅ Confirmation Modal | Before save/delete with friendly messaging |
| ✅ Loading Overlay | LoadingOverlay on save operations |
| ✅ Validation | Required field check, focus-on-first-error |
| ✅ Search/Filter | Debounced search + status dropdown |
| ✅ Pagination | 15 rows per page, DataTablePagination |
| ✅ Tooltips | On icon fields and complex inputs |
| ✅ Consistent Colors | Soft greens/purples, lavender hover |
| ✅ Dotted Borders | `border-2 border-dotted` on modals |
| ✅ 13px Typography | Sharp, clear text throughout |
| ✅ Single-Table Design | All CRUD in modal, no separate pages |
| ✅ Reusability | Shared MaintenanceDialog component |
| ✅ RTL Support | Existing useLanguage hook handles this |

---

## Implementation Order

1. **Phase 1: Infrastructure**
   - Create database migrations for all 9 tables
   - Create shared components (MaintenanceDialog, MaintenanceTable)
   - Update sidebar navigation
   - Add translation keys

2. **Phase 2: Core Pages** (used in /items/add)
   - Categories
   - Subcategories
   - Serving Times
   - Allergens

3. **Phase 3: Supporting Pages**
   - Item Types
   - Classification Types
   - Units

4. **Phase 4: Inventory Pages**
   - Storage Types
   - Ingredient Groups

5. **Phase 5: Integration**
   - Update ItemsAdd.tsx to fetch from maintenance tables
   - Replace hardcoded arrays with API calls
   - Test end-to-end flow

