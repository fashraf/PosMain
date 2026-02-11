

# Branch Settings Page Redesign

## Overview

Complete redesign of the Branch Add/Edit form to be enterprise-grade with full-width layout, dynamic Sales Channels from database, multi-tax builder, horizontal pricing mode, confirmation modal, and clean flat UI inspired by the reference screenshot.

---

## 1. Database Changes

### Create `sales_channels` table

| Column | Type | Default |
|--------|------|---------|
| id | uuid | gen_random_uuid() |
| name_en | text (NOT NULL) | -- |
| name_ar | text | NULL |
| name_ur | text | NULL |
| code | text (NOT NULL) | -- |
| icon | text | NULL |
| is_active | boolean | true |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

Seed with: In-Store, Zomato, Swiggy, Online Website (inactive).

RLS: Admins manage all, authenticated users can view.

### Create `branch_taxes` table

| Column | Type | Default |
|--------|------|---------|
| id | uuid | gen_random_uuid() |
| branch_id | uuid (FK to branches) | -- |
| tax_name | text (NOT NULL) | -- |
| tax_type | text | 'percentage' |
| value | numeric | 0 |
| apply_on | text | 'before_discount' |
| is_active | boolean | true |
| sort_order | integer | 0 |
| created_at | timestamptz | now() |

RLS: Admins manage all, authenticated users can view.

### Add `sales_channel_ids` column to `branches`

| Column | Type | Default |
|--------|------|---------|
| sales_channel_ids | uuid[] | '{}' |

---

## 2. Branch Form Page Redesign (`BranchFormPage.tsx`)

Full-width container (remove `max-w-2xl`), clean flat white background, light grey section dividers.

### Section Layout (using DashedSectionCard)

**Section 1: Basic Information** (purple)
- Row 1: Branch Name (multi-language, full width)
- Row 2: 4-column grid -- Branch Code (col-3), Currency dropdown (col-3), Pricing Mode (col-3), Status toggle (col-3)
- Font: 14px for inputs, 16px medium for section headers

**Section 2: Sales Channels** (green) -- replaces "Order Types"
- `SearchableMultiSelect` fetching active sales channels from the new `sales_channels` table
- Shows loading skeleton while fetching
- Selected channels displayed as small badge tags
- Tooltip explaining purpose

**Section 3: Tax Configuration** (amber) -- replaces single VAT toggle
- Dynamic repeatable tax rows in a grid:
  - Tax Name (col-3), Tax Type dropdown: Percentage/Fixed (col-3), Value (col-3), Apply On dropdown: Before Discount/After Discount (col-2), Active toggle + Delete (col-1)
- "Add Tax" button with Plus icon
- Smooth add/remove animation
- Tooltip explaining tax application logic

**Section 4: Pricing Mode** (blue)
- Horizontal inline radio buttons: Tax Inclusive | Tax Exclusive | Hybrid
- Selected option gets soft highlight background
- Tooltip explaining each mode

**Section 5: Rounding Rules** (muted)
- Horizontal radio group (unchanged but with 14px font)

### Save Flow
- Click "Save Branch" opens a **Confirmation Modal**:
  - Title: "Confirm Branch Configuration Changes"
  - Summary table showing: Sales Channels count, Tax count, Pricing Mode, Status
  - Warning: "These updates will reflect immediately in POS operations."
  - Buttons: Cancel | Confirm & Apply

---

## 3. Typography & Spacing

| Element | Size |
|---------|------|
| Input font | 14px (`text-sm`) |
| Labels | 14px, font-medium |
| Section headers | 16px, font-medium |
| Page title | 18px, font-bold |
| Spacing | Consistent 12px (gap-3, space-y-3, p-3) |

---

## 4. Responsive Behavior

| Breakpoint | Columns per row |
|------------|----------------|
| Desktop (lg+) | 4 fields (grid-cols-4) |
| Tablet (md) | 2 fields (grid-cols-2) |
| Mobile (sm) | 1 field (grid-cols-1) |

---

## 5. UX Enhancements

- Required fields marked with red asterisk
- Tooltip icons next to: Pricing Mode, Tax Apply On, Sales Channels
- Real-time validation (name required, tax value must be positive)
- Focus-on-error scrolling

---

## 6. Sales Channels Page Update

Update `SalesChannels.tsx` to fetch from the new `sales_channels` DB table instead of hardcoded array (currently mock data).

---

## Files to Create/Modify

| File | Action |
|------|--------|
| Migration SQL | Create `sales_channels` + `branch_taxes` tables, add `sales_channel_ids` to branches |
| `src/components/branches/BranchFormPage.tsx` | Full rewrite with new design |
| `src/components/branches/BranchTaxRow.tsx` | **Create** -- single tax row component |
| `src/components/branches/BranchSaveConfirmModal.tsx` | **Create** -- confirmation modal |
| `src/pages/Branches.tsx` | Update to show Sales Channels column instead of Order Types |
| `src/pages/BranchesEdit.tsx` | Update to load branch_taxes |
| `src/pages/SalesChannels.tsx` | Update to use DB instead of mock data |
