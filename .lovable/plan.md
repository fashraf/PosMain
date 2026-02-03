
# POS Admin UX Enhancement Plan

## Overview
This plan transforms the current modal-based Add/Edit workflow into a dedicated page-based approach, adds View Details modals, implements a reusable Confirm Changes modal, and introduces tooltips throughout the UI. Additionally, a new Branches module with Currency and VAT settings will be created.

---

## Design Updates

### Color Refinements (Match Reference Image)
- Sidebar background: `#F3F0FF` (light lavender)
- Sidebar link text: `#6B7280`
- Active link: `#8B5CF6` with white/light background
- Main content background: `#F9FAFB` (very light gray)
- Card borders: `#E5E7EB`
- Primary action button: `#8B5CF6`

---

## Architecture Changes

### UX Pattern Shift
| Current | New |
|---------|-----|
| Add/Edit via Dialog modals | Dedicated Add/Edit pages |
| Immediate save on submit | Confirm Changes modal before save |
| No view-only option | View Details modal (read-only) |
| No tooltips | Tooltips on key fields |

### New Route Structure
```text
/sales-channels              - List page
/sales-channels/add          - Add page
/sales-channels/:id/edit     - Edit page

/ingredients                 - List page
/ingredients/add             - Add page
/ingredients/:id/edit        - Edit page

/items                       - List page
/items/add                   - Add page
/items/:id/edit              - Edit page

/item-pricing                - Matrix page (unchanged, but with save confirmation)

/branches                    - List page (NEW)
/branches/add                - Add page (NEW)
/branches/:id/edit           - Edit page (NEW)
```

---

## New i18n Keys Required

```text
common.view, common.confirmChanges, common.oldValue, common.newValue, common.noChanges, common.confirmAndSave, common.field, common.back

branches.title, branches.addBranch, branches.editBranch, branches.branchName, branches.branchCode, branches.basicInfo, branches.currencySettings, branches.taxSettings, branches.currency, branches.currencyTooltip, branches.vatEnabled, branches.vatPercentage, branches.additionalTaxes, branches.taxName, branches.taxPercentage, branches.taxTooltip, branches.addTax, branches.noBranches

currencies.sar, currencies.inr, currencies.usd, currencies.symbol, currencies.isoCode

tooltips.canAddExtra, tooltips.extraCost, tooltips.alertThreshold, tooltips.channelPricing, tooltips.vatField, tooltips.currency
```

---

## Shared Components to Create

### 1. ConfirmChangesModal
**Location:** `src/components/shared/ConfirmChangesModal.tsx`

**Purpose:** Reusable modal shown before saving any Add/Edit form

**Props:**
- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `onConfirm: () => void`
- `changes: Array<{ field: string, oldValue: string | null, newValue: string }>`
- `title?: string`

**Features:**
- Table showing: Field | Old Value | New Value
- Highlights changed fields
- Empty state if no changes
- "Confirm and Save" and "Cancel" buttons
- Fully i18n compatible

### 2. ViewDetailsModal
**Location:** `src/components/shared/ViewDetailsModal.tsx`

**Purpose:** Reusable read-only modal for viewing entity details

**Props:**
- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `title: string`
- `sections: Array<{ title: string, fields: Array<{ label: string, value: React.ReactNode, icon?: LucideIcon }> }>`

**Features:**
- Grouped sections with titles
- Each field: icon (optional) + label + value
- Close button only (no edit controls)
- RTL compatible

### 3. TooltipInfo
**Location:** `src/components/shared/TooltipInfo.tsx`

**Purpose:** Small info icon with tooltip for explaining fields

**Props:**
- `content: string`
- `side?: "top" | "bottom" | "left" | "right"`

**Features:**
- Uses Radix Tooltip
- Info icon (circle-i)
- Subtle styling
- RTL compatible positioning

### 4. PageFormLayout
**Location:** `src/components/shared/PageFormLayout.tsx`

**Purpose:** Consistent layout wrapper for Add/Edit pages

**Props:**
- `title: string`
- `children: React.ReactNode`
- `onCancel: () => void`
- `onSave: () => void`
- `isSaving?: boolean`

**Features:**
- Page header with back button
- Card-based content sections
- Sticky footer with Cancel/Save buttons
- Save button opens confirm modal (handled by parent)

---

## Page Implementations

### 1. Sales Channels

#### List Page Updates (`src/pages/SalesChannels.tsx`)
- Remove `SalesChannelDialog` import
- Add "View" button per row (opens ViewDetailsModal)
- "Add New" button navigates to `/sales-channels/add`
- "Edit" button navigates to `/sales-channels/:id/edit`
- Compact table styling

#### Add Page (`src/pages/SalesChannelsAdd.tsx`)
- Card-based form sections
- Section 1: Channel Name (multilingual)
- Section 2: Code and Icon
- Section 3: Status toggle
- Sticky footer with Cancel/Save
- Save opens ConfirmChangesModal

#### Edit Page (`src/pages/SalesChannelsEdit.tsx`)
- Same form as Add page
- Pre-populated with existing data
- Tracks changes for ConfirmChangesModal

---

### 2. Ingredients

#### List Page Updates (`src/pages/Ingredients.tsx`)
- Remove `IngredientDialog` import
- Add "View" button per row
- Add tooltips for: Alert Threshold, Can Add Extra, Extra Cost
- "Add New" navigates to `/ingredients/add`
- "Edit" navigates to `/ingredients/:id/edit`

#### Add Page (`src/pages/IngredientsAdd.tsx`)
- Section 1: Basic Info (Name multilingual, Type, Unit)
- Section 2: Stock & Pricing (Quantity, Alert Threshold with tooltip, Cost, Selling Price)
- Section 3: Extra Options (Can Sell Individually, Can Add Extra with tooltip, Extra Cost with tooltip)
- Section 4: Status
- Sticky footer

#### Edit Page (`src/pages/IngredientsEdit.tsx`)
- Same structure as Add
- Pre-filled data, change tracking

---

### 3. Items

#### List Page Updates (`src/pages/Items.tsx`)
- Remove `ItemDialog` import
- Add "View" button per row
- "Add New" navigates to `/items/add`
- "Edit" navigates to `/items/:id/edit`

#### Add Page (`src/pages/ItemsAdd.tsx`)
- Section 1: Basic Info (Name multilingual, Description multilingual)
- Section 2: Classification (Item Type dropdown, Is Combo toggle)
- Section 3: Pricing (Base Cost)
- Section 4: Image (Upload placeholder with preview)
- Section 5: Status

#### Edit Page (`src/pages/ItemsEdit.tsx`)
- Same structure, pre-filled

---

### 4. Item Pricing

#### Updates (`src/pages/ItemPricing.tsx`)
- Add tooltips for price cells that differ from base cost
- Save All button opens ConfirmChangesModal showing all modified prices
- No navigation changes (stays as matrix page)

---

### 5. Branches (NEW)

#### List Page (`src/pages/Branches.tsx`)
- Table columns: Name, Code, Currency, VAT Enabled, Status, Actions
- View/Edit/Add buttons
- Add "Branches" to sidebar navigation

#### Add Page (`src/pages/BranchesAdd.tsx`)
**Section 1: Basic Information**
- Branch Name (multilingual input)
- Branch Code
- Status toggle

**Section 2: Currency Settings**
- Currency selector dropdown with:
  - Saudi Riyal (SAR) - ﷼
  - Indian Rupee (INR) - ₹
  - US Dollar (USD) - $
- Display: Symbol + ISO Code
- Tooltip: "Currency is used for prices, invoices, and receipts for this branch."

**Section 3: Tax and VAT Settings**
- Enable VAT toggle
- VAT Percentage input (visible when enabled)
- Additional Taxes section:
  - Dynamic rows: Tax Name + Tax Percentage + Remove button
  - "Add Tax" button
- Tooltip: "Taxes are applied during billing and shown on receipts."

#### Edit Page (`src/pages/BranchesEdit.tsx`)
- Same structure as Add
- Pre-filled data

---

## Table Component Updates

### Row Actions Pattern
Each table will have consistent action buttons:
```text
[Eye Icon] View    - Opens ViewDetailsModal
[Pencil Icon] Edit - Navigates to /entity/:id/edit
[Toggle] Status    - Inline toggle (unchanged)
```

No delete buttons on list pages (soft delete via status).

---

## File Summary

### New Files to Create
```text
src/components/shared/ConfirmChangesModal.tsx
src/components/shared/ViewDetailsModal.tsx
src/components/shared/TooltipInfo.tsx
src/components/shared/PageFormLayout.tsx

src/pages/SalesChannelsAdd.tsx
src/pages/SalesChannelsEdit.tsx

src/pages/IngredientsAdd.tsx
src/pages/IngredientsEdit.tsx

src/pages/ItemsAdd.tsx
src/pages/ItemsEdit.tsx

src/pages/Branches.tsx
src/pages/BranchesAdd.tsx
src/pages/BranchesEdit.tsx

src/components/branches/BranchTable.tsx
src/components/branches/BranchViewModal.tsx
src/components/branches/CurrencySelector.tsx
src/components/branches/TaxSettings.tsx
```

### Files to Modify
```text
src/index.css                    - Update color tokens for lavender theme
src/lib/i18n/translations.ts     - Add all new i18n keys
src/App.tsx                      - Add new routes
src/components/AppSidebar.tsx    - Add Branches nav item
src/pages/SalesChannels.tsx      - Switch to page-based workflow
src/pages/Ingredients.tsx        - Switch to page-based workflow
src/pages/Items.tsx              - Switch to page-based workflow
src/pages/ItemPricing.tsx        - Add confirm modal on save
src/components/sales-channels/SalesChannelTable.tsx - Add View action
src/components/ingredients/IngredientTable.tsx      - Add View action, tooltips
src/components/items/ItemTable.tsx                  - Add View action
```

### Files to Delete (replaced by page-based approach)
```text
src/components/sales-channels/SalesChannelDialog.tsx
src/components/ingredients/IngredientDialog.tsx
src/components/items/ItemDialog.tsx
```

---

## Implementation Order

1. **Color/Theme Updates** - Update CSS variables in `src/index.css`
2. **i18n Keys** - Add all new translation keys
3. **Shared Components** - ConfirmChangesModal, ViewDetailsModal, TooltipInfo, PageFormLayout
4. **Sales Channels** - Update list page, create Add/Edit pages
5. **Ingredients** - Update list page, create Add/Edit pages, add tooltips
6. **Items** - Update list page, create Add/Edit pages
7. **Item Pricing** - Add confirm modal
8. **Branches** - Create full module (list, add, edit, components)
9. **Routing** - Update App.tsx with all new routes
10. **Sidebar** - Add Branches navigation item

---

## Technical Notes

### Change Tracking for Confirm Modal
Each Add/Edit page will:
1. Store initial form values on mount
2. Compare current values on save click
3. Generate changes array: `{ field, oldValue, newValue }`
4. Pass to ConfirmChangesModal

### Currency Data Structure
```typescript
const currencies = [
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];
```

### RTL Considerations
- All tooltips use `side` prop for proper positioning
- PageFormLayout footer uses `flex-row-reverse` when RTL
- Navigation uses `useNavigate(-1)` for back button

---

## Database Schema for Branches

```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_ur TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'SAR',
  vat_enabled BOOLEAN DEFAULT false,
  vat_percentage DECIMAL(5,2) DEFAULT 0,
  additional_taxes JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

This schema will be created via database migration after plan approval.
