
# Items Table Redesign + Replacement Modal + Enhanced Save Summary

## Overview
Redesign the Items table to match the reference image with:
1. Add "Combo Price" column (showing 0 for now, editable later)
2. Remove "PCS" suffix from quantity controls
3. Replacement column: clickable button showing count (e.g., "3"), with X and eye (view) icons for each replacement
4. Replacement modal to add items under a parent item
5. Save Summary modal at 75% width with complete breakdown including replacements

---

## 1. Updated ItemTable Layout (Based on Reference Image)

### New Column Structure
```text
+─────────────────────────────────────────────────────────────────────────────────────────+
| ITEMS                                                                               [+] |
+═════════════════════════════════════════════════════════════════════════════════════════+
| Name           │ Replacement │     Quantity      │ Combo Price │    Actual Cost    │   |
|════════════════╪═════════════╪═══════════════════╪═════════════╪═══════════════════╪═══|
| Margherita     │    [+]      │  [−]  2  [+]      │      0      │ SAR 12.99 × 2     │ × |
| Pizza          │             │                   │             │ SAR 25.98         │   |
|────────────────┼─────────────┼───────────────────┼─────────────┼───────────────────┼───|
| Chicken Burger │    [+]      │  [−]  4  [+]      │      0      │ SAR 8.99 × 4      │ × |
|                │             │                   │             │ SAR 35.96         │   |
|────────────────┼─────────────┼───────────────────┼─────────────┼───────────────────┼───|
| Soft Drink     │    [+]      │  [−]  6  [+]      │      0      │ SAR 2.50 × 6      │ × |
|  → Cola (Def)  │   👁 ×      │                   │     +0      │                   │   |
|  → Sprite      │   👁 ×      │                   │   +SAR 1.00 │                   │   |
|  → Fanta       │   👁 ×      │                   │   +SAR 1.00 │                   │   |
|                │   3         │                   │             │ SAR 15.00         │   |
|────────────────┼─────────────┼───────────────────┼─────────────┼───────────────────┼───|
| French Fries   │    [+]      │  [−]  1  [+]      │      0      │ SAR 3.99 × 1      │ × |
|                │             │                   │             │ SAR 3.99          │   |
+════════════════╪═════════════╪═══════════════════╪═════════════╪═══════════════════╪═══+
|    ITEMS TOTAL │             │    ITEMS TOTAL    │   SAR 0.    │        SAR 80.93  │   |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

### Column Widths
| Column | Width | Alignment |
|--------|-------|-----------|
| Name | 25% | Left |
| Replacement | 12% | Center |
| Quantity | 20% | Center |
| Combo Price | 15% | Center |
| Actual Cost | 23% | Right |
| Remove (×) | 5% | Center |

---

## 2. Data Structure Updates

### Extended SubItemMappingItem Interface
```typescript
interface ReplacementItem {
  id: string;
  item_id: string;
  item_name: string;
  extra_cost: number;
  is_default: boolean;
}

interface SubItemMappingItem {
  id: string;
  sub_item_id: string;
  sub_item_name: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
  combo_price: number;           // NEW: Combo price for this item
  replacements: ReplacementItem[]; // NEW: Array of replacement options
}
```

---

## 3. ItemTable Component Updates

### Changes Required
1. Add "Combo Price" column header and cells
2. Remove "PCS" from QuantityControl (pass `unit={undefined}`)
3. Rename "Price" column to "Actual Cost"
4. Replacement column shows:
   - `[+]` button when no replacements
   - Count badge (e.g., "3") when replacements exist
   - Clicking opens ReplacementModal
5. Render replacement sub-rows indented under parent
6. Each replacement row has:
   - Eye icon (view/edit)
   - X icon (remove)
   - "(Def)" label if is_default
   - +SAR X.XX for extra cost
7. Footer shows "ITEMS TOTAL" on both left and center columns

### Table Header (new)
```jsx
<thead>
  <tr>
    <th className="w-[25%]">{t("common.name")}</th>
    <th className="w-[12%] text-center">{t("itemMapping.replacement")}</th>
    <th className="w-[20%] text-center">{t("itemMapping.quantity")}</th>
    <th className="w-[15%] text-center">{t("itemMapping.comboPrice")}</th>
    <th className="w-[23%] text-right">{t("itemMapping.actualCost")}</th>
    <th className="w-[5%]"></th>
  </tr>
</thead>
```

---

## 4. Replacement Sub-Rows Rendering

### Visual Structure
```text
Parent Row:
| Soft Drink     │    [+]      │  [−]  6  [+]      │      0      │ SAR 2.50 × 6     │ × |
|                │             │                   │             │ SAR 15.00        │   |

Replacement Rows (indented, no quantity/remove on parent):
|  → Cola (Def)  │   👁  ×     │                   │     +0      │                  │   |
|  → Sprite      │   👁  ×     │                   │   +SAR 1.00 │                  │   |
|  → Fanta       │   👁  ×     │                   │   +SAR 1.00 │                  │   |

Badge Row (replacement count):
|                │    3        │                   │             │                  │   |
```

### Replacement Row Rules
- Indented 16px with "→" prefix
- "(Def)" suffix for is_default = true
- Eye icon: opens edit modal
- X icon: removes this replacement (with confirmation)
- Combo Price shows "+0" or "+SAR X.XX"
- No Quantity or Actual Cost columns for replacement rows
- After all replacements, show count badge in Replacement column

---

## 5. ReplacementModal Component (New)

### Modal Specifications
```text
+────────────────────────────────────────────────────────────────────────+
│ Replacements for "Soft Drink"                                      ×  │
+════════════════════════════════════════════════════════════════════════+
│                                                                        │
│ Add Replacement                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Select item...                                               ▼    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [Selected: Sprite]                                                     │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Extra Cost    SAR [ 1.00      ]                                    │ │
│ │ Set as Default  [ ]                                                │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                       [Add Replacement]│
│                                                                        │
│────────────────────────────────────────────────────────────────────────│
│                                                                        │
│ Current Replacements (3)                                               │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ★ Cola           (Default)                          +0       👁  × │ │
│ │   Sprite                                      +SAR 1.00       👁  × │ │
│ │   Fanta                                       +SAR 1.00       👁  × │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
+════════════════════════════════════════════════════════════════════════+
│                                                             [Done]     │
+────────────────────────────────────────────────────────────────────────+
```

### Modal Width: 540px (matches other modals)

### Features
1. Searchable dropdown to select replacement item
2. Extra Cost input (SAR prefix, defaults to 0)
3. "Set as Default" checkbox
4. Add Replacement button (appends to list)
5. Current Replacements list:
   - ★ marker for default
   - Extra cost display
   - Eye icon (edit) and X icon (remove)
6. Done button closes modal

### Props
```typescript
interface ReplacementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentItemName: string;
  parentItemId: string;
  replacements: ReplacementItem[];
  onReplacementsChange: (replacements: ReplacementItem[]) => void;
  availableItems: AvailableItem[];
  currentLanguage: string;
}
```

---

## 6. QuantityControl Update

### Remove PCS Suffix
Current:
```jsx
<QuantityControl
  value={mapping.quantity}
  onChange={(qty) => onQuantityChange(mapping.id, qty)}
  min={1}
  step={1}
  unit="PCS"  // REMOVE THIS
/>
```

New:
```jsx
<QuantityControl
  value={mapping.quantity}
  onChange={(qty) => onQuantityChange(mapping.id, qty)}
  min={1}
  step={1}
  // No unit prop - removes PCS suffix
/>
```

---

## 7. Enhanced SaveSummaryModal (75% Width)

### Updated Modal Size
```jsx
<DialogContent className="sm:max-w-[75vw] p-0 gap-0">
```

### New Layout (Three Sections)
```text
+─────────────────────────────────────────────────────────────────────────────────────────+
│ Confirm Save                                                                        ×   │
+═════════════════════════════════════════════════════════════════════════════════════════+
│                                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────────────────────┐ │
│ │                              SUMMARY                                                │ │
│ ├─────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ Ingredients        │ 3 pcs           │                      │ SAR 3.05             │ │
│ │ Items              │ 4 lines         │ 8 replacements       │ SAR 80.93            │ │
│ ├─────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ Base Cost          │                 │                      │ SAR 83.98            │ │
│ │ Combo Price        │                 │                      │ SAR 45.99            │ │
│ │ Selling Price      │                 │                      │ SAR 50.59            │ │
│ │ Profit             │                 │                      │ SAR -33.39 🔴        │ │
│ └─────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                         │
│ ┌────────────────────────────────────┐ ┌────────────────────────────────────┐          │
│ │ INGREDIENTS (3)                    │ │ ITEMS (4)                          │          │
│ ├────────────────────────────────────┤ ├────────────────────────────────────┤          │
│ │ Tomato          0.2 KG   SAR 1.00  │ │ Margherita Pizza   ×2   SAR 25.98 │          │
│ │ Cheese          0.15 KG  SAR 1.80  │ │ Chicken Burger     ×4   SAR 35.96 │          │
│ │ Olive Oil       0.05 L   SAR 0.25  │ │ Soft Drink         ×6   SAR 15.00 │          │
│ │                                    │ │   → Cola (Def) +0                  │          │
│ │                                    │ │   → Sprite +1.00                   │          │
│ │                                    │ │   → Fanta +1.00                    │          │
│ │                                    │ │ French Fries       ×1   SAR 3.99  │          │
│ └────────────────────────────────────┘ └────────────────────────────────────┘          │
│                                                                                         │
+═════════════════════════════════════════════════════════════════════════════════════════+
│                                                        [Cancel]    [Confirm Save]       │
+─────────────────────────────────────────────────────────────────────────────────────────+
```

### Three-Column Detail View
1. **Summary Section** (top) - Financial overview
2. **Ingredients Section** (bottom-left) - All ingredient details
3. **Items Section** (bottom-right) - All items with their replacements

### Props Update
```typescript
interface SaveSummaryModalProps {
  // ... existing props ...
  ingredientMappings: IngredientMappingItem[];  // NEW: Full data for details
  itemMappings: SubItemMappingItem[];           // NEW: Full data with replacements
  totalReplacements: number;                     // NEW: Count of all replacements
}
```

---

## 8. Files to Create

| File | Purpose |
|------|---------|
| `src/components/item-mapping/ReplacementModal.tsx` | Modal for managing item replacements |

---

## 9. Files to Modify

| File | Changes |
|------|---------|
| `src/components/item-mapping/ItemTable.tsx` | Add Combo Price column, remove PCS, add replacement display with sub-rows |
| `src/components/item-mapping/SubItemMappingList.tsx` | Update interface with `combo_price` and `replacements` fields |
| `src/components/item-mapping/SaveSummaryModal.tsx` | Expand to 75% width, add detailed breakdown sections |
| `src/components/item-mapping/index.ts` | Export ReplacementModal |
| `src/pages/ItemIngredientMappingEdit.tsx` | Add replacement state management, update initial data |
| `src/lib/i18n/translations.ts` | Add new translation keys |

---

## 10. New Translation Keys

```typescript
// itemMapping section additions
actualCost: "Actual Cost",
replacements: "Replacements",
replacementsFor: "Replacements for \"{{item}}\"",
currentReplacements: "Current Replacements",
setAsDefault: "Set as Default",
default: "Default",
done: "Done",
viewReplacement: "View",
editReplacement: "Edit",
noReplacements: "No replacements added",
addFirstReplacement: "Click '+' to add replacement options",
replacementCount: "{{count}} replacements",
```

---

## 11. Implementation Flow

### Phase 1: Data Structure
1. Update `SubItemMappingItem` interface with `combo_price` and `replacements`
2. Update initial mock data with sample replacements

### Phase 2: ReplacementModal
1. Create new modal component
2. Implement searchable dropdown (reuse Popover+Command pattern)
3. Add extra cost input and default checkbox
4. Implement current replacements list with edit/remove

### Phase 3: ItemTable Redesign
1. Add Combo Price column
2. Remove "PCS" from QuantityControl
3. Rename Price to Actual Cost
4. Implement replacement button with count badge
5. Add replacement sub-rows rendering
6. Add eye/X icons for each replacement

### Phase 4: SaveSummaryModal Enhancement
1. Change width to 75vw
2. Add detailed ingredients section
3. Add detailed items section with replacements
4. Update summary to show replacement count

### Phase 5: State Management
1. Add replacement modal state to edit page
2. Wire up replacement CRUD handlers
3. Update cost calculations to include replacements

---

## 12. Density Compliance

| Rule | Compliance |
|------|------------|
| Row height 32px | ✓ All rows |
| Text 13px | ✓ All text |
| No PCS suffix | ✓ Removed |
| Combo Price column | ✓ Added |
| Actual Cost column | ✓ Renamed |
| Replacement count badge | ✓ Clickable |
| Sub-row indentation 16px | ✓ Arrow prefix |
| Eye + X icons 16px | ✓ strokeWidth 1.5 |
| Modal 75% width | ✓ SaveSummary only |
| Full detail breakdown | ✓ Both sections |
