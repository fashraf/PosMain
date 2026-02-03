

# Add Ingredient / Add Item & Replacement Modal Refinement Plan

## Overview
Refine the existing modals to match the reference image's clean, compact 2-column form layout while maintaining the density-first, premium aesthetic. The current modals use a vertical flowing layout but the reference shows a more compact horizontal 2-column grid approach.

---

## Current State vs. Target

### Current Modal Structure (Vertical Flow)
```text
┌─────────────────────────────────────┐
│ Add Ingredient                      │
├─────────────────────────────────────┤
│ Select Ingredient *                 │
│ ┌─────────────────────────────────┐ │
│ │ Select ingredient...        ▼   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Preview Block - appears on select] │
│                                     │
│ Quantity          Extra Cost        │
│ ┌──────────┐      ┌──────────┐     │
│ │ 1        │      │ 0.00     │     │
│ └──────────┘      └──────────┘     │
├─────────────────────────────────────┤
│            [Cancel] [Confirm]       │
└─────────────────────────────────────┘
```

### Target Layout (Reference Image - 2x2 Grid)
```text
┌─────────────────────────────────────────────────────┐
│ Add Item                                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Select Item *              Item Price               │
│ ┌──────────────────┐      ┌──────────────────┐     │
│ │ Select...      ▼ │      │ (auto-filled)    │     │
│ └──────────────────┘      └──────────────────┘     │
│                                                     │
│ Quantity                   Extra Cost               │
│ ┌──────────────────┐      ┌──────────────────┐     │
│ │ 1                │      │ 0.00             │     │
│ └──────────────────┘      └──────────────────┘     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                        [Save]       │
└─────────────────────────────────────────────────────┘
```

---

## 1. AddIngredientModal Refinements

### Layout Changes
- Switch from vertical flow to **2x2 grid layout**
- Row 1: `Select Ingredient` (dropdown) | `Unit Price` (read-only, auto-filled)
- Row 2: `Quantity` (input) | `Extra Cost` (input)
- Remove separate preview card (price shows inline)
- Single action button: "Save" (not "Confirm")

### Visual Specifications
```text
Width: 480px (current)
Padding: 20px outer, 16px between form groups
Row height: ~48px (label 13px + input 36px)
Grid gap: 16px horizontal, 20px vertical
Background: #FFFFFF
Border: 1px #E5E7EB
Border-radius: 8px (modal), 6px (inputs)
```

### Form Fields
| Field | Type | Notes |
|-------|------|-------|
| Select Ingredient | Dropdown (Popover+Command) | Required (*), filters out mapped |
| Unit Price | Read-only input | Auto-fills: "SAR X.XX/Unit", bg-muted |
| Quantity | Number input | Default 1, min 0.01 for kg/l, min 1 for pcs |
| Extra Cost | Number input | Default 0, green tint when >0 |

### Header
- Title: "Add Ingredient" (16px, font-semibold)
- No subtitle needed
- Close X (top-right, 18px, #6B7280 → #EF4444 hover)
- Border-bottom: 1px #E5E7EB

### Footer
- Background: #F9FAFB
- Border-top: 1px #E5E7EB
- Single button: "Save" (right-aligned)
  - bg-[#1F2937] (dark gray/black as in image), text-white
  - Hover: slightly lighter
  - Disabled: bg-muted, cursor-not-allowed

---

## 2. AddItemModal Refinements

### Same Layout as AddIngredientModal
- Row 1: `Select Item` (dropdown) | `Item Price` (read-only)
- Row 2: `Quantity` (input) | `Extra Cost` (input)
- Single "Save" button

### Dropdown Filtering
- Filter out: current item (if editing combo), already mapped items
- No combo items in list
- Show: `[Name] - SAR [Price]` per row

---

## 3. ReplacementModal Refinements

### Current Structure (Working Well)
The ReplacementModal already has good structure:
- Add replacement section with dropdown + config
- Current replacements list
- Done button

### Minor Refinements Needed
1. **2-Column Layout for Inputs**
   - Move "Extra Cost" and "Set as Default" to same row
   - More compact config section

2. **Improved Empty State**
   - Smaller text, subtle
   - Icon: Plus outline

3. **Action Alignment**
   - "Add Replacement" button right-aligned in config section

4. **Live Preview Line**
   - Add: `→ [Item Name] (+SAR X.XX)` below config before Add button
   - Color: #22C55E if cost >0, else #6B7280

---

## 4. Shared Visual Standards

### Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Modal title | 16px | 600 | #1F2937 |
| Field labels | 13px | 500 | #374151 |
| Input text | 14px | 400 | #1F2937 |
| Placeholder | 14px | 400 | #9CA3AF |
| Helper text | 12px | 400 | #6B7280 |

### Colors (Exact)
| Use | Color |
|-----|-------|
| Background | #FFFFFF |
| Input border | #E5E7EB |
| Input focus ring | #8B5CF6 (2px) |
| Required asterisk | #EF4444 |
| Read-only bg | #F9FAFB |
| Extra cost >0 bg | #F0FDF4 |
| Extra cost >0 border | #BBF7D0 |
| Success text | #22C55E |
| Danger hover | #EF4444 |
| Primary button bg | #1F2937 |
| Cancel button | ghost, #6B7280 |

### Input Styling
```css
.form-input {
  height: 36px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  transition: border-color 150ms, box-shadow 150ms;
}
.form-input:focus {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  outline: none;
}
.form-input:read-only {
  background: #F9FAFB;
  cursor: not-allowed;
}
```

---

## 5. Updated AddIngredientModal Structure

```text
┌─────────────────────────────────────────────────────┐
│ Add Ingredient                                  ×   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Select Ingredient *              Unit Price         │
│ ┌───────────────────────┐       ┌───────────────┐  │
│ │ Tomato (Kg)       ▼   │       │ SAR 5.00/Kg   │  │
│ └───────────────────────┘       └───────────────┘  │
│                                   (read-only)       │
│                                                     │
│ Quantity *                       Extra Cost         │
│ ┌───────────────────────┐       ┌───────────────┐  │
│ │ 0.2                   │       │ 1.50          │  │
│ └───────────────────────┘  Kg   └───────────────┘  │
│                                   (optional)        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                         [Save]      │
└─────────────────────────────────────────────────────┘
```

### Component Code Pattern
```tsx
<div className="grid grid-cols-2 gap-4">
  {/* Select Ingredient */}
  <div className="space-y-1.5">
    <label className="text-[13px] font-medium">
      {t("itemMapping.selectIngredient")} <span className="text-red-500">*</span>
    </label>
    <Popover>...</Popover>
  </div>
  
  {/* Unit Price (read-only) */}
  <div className="space-y-1.5">
    <label className="text-[13px] font-medium">
      {t("itemMapping.unitPrice")}
    </label>
    <Input 
      value={selectedIngredient ? `SAR ${selectedIngredient.cost_per_unit.toFixed(2)}/${selectedIngredient.unit}` : ""} 
      readOnly 
      className="bg-muted cursor-not-allowed"
    />
  </div>
  
  {/* Quantity */}
  <div className="space-y-1.5">
    <label className="text-[13px] font-medium">
      {t("itemMapping.quantity")} <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center gap-2">
      <Input type="number" ... />
      <span className="text-[13px] text-muted-foreground">{selectedIngredient?.unit}</span>
    </div>
  </div>
  
  {/* Extra Cost */}
  <div className="space-y-1.5">
    <label className="text-[13px] font-medium">
      {t("itemMapping.extraCost")}
    </label>
    <Input 
      type="number" 
      className={cn(extraCost > 0 && "bg-[#F0FDF4] border-[#BBF7D0]")}
      ...
    />
    <span className="text-[12px] text-muted-foreground">{t("common.optional")}</span>
  </div>
</div>
```

---

## 6. Updated AddItemModal Structure

```text
┌─────────────────────────────────────────────────────┐
│ Add Item                                        ×   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Select Item *                    Item Price         │
│ ┌───────────────────────┐       ┌───────────────┐  │
│ │ French Fries       ▼  │       │ SAR 3.99      │  │
│ └───────────────────────┘       └───────────────┘  │
│                                   (read-only)       │
│                                                     │
│ Quantity *                       Extra Cost         │
│ ┌───────────────────────┐       ┌───────────────┐  │
│ │ 1                     │       │ 0.00          │  │
│ └───────────────────────┘       └───────────────┘  │
│                                   (optional)        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                         [Save]      │
└─────────────────────────────────────────────────────┘
```

---

## 7. Updated ReplacementModal Structure

```text
┌─────────────────────────────────────────────────────────┐
│ Replacements for "Soft Drink"                       ×   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Add Replacement                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Select item...                                   ▼  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [When item selected:]                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Extra Cost               Set as Default             │ │
│ │ SAR ┌─────────┐          ☐ Default                  │ │
│ │     │ 0.00    │                                     │ │
│ │     └─────────┘                                     │ │
│ │                                                     │ │
│ │ → Sprite (+SAR 0.00)                                │ │
│ │                                [Add Replacement]    │ │
│ └─────────────────────────────────────────────────────┘ │
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

### Key Additions
1. **Live Preview Line**: `→ [Item Name] (+SAR X.XX)` shown before Add button
2. **Compact 2-column config**: Extra Cost and Default checkbox side by side
3. **Inline Add Replacement button** (right-aligned within config card)

---

## 8. Files to Modify

| File | Changes |
|------|---------|
| `AddIngredientModal.tsx` | 2x2 grid layout, read-only price field, Save button |
| `AddItemModal.tsx` | Same 2x2 grid layout, match reference image |
| `ReplacementModal.tsx` | Add live preview line, compact config layout |
| `translations.ts` | Add: `unitPrice`, `itemPrice`, `save` |

---

## 9. New Translation Keys

```typescript
// itemMapping additions
unitPrice: "Unit Price",
itemPrice: "Item Price", 
save: "Save",
addIngredientToCombo: "Add Ingredient to Combo",
addItemToCombo: "Add Item to Combo",
```

---

## 10. Density Compliance Checklist

| Rule | Target | Compliance |
|------|--------|------------|
| Modal padding | 20px outer | ✓ |
| Label size | 13px | ✓ |
| Input height | 36px | ✓ |
| Row gap | 16-20px | ✓ |
| Border radius | 6-8px | ✓ |
| Border color | #E5E7EB | ✓ |
| Focus ring | #8B5CF6 | ✓ |
| Green tint (extra >0) | #F0FDF4 | ✓ |
| Required asterisk | Red (#EF4444) | ✓ |
| Read-only bg | #F9FAFB | ✓ |
| Button bg | Dark (#1F2937) | ✓ |
| No shadows inside | Only modal outer | ✓ |

---

## 11. Implementation Summary

### Changes per Modal

**AddIngredientModal.tsx:**
- Replace vertical layout with `grid grid-cols-2 gap-4`
- Add read-only "Unit Price" field (auto-filled on select)
- Remove preview card (redundant with inline price)
- Change "Confirm" to "Save" with dark bg
- Add required asterisk on Select and Quantity

**AddItemModal.tsx:**
- Same 2x2 grid refactor
- Add read-only "Item Price" field
- Remove preview card
- "Save" button styling

**ReplacementModal.tsx:**
- Add live preview line: `→ {selectedName} (+SAR {extraCost})`
- Compact the Extra Cost + Default checkbox to single row
- Ensure "Add Replacement" is inside the config card

All changes maintain the existing functionality while achieving the compact, premium, lovable aesthetic from the reference image.

