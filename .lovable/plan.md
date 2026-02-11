
# Print Template Management Module

## Overview

Build a full Print Template management system under **Maintenance** that lets users design receipt/invoice templates per branch with a live preview. The form uses an 8/4 column split -- configuration on the left, a scaled-down receipt preview on the right that updates in real-time.

---

## 1. Database: New `print_templates` Table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Required, template name |
| branch_id | uuid | FK to branches(id), required |
| is_active | boolean | Default true |
| show_logo | boolean | Default true |
| logo_url | text | Nullable, uploaded logo URL |
| logo_position | text | 'left', 'center', 'right' -- default 'center' |
| show_branch_name | boolean | Default true |
| show_branch_mobile | boolean | Default true |
| show_order_id | boolean | Default true |
| show_order_taken_by | boolean | Default true |
| header_text | text | Nullable, e.g. "Welcome to Our Restaurant" |
| header_alignment | text | 'left', 'center', 'right' -- default 'center' |
| show_item_name | boolean | Default true |
| show_qty | boolean | Default true |
| show_price | boolean | Default true |
| show_line_total | boolean | Default true |
| show_total_amount | boolean | Default true |
| show_discount | boolean | Default false |
| show_tax_breakdown | boolean | Default false |
| show_qr | boolean | Default false |
| qr_content | text | 'order_url', 'order_id', 'custom' -- default 'order_url' |
| qr_size | text | 'small', 'medium', 'large' -- default 'medium' |
| show_amount_above_qr | boolean | Default false |
| show_order_id_near_qr | boolean | Default false |
| show_footer | boolean | Default true |
| footer_text | text | Nullable, e.g. "Thank you for visiting" |
| footer_alignment | text | 'left', 'center', 'right' -- default 'center' |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

RLS: Admin full access, authenticated users can view.

Unique constraint on `(name, branch_id)` to prevent duplicate template names per branch.

---

## 2. New Files

### Pages

- **`src/pages/maintenance/PrintTemplates.tsx`** -- List page with GridFilters (search + branch filter + status filter), premium gradient table header, branch name column, status toggle, edit/view actions.
- **`src/pages/maintenance/PrintTemplatesAdd.tsx`** -- Thin wrapper calling `PrintTemplateFormPage` in add mode.
- **`src/pages/maintenance/PrintTemplatesEdit.tsx`** -- Wrapper loading data then calling `PrintTemplateFormPage` in edit mode.

### Components

- **`src/components/print-templates/PrintTemplateFormPage.tsx`** -- The main form with 8/4 split layout:
  - **Left column (col-span-8)**: Four `DashedSectionCard` sections:
    1. **Template Info**: Name input + Branch dropdown (SearchableSelect) + Active toggle
    2. **Header**: Show Logo toggle + Logo Position radio (Left/Center/Right) + Upload Logo (ImageUploadHero) + Show Branch Name / Branch Mobile / Order ID / Order Taken By checkboxes + Header Text input + Header Alignment dropdown
    3. **Body**: Checkboxes for Item Name, Qty, Price, Line Total, Total Amount, Discount, Tax Breakdown
    4. **QR / Special**: Generate QR toggle + QR Content dropdown (Order URL/Order ID/Custom) + QR Size dropdown + Amount Above QR / Order ID Near QR toggles
    5. **Footer**: Show Footer toggle + Footer Text input + Footer Alignment dropdown
  - **Right column (col-span-4)**: Sticky live receipt preview card

- **`src/components/print-templates/ReceiptPreview.tsx`** -- A scaled receipt mockup that renders inside a white card with dotted border, simulating a thermal printer output. It reads the form state and renders:
  - Logo placeholder (with position)
  - Branch name, mobile, order ID (if toggled on)
  - "Order Taken By: Ahmad" (if toggled on)
  - Header text (with alignment)
  - A sample items table with 3 dummy items (showing only toggled-on columns)
  - Discount row, tax breakdown (if toggled on)
  - Total amount
  - QR code placeholder (with size + surrounding labels)
  - Footer text (with alignment)
  - The preview uses a receipt-like narrow styling (max-w-[280px], mono font, thin borders)

- **`src/components/print-templates/PrintTemplateSaveModal.tsx`** -- Confirmation modal before save, showing a summary of enabled sections.

### Sample Data for Preview

The preview will use hardcoded demo data:

```text
Branch: Al Riyadh Main Branch
Mobile: +966 50 123 4567
Order #: 1042
Taken By: Ahmad

------- ITEMS -------
Chicken Shawarma   x2   15.00   30.00
Arabic Coffee      x3    5.00   15.00
Kunafa             x1   12.00   12.00
--------------------------
Subtotal:                       57.00
VAT 15%:                         8.55
TOTAL:                          65.55

[QR Code Placeholder]
Order #1042

Thank you for visiting!
```

---

## 3. Modified Files

| File | Change |
|------|--------|
| `src/App.tsx` | Add 3 routes: `/maintenance/print-templates`, `/maintenance/print-templates/add`, `/maintenance/print-templates/:id/edit` |
| `src/components/AppSidebar.tsx` | Add "Print Templates" entry to `maintenanceSubItems` array |
| `src/lib/i18n/translations.ts` | Add print template translation keys |
| `src/pages/maintenance/index.ts` | Export PrintTemplatesPage |

---

## 4. List Page Design

The list page follows the premium grid standards:

- **GridFilters** bar with:
  - Title: "Print Templates"
  - Branch filter dropdown (populated from branches table)
  - Status filter (All / Active / Inactive)
  - Search input
  - "Add Template" button
- **Table columns**: #, Template Name, Branch, Header, Body Fields, QR, Status, Actions
- Gradient header: `bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80`
- Zebra striping, lavender hover
- Status toggle with Switch + GridStatusBadge
- Edit button navigates to edit page

---

## 5. Form Page Layout (8/4 Split)

```text
+------ col-span-8 ------+---- col-span-4 ----+
|                         |                     |
| [Template Info Card]    |  .................  |
|                         |  :               :  |
| [Header Card]           |  : RECEIPT       :  |
|   Logo / Branch / etc.  |  : PREVIEW       :  |
|                         |  :               :  |
| [Body Card]             |  : (live update) :  |
|   Item columns toggles  |  :               :  |
|                         |  :               :  |
| [QR / Special Card]     |  :               :  |
|                         |  :...............:  |
| [Footer Card]           |                     |
|                         |                     |
+-------------------------+---------------------+
|          [ Cancel ]   [ Save Template ]        |
+------------------------------------------------+
```

The right column uses `sticky top-4` so the preview stays visible while scrolling through sections.

---

## 6. Key Behaviors

- **Live preview**: Every toggle/input change instantly reflects in the ReceiptPreview component -- no save needed to see the effect
- **Logo upload**: Uses existing `ImageUploadHero` component, uploads to a new `print-logos` storage bucket
- **Branch required**: Template must be linked to a branch; the branch dropdown fetches from the branches table
- **Duplicate prevention**: DB unique constraint on (name, branch_id); error caught and shown inline
- **Confirmation modal**: Before save, shows a summary modal listing which sections are enabled (e.g., "Header: Logo, Branch Name, Order ID / Body: 5 columns / Footer: Enabled")
- **Sticky footer**: Fixed bottom bar with Cancel + Save Template buttons (left-[16rem] offset)

---

## 7. Storage Bucket

Create a new `print-logos` storage bucket for uploaded logos, with public access for rendering in receipts.

---

## 8. No Changes To

- Existing POS order flow or checkout
- Existing branch, shift, or user management
- Any existing database tables
Need to add CR number and VAT Number also please 
