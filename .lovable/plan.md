

# Item-Ingredient Mapping Module - Revised UI Plan

## Key Changes from Previous Plan

Based on your feedback, the design is revised to:
1. **Summary Grid (Main View)** - Shows item name + counts only (e.g., "5 Ingredients, 2 Sub-Items")
2. **Nested Expandable Rows** - Click to expand and see ingredient/item details in a sub-grid
3. **CRUD on Separate Pages** - Add/Edit pages for mappings, not modals
4. **Modals for Confirmation Only** - Following existing patterns

---

## 1. Page Structure Overview

```text
/item-ingredient-mapping              - Main list with summary grid
/item-ingredient-mapping/:id/edit     - Edit mappings for a specific item
/ingredients                          - Ingredient management list (existing)
/ingredients/add                      - Add ingredient page
/ingredients/:id/edit                 - Edit ingredient page
```

---

## 2. Main Page - Summary Grid Layout

```text
+------------------------------------------------------------------+
| 🔗 Item-Ingredient Mapping                      [+ Add Mapping]   |
+==================================================================+
| 🔍 Search items...    | Filter: [All ▼] [Combos Only] [Edible]   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| MAIN ITEM LIST (Summary View)                                     |
+==================================================================+
| ≡ | Item Name           | Type    | Ingredients | Sub-Items | ⚙️ |
|---|---------------------|---------|-------------|-----------|-----|
| ≡ | Margherita Pizza    | Edible  | 4           | -         | ✏️  |
|   | └─ [Expand to see details]                                   |
|---|---------------------|---------|-------------|-----------|-----|
| ≡ | Chicken Burger      | Edible  | 3           | -         | ✏️  |
|---|---------------------|---------|-------------|-----------|-----|
| ≡ | 🏷️ Family Combo     | Combo   | 6 (total)   | 3         | ✏️  |
|   | └─ [Expand to see sub-items & aggregated ingredients]        |
|---|---------------------|---------|-------------|-----------|-----|
| ≡ | Paper Napkins       | Non-Ed  | -           | -         | -   |
+------------------------------------------------------------------+
| ≡ = Drag to reorder priority                                      |
| 🏷️ = Combo badge                                                 |
| Counts show summary only - click row to expand                    |
+------------------------------------------------------------------+
```

---

## 3. Expanded Row - Nested Sub-Grid

When user clicks on a row, it expands to show the nested details:

```text
+------------------------------------------------------------------+
| ≡ | Margherita Pizza    | Edible  | 4           | -         | ✏️  |
+------------------------------------------------------------------+
| ▼ EXPANDED VIEW                                                   |
|   +--------------------------------------------------------------+|
|   | INGREDIENTS (4)                                              ||
|   +--------------------------------------------------------------+|
|   | Ingredient    | Qty   | Unit | Can Remove | Can Extra | Cost ||
|   |---------------|-------|------|------------|-----------|------||
|   | Tomato        | 0.2   | Kg   | ✓          | ✓         | $1.00||
|   | Cheese        | 0.15  | Kg   | ✓          | ✓ +$2.00  | $1.80||
|   | Olive Oil     | 0.05  | L    | ✗          | ✗         | $0.25||
|   | Basil         | 0.02  | Kg   | ✓          | ✗         | $0.40||
|   +--------------------------------------------------------------+|
|   | Total Ingredient Cost: $3.45                                 ||
|   +--------------------------------------------------------------+|
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| ≡ | 🏷️ Family Combo     | Combo   | 6 (total)   | 3         | ✏️  |
+------------------------------------------------------------------+
| ▼ EXPANDED VIEW                                                   |
|   +--------------------------------------------------------------+|
|   | SUB-ITEMS (3)                                     [Priority]  ||
|   +--------------------------------------------------------------+|
|   | ≡ | Item Name         | Qty | Unit Price | Subtotal         ||
|   |---|-------------------|-----|------------|------------------||
|   | ≡ | Margherita Pizza  | 2x  | $12.99     | $25.98           ||
|   | ≡ | Chicken Burger    | 4x  | $8.99      | $35.96           ||
|   | ≡ | Soft Drink        | 6x  | $2.50      | $15.00           ||
|   +--------------------------------------------------------------+|
|   |                                                              ||
|   | AGGREGATED INGREDIENTS (6)                                   ||
|   +--------------------------------------------------------------+|
|   | Ingredient    | Total Qty | From Items              | Cost  ||
|   |---------------|-----------|-------------------------|-------||
|   | Tomato        | 0.6 Kg    | 2× Pizza, 4× Burger     | $3.00 ||
|   | Cheese        | 0.5 Kg    | 2× Pizza, 4× Burger     | $6.00 ||
|   | Chicken       | 0.8 Kg    | 4× Burger               | $9.60 ||
|   | ... more                                                     ||
|   +--------------------------------------------------------------+|
|   | Total Combo Cost: $76.94 | Item Costs + Ingredients          ||
+------------------------------------------------------------------+
```

---

## 4. Edit Mapping Page (Separate Page, Not Modal)

**Route:** `/item-ingredient-mapping/:itemId/edit`

```text
+------------------------------------------------------------------+
| ← Edit Mapping: Margherita Pizza                                  |
+==================================================================+

+------------------------------------------------------------------+
| 📋 Item Details (Read-Only)                                       |
+------------------------------------------------------------------+
| Item Name          | Type         | Base Cost                    |
| Margherita Pizza   | Edible       | $12.99                       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 🥕 INGREDIENT MAPPINGS                         [+ Add Ingredient] |
+==================================================================+
| Drag to reorder priority for POS customization screen            |
+------------------------------------------------------------------+
| ≡ | Ingredient | Qty    | Unit | Remove | Extra | Extra Cost | ✕ |
|---|------------|--------|------|--------|-------|------------|---|
| ≡ | [Tomato ▼] | [0.2]  | Kg   | [✓]    | [✓]   | [$1.50]    | 🗑 |
| ≡ | [Cheese ▼] | [0.15] | Kg   | [✓]    | [✓]   | [$2.00]    | 🗑 |
| ≡ | [Olive ▼]  | [0.05] | L    | [✗]    | [✗]   | [-]        | 🗑 |
| ≡ | [Basil ▼]  | [0.02] | Kg   | [✓]    | [✗]   | [-]        | 🗑 |
+------------------------------------------------------------------+
| Ingredient Cost Total: $3.45                                      |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 🏷️ COMBO SUB-ITEMS (Only for Combo Items)      [+ Add Sub-Item]  |
+==================================================================+
| This section appears only if item.is_combo = true                 |
+------------------------------------------------------------------+
| ≡ | Item Name              | Qty    | Unit Price | Subtotal | ✕  |
|---|------------------------|--------|------------|----------|-----|
| ≡ | [Margherita Pizza ▼]   | [2]    | $12.99     | $25.98   | 🗑  |
| ≡ | [Chicken Burger ▼]     | [4]    | $8.99      | $35.96   | 🗑  |
| ≡ | [Soft Drink ▼]         | [6]    | $2.50      | $15.00   | 🗑  |
+------------------------------------------------------------------+
| Sub-Items Total: $76.94                                           |
+------------------------------------------------------------------+

+==================================================================+
|                                      [Cancel]  [Save Changes]     |
+==================================================================+
```

---

## 5. Add Ingredient to Mapping (Inline Search, Not Modal)

When clicking [+ Add Ingredient]:

```text
+------------------------------------------------------------------+
| 🔍 Search and select ingredient:                                  |
| ┌────────────────────────────────────────────────────────────────┐|
| │ 🔍 Type to search...                                           │|
| │ ─────────────────────────────────────────────────────────────  │|
| │ 🟢 Tomato (Kg) - $5.00/Kg                                      │|
| │ 🟢 Cheese (Kg) - $12.00/Kg                        [Already ✓]  │|
| │ 🟡 Chicken (Kg) - $12.00/Kg                                    │|
| │ 🟢 Olive Oil (L) - $5.00/L                        [Already ✓]  │|
| │ 🟢 Mushrooms (Kg) - $8.00/Kg                                   │|
| └────────────────────────────────────────────────────────────────┘|
| Already mapped items are disabled with "Already ✓" label          |
+------------------------------------------------------------------+
```

---

## 6. Confirmation Modal (Only Use Case)

**DuplicateWarningModal** - Shown only when adding an ingredient that's already mapped:

```text
+--------------------------------------------------+
| ⚠️ Ingredient Already Mapped                      |
+==================================================+
|                                                   |
| "Cheese" is already mapped to this item.          |
|                                                   |
| Current quantity: 0.15 Kg                         |
|                                                   |
| Would you like to:                                |
| • Go to existing mapping to edit it               |
| • Cancel and choose a different ingredient        |
|                                                   |
+--------------------------------------------------+
| [Go to Existing]           [Cancel]               |
+--------------------------------------------------+
```

**SaveConfirmationModal** - Standard confirm changes (existing pattern):

```text
+--------------------------------------------------+
| 📋 Confirm Changes                                |
+==================================================+
| Review the changes before saving:                 |
|                                                   |
| Field           | Old Value    | New Value        |
|-----------------|--------------|------------------|
| Tomato Qty      | 0.2 Kg       | 0.25 Kg          |
| Cheese Extra    | $2.00        | $2.50            |
| Added           | -            | Mushrooms        |
| Removed         | Basil        | -                |
|                                                   |
+--------------------------------------------------+
|                        [Cancel]  [Confirm & Save] |
+--------------------------------------------------+
```

---

## 7. Component Architecture

### New Files to Create

```text
src/pages/ItemIngredientMapping.tsx       - Complete rewrite (summary grid)
src/pages/ItemIngredientMappingEdit.tsx   - Edit page for a specific item

src/components/item-mapping/
  ├── MappingSummaryTable.tsx             - Main table with expandable rows
  ├── MappingExpandedRow.tsx              - Expanded details sub-grid
  ├── IngredientMappingList.tsx           - Sortable ingredient list (edit page)
  ├── SubItemMappingList.tsx              - Sortable sub-items for combos
  ├── IngredientSearchPicker.tsx          - Inline search to add ingredients
  ├── SubItemSearchPicker.tsx             - Inline search to add sub-items
  └── DuplicateMappingWarning.tsx         - Warning modal for duplicates
```

### Files to Modify

```text
src/App.tsx                               - Add new routes
src/lib/i18n/translations.ts              - Add i18n keys
```

---

## 8. Data Display Summary

### Summary Counts (Main Grid)

| Item Type | Ingredients Column | Sub-Items Column |
|-----------|-------------------|------------------|
| Regular Item | Count of mapped ingredients | "-" |
| Combo Item | Aggregated count (sum from sub-items) | Count of sub-items |
| Non-Edible | "-" (no mappings) | "-" |

### Expanded View Details

| Section | Regular Items | Combo Items |
|---------|---------------|-------------|
| Ingredients | Direct mappings | Aggregated from all sub-items |
| Sub-Items | Hidden | List with quantities |
| Cost Breakdown | Ingredient total | Sub-item total + ingredient total |

---

## 9. Drag-and-Drop Priority

**Purpose:** Order determines display priority when customizing item on POS

**Behavior:**
- Dragging updates `sort_order` field in database
- Higher priority = appears first in POS customization screen
- Both ingredients and sub-items (for combos) are independently sortable

**Visual Indicator:**
```text
≡  ← Grip handle (visible on hover)
Priority automatically renumbers on save (1, 2, 3...)
```

---

## 10. i18n Keys to Add

```text
// Navigation & Headers
itemMapping.title: "Item-Ingredient Mapping"
itemMapping.editMapping: "Edit Mapping"
itemMapping.ingredients: "Ingredients"
itemMapping.subItems: "Sub-Items"
itemMapping.ingredientCount: "Ingredients"
itemMapping.subItemCount: "Sub-Items"

// Summary Grid
itemMapping.noMappings: "No mappings configured"
itemMapping.expandToView: "Click to expand"
itemMapping.aggregatedTotal: "Aggregated Total"
itemMapping.fromItems: "From Items"

// Edit Page
itemMapping.ingredientMappings: "Ingredient Mappings"
itemMapping.comboSubItems: "Combo Sub-Items"
itemMapping.addIngredient: "Add Ingredient"
itemMapping.addSubItem: "Add Sub-Item"
itemMapping.quantity: "Quantity"
itemMapping.canRemove: "Can Remove"
itemMapping.canAddExtra: "Can Add Extra"
itemMapping.extraCost: "Extra Cost"
itemMapping.ingredientCostTotal: "Ingredient Cost Total"
itemMapping.subItemsTotal: "Sub-Items Total"

// Search Picker
itemMapping.searchIngredients: "Search ingredients..."
itemMapping.searchItems: "Search items..."
itemMapping.alreadyMapped: "Already mapped"
itemMapping.selectToAdd: "Select to add"

// Validation & Warnings
itemMapping.duplicateWarning: "Ingredient Already Mapped"
itemMapping.duplicateDescription: "is already mapped to this item"
itemMapping.goToExisting: "Go to Existing"
itemMapping.quantityRequired: "Quantity is required"
itemMapping.minTwoSubItems: "Combo must have at least 2 sub-items"

// Drag & Drop
itemMapping.dragToReorder: "Drag to reorder priority"
itemMapping.priorityTooltip: "Priority determines order in POS customization screen"
```

---

## 11. Implementation Phases

### Phase 1: Foundation
1. Create MappingSummaryTable with expandable rows
2. Implement MappingExpandedRow component
3. Update main page with summary grid

### Phase 2: Edit Page
1. Create ItemIngredientMappingEdit page
2. Build IngredientMappingList with drag-and-drop
3. Build SubItemMappingList for combos
4. Add inline search pickers

### Phase 3: Validation & Polish
1. Add DuplicateMappingWarning modal
2. Integrate ConfirmChangesModal
3. Add all i18n translations
4. Implement transactional save

### Phase 4: Database Integration
1. Create/update database tables
2. Connect UI to Supabase queries
3. Add RLS policies

---

## 12. Key UX Principles Applied

| Principle | Implementation |
|-----------|----------------|
| Summary first, details on demand | Main grid shows counts, expand for details |
| CRUD on pages, not modals | Edit page for full control, modals only for confirmations |
| Scalability (100+ ingredients) | No matrix view, just counts and searchable lists |
| Progressive disclosure | Combo sections only visible for combo items |
| Drag-and-drop for priority | Intuitive reordering with visual feedback |
| Consistent patterns | Follows existing Item/Branch Add/Edit patterns |

