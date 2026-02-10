

# Branch Master Data: Full Feature Overhaul

## Overview

Expand the `branches` table with new columns and rebuild the List, Add, and Edit pages to match the reference screenshots -- with Branch Code, Currency, VAT, Order Types, Pricing Mode, Rounding Rules, and compact DashedSectionCard layout.

---

## 1. Database Migration

Add the following columns to the `branches` table:

| Column | Type | Default | Nullable |
|--------|------|---------|----------|
| `branch_code` | text | NULL | Yes |
| `name_ar` | text | NULL | Yes |
| `name_ur` | text | NULL | Yes |
| `currency` | text | `'SAR'` | No |
| `currency_symbol` | text | `'ر.س'` | No |
| `vat_enabled` | boolean | `false` | No |
| `vat_rate` | numeric | `15` | No |
| `pricing_mode` | text | `'exclusive'` | No |
| `rounding_rule` | text | `'none'` | No |
| `order_types` | text[] | `'{}'` | No |

Then seed 3 branches:
- Main Branch (MAIN, SAR, VAT 15%, active)
- Downtown (DOWNTOWN, SAR, VAT 15%, active)
- Mall Outlet (MALL, USD, no VAT, inactive)

---

## 2. Branch List Page (`Branches.tsx`)

Rebuild the table to show columns matching the screenshot:

| Name | Branch Code | Currency | VAT Enabled | Status | Actions |
|------|-------------|----------|-------------|--------|---------|

- Branch Code displayed in a monospace badge
- Currency shows symbol + code (e.g., "ر.س SAR")
- VAT Enabled shows Yes/No badge + percentage in parentheses
- Status shows Switch + StatusBadge
- Actions: Eye (view) + Edit icons
- Compact spacing, 12px font throughout

---

## 3. Branch Add/Edit Pages

Both pages will use a shared `BranchFormPage` component with 5 DashedSectionCard sections:

**Section 1: Basic Information** (purple)
- Branch Name: `CompactMultiLanguageInput` (EN/AR/UR)
- Branch Code: Input
- Status: Switch toggle (right-aligned)

**Section 2: Order Types** (green)
- `CheckboxGroup` with 3 options: Dine-In, Takeaway, Delivery

**Section 3: Currency & Pricing** (blue)
- Currency: `SearchableSelect` dropdown (SAR, USD, AED, EGP, BDT, PKR)
- Pricing Mode: `CompactRadioGroup` (Inclusive / Exclusive) with descriptions

**Section 4: Tax & VAT Settings** (amber)
- VAT Enabled: Switch toggle
- VAT Rate: Input (shown only when VAT enabled), percentage field

**Section 5: Rounding Rules** (muted)
- `CompactRadioGroup` horizontal: No rounding, 0.05, 0.10, Whole number

**Footer**: Sticky Cancel + Save buttons

---

## Technical Details

### Files to Create/Modify

| File | Action |
|------|--------|
| Migration SQL | New columns + seed data |
| `src/components/branches/BranchFormPage.tsx` | **Create** -- shared form component |
| `src/pages/Branches.tsx` | **Rewrite** -- expanded table columns |
| `src/pages/BranchesAdd.tsx` | **Rewrite** -- use BranchFormPage |
| `src/pages/BranchesEdit.tsx` | **Rewrite** -- use BranchFormPage |

### Currency Options
```text
SAR (ر.س) - Saudi Riyal
USD ($) - US Dollar
AED (د.إ) - UAE Dirham
EGP (ج.م) - Egyptian Pound
BDT (৳) - Bangladeshi Taka
PKR (₨) - Pakistani Rupee
```

### Validation
- Branch Name (EN) is required
- Branch Code is optional but unique if provided
- Focus-on-error scrolling to first invalid field

### Compact Styling Rules
- All padding/margins max 5px (`p-1`, `space-y-1.5`, `gap-1.5`)
- Font size 12px (`text-xs`) for labels, inputs, text
- Input height: `h-7`
- DashedSectionCard padding: `p-2` internal
- Sticky footer: `left-[16rem] right-0`

