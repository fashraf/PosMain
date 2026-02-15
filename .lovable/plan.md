

# Branch Insights & Finance Dashboard -- BOZ (Board of Zones)

## Overview

This is a major redesign of the Dashboard page (`/`) to introduce a **BOZ (Board of Zones)** multi-branch overview as the default "All Branches" view, plus a redesigned single-branch detail view. The Finance Overview page (`/finance`) will also be enhanced with a compact BOZ table view. A branch comparison feature will allow selecting multiple branches for side-by-side analysis.

---

## Architecture

The current Dashboard page already has the dual-view pattern (All Branches vs Single Branch). This redesign will:
1. Replace the "All Branches" view with the BOZ card grid
2. Redesign the single-branch detail view with richer KPIs and activity feeds
3. Add a branch comparison mode (select 2-3 branches)
4. Introduce new reusable components for branch cards, comparison panels, and activity feeds

---

## View 1: BOZ Overview (All Branches)

When "All Branches" is selected in the header dropdown, show:

### Row 1 -- Branch Cards Grid
A responsive grid (2 columns on desktop, 1 on tablet) of **BranchInsightCard** components. Each card contains:

```
+-------------------------------+
|        Riyadh Downtown        |  <-- Branch name header
+-------------------------------+
| Total Orders      248         |
| Last Placed       3 min ago   |  <-- relative time, color-coded
| Cancellations     14    -4%   |  <-- vs yesterday indicator
| Staff On Duty     11 / 12     |
| Revenue           18,420 SAR  |
| vs Yesterday      +12%  (up)  |  <-- green/red arrow
+-------------------------------+
```

- Sections separated by dotted lines (`border-dotted`)
- Hover shows tooltip with order type breakdown (62% delivery, 28% dine-in, 10% takeaway)
- Shadow on hover for interactivity feel
- Clicking a card switches the dropdown to that branch (loads branch detail view)
- Color indicators: green arrow for positive change, red for negative, grey for stable

**Data source**: Existing `useDashboardData` hook extended to compute per-branch metrics (orders, last order time, cancellations, staff count, revenue, vs-yesterday comparison).

### Row 2 -- Branch Comparison Section
- Checkbox row: `[ ] Riyadh Downtown  [x] Jeddah  [x] Dammam`
- When 2+ branches are checked, show a **ComparisonSummaryPanel**:
  - Side-by-side horizontal bars for Orders, Revenue, Cancellations
  - Percentage vs average indicators
  - Small comparison table with branch names as columns

### Row 3 -- Compact BOZ Table (Quick Scan)
A table alternative to cards for fast scanning:

| Branch | Orders | Last | Cancel. | Staff | Revenue | vs Yest |
|--------|--------|------|---------|-------|---------|---------|
| Riyadh | 248 (up) | 3m ago | 14 (down) | 11 | 18.4k SAR | +12% (up) |

- 42px rows, dotted borders, zebra striping
- Arrows and color-coded percentages inline
- Sparkline column showing today's revenue curve per branch

### Row 4 -- Aggregate KPI Strip
Same as current but refined: Total Revenue, Total Orders, Avg Check, Total Cancellations across all branches.

### Row 5 -- Charts (existing)
Keep the Revenue Trend chart, Branch Contribution bar chart, and Alerts panel.

---

## View 2: Branch Detail Dashboard (Single Branch Selected)

When a specific branch is selected, show:

### Row 1 -- Enhanced KPI Cards (6 cards)
```
| Total Orders | Revenue | Cancellations | Avg Order Time | Staff On Duty | Last Order |
|     248      | 18,420  |      14       |    7.1 min     |   11 / 12     | 3 min ago  |
|   +12% (up)  | +12%    |   -22% (down) |   -9% (down)   |               |            |
```
Each card shows: big number, vs-yesterday percentage, mini sparkline underneath.

### Row 2 -- Today vs Yesterday KPI Comparison Strip
A horizontal strip with dotted separators:
```
Total Orders: 248 | Yesterday: 221 | +12.2% (up)
Revenue: 18,420   | Yesterday: 16,450 | +12.0% (up)
Cancellations: 14 | Yesterday: 18 | -22.2% (down)
```

### Row 3 -- Charts Side-by-Side
- Left: **Orders by Hour** bar chart (today vs yesterday overlay)
- Right: **Orders by Type** donut chart (Dine-in, Takeaway, Delivery)

### Row 4 -- Recent Activity Feed
A scrollable card showing recent events with timestamps:
```
* #ORD-394821  Placed    3 min ago    SAR 148   Delivery
* #ORD-394819  Cancelled 18 min ago   Reason: Customer changed mind
* Ahmed        Clock-in  07:45 AM
```
Mixed order + staff events, color-coded by type.

### Row 5 -- Alerts & Highlights
Enhanced alert panel with color-coded badges:
- Red: "High cancellations in last 60 min (4 cases)"
- Green: "Revenue 14% above daily target"
- Yellow: "Pending orders: 9 (target less than 5)"

### Row 6 -- Reports Quick Links
Buttons: `[ Daily Summary ]  [ Weekly Trend ]  [ Branch Comparison ]  [ Export PDF/Excel ]`
These link to the existing finance report pages with the branch pre-selected.

---

## New Components

| Component | File | Purpose |
|-----------|------|---------|
| **BranchInsightCard** | `src/components/dashboard/BranchInsightCard.tsx` | Individual branch card for BOZ grid |
| **BOZCardGrid** | `src/components/dashboard/BOZCardGrid.tsx` | Grid container rendering all branch cards |
| **BOZCompactTable** | `src/components/dashboard/BOZCompactTable.tsx` | Table alternative for quick scan view |
| **BranchComparisonPanel** | `src/components/dashboard/BranchComparisonPanel.tsx` | Side-by-side comparison when branches are checked |
| **BranchDetailKPIStrip** | `src/components/dashboard/BranchDetailKPIStrip.tsx` | Enhanced KPI row for single-branch view |
| **RecentActivityFeed** | `src/components/dashboard/RecentActivityFeed.tsx` | Mixed activity log (orders + staff events) |
| **BranchReportLinks** | `src/components/dashboard/BranchReportLinks.tsx` | Quick link buttons to finance reports |

---

## Data Hook Changes

### `useDashboardData.ts` -- Extend
Add per-branch breakdown to the "All Branches" query:
- For each active branch, compute: total orders, last order timestamp, cancellation count, cancellation change vs yesterday, staff count (from `user_branches`), revenue, revenue change vs yesterday.
- Return a `branchInsights` array used by `BOZCardGrid`.

### `useBranchDashboardData.ts` -- Extend
Add:
- `lastOrderTime`: timestamp of most recent order for relative display ("3 min ago")
- `yesterdayComparison`: structured object with metric-by-metric comparison
- `recentActivity`: merged feed of recent orders and staff events (last 10 entries)

---

## Visual Design Specifications

### Branch Card Styling
- `border: 1px solid border-color` with `shadow-sm`, `hover:shadow-lg` transition
- Sections separated by `border-dotted border-muted` horizontal lines
- Branch name in a tinted header bar (subtle gradient like existing dashboard header)
- Numbers in `text-lg font-bold`, labels in `text-xs text-muted-foreground`
- Trend arrows: green (#32c080) for up, orange (#dc8c3c) for down, grey (#a09888) for stable
- "Last Placed" uses the existing `getTimeAgo` utility from `src/lib/pos/timeAgo.ts` with color coding

### Compact Table Styling
- Follows Premium Grid standards (42px rows, zebra #F9FAFB/white, lavender hover #F3F0FF)
- Dotted horizontal borders (`border-dotted`)
- Inline sparklines using the existing `SparklineChart` component (36px height)

### Comparison Panel
- Light background card (`bg-muted/30`)
- Horizontal bar segments using CSS widths (no heavy chart library needed)
- Branch names as labels with colored dots

### Color Legend
- Green (#32c080): above target / improving
- Yellow/Orange (#dc8c3c): stable / needs attention
- Red (#ef4444): below target / critical
- Teal (#2c8cb4): headers and primary accents

---

## Updated Page Structure

### Dashboard.tsx (redesigned)
```
All Branches view:
  DashboardHeader (existing, unchanged)
  BOZCardGrid (new -- branch insight cards)
  BOZCompactTable (new -- table alternative)
  BranchComparisonPanel (new -- when branches selected)
  QuickStatsStrip (existing)
  RevenueTrendChart (existing)
  BranchContributionChart + StaffAttendanceCard (existing)
  AlertsPanel (existing)

Single Branch view:
  DashboardHeader (existing)
  BranchDetailKPIStrip (new -- 6 enhanced KPI cards)
  Today vs Yesterday comparison strip (inline)
  DonutChartCard x3 (existing)
  RevenueTrendChart (existing)
  RecentActivityFeed (new -- mixed activity log)
  CashierDutyTable + KeyMetricsGrid (existing)
  AlertsPanel (existing)
  BranchReportLinks (new -- links to /finance/*)
```

---

## File Summary

| File | Action |
|------|--------|
| `src/components/dashboard/BranchInsightCard.tsx` | Create |
| `src/components/dashboard/BOZCardGrid.tsx` | Create |
| `src/components/dashboard/BOZCompactTable.tsx` | Create |
| `src/components/dashboard/BranchComparisonPanel.tsx` | Create |
| `src/components/dashboard/BranchDetailKPIStrip.tsx` | Create |
| `src/components/dashboard/RecentActivityFeed.tsx` | Create |
| `src/components/dashboard/BranchReportLinks.tsx` | Create |
| `src/hooks/useDashboardData.ts` | Update -- add branchInsights array |
| `src/hooks/useBranchDashboardData.ts` | Update -- add lastOrderTime, recentActivity |
| `src/pages/Dashboard.tsx` | Redesign -- BOZ view + enhanced branch view |
| `src/lib/i18n/translations.ts` | Update -- add BOZ-related translation keys |

No database changes required -- all data comes from existing tables (`pos_orders`, `branches`, `profiles`, `user_branches`).

