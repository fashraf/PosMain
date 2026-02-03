

# Enhanced Branch & Item Configuration - UI Prototype Plan

## Overview
This plan enhances the Branch Add/Edit pages with new configuration sections (Order Types, Pricing Mode, Rounding Rules) and extends Items with Categories, Preparation Time, Allergens, and Calories. The focus is on a compact, enterprise-grade UX with proper alignment and minimal spacing.

---

## UX Issues to Address (Current Problems)

### Current Layout Issues
- Cards take up too much vertical space
- MultiLanguageInput tabs are full-width (wasteful)
- Too much padding/spacing between elements
- Fields not aligned in grid layouts
- Single card per section creates excessive scrolling

### Compact UX Improvements
- Use 2-column grid layouts within cards
- Smaller card padding (`p-4` instead of `p-6`)
- Inline checkbox groups instead of large toggle rows
- Combine related sections into single cards where logical
- Horizontal groupings for related fields

---

## New i18n Keys Required

```text
branches.orderTypes, branches.orderTypesDescription
branches.dineIn, branches.takeaway, branches.delivery
branches.internalDelivery, branches.aggregatorDelivery
branches.aggregators, branches.uberEats, branches.talabat, branches.jahez, branches.zomato, branches.swiggy
branches.pricingMode, branches.pricingModeTooltip
branches.inclusivePricing, branches.exclusivePricing
branches.inclusiveDescription, branches.exclusiveDescription
branches.roundingRules, branches.roundingTooltip
branches.noRounding, branches.roundTo005, branches.roundTo010, branches.roundToWhole

categories.title, categories.addCategory, categories.editCategory
categories.categoryName, categories.timeAvailability, categories.menuAvailability
categories.breakfast, categories.lunch, categories.dinner
categories.availableFor, categories.noCategories

items.preparationTime, items.preparationTimeMinutes, items.preparationTimeTooltip
items.allergens, items.allergensTooltip
items.nuts, items.dairy, items.gluten, items.eggs, items.soy, items.shellfish, items.wheat
items.calories, items.caloriesTooltip
items.categories, items.assignCategories
```

---

## 1. Branch Add/Edit Page Redesign

### New Layout Structure (Compact Cards)

```text
+--------------------------------------------------+
| ← Edit Branch                                    |
+==================================================+

+------------------------+-------------------------+
|  BASIC INFORMATION                               |
+------------------------+-------------------------+
| Branch Name [EN|AR|UR]        | Branch Code      |
| [compact tabs input]          | [MAIN_01]        |
+-------------------------------------------------+
| ○ Active    ○ Inactive                          |
+-------------------------------------------------+

+--------------------------------------------------+
|  ORDER TYPES                                     |
+--------------------------------------------------+
| ☑ Dine-In   ☑ Takeaway   ☐ Delivery             |
|                                                  |
| └─ Delivery Options (if Delivery checked):      |
|    ☑ Internal Delivery                          |
|    ☑ Aggregator Delivery                        |
|         ☑ Uber Eats  ☑ Talabat  ☐ Jahez         |
|         ☐ Zomato     ☐ Swiggy                   |
+--------------------------------------------------+

+--------------------------------------------------+
|  CURRENCY & PRICING                              |
+--------------------------------------------------+
| Currency        | Pricing Mode                   |
| [﷼ SAR ▼]       | ○ Inclusive (VAT in price)    |
|                 | ○ Exclusive (VAT added)        |
+-------------------------------------------------+

+--------------------------------------------------+
|  TAX SETTINGS                                    |
+--------------------------------------------------+
| ☑ Enable VAT          VAT %: [15.00] %          |
+-------------------------------------------------+
| Additional Taxes:                   [+ Add Tax]  |
| ┌────────────────────┬──────────┬───┐           |
| │ Service Tax        │ 5.00 %   │ ✕ │           |
| │ Municipal Tax      │ 2.50 %   │ ✕ │           |
| └────────────────────┴──────────┴───┘           |
+--------------------------------------------------+

+--------------------------------------------------+
|  ROUNDING RULES                                  |
+--------------------------------------------------+
| Round final bill to:                             |
| ○ No rounding                                   |
| ○ Nearest 0.05                                  |
| ○ Nearest 0.10                                  |
| ○ Nearest whole number                          |
+--------------------------------------------------+

+==================================================+
|              [ Cancel ]  [ Save ]                |
+==================================================+
```

### Technical Implementation

**Order Types Section:**
- Checkbox group for main order types (Dine-In, Takeaway, Delivery)
- Collapsible/conditional delivery options when Delivery is selected
- Nested checkboxes for aggregator platforms

**Pricing Mode:**
- Radio group with description text
- Visual example of how pricing works

**Rounding Rules:**
- Radio group with clear descriptions
- Tooltip explaining "applies to final bill only"

---

## 2. Item Categories Module (NEW)

### Categories List Page (`/categories`)
- Table: Name, Time Slots, Order Types, Status, Actions

### Category Add/Edit Page

```text
+--------------------------------------------------+
|  BASIC INFORMATION                               |
+--------------------------------------------------+
| Category Name [EN|AR|UR]     | Status            |
| [compact input]              | ○ Active ○ Inactive|
+--------------------------------------------------+

+--------------------------------------------------+
|  TIME AVAILABILITY                               |
+--------------------------------------------------+
| Available during:                                |
| ☑ Breakfast (6:00 - 11:00)                      |
| ☑ Lunch (11:00 - 16:00)                         |
| ☐ Dinner (16:00 - 23:00)                        |
+--------------------------------------------------+

+--------------------------------------------------+
|  MENU AVAILABILITY                               |
+--------------------------------------------------+
| Available for order types:                       |
| ☑ Dine-In   ☑ Takeaway   ☑ Internal Delivery    |
|                                                  |
| Available for aggregators:                       |
| ☑ Uber Eats  ☐ Talabat  ☑ Jahez                 |
+--------------------------------------------------+
```

---

## 3. Item Add/Edit Page Redesign

### Enhanced Layout

```text
+--------------------------------------------------+
| ← Add Item                                       |
+==================================================+

+------------------------+-------------------------+
|  BASIC INFORMATION                               |
+------------------------+-------------------------+
| Item Name [EN|AR|UR]         | Item Type         |
| [compact tabs]               | [Edible ▼]        |
+------------------------+-------------------------+
| Description            | Base Cost    | Combo    |
| [textarea]             | [12.99]      | ☑ Yes    |
+-------------------------------------------------+

+--------------------------------------------------+
|  CATEGORIES                                      |
+--------------------------------------------------+
| Assign to categories:                            |
| ☑ Breakfast  ☑ Lunch  ☐ Dinner  ☐ Snacks       |
+--------------------------------------------------+

+--------------------------------------------------+
|  PREPARATION & NUTRITION                         |
+--------------------------------------------------+
| Prep Time (min)  | Calories                      |
| [15]             | [450] kcal                    |
+-------------------------------------------------+
| Allergens:                                       |
| ☐ Nuts  ☑ Dairy  ☑ Gluten  ☐ Eggs  ☐ Soy       |
| ☐ Shellfish  ☐ Wheat                            |
+--------------------------------------------------+

+--------------------------------------------------+
|  IMAGE                                           |
+--------------------------------------------------+
| [  Upload Image  ] (placeholder)                 |
+--------------------------------------------------+

+--------------------------------------------------+
|  STATUS                                          |
+--------------------------------------------------+
| ○ Active    ○ Inactive                          |
+--------------------------------------------------+
```

---

## 4. Database Schema Updates

### New/Modified Tables

```sql
-- Branches table updates
ALTER TABLE branches ADD COLUMN order_types JSONB DEFAULT '{"dine_in": true, "takeaway": true, "delivery": false}';
ALTER TABLE branches ADD COLUMN delivery_options JSONB DEFAULT '{"internal": false, "aggregators": []}';
ALTER TABLE branches ADD COLUMN pricing_mode TEXT DEFAULT 'exclusive' CHECK (pricing_mode IN ('inclusive', 'exclusive'));
ALTER TABLE branches ADD COLUMN rounding_rule TEXT DEFAULT 'none' CHECK (rounding_rule IN ('none', '0.05', '0.10', '1.00'));

-- Item Categories table
CREATE TABLE item_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_ur TEXT NOT NULL,
  time_slots JSONB DEFAULT '[]', -- ["breakfast", "lunch", "dinner"]
  order_types JSONB DEFAULT '[]', -- ["dine_in", "takeaway", "delivery"]
  aggregators JSONB DEFAULT '[]', -- ["uber_eats", "talabat", etc.]
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Item-Category mapping
CREATE TABLE item_category_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  category_id UUID REFERENCES item_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(item_id, category_id)
);

-- Items table updates
ALTER TABLE items ADD COLUMN preparation_time_minutes INTEGER DEFAULT 15;
ALTER TABLE items ADD COLUMN allergens JSONB DEFAULT '[]';
ALTER TABLE items ADD COLUMN calories INTEGER;
```

---

## 5. New Components to Create

### Compact UI Components

**1. CheckboxGroup Component**
```text
src/components/shared/CheckboxGroup.tsx
```
- Horizontal checkbox layout
- Label + tooltip support
- Compact spacing

**2. RadioGroup Component (enhanced)**
```text
src/components/shared/CompactRadioGroup.tsx
```
- Horizontal or vertical layout
- Description text support
- Visual selection indicator

**3. CollapsibleSection Component**
```text
src/components/shared/CollapsibleSection.tsx
```
- For nested options (delivery → aggregators)
- Smooth expand/collapse animation

**4. AllergenPicker Component**
```text
src/components/shared/AllergenPicker.tsx
```
- Predefined allergen checkboxes
- Icon badges for each allergen

**5. CompactMultiLanguageInput Component**
```text
src/components/shared/CompactMultiLanguageInput.tsx
```
- Smaller tab buttons
- Reduced vertical spacing
- Inline with other fields in grid

---

## 6. File Changes Summary

### New Files to Create
```text
src/components/shared/CheckboxGroup.tsx
src/components/shared/CompactRadioGroup.tsx
src/components/shared/CollapsibleSection.tsx
src/components/shared/AllergenPicker.tsx
src/components/shared/CompactMultiLanguageInput.tsx

src/pages/Categories.tsx
src/pages/CategoriesAdd.tsx
src/pages/CategoriesEdit.tsx
src/components/categories/CategoryTable.tsx
```

### Files to Modify
```text
src/lib/i18n/translations.ts - Add all new keys
src/pages/BranchesAdd.tsx - Complete redesign with new sections
src/pages/BranchesEdit.tsx - Complete redesign with new sections
src/pages/ItemsAdd.tsx - Add categories, prep time, allergens, calories
src/pages/ItemsEdit.tsx - Add categories, prep time, allergens, calories
src/App.tsx - Add category routes
src/components/AppSidebar.tsx - Add Categories nav item
src/components/shared/MultiLanguageInput.tsx - Create compact variant
```

---

## 7. Design Specifications (Compact UX)

### Spacing Standards
- Card padding: `p-4` (down from `p-6`)
- Card header padding: `pb-3` (smaller)
- Field gap in grids: `gap-3` (down from `gap-4`)
- Section spacing: `space-y-4` (down from `space-y-6`)

### Grid Layouts
- 2-column for most form fields: `grid grid-cols-1 md:grid-cols-2 gap-3`
- 3-column for checkboxes: `grid grid-cols-2 sm:grid-cols-3 gap-2`

### Component Sizing
- Checkbox label: `text-sm`
- Section titles: `text-base font-medium` (not large h3)
- Input heights: Keep default but tighter margins

### Color Usage
- Active checkbox: Primary purple (`#8B5CF6`)
- Inactive states: `text-muted-foreground`
- Section dividers: `border-t border-border`

---

## 8. Implementation Order

1. **Compact UI Components** - CheckboxGroup, CompactRadioGroup, CompactMultiLanguageInput
2. **i18n Keys** - Add all translation strings
3. **Branch Pages Redesign** - Order Types, Pricing Mode, Rounding Rules
4. **Categories Module** - Full CRUD for item categories
5. **Items Pages Update** - Categories, Prep Time, Allergens, Calories
6. **Database Migrations** - Schema updates
7. **Sidebar Updates** - Add Categories navigation

---

## 9. Visual Alignment Rules

### Form Field Alignment
- Labels above inputs (not inline)
- Required asterisk `*` in red after label
- Tooltips as small `ℹ️` icons after labels
- Error states with red border and helper text below

### Multi-Column Alignment
```text
| Field 1 Label         | Field 2 Label         |
| [Input field]         | [Input field]         |
```

### Checkbox Alignment
```text
☑ Label 1    ☑ Label 2    ☐ Label 3
```
(inline, not stacked vertically)

---

## 10. Sample Data Structure for Order Types

```typescript
interface BranchOrderTypes {
  dine_in: boolean;
  takeaway: boolean;
  delivery: {
    enabled: boolean;
    internal: boolean;
    aggregators: {
      uber_eats: boolean;
      talabat: boolean;
      jahez: boolean;
      zomato: boolean;
      swiggy: boolean;
    };
  };
}

interface ItemAllergens {
  nuts: boolean;
  dairy: boolean;
  gluten: boolean;
  eggs: boolean;
  soy: boolean;
  shellfish: boolean;
  wheat: boolean;
}
```

This ensures all configurations are strongly typed and the POS order screen can dynamically filter items based on branch settings.

