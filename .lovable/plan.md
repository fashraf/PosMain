

# High-Density Profit-First Combo/Ingredient Mapping UI

## Overview
Complete redesign of the Item-Ingredient Mapping Edit page following strict SaaS density rules. This plan replaces cards with flat tables, enforces 32px row heights, uses border-only separators, implements modal-only add flows, and adds a live profit summary.

---

## 1. Design System Overrides

### New CSS Variables (src/index.css)
```css
:root {
  /* Exact palette from spec */
  --sidebar-bg: #F3F0FF;
  --main-bg: #F9FAFB;
  --primary: #8B5CF6;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
  --success: #22C55E;
  --danger: #EF4444;
  --warning: #F59E0B;
}

/* Global density enforcement */
.density-ui * {
  margin: 0;
}
.density-ui {
  --row-height: 32px;
  --padding-sm: 4px;
  --padding-md: 6px;
  --padding-lg: 8px;
}
```

### Component Rules
- Max border-radius: 6px (use `rounded-[6px]`)
- No shadows, no elevations
- Tables beat cards 95% of the time
- Icons: lucide-react only, strokeWidth={1.5}, size 16-18px

---

## 2. Page Layout Structure

### Wireframe
```text
+------------------------------------------------------------------+
| ← Family Combo                          [Cancel] [Save Changes]   |
+==================================================================+
| Type: Combo | Base: SAR 45.99                                     |
+------------------------------------------------------------------+
|              LIVE COST SUMMARY (sticky right)                     |
|       Combo Price: 45.99  Cost: 22.00  Sell: 48.00  Profit: 26.00 |
+------------------------------------------------------------------+

+-------------------------------┬----------------------------------+
| INGREDIENTS                   │ ITEMS                             |
| [+ icon only]                 │ [+ icon only]                     |
+-------------------------------┼----------------------------------+
| Name          │ Qty   │ Cost │ × │ Name          │ Qty │ Price │ × │
|───────────────┼───────┼──────┼───│───────────────┼─────┼───────┼───│
| Tomato        │ ⊖ 0.2 ⊕│ 1.00 │ × │ Margherita    │ ⊖ 2 ⊕│ 25.98 │ × │
| Cheese        │ ⊖ 0.15⊕│ 1.80 │ × │   → Medium    │     │ +2.00 │   │
| Olive Oil     │ ⊖ 0.05⊕│ 0.25 │ × │   → Large ★   │     │ +4.00 │   │
+-------------------------------┼──────────────────────────────────+
| TOTAL         │       │ 3.05 │   │ Chicken Burger│ ⊖ 4 ⊕│ 35.96 │ × │
+-------------------------------┴----------------------------------+
|               │       │      │   │ TOTAL         │     │ 61.94 │   │
+-------------------------------┴----------------------------------+
Row height: 32px | Borders only (#E5E7EB) | Zero gaps
```

---

## 3. Component Architecture

### Files to Create
```text
src/components/item-mapping/
  ├── IngredientTable.tsx          - Flat table, 32px rows
  ├── ItemTable.tsx                - Flat table for combo items
  ├── AddIngredientModal.tsx       - Full modal with 4 steps
  ├── AddItemModal.tsx             - Full modal with 4 steps
  ├── RemoveConfirmModal.tsx       - Small danger modal
  ├── LiveCostSummary.tsx          - Sticky profit bar
  ├── SaveSummaryModal.tsx         - Final save confirmation
  └── QuantityControl.tsx          - Compact ⊖ [val] ⊕ inline
```

### Files to Modify
```text
src/pages/ItemIngredientMappingEdit.tsx - Complete rewrite
src/index.css                           - Add density classes
```

---

## 4. Ingredient Table Component

### Structure (32px rows, flat, borders only)
```text
+------------------------------------------------------------------+
| INGREDIENTS                                              [+]      |
+==================================================================+
| Name              │ Qty           │ Cost       │ ×                |
|═══════════════════╪═══════════════╪════════════╪══════════════════|
| Tomato            │ ⊖ [0.2]  ⊕ KG │ SAR 1.00   │ ×                |
| Cheese            │ ⊖ [0.15] ⊕ KG │ SAR 1.80   │ ×                |
| Olive Oil         │ ⊖ [0.05] ⊕ L  │ SAR 0.25   │ ×                |
+-------------------+---------------+------------+------------------+
| TOTAL                             │ SAR 3.05   │                  |
+------------------------------------------------------------------+
```

### Row Specifications
- Height: 32px exactly (`h-8`)
- Padding: 4-6px (`px-1.5 py-1`)
- Font: 13px (`text-[13px]`)
- Zebra: alternating #FFFFFF / #F9FAFB
- Border: 1px solid #E5E7EB
- Remove icon: × (X icon), #6B7280 → #EF4444 on hover
- Quantity controls: inline, 16px icons

### Code Structure
```typescript
interface IngredientRow {
  id: string;
  name: string;
  quantity: number;
  unit: "KG" | "L" | "PCS";
  unit_cost: number;
  calculated_cost: number;
}

// Row height enforced via className="h-8"
// No padding > 8px anywhere
// Icons: size={16} strokeWidth={1.5}
```

---

## 5. Item Table Component (Combo-Only)

### Structure with Variant Indentation
```text
+------------------------------------------------------------------+
| ITEMS                                                    [+]      |
+==================================================================+
| Name                    │ Qty       │ Price      │ ×              |
|═════════════════════════╪═══════════╪════════════╪════════════════|
| Coffee (Default: Small) │ ⊖ [2] ⊕   │ SAR 10.00  │ ×              |
|   → Medium              │           │ +SAR 2.00  │                |
|   → Large ★             │           │ +SAR 4.00  │                |
| Chicken Burger          │ ⊖ [4] ⊕   │ SAR 35.96  │ ×              |
+-------------------------+-----------+------------+----------------+
| TOTAL                               │ SAR 45.96  │                |
+------------------------------------------------------------------+
```

### Variant Row Rules
- Indentation: 16-20px (`pl-4` or `pl-5`)
- Default marked with ★ or bold
- Extra cost displayed as "+SAR X.XX" (or "+0" if none)
- Variant rows have NO quantity controls, NO remove icon
- Only parent items are removable

---

## 6. Add Ingredient Modal (4-Step Flow)

### Modal Layout (Large, Centered)
```text
+------------------------------------------------------------------+
| Add Ingredient                                              [×]   |
+==================================================================+
|                                                                   |
| Step 1: Select Ingredient                                         |
| ┌────────────────────────────────────────────────────────────────┐|
| │ 🔍 Search ingredients...                                       │|
| │ ──────────────────────────────────────────────────────────────│|
| │ ○ Tomato (KG) - SAR 5.00/KG                                    │|
| │ ○ Cheese (KG) - SAR 12.00/KG                   [Already Added] │|
| │ ● Mushrooms (KG) - SAR 8.00/KG                                 │|
| │ ○ Chicken (KG) - SAR 12.00/KG                                  │|
| └────────────────────────────────────────────────────────────────┘|
|                                                                   |
| Step 2: Preview (Read-Only)                                       |
| ┌────────────────────────────────────────────────────────────────┐|
| │ Name: Mushrooms                                                │|
| │ Unit: KG                                                       │|
| │ Base Cost: SAR 8.00/KG                                         │|
| │ Stock: 15 KG (Healthy)                                         │|
| └────────────────────────────────────────────────────────────────┘|
|                                                                   |
| Step 3: Configure                                                 |
| ┌──────────────────────┬─────────────────────────────────────────┐|
| │ Quantity             │ [0.2      ] KG                          │|
| │ Extra Cost (optional)│ SAR [0.00    ]                          │|
| └──────────────────────┴─────────────────────────────────────────┘|
|                                                                   |
+==================================================================+
| [Cancel]                                              [Confirm]   |
+------------------------------------------------------------------+
```

### Behavior
1. Dropdown filters out already-added ingredients instantly
2. Selection enables preview block
3. Quantity defaults to 1, Extra Cost defaults to 0
4. On Confirm → append row instantly, close modal
5. On Cancel → discard completely, no trace

---

## 7. Add Item Modal (Combo-Only)

### Same 4-Step Pattern
```text
+------------------------------------------------------------------+
| Add Item                                                    [×]   |
+==================================================================+
|                                                                   |
| Step 1: Select Item                                               |
| ┌────────────────────────────────────────────────────────────────┐|
| │ 🔍 Search items...                                             │|
| │ ──────────────────────────────────────────────────────────────│|
| │ ○ Margherita Pizza - SAR 12.99                 [Already Added] │|
| │ ● French Fries - SAR 3.99                                      │|
| │ ○ Soft Drink - SAR 2.50                                        │|
| └────────────────────────────────────────────────────────────────┘|
|                                                                   |
| Step 2: Preview                                                   |
| ┌────────────────────────────────────────────────────────────────┐|
| │ Name: French Fries                                             │|
| │ Base Cost: SAR 3.99                                            │|
| │ Type: Non-Combo                                                │|
| └────────────────────────────────────────────────────────────────┘|
|                                                                   |
| Step 3: Configure                                                 |
| ┌──────────────────────┬─────────────────────────────────────────┐|
| │ Quantity             │ [2        ] PCS                         │|
| │ Extra Cost (optional)│ SAR [0.00    ]                          │|
| └──────────────────────┴─────────────────────────────────────────┘|
|                                                                   |
+==================================================================+
| [Cancel]                                              [Confirm]   |
+------------------------------------------------------------------+
```

---

## 8. Remove Confirmation Modal (Danger)

### Small, Focused
```text
+------------------------------------------+
| Remove "Cheese"?                          |
+==========================================+
|                                          |
| This ingredient will be removed from     |
| the mapping.                             |
|                                          |
+------------------------------------------+
| [Cancel]              [Remove]           |
+------------------------------------------+
              ↑ bg: #EF4444, white text
```

---

## 9. Live Cost Summary (Sticky Bar)

### Position: Top-right or bottom bar, always visible
```text
┌──────────────────────────────────────────────────────────────────┐
│ Combo Price: 45.99 │ Cost: 22.00 │ Sell: 48.00 │ Profit: 26.00 🟢│
└──────────────────────────────────────────────────────────────────┘
```

### Profit Color Coding
- Positive: #22C55E (green)
- Zero: #F59E0B (orange/warning)
- Negative: #EF4444 (red)

### Live Update Triggers
- Quantity change (ingredient or item)
- Add/remove ingredient or item
- Variant selection change

---

## 10. Final Save Summary Modal

### Pre-Save Confirmation
```text
+------------------------------------------------------------------+
| Confirm Save                                                [×]   |
+==================================================================+
|                                                                   |
| ┌────────────────────────────────────────────────────────────────┐|
| │ Ingredients     │ 3 pcs              │ SAR 8.50               │|
| │ Items           │ 4 lines            │ SAR 13.50              │|
| ├─────────────────┼────────────────────┼────────────────────────┤|
| │ Base Cost       │                    │ SAR 22.00              │|
| │ Combo Price     │                    │ SAR 24.00              │|
| │ Selling Price   │                    │ SAR 26.00              │|
| │ Profit          │                    │ SAR 4.00 🟢            │|
| └────────────────────────────────────────────────────────────────┘|
|                                                                   |
+==================================================================+
| [Cancel]                                    [Confirm Save]        |
+------------------------------------------------------------------+
                                                    ↑ wide, primary
```

---

## 11. Quantity Control Component

### Inline, Compact Design
```text
⊖ [0.20] ⊕ KG
↑    ↑    ↑  ↑
│    │    │  └─ Unit suffix (text-secondary)
│    │    └─── Increment (+) icon, 16px
│    └──────── Input, w-12, h-6, text-center, border
└───────────── Decrement (-) icon, 16px
```

### Code
```typescript
<div className="flex items-center gap-0.5">
  <button className="p-0.5 hover:text-primary">
    <Minus size={16} strokeWidth={1.5} />
  </button>
  <input 
    type="number" 
    className="w-12 h-6 text-center border border-[#E5E7EB] rounded-[4px] text-[13px]" 
  />
  <button className="p-0.5 hover:text-primary">
    <Plus size={16} strokeWidth={1.5} />
  </button>
  <span className="text-[13px] text-[#6B7280] ml-1">KG</span>
</div>
```

---

## 12. Implementation Details

### Table CSS Classes
```css
.density-table {
  border-collapse: collapse;
  width: 100%;
}
.density-table th,
.density-table td {
  height: 32px;
  padding: 4px 6px;
  border: 1px solid #E5E7EB;
  font-size: 13px;
}
.density-table th {
  background: #F9FAFB;
  font-weight: 500;
  text-align: left;
}
.density-table tr:nth-child(even) {
  background: #F9FAFB;
}
.density-table tr:nth-child(odd) {
  background: #FFFFFF;
}
/* Numbers right-aligned */
.density-table .text-right {
  text-align: right;
}
```

### Remove Card Patterns
Current:
```jsx
<Card className="bg-card border rounded-lg p-4">
```
New:
```jsx
<table className="density-table">
```

---

## 13. Header Redesign

### Current (Too Spacious)
```text
| ← Edit Mapping: Margherita Pizza           [Save Changes] |
```

### New (Compact, 32px)
```text
+------------------------------------------------------------------+
| ← Family Combo               Type: Combo │ Base: SAR 45.99  [Save]|
+------------------------------------------------------------------+
Height: 32-36px | Icon-only back button | Inline metadata
```

---

## 14. Two-Column Split (50/50)

### Layout Rules
- Shared vertical border in middle
- NO gap between columns
- Border-only separation, no shadow
- Headers at same visual level

```jsx
<div className="grid grid-cols-2 divide-x divide-[#E5E7EB]">
  <div className="p-0">
    {/* Ingredients Table */}
  </div>
  <div className="p-0">
    {/* Items Table */}
  </div>
</div>
```

---

## 15. Terminology Enforcement

| Old Term | New Term |
|----------|----------|
| Ingredient Mapping | Ingredients |
| Combo Sub-Items | Items |
| Delete | Remove |
| Save Mapping | Save Changes |
| Sub-Items | Items |

---

## 16. Icon Specifications

All icons: lucide-react, strokeWidth={1.5}, size 16-18px

| Action | Icon | Hover Color |
|--------|------|-------------|
| Add | Plus | #8B5CF6 |
| Remove | X | #EF4444 |
| Increment | Plus (small) | #8B5CF6 |
| Decrement | Minus (small) | #8B5CF6 |
| Back | ArrowLeft | default |
| Save | Check | #FFFFFF (on primary) |

---

## 17. Implementation Phases

### Phase 1: CSS Foundation
1. Add density CSS variables to index.css
2. Create `.density-table` and `.density-ui` classes
3. Update border and radius defaults

### Phase 2: Core Components
1. Create `QuantityControl` component
2. Create `IngredientTable` (flat table, 32px rows)
3. Create `ItemTable` with variant indentation
4. Create `LiveCostSummary` sticky bar

### Phase 3: Modal System
1. Create `AddIngredientModal` (4-step flow)
2. Create `AddItemModal` (4-step flow)
3. Create `RemoveConfirmModal` (small danger)
4. Create `SaveSummaryModal` (final confirmation)

### Phase 4: Page Assembly
1. Rewrite `ItemIngredientMappingEdit.tsx`
2. Wire up all state and handlers
3. Implement live cost calculations

### Phase 5: Polish
1. Tooltips on all action icons
2. Keyboard accessibility
3. Responsive (mobile single-column stack)

---

## 18. Files Summary

### New Files (8)
```text
src/components/item-mapping/IngredientTable.tsx
src/components/item-mapping/ItemTable.tsx
src/components/item-mapping/AddIngredientModal.tsx
src/components/item-mapping/AddItemModal.tsx
src/components/item-mapping/RemoveConfirmModal.tsx
src/components/item-mapping/LiveCostSummary.tsx
src/components/item-mapping/SaveSummaryModal.tsx
src/components/item-mapping/QuantityControl.tsx
```

### Modified Files (3)
```text
src/pages/ItemIngredientMappingEdit.tsx - Complete rewrite
src/index.css - Add density classes
src/lib/i18n/translations.ts - SAR currency, new terms
```

### Files to Remove/Deprecate
```text
src/components/item-mapping/IngredientCard.tsx - Replace with table rows
src/components/item-mapping/ItemCard.tsx - Replace with table rows
```

---

## 19. Validation & Safety

### Client-Side Rules
- Every remove action → confirmation modal
- Duplicate check on save → warning modal
- Quantity minimum: 0.01 (ingredient), 1 (item)
- No negative values allowed

### Server-Side Mirror
- Same validation rules
- Transactional save (all or nothing)
- Duplicate detection
- Combo type enforcement

---

## 20. Density Checklist

| Rule | Compliance |
|------|------------|
| Zero default margins | ✅ Global reset |
| Padding ≤ 8px | ✅ Max p-2 (8px) |
| Border separators | ✅ No whitespace gaps |
| No card-in-card | ✅ Flat tables only |
| Row height 32px | ✅ h-8 enforced |
| Tables > Cards | ✅ 100% tables |
| Icons 16-18px | ✅ size={16} |
| strokeWidth 1.5 | ✅ All icons |
| border-radius ≤ 6px | ✅ rounded-[6px] max |
| No shadows | ✅ shadow-none |

---

This plan delivers a profit-first, high-density SaaS interface that prioritizes clarity, speed, and zero wasted space. Every pixel serves a purpose.

