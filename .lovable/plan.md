

# Branch-Level Real-Time Dashboard

## Overview

Transform the current group-level dashboard into a branch-specific dashboard. Users select a branch from a dropdown in the header, and all data filters to that branch. All data comes from real database tables (pos_orders, profiles, user_branches, branches, etc.) -- values will be zero if no data exists, which is fine.

---

## Architecture

The existing group dashboard (`/`) becomes the branch dashboard. A branch selector dropdown is added to the header. When a branch is selected, all queries filter by `branch_id`.

---

## Page Layout

```text
+------------------------------------------------------------------+
| HEADER: [Branch Dropdown v] | Date/Time | Status Badge | Refresh |
+------------------------------------------------------------------+
| ROW 1: 3x KPI Gauge Cards (Revenue, Avg Check, Total Orders)    |
+------------------------------------------------------------------+
| ROW 2: Quick Stats Strip (Paid, Pending, Cancelled, Staff)       |
+------------------------------------------------------------------+
| ROW 3: 3x Donut Charts side-by-side (col-4 each)                |
|  Payment Modes | Sales by Category | Order Types                 |
+------------------------------------------------------------------+
| ROW 4: Hourly Revenue Trend (Today vs Yesterday) - full width   |
+------------------------------------------------------------------+
| ROW 5: Staff on Duty Table | Key Metrics Grid                    |
+------------------------------------------------------------------+
| ROW 6: 3x Scrollable Lists (col-4 each)                         |
|  Latest 50 Orders | Top 50 Slowest | Staff Attendance            |
+------------------------------------------------------------------+
| ROW 7: Alerts & Insights                                         |
+------------------------------------------------------------------+
```

---

## Components

### Modified Files

**`src/pages/Dashboard.tsx`** -- Complete rewrite to compose new branch-level sections with branch selector state.

**`src/hooks/useDashboardData.ts`** -- Refactor to accept `branchId` parameter. All queries filter by branch. Add new queries for order items (category breakdown), payment method breakdown, order type breakdown, and recent orders list.

**`src/components/dashboard/DashboardHeader.tsx`** -- Add branch selector dropdown (Select component). Show selected branch name prominently. Remove "Branches: N" counter.

**`src/components/dashboard/mockDashboardData.ts`** -- Add new TypeScript interfaces for donut chart data, cashier data, and order list data.

### New Files

**`src/components/dashboard/DonutChartCard.tsx`**
- Reusable Recharts `PieChart` (donut style) with inner hole
- Props: title, data array `{name, value, color}`, and optional center label
- Pastel color scheme consistent with dashboard palette
- Legend below/beside the chart with percentages
- Used for: Payment Modes, Sales by Category, Order Types

**`src/components/dashboard/CashierDutyTable.tsx`**
- Table showing staff assigned to the selected branch
- Columns: Name, Status (Active), Role
- Data from `user_branches` joined with `profiles`
- Material-style table with hover effects, sticky header

**`src/components/dashboard/RecentOrdersList.tsx`**
- Scrollable card showing latest 50 orders for the branch
- Columns: Time, Order #, Total (SAR), Status badge
- Data from `pos_orders` filtered by branch, ordered by `created_at DESC`, limit 50
- Fixed height with vertical scroll, sticky header

**`src/components/dashboard/SlowestOrdersList.tsx`**  
- Shows orders sorted by duration (pending time)
- Columns: Time, Order #, Duration, Status
- Same query source but sorted differently

**`src/components/dashboard/StaffAttendanceList.tsx`**
- Shows all staff assigned to this branch
- Columns: Name, Employee Code, Status (Active/Inactive)
- Data from `user_branches` + `profiles`
- Scrollable card with sticky header

---

## Data Flow

### Branch Selector
- Fetch active branches on mount (existing query)
- Default to first branch if available
- Store `selectedBranchId` in state
- Pass to `useBranchDashboardData(branchId)` hook

### Queries (all filtered by `branch_id`)

| Query | Table | Filter | Purpose |
|-------|-------|--------|---------|
| Today's orders | `pos_orders` | `branch_id = X, created_at >= today` | Revenue, order counts, payment methods, order types |
| Yesterday's orders | `pos_orders` | `branch_id = X, created_at = yesterday` | Comparison data |
| Branch staff | `user_branches` + `profiles` | `branch_id = X` | Staff list, attendance |
| Recent 50 orders | `pos_orders` | `branch_id = X`, limit 50, desc | Latest orders list |
| Order items | `pos_order_items` via order IDs | Join with items for categories | Category breakdown |

### Donut Chart Data (computed from orders)

**Payment Modes**: Group today's paid orders by `payment_method` (cash, card, both, pay_later)

**Order Types**: Group today's orders by `order_type` (dine_in, takeaway, self_pickup, delivery)

**Sales by Category**: Join `pos_order_items` -> `pos_menu_items` -> `maintenance_categories` to get category breakdown. If no category data, show "Uncategorized".

---

## Donut Chart Design

- Recharts `PieChart` with `innerRadius={50}` `outerRadius={80}` for donut effect
- Center text showing total count or total SAR
- Soft pastel colors: `#2c8cb4`, `#32c080`, `#dc8c3c`, `#64b4e0`, `#a09888`, `#8b5cf6`
- Legend items below chart with color dots + label + percentage
- Animated on load with `animationDuration={800}`
- Card wrapper with section header

---

## Scrollable Lists Design

- Fixed height `max-h-[400px]` with `overflow-y-auto`
- Sticky header row
- Alternating row backgrounds for readability
- Each list in a Card with header title
- 3 columns side by side on desktop (`grid-cols-3`), stacked on mobile

---

## Auto-Refresh

- `refetchInterval: 60000` (60 seconds) on all order queries
- Small refresh indicator in header (spinning icon during refetch)

---

## Loading States

- Full skeleton layout while initial data loads
- Individual shimmer cards for each section
- Block UI overlay not needed since queries are fast

---

## Color Palette (unchanged)

| Color | Hex | Usage |
|-------|-----|-------|
| Teal | `#2c8cb4` | Headers, primary accents |
| Mint | `#32c080` | Positive trends |
| Orange | `#dc8c3c` | Warnings, financial highlights |
| Cyan | `#64b4e0` | Secondary metrics |
| Warm Gray | `#a09888` | Neutral text |

---

## Files Summary

| File | Action |
|------|--------|
| `src/hooks/useBranchDashboardData.ts` | Create -- new hook with branch-filtered queries |
| `src/components/dashboard/DonutChartCard.tsx` | Create -- reusable donut chart |
| `src/components/dashboard/CashierDutyTable.tsx` | Create -- staff on duty table |
| `src/components/dashboard/RecentOrdersList.tsx` | Create -- latest 50 orders |
| `src/components/dashboard/SlowestOrdersList.tsx` | Create -- slowest orders |
| `src/components/dashboard/StaffAttendanceList.tsx` | Create -- staff attendance list |
| `src/components/dashboard/mockDashboardData.ts` | Update -- add new interfaces |
| `src/components/dashboard/DashboardHeader.tsx` | Update -- add branch selector |
| `src/pages/Dashboard.tsx` | Rewrite -- compose branch dashboard |
| `src/hooks/useDashboardData.ts` | Keep as-is (can be removed later) |

No database changes required.

