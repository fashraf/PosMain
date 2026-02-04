

# Ingredient Master Add - Single Column Redesign

## Overview
Redesign the Ingredient Master Add page (`/inventory/ingredients/add`) to use a **full-width single-column layout (col-12)** with NO image upload, following the same dashed-border section card styling as the Items form.

---

## Target Layout Design (Full Width)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Add Ingredient                                                                                      │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                        │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 🥕 Visual & Basics                                                              [purple header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Ingredient Name * [EN🟢|AR🔴|UR🔴]           │  Short Description [EN🟢|AR🔴|UR🔴]              ┊  │
│  ┊  ┌────────────────────────────────────────┐  │  ┌────────────────────────────────────────────┐  ┊  │
│  ┊  │ Chicken Breast                         │  │  │ Fresh boneless chicken for grilling...    │  ┊  │
│  ┊  └────────────────────────────────────────┘  │  └────────────────────────────────────────────┘  ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                        │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 🏷️ Classification                                                               [green header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Type *              │  Unit *             │  Storage Type *      │  Category/Group            ┊  │
│  ┊  ┌────────────────┐  │  ┌────────────────┐ │  ┌─────────────────┐ │  ┌─[Meat ×][Poultry ×]──┐  ┊  │
│  ┊  │ Solid        ▼ │  │  │ KG           ▼ │ │  │ Freezer       ▼ │ │  │                    ▼ │  ┊  │
│  ┊  └────────────────┘  │  └────────────────┘ │  └─────────────────┘ │  └──────────────────────┘  ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                        │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ ⚠️ Inventory & Alerts                                                           [amber header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  ┌──────────────────────────────────────────────────────────────────────────────────────────┐  ┊  │
│  ┊  │█████████████████████████████████████████░░░░░░░░░░░░░░│ 68% Available                   │  ┊  │
│  ┊  └──────────────────────────────────────────────────────────────────────────────────────────┘  ┊  │
│  ┊                                                                                                ┊  │
│  ┊  Min Stock Alert *(i) │  Shelf Life Days (i)  │  PAR Level (i)      │  Current Stock          ┊  │
│  ┊  ┌──────────────────┐ │  ┌──────────────────┐ │  ┌──────────────────┐│  ┌──────────────────┐   ┊  │
│  ┊  │ 10               │ │  │ 7          days  │ │  │ 25               ││  │ 100              │   ┊  │
│  ┊  └──────────────────┘ │  └──────────────────┘ │  └──────────────────┘│  └──────────────────┘   ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                        │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 💰 Pricing                                                                       [blue header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Cost Price * (SAR)       │  Selling Price (SAR)       │  ☑ Can Purchase   ☐ Return on Cancel ┊  │
│  ┊  ┌────────────────────┐   │  ┌────────────────────────┐ │                                      ┊  │
│  ┊  │ SAR 15.00          │   │  │ SAR 20.00 (optional)   │ │                                      ┊  │
│  ┊  └────────────────────┘   │  └────────────────────────┘ │                                      ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                        │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 📋 Details                                                                       [muted/gray]  ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Yield % (i)              │  Supplier/Vendor                                                   ┊  │
│  ┊  ┌─────────────────────┐  │  ┌─────────────────────────────────────────────────────────────┐   ┊  │
│  ┊  │ 85               %  │  │  │ Fresh Foods Co.                                             │   ┊  │
│  ┊  └─────────────────────┘  │  └─────────────────────────────────────────────────────────────┘   ┊  │
│  ┊                                                                                                ┊  │
│  ┊  Allergen Flags                                                                                ┊  │
│  ┊  [🥜Nuts] [🥛Dairy ✓] [🌾Gluten] [🥚Eggs] [🫘Soy] [🦐Shellfish] [🌾Wheat]                       ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                        [× Cancel]   [✓ Save Ingredient]               │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Differences from Items Form

| Aspect | Items Form | Ingredient Form |
|--------|------------|-----------------|
| Layout | Two-column (4+8) | **Single column (12)** |
| Image Upload | Yes (280x280) | **NO** |
| Sections | 4 cards | 5 cards |
| Focus | Menu items, combos | Raw ingredients, stock |

---

## Section Cards (All Full Width)

### 1. Visual & Basics (Purple)
- **Row 1 (2 columns):**
  - Ingredient Name* (MultiLanguageInputWithIndicators)
  - Short Description (MultiLanguageInputWithIndicators, multiline)

### 2. Classification (Green)
- **Row 1 (4 columns):**
  - Type* (Select: Solid, Liquid, Powder, Other)
  - Unit* (Select: KG, G, L, ML, Piece, Pack, etc.)
  - Storage Type* (Select: Freezer, Fridge, Dry, Room Temp)
  - Category/Group (MultiSelectBadges)

### 3. Inventory & Alerts (Amber)
- **Progress bar** (full width) - shows stock percentage
- **Row 2 (4 columns):**
  - Min Stock Alert* (number + tooltip)
  - Shelf Life Days (number + "days" suffix + tooltip)
  - PAR Level (number + tooltip)
  - Current Stock (number)

### 4. Pricing (Blue)
- **Row 1 (4 columns):**
  - Cost Price* (SAR prefix)
  - Selling Price (optional, SAR prefix)
  - Can Purchase (Switch toggle)
  - Return on Cancel (Switch toggle)

### 5. Details (Muted/Gray - new variant)
- **Row 1 (2 columns):**
  - Yield % (number 0-100 + tooltip)
  - Supplier/Vendor (text input)
- **Row 2:**
  - Allergen Flags (AllergenPicker component)

---

## Files to Create/Modify

| Action | File | Changes |
|--------|------|---------|
| UPDATE | `src/components/shared/DashedSectionCard.tsx` | Add `muted` color variant |
| CREATE | `src/components/ingredients/IngredientSaveConfirmModal.tsx` | Friendly confirmation modal |
| REWRITE | `src/pages/inventory/IngredientMasterAdd.tsx` | Complete single-column redesign |
| UPDATE | `src/lib/i18n/translations.ts` | Add ingredient-specific translation keys |

---

## Form State Structure

```typescript
const [formData, setFormData] = useState({
  // Basic Info
  name_en: "",
  name_ar: "",
  name_ur: "",
  description_en: "",
  description_ar: "",
  description_ur: "",

  // Classification
  ingredient_type: "",        // solid | liquid | powder | other
  unit: "",                   // kg | g | l | ml | piece | pack
  storage_type: "",           // freezer | fridge | dry | room_temp
  categories: [] as string[], // Multi-select

  // Inventory & Alerts
  min_stock_alert: 10,
  shelf_life_days: null as number | null,
  reorder_point: null as number | null,
  current_stock: 100,
  max_stock: 100,

  // Pricing
  cost_price: 0,
  selling_price: null as number | null,
  can_purchase: true,
  will_return_on_cancel: false,

  // Details
  yield_percentage: 100,
  allergens: [] as AllergenType[],
  supplier: "",

  // Status
  is_active: true,
});
```

---

## Dropdown Options

### Ingredient Type
- Solid, Liquid, Powder, Other

### Unit
- Kilogram (KG), Gram (G), Liter (L), Milliliter (ML), Piece, Pack, Box, Dozen

### Storage Type
- Freezer (-18°C), Fridge/Chiller (0-4°C), Dry/Ambient, Room Temperature

### Ingredient Categories (Multi-Select)
- Meat & Poultry, Dairy, Produce/Vegetables, Spices & Herbs, Dry Goods, Oils & Fats, Beverages/Base, Packaging, Seafood, Bakery Items

---

## DashedSectionCard Update - Add Muted Variant

```typescript
muted: {
  border: "border-gray-300/40",
  headerBg: "bg-gray-50",
  headerBorder: "border-gray-200/50",
  iconColor: "text-gray-600",
  titleColor: "text-gray-700",
},
```

---

## Confirmation Modal

**Title:** "Great Choice! 🥕"  
**Message:** "Ready to save this ingredient? It will be available for recipes & items."  
**Summary Card:** Shows Name, Type, Unit, Category, Cost Price, Storage Type

---

## Grid Strategy (Maximize Horizontal Space)

| Section | Grid |
|---------|------|
| Basics | `grid-cols-1 md:grid-cols-2` |
| Classification | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| Inventory | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| Pricing | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| Details | `grid-cols-1 md:grid-cols-2` + full-width allergens |

---

## Translation Keys to Add

```typescript
ingredients: {
  visualAndBasics: "Visual & Basics",
  classification: "Classification",
  inventoryAndAlerts: "Inventory & Alerts",
  pricing: "Pricing",
  details: "Details",
  ingredientType: "Type",
  storageType: "Storage Type",
  categoryGroup: "Category/Group",
  minStockAlert: "Min Stock Alert",
  shelfLifeDays: "Shelf Life (Days)",
  parLevel: "PAR Level",
  sellingPrice: "Selling Price",
  canPurchase: "Can Purchase",
  willReturnOnCancel: "Return on Cancel",
  yieldPercentage: "Yield %",
  supplier: "Supplier/Vendor",
  allergenFlags: "Allergen Flags",
  
  // Types
  solid: "Solid",
  liquid: "Liquid",
  powder: "Powder",
  other: "Other",
  
  // Storage
  freezer: "Freezer (-18°C)",
  fridge: "Fridge/Chiller (0-4°C)",
  dryAmbient: "Dry/Ambient",
  roomTemp: "Room Temperature",
  
  // Categories
  meatPoultry: "Meat & Poultry",
  dairy: "Dairy",
  produceVegetables: "Produce/Vegetables",
  // ...etc
  
  // Confirmation
  greatChoice: "Great Choice!",
  readyToSaveIngredient: "Ready to save this ingredient?",
  availableForRecipes: "It will be available for recipes & items.",
  
  // Tooltips
  minStockTooltip: "Trigger low-stock notification when quantity falls below this level",
  shelfLifeTooltip: "Typical days before expiry/spoilage (used for FIFO & waste prevention)",
  parLevelTooltip: "Ideal minimum quantity to maintain - triggers reorder when reached",
  yieldTooltip: "Usable portion after trimming/cleaning (e.g., 85% for chicken after bones)",
  canPurchaseTooltip: "Allow purchasing this ingredient from suppliers through PO system",
  willReturnTooltip: "Can this ingredient be returned to stock if an order is canceled?",
},
```

---

## Visual Specifications

| Element | Value |
|---------|-------|
| Layout | **Full width (col-12)** |
| Section gap | `gap-5` (20px) |
| Card radius | `rounded-xl` (12px) |
| Card border | `border-2 border-dashed` |
| Input height | `h-10` (40px) |
| Grid gap | `gap-4` (16px) |
| Progress bar | `h-3` (12px) |
| Footer | Sticky bottom |

---

## Implementation Order

1. **Update `DashedSectionCard.tsx`** - Add `muted` variant
2. **Create `IngredientSaveConfirmModal.tsx`** - Friendly confirmation modal
3. **Rewrite `IngredientMasterAdd.tsx`** - Complete single-column redesign
4. **Update `translations.ts`** - Add all ingredient keys

