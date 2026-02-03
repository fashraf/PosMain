

# ReplacementModal UI Redesign - Match AddItemModal Layout

## Overview
Redesign the ReplacementModal to use the same clean 2x2 grid form layout as AddItemModal, while keeping the current replacements list section below.

---

## Current State vs. Target

### Current Layout (Vertical sections)
```text
┌─────────────────────────────────────────────────────────┐
│ Replacements for "Soft Drink"                       ×   │
├─────────────────────────────────────────────────────────┤
│ Add Replacement                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Select item...                                   ▼  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Config card appears on selection with stacked fields]  │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│ Current Replacements (3)                                │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

### Target Layout (2x2 Grid - same as AddItemModal)
```text
┌─────────────────────────────────────────────────────────┐
│ Replacements for "Soft Drink"                       ×   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Select Item *                    Item Price             │
│ ┌───────────────────────┐       ┌───────────────────┐  │
│ │ Sprite             ▼  │       │ SAR 2.50          │  │
│ └───────────────────────┘       └───────────────────┘  │
│                                   (read-only)           │
│                                                         │
│ Extra Cost                       Set as Default         │
│ ┌───────────────────────┐       ┌───────────────────┐  │
│ │ SAR 1.00              │       │ ☐ Default         │  │
│ └───────────────────────┘       └───────────────────┘  │
│   (optional)                                            │
│                                                         │
│ → Sprite (+SAR 1.00)                   [Add Replacement]│
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ Current Replacements (3)                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ★ Cola         (Default)                  +0  👁 ×  │ │
│ │   Sprite                            +SAR 1.00  👁 ×  │ │
│ │   Fanta                             +SAR 1.00  👁 ×  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                              [Done]     │
└─────────────────────────────────────────────────────────┘
```

---

## Key Changes

### 1. Replace Vertical Form with 2x2 Grid
- **Row 1**: Select Item (dropdown) | Item Price (read-only)
- **Row 2**: Extra Cost (input) | Set as Default (checkbox aligned)
- Remove the conditional config card that only appears on selection
- Show all 4 fields always (Item Price shows "—" when nothing selected)

### 2. Form Field Structure
| Field | Position | Type | Notes |
|-------|----------|------|-------|
| Select Item | Row 1, Col 1 | Dropdown | Required (*), filters duplicates |
| Item Price | Row 1, Col 2 | Read-only input | Auto-fills on selection |
| Extra Cost | Row 2, Col 1 | Number input | SAR prefix, default 0 |
| Set as Default | Row 2, Col 2 | Checkbox | Aligned to input height |

### 3. Live Preview Line
- Show below the 2x2 grid when item is selected
- Format: `→ [Item Name] (+SAR X.XX)`
- Green (`#22C55E`) when cost > 0, muted otherwise
- Right-aligned "Add Replacement" button on same line

### 4. Keep Current Replacements Section
- Separator line after the form area
- "Current Replacements (n)" heading
- Existing replacement list with Star, Eye, X icons
- Empty state when no replacements

---

## Visual Specifications

### 2x2 Grid Layout
```css
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 16px; /* gap-4 */
}
```

### Field Styling (matching AddItemModal)
- Labels: 13px, font-medium
- Input height: 36px (h-9)
- Read-only: bg-muted, cursor-not-allowed
- Extra cost green tint: bg-[#F0FDF4] border-[#BBF7D0] when > 0
- Required asterisk: text-destructive

### Checkbox Alignment
```tsx
<div className="space-y-1.5">
  <label className="text-[13px] font-medium">
    {t("itemMapping.setAsDefault")}
  </label>
  <div className="flex items-center gap-2 h-9">
    <Checkbox id="default" ... />
    <label htmlFor="default">{t("itemMapping.default")}</label>
  </div>
</div>
```

---

## Implementation Details

### Modified JSX Structure
```tsx
<div className="px-5 py-5">
  {/* 2x2 Grid Form - Always visible */}
  <div className="grid grid-cols-2 gap-4">
    {/* Row 1: Select Item */}
    <div className="space-y-1.5">
      <label>Select Item *</label>
      <Popover>...</Popover>
    </div>
    
    {/* Row 1: Item Price (read-only) */}
    <div className="space-y-1.5">
      <label>Item Price</label>
      <Input readOnly value={selectedItem?.base_cost} />
    </div>
    
    {/* Row 2: Extra Cost */}
    <div className="space-y-1.5">
      <label>Extra Cost (optional)</label>
      <Input type="number" value={extraCost} ... />
    </div>
    
    {/* Row 2: Set as Default */}
    <div className="space-y-1.5">
      <label>Set as Default</label>
      <div className="flex items-center gap-2 h-9">
        <Checkbox checked={isDefault} ... />
        <label>Default</label>
      </div>
    </div>
  </div>

  {/* Live Preview + Add Button (when item selected) */}
  {selectedItem && (
    <div className="flex items-center justify-between mt-4">
      <div className={cn("flex items-center gap-2 text-[13px]", ...)}>
        <ArrowRight size={14} />
        <span>{selectedItem.name}</span>
        <span>(+SAR {extraCost})</span>
      </div>
      <Button onClick={handleAddReplacement}>
        {t("itemMapping.addReplacement")}
      </Button>
    </div>
  )}

  {/* Separator */}
  <div className="border-t border-border mt-5 pt-4" />

  {/* Current Replacements List */}
  <div className="space-y-3">
    <div className="text-[13px] font-medium">
      Current Replacements ({replacements.length})
    </div>
    {/* ... existing list rendering ... */}
  </div>
</div>
```

---

## File to Modify

| File | Changes |
|------|---------|
| `src/components/item-mapping/ReplacementModal.tsx` | Replace vertical layout with 2x2 grid, add Item Price field, keep replacements list |

---

## Density Compliance

| Rule | Target | Compliance |
|------|--------|------------|
| Grid layout | 2 columns | ✓ |
| Label size | 13px | ✓ |
| Input height | 36px (h-9) | ✓ |
| Grid gap | 16px | ✓ |
| Read-only bg | bg-muted | ✓ |
| Green tint (cost > 0) | #F0FDF4 | ✓ |
| Required asterisk | text-destructive | ✓ |
| Checkbox aligned to h-9 | ✓ |
| Live preview below grid | ✓ |
| Replacements list preserved | ✓ |

