
# Finance Module

## Overview

A new top-level "Finance" section in the sidebar with 5 sub-pages: Overview (branch-wise dashboard), Reports, VAT Report, Cancellations, and Expenses/Profit. All data is sourced from existing `pos_orders`, `pos_order_items`, `branches`, and `profiles` tables plus 2 new tables for expenses and integration logs. The module supports date-range filtering, branch filtering, and multiple chart types.

---

## Database Changes

### New Table: `finance_expenses`
Tracks operational expenses (COGS, salaries, rent, etc.) per branch per period.

```text
id              uuid PK default gen_random_uuid()
branch_id       uuid FK -> branches(id)
category        text NOT NULL (e.g. 'cogs', 'salaries', 'rent', 'utilities', 'marketing', 'other')
description     text
amount          numeric NOT NULL default 0
expense_date    date NOT NULL
created_by      uuid (nullable)
created_at      timestamptz default now()
updated_at      timestamptz default now()
```

RLS: Admin-only for INSERT/UPDATE/DELETE. Authenticated users can SELECT.

### New Table: `finance_integration_logs`
Audit trail for finance-related events (exports, syncs, approvals).

```text
id              uuid PK default gen_random_uuid()
event_type      text NOT NULL (e.g. 'export_pdf', 'export_excel', 'vat_sync', 'refund_approval')
details         jsonb
performed_by    uuid (nullable)
created_at      timestamptz default now()
```

RLS: Admin-only for all operations.

---

## Sidebar Navigation

Add a "Finance" collapsible group (icon: `TrendingUp`) with sub-items:

| Label | Route | Description |
|-------|-------|-------------|
| Overview | `/finance` | Branch-wise dashboard with KPIs |
| Revenue Report | `/finance/revenue` | Branch/category/payment breakdowns |
| VAT Report | `/finance/vat` | Branch-wise, item-level VAT |
| Cancellations | `/finance/cancellations` | Refund/cancellation analysis |
| Expenses & Profit | `/finance/expenses` | COGS, expenses, P&L |

---

## Page Layouts

### 1. Finance Overview (`/finance`)

**Header**: Date range picker (Today / This Week / This Month / This Year / Custom) + Branch filter dropdown (All or specific)

**Row 1 -- Hero KPI Cards (6 big-number cards with sparklines)**
```text
| Total Sales | VAT Collected | Cancellations | Discounts | Gross Profit | Net Profit |
```
Each card shows: Big number (SAR), sparkline trend (last 7 days), percentage change vs prior period. Color-coded: green for positive, orange for negative.

**Row 2 -- Revenue Trend Line Chart (full width)**
- Multi-line: Revenue, VAT, Cancellations over selected period
- X-axis: daily/weekly/monthly depending on range
- Tooltip with all values

**Row 3 -- Branch-wise Summary Table**
- Columns: Branch Name, Total Sales, VAT, Cancellations, Discounts, Gross Profit, Net Profit, Margin %
- Each row is clickable -> navigates to `/finance/revenue?branch=<id>`
- Sortable columns, sticky header
- Premium Grid styling (42px rows, zebra, lavender hover)

**Row 4 -- Side-by-side charts**
- Left: Horizontal Bar Chart -- Branch comparison (revenue)
- Right: Donut Chart -- Payment type breakdown

**Row 5 -- Alerts panel**
- Unusual spikes/drops in revenue or cancellations
- Branches with margin below threshold

---

### 2. Revenue Report (`/finance/revenue`)

**Filters**: Date range, Branch, Category, Payment Type

**Tab 1: Branch-wise** -- Data table with branch breakdowns, bar chart comparison
**Tab 2: Category-wise** -- Table + pie chart of sales by item category
**Tab 3: Payment Type** -- Table + donut chart by cash/card/both/pay_later
**Tab 4: Top Items** -- Ranked table of top-selling items by revenue, with quantity and avg price

Each tab has an Export button (logs to `finance_integration_logs`).

---

### 3. VAT Report (`/finance/vat`)

**Filters**: Date range, Branch

**Content**:
- Summary card: Total Taxable Amount, Total VAT (15%), Total Inclusive
- Branch-wise VAT table (branch, taxable, vat_amount, total)
- Item-level VAT table (item_name, qty, unit_price, subtotal, vat, total)
- Compliance format: VAT Registration Number field (from branch settings)
- Export to PDF/Excel

---

### 4. Cancellations Report (`/finance/cancellations`)

**Filters**: Date range, Branch

**Content**:
- KPI cards: Total Cancellations (count), Total Refund Amount, Cancellation Rate (%), Top Cancel Reason
- Line chart: Cancellations over time
- Data table: Date, Order #, Branch, Amount, Reason, Cancelled By
- Donut chart: Cancellation reasons breakdown
- Source: `pos_orders` where `payment_status = 'cancelled'` using `cancel_reason` and `cancelled_at`

---

### 5. Expenses and Profit (`/finance/expenses`)

**Filters**: Date range, Branch

**Content**:
- Expense entry form (admin-only): Category dropdown, Amount, Date, Branch, Description
- Expense categories table with totals
- P&L Summary card:
  ```text
  Revenue (from pos_orders)
  - COGS (from finance_expenses where category='cogs')
  = Gross Profit
  - Operating Expenses (salaries + rent + utilities + marketing + other)
  = Net Profit
  Margin % = (Net Profit / Revenue) x 100
  ```
- Bar chart: Expense breakdown by category
- Trend chart: Profit margin over time (monthly)

---

## Shared Components

### `FinanceDateRangePicker`
- Presets: Today, This Week, This Month, This Year, Custom
- Returns `{from: string, to: string}` ISO dates
- Used across all finance pages

### `FinanceBranchFilter`
- Dropdown with "All Branches" + individual branches
- Reuses existing branch query

### `FinanceKPICard`
- Big number + sparkline + trend badge
- Props: `title`, `value`, `sparklineData[]`, `change`, `changeDirection`

### `FinanceDataTable`
- Premium Grid style table with sorting, export button
- Props: `columns`, `data`, `onExport`

### `SparklineChart`
- Tiny inline area chart (recharts) for KPI cards
- Props: `data: number[]`, `color: string`, `height: number`

---

## Data Hook: `useFinanceData`

```text
useFinanceData({
  branchId: string | null,
  dateRange: { from: string, to: string },
  granularity: 'daily' | 'weekly' | 'monthly'
})
```

Queries:
1. `pos_orders` filtered by date range + branch -> revenue, VAT, cancellations, payment methods
2. `pos_order_items` joined with menu items/categories -> category breakdown, item-level data
3. `finance_expenses` filtered by date range + branch -> expense totals by category
4. Computed: gross profit (revenue - COGS), net profit (gross - operating expenses), margins

Returns: KPI values, chart data arrays, table data arrays, alerts.

---

## Chart Types Used

| Chart | Library | Usage |
|-------|---------|-------|
| Line Chart | Recharts `LineChart` | Revenue/VAT/Cancellation trends over time |
| Vertical Bar Chart | Recharts `BarChart` | Branch comparison, expense breakdown |
| Horizontal Bar Chart | Recharts `BarChart` layout="vertical" | Branch ranking |
| Pie/Donut Chart | Recharts `PieChart` | Payment types, categories, cancel reasons |
| Big Number + Sparkline | Custom + Recharts `AreaChart` | Hero KPI cards |
| Data Table | Custom Premium Grid | All detailed breakdowns |
| Heatmap (optional) | Custom CSS grid | Sales density by day/hour (Phase 2) |

---

## Export Functionality

- PDF: Browser `window.print()` with a print-optimized layout
- Excel: Generate CSV string and trigger download via `Blob` + `URL.createObjectURL`
- Each export logs an entry to `finance_integration_logs`

---

## File Summary

| File | Action |
|------|--------|
| **Database** | |
| Migration: `finance_expenses` table | Create |
| Migration: `finance_integration_logs` table | Create |
| **Pages** | |
| `src/pages/finance/FinanceOverview.tsx` | Create |
| `src/pages/finance/RevenueReport.tsx` | Create |
| `src/pages/finance/VATReport.tsx` | Create |
| `src/pages/finance/CancellationsReport.tsx` | Create |
| `src/pages/finance/ExpensesProfit.tsx` | Create |
| `src/pages/finance/index.ts` | Create (barrel export) |
| **Components** | |
| `src/components/finance/FinanceDateRangePicker.tsx` | Create |
| `src/components/finance/FinanceBranchFilter.tsx` | Create |
| `src/components/finance/FinanceKPICard.tsx` | Create |
| `src/components/finance/SparklineChart.tsx` | Create |
| `src/components/finance/FinanceDataTable.tsx` | Create |
| `src/components/finance/FinanceLineChart.tsx` | Create |
| `src/components/finance/FinanceBarChart.tsx` | Create |
| `src/components/finance/FinanceDonutChart.tsx` | Create |
| `src/components/finance/FinancePLCard.tsx` | Create |
| `src/components/finance/ExpenseForm.tsx` | Create |
| `src/components/finance/ExportButtons.tsx` | Create |
| `src/components/finance/index.ts` | Create |
| **Hooks** | |
| `src/hooks/useFinanceData.ts` | Create |
| `src/hooks/useFinanceExpenses.ts` | Create |
| **Navigation** | |
| `src/components/AppSidebar.tsx` | Update -- add Finance collapsible group |
| `src/App.tsx` | Update -- add 5 finance routes |
| `src/lib/i18n/translations.ts` | Update -- add finance translation keys |

---

## Color Palette (consistent with dashboard)

| Color | Hex | Finance Usage |
|-------|-----|---------------|
| Teal | `#2c8cb4` | Revenue, headers |
| Mint Green | `#32c080` | Profit, positive trends |
| Soft Orange | `#dc8c3c` | Cancellations, warnings |
| Light Cyan | `#64b4e0` | VAT, secondary metrics |
| Warm Gray | `#a09888` | Neutral/expenses |
| Purple | `#8b5cf6` | Net profit, special highlights |

---

## Implementation Order

1. Database migrations (2 tables)
2. Shared finance components (date picker, branch filter, KPI card, sparkline, data table, export buttons)
3. `useFinanceData` hook
4. Finance Overview page
5. Revenue Report page
6. VAT Report page
7. Cancellations Report page
8. Expenses and Profit page + `useFinanceExpenses` hook + expense form
9. Sidebar + routing updates
10. Translation keys
