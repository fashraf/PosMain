
# Redesign Ingredient & Item Modals + Grids (UI Prototype)

## Overview

The current Add Ingredient and Add Item modals are minimal 2x2 grid forms (480px wide). The spec requires larger modals (50%+ screen width) with structured sections, mutually exclusive toggles (Can Add Extra vs Can Remove), auto-fetched read-only prices, tooltips on all fields, and enhanced grid views with additional columns.

## Current State vs Required

### Add Ingredient Modal
| Area | Current | Required |
|------|---------|----------|
| Size | 480px | 50%+ screen width (~600px+) |
| Fields | Ingredient, Unit Price, Quantity, Extra Cost | Ingredient, Unit Price, Default Quantity, Can Add Extra, Extra Cost, Can Remove |
| Toggle Logic | None | Can Add Extra and Can Remove are mutually exclusive |
| Tooltips | None | On all fields |
| Sections | Flat 2x2 grid | Section 1: Ingredient Selection, Section 2: Quantity & Rules |

### Add Item Modal
| Area | Current | Required |
|------|---------|----------|
| Size | 480px | 50%+ screen width |
| Fields | Item, Price, Quantity, Extra Cost | Item, Price, Default Quantity, Can Add Extra, Extra Cost, Can Remove, Replacement Item |
| Toggle Logic | None | Mutually exclusive Can Add Extra / Can Remove |
| Replacement | Separate modal | Inline dropdown inside same modal |
| Tooltips | None | On all fields |
| Validation | Basic | Cannot replace item with itself |

### Ingredient Grid (inside Item Master)
| Area | Current | Required |
|------|---------|----------|
| Columns | Name, Quantity, Cost, Delete | Name, Quantity, Can Add, Can Remove, Extra Cost, Edit, Delete |
| Edit | Inline only | Opens modal pre-filled |
| Badges | None | Visual badges for Addable, Removable |

### Item Grid (inside Item Master)
| Area | Current | Required |
|------|---------|----------|
| Columns | Name, Replacement, Qty, Combo Price, Actual, Delete | Name, Replacement Item, Qty, Combo Price, Actual Price, Can Add, Can Remove, Edit, Delete |
| Edit | Not supported | Opens modal pre-filled |
| Badges | None | Visual badges for Addable, Removable |

---

## Implementation Details

### 1. Redesign AddIngredientModal

**File**: `src/components/item-mapping/AddIngredientModal.tsx`

**Layout**: Two sections with clear headers inside a larger modal (~sm:max-w-[600px])

**Section 1 -- Ingredient Selection** (two-column row):
- Ingredient dropdown (Select2 searchable, existing pattern) with TooltipInfo
- Unit Price (read-only, auto-fetched from selected ingredient's cost_per_unit) with TooltipInfo

**Section 2 -- Quantity & Rules** (two-column layout):
- Default Quantity (numeric, required, must be > 0) with TooltipInfo
- Can Add Extra (toggle/checkbox, default OFF) with TooltipInfo
  - When ON: enables Extra Cost field and forces Can Remove = OFF
- Extra Cost (numeric, enabled only when Can Add Extra = ON, must be >= 0) with TooltipInfo
- Can Remove (toggle/checkbox, default OFF) with TooltipInfo
  - When ON: forces Can Add Extra = OFF

**Mutual Exclusivity Logic**:
```
onCanAddExtraChange(checked):
  if checked: set canRemove = false
  if !checked: set extraCost = 0, disable extraCost

onCanRemoveChange(checked):
  if checked: set canAddExtra = false, extraCost = 0
```

**Footer**: Cancel + Save Ingredient buttons (sticky)

**Updated onConfirm signature**: Pass `canAddExtra`, `canRemove`, and `extraCost` back to parent.

### 2. Redesign AddItemModal

**File**: `src/components/item-mapping/AddItemModal.tsx`

**Layout**: Three sections inside a larger modal (~sm:max-w-[600px])

**Section 1 -- Item Selection** (two-column):
- Item dropdown (Select2 searchable) with TooltipInfo
- Item Price (read-only, auto-fetched) with TooltipInfo

**Section 2 -- Quantity & Rules** (two-column):
- Default Quantity (numeric, required, must be > 0) with TooltipInfo
- Can Add Extra (toggle, default OFF, mutually exclusive with Can Remove) with TooltipInfo
- Extra Cost (enabled only when Can Add Extra = ON) with TooltipInfo
- Can Remove (toggle, default OFF, mutually exclusive with Can Add Extra) with TooltipInfo

**Section 3 -- Replacement Rule** (single field):
- Replacement Item (Select2 searchable dropdown from Item Master) with TooltipInfo
- Validation: Replacement Item must not equal Selected Item

**Footer**: Cancel + Save Item buttons (sticky)

**Updated onConfirm signature**: Pass `canAddExtra`, `canRemove`, `extraCost`, and `replacementItem` back to parent.

### 3. Update Ingredient Grid

**File**: `src/components/item-mapping/IngredientTable.tsx`

**New columns** (added after existing Name, Quantity, Cost):
- Can Add (checkbox icon or Yes/No badge)
- Can Remove (checkbox icon or Yes/No badge)
- Extra Cost (shown only if Can Add = Yes, otherwise "--")
- Actions: Edit (pencil icon, opens AddIngredientModal pre-filled) + Delete (trash icon, confirmation required)

**Visual badges**:
- "Addable" badge: green pill when can_add_extra = true
- "Removable" badge: blue pill when can_remove = true

### 4. Update Item Grid

**File**: `src/components/item-mapping/ItemTable.tsx`

**New columns** (added to existing):
- Can Add (Yes/No badge)
- Can Remove (Yes/No badge)
- Actions: Edit (pencil icon) + Delete (trash icon)

### 5. Update Data Types

**File**: `src/components/item-mapping/SubItemMappingList.tsx`

Add to `SubItemMappingItem` interface:
- `can_add_extra: boolean`
- `can_remove: boolean`
- `extra_cost: number`
- `replacement_item_id?: string`
- `replacement_item_name?: string`

**File**: `src/components/item-mapping/IngredientMappingList.tsx`

The `IngredientMappingItem` interface already has `can_remove`, `can_add_extra`, `extra_cost` -- no changes needed.

### 6. Update Parent Handlers

**Files**: `src/pages/ItemsAdd.tsx` and `src/pages/ItemsEdit.tsx`

- Update `handleAddIngredient` to accept and store `canAddExtra` and `canRemove` from the new modal signature
- Update `handleAddItem` to accept and store `canAddExtra`, `canRemove`, `extraCost`, and `replacementItem`
- Add `handleEditIngredient` and `handleEditItem` handlers for the Edit action in grids
- Pass edit state (selected mapping) to modals when editing

### 7. Update Modal Callbacks/Interfaces

**Files**: Both modal components

- `AddIngredientModal.onConfirm` signature changes to include `canAddExtra` and `canRemove`
- `AddItemModal.onConfirm` signature changes to include `canAddExtra`, `canRemove`, `extraCost`, and optional `replacementItem`

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/item-mapping/AddIngredientModal.tsx` | Rewrite | Larger modal, 2 sections, toggles, tooltips, mutual exclusivity |
| `src/components/item-mapping/AddItemModal.tsx` | Rewrite | Larger modal, 3 sections, replacement dropdown, toggles, tooltips |
| `src/components/item-mapping/IngredientTable.tsx` | Modify | Add Can Add, Can Remove, Extra Cost, Edit columns |
| `src/components/item-mapping/ItemTable.tsx` | Modify | Add Can Add, Can Remove, Edit columns |
| `src/components/item-mapping/SubItemMappingList.tsx` | Modify | Add new fields to SubItemMappingItem interface |
| `src/pages/ItemsAdd.tsx` | Modify | Update handlers for new modal signatures, add edit handlers |
| `src/pages/ItemsEdit.tsx` | Modify | Same handler updates as ItemsAdd |

---

## Validation Summary

- Ingredient cannot be added twice to the same item (already enforced via `mappedIds`)
- Can Add Extra and Can Remove are mutually exclusive (new toggle logic)
- Extra Cost required only when Can Add Extra = ON
- Quantity must be > 0
- Replacement Item cannot equal Selected Item (new validation)
- Item cannot be added twice in same combo (already enforced via `mappedIds`)

## Visual Design Notes

- Modal width: `sm:max-w-[600px]` (50%+ on desktop)
- Section headers: 13px uppercase tracking-wide with thin bottom border
- All fields: TooltipInfo icon next to label
- Toggle styling: Switch component with mutually exclusive behavior
- Badges in grids: pill-style (green for Addable, blue for Removable)
- Footer: sticky with border-t, muted background, Cancel + Save buttons
- 13px typography throughout per visual identity standards
