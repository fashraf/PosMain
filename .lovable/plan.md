

# Ingredient Master Form -- UI Prototype

This is a UI-only prototype. No database changes yet -- all new fields will use local state with placeholder values. The database migration will be done separately after the UI is approved.

## What Will Be Built

A fully functional 5-section form with all fields, tooltips, conditional logic, and footer actions rendered in the browser. Save actions will be wired to the existing minimal DB columns only; new fields will be visually present but not persisted until the DB migration is approved.

## Section Layout

### Section 1 -- Basic Details (Carrot icon, purple variant)
Two-column grid with:
- **Ingredient Name**: MultiLanguageInputWithIndicators (EN/AR/UR), required, with TooltipInfo
- **Description**: MultiLanguageInputWithIndicators, multiline, with TooltipInfo
- **Ingredient Group**: SearchableSelect from `useIngredientGroups()`, required, with TooltipInfo
- **Classification Type**: SearchableSelect from new `useClassificationTypes()` hook, required, with TooltipInfo
- **Track In Inventory**: Toggle switch, default ON, with TooltipInfo
- **Can Be Sold**: Toggle switch, default OFF, with TooltipInfo

### Section 2 -- Measurement & Cost (Scale icon, green variant)
Two-column grid with:
- **Base Unit**: SearchableSelect from `useUnits()`, required, with TooltipInfo
- **Purchase Unit**: SearchableSelect from `useUnits()`, required, with TooltipInfo
- **Conversion Factor**: Numeric input, required, must be > 0, with TooltipInfo
- **Cost per Purchase Unit**: Numeric input with SAR prefix, required, with TooltipInfo
- **Cost per Base Unit**: Read-only calculated field (cost / conversion), displayed in a disabled input with muted background, with TooltipInfo

### Section 3 -- Inventory & Storage (Warehouse icon, blue variant)
- All fields inside this section become **disabled/greyed out** when "Track In Inventory" is OFF
- **Storage Type**: SearchableSelect from `useStorageTypes()`, with TooltipInfo
- **Min Stock Level**: Numeric input, with TooltipInfo
- **Max Stock Level**: Numeric input (validated >= min), with TooltipInfo
- **Shelf Life (Days)**: Numeric input, with TooltipInfo
- **Expiry Tracking**: Toggle, only active when Track In Inventory = ON, with TooltipInfo
- **Temperature Sensitive**: Toggle, with TooltipInfo

### Section 4 -- Status & Controls (Settings icon, amber variant)
Three toggles in a horizontal row:
- **Purchasable**: Toggle, default ON, with TooltipInfo
- **Return When Order Is Canceled**: Toggle, default ON, with TooltipInfo
- **Active**: Toggle, default ON, with TooltipInfo

### Section 5 -- Notes (FileText icon, muted variant)
- **Internal Notes**: Textarea, max 500 chars, character counter, with TooltipInfo

### Footer (fixed bottom bar)
Three buttons:
- **Cancel** (outline) -- navigates back
- **Save & New** (secondary) -- saves then clears form
- **Save** (primary) -- saves and navigates to list

## Conditional Logic (all client-side)
- Track In Inventory = OFF disables Section 3 fields (opacity-50, pointer-events-none)
- Expiry Tracking toggle only clickable when Track In Inventory = ON
- Cost per Base Unit recalculates live: `costPerPurchaseUnit / conversionFactor`
- If conversionFactor is 0 or empty, Cost per Base Unit shows "--"

## New Hook Required
Add `useClassificationTypes()` to `src/hooks/useMaintenanceData.ts`, following the same pattern as the existing hooks, querying `classification_types` table.

## Files to Modify

| File | Action |
|------|--------|
| `src/hooks/useMaintenanceData.ts` | Add `useClassificationTypes()` hook and `ClassificationTypeItem` interface |
| `src/pages/inventory/IngredientMasterAdd.tsx` | Full rewrite with 5-section layout, all fields, tooltips, conditional logic, and 3-button footer |
| `src/pages/inventory/IngredientMasterEdit.tsx` | Same 5-section layout, pre-populated from DB (new fields default to initial values since columns do not exist yet) |
| `src/components/ingredients/IngredientSaveConfirmModal.tsx` | Update `IngredientSummary` interface to include new fields; display group name, classification, units, toggles in summary card |

## Save Behavior (Prototype Phase)
- Only existing DB columns (`name_en`, `name_ar`, `name_ur`, `unit_id`, `cost_per_unit`, `is_active`) will be saved
- New fields will be in local state only, visible in the confirmation modal summary
- A follow-up database migration will add the remaining columns and wire up persistence

