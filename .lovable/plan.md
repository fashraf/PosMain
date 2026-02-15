# Dashboard Enhancement -- Rich Charts, KPIs & Financial Breakdowns

## What Changes

The dashboard will be significantly enhanced with new financial summary cards, collection status breakdowns, order type distribution charts, payment method analysis, and improved visual presentation across both the "All Branches" and single-branch views.

---

## New Components

### 1. `CollectionSummaryStrip` (new)

A prominent row of 4-5 hero cards showing financial collection status:

- **Total Amount** (all orders today) -- big bold SAR number
- **Collected** (paid orders) -- green accent with percentage of total
- **Not Collected** (pending orders) -- orange accent with count
- **Cancelled/Refunded** -- red accent with count and SAR value
- **VAT Collected** -- purple accent with SAR amount

Each card uses the existing `SparklineChart` underneath for hourly trend and shows vs-yesterday percentage change.

### 2. `PaymentMethodChart` (new)

A horizontal bar chart showing cash vs card vs both vs pay_later breakdown:

- Each bar shows SAR amount and order count
- Color-coded bars (Cash: green, Card: blue, Both: purple, Pay Later: orange)
- Percentage labels on each bar

### 3. `OrderTypeBarChart` (new)

A vertical bar chart (Recharts) showing dine-in, takeaway, delivery, self-pickup:

- Gradient bars matching the finance chart style
- Value labels on top of each bar
- Order count + SAR revenue dual axis

### 4. `HourlyOrdersChart` (new)

A bar chart showing order count per hour (complementing the existing revenue trend):

- Today bars solid, yesterday bars outlined/dashed
- Highlights peak hour with a badge

### 5. `TopSellingItemsCard` (new)

A ranked list of top 10 selling items by revenue:

- Item name, quantity sold, total revenue
- Small horizontal progress bar showing relative contribution
- Only shown in single-branch view (uses `orderItemsQuery` data already fetched)

---

## Data Hook Enhancements

### `useDashboardData.ts` -- Add to "All Branches" view:

- `collectionSummary`: object with `{ totalAmount, collected, notCollected, cancelled, vatCollected }` and their yesterday comparisons
- `paymentMethodBreakdown`: array `{ method, count, amount }` from `todayPaid`
- `orderTypeBreakdown`: array `{ type, count, amount }` from `todayOrders`
- `hourlyOrders`: array `{ hour, count, yesterdayCount }` (order count, not revenue)

### `useBranchDashboardData.ts` -- Add to single-branch view:

- `collectionSummary`: same structure as above but branch-filtered
- `topSellingItems`: array `{ name, quantity, revenue }` from `orderItemsQuery` data (already fetched)
- `hourlyOrders`: order count per hour for bar chart

---

## Dashboard Layout Changes

### All Branches View (new layout order):

1. **DashboardHeader** (unchanged)
2. **CollectionSummaryStrip** (NEW -- hero financial cards)
3. **BOZCardGrid** (existing branch cards)
4. **BOZCompactTable** (existing compact table)
5. **BranchComparisonPanel** (existing)
6. **QuickStatsStrip** (existing, refined)
7. **Two charts side-by-side**: RevenueTrendChart + HourlyOrdersChart (NEW)
8. **Two charts side-by-side**: PaymentMethodChart (NEW) + OrderTypeBarChart (NEW)
9. **Two charts side-by-side**: BranchContributionChart (existing) + StaffAttendanceCard (existing)
10. **KeyMetricsGrid** (existing)
11. **AlertsPanel** (existing)

### Single Branch View (new layout order):

1. **DashboardHeader** (unchanged)
2. **CollectionSummaryStrip** (NEW -- branch-specific)
3. **BranchDetailKPIStrip** (existing 6-card strip)
4. **Today vs Yesterday comparison** (existing inline strip)
5. **QuickStatsStrip** (existing)
6. **Three Donut Charts** (existing: Payment Modes, Category, Order Types)
7. **Two charts side-by-side**: RevenueTrendChart + HourlyOrdersChart (NEW)
8. **Two charts side-by-side**: PaymentMethodChart (NEW) + TopSellingItemsCard (NEW)
9. **Two cards side-by-side**: RecentActivityFeed + CashierDutyTable (existing)
10. **KeyMetricsGrid** (existing)
11. **Three scrollable lists** (existing: Recent Orders, Slowest, Staff)
12. **AlertsPanel** (existing)
13. **BranchReportLinks** (existing)

---

## Visual Design

- **CollectionSummaryStrip cards**: Large `text-2xl font-bold` numbers, colored left border (4px), subtle gradient background matching the card's accent color at 5% opacity, sparkline underneath
- **PaymentMethodChart**: Horizontal bars with rounded ends, value + percentage labels, gradient fills
- **OrderTypeBarChart**: Uses the same gradient style as `FinanceGradientBarChart` (purple-to-cyan)
- **HourlyOrdersChart**: Clean vertical bars, today (solid teal) vs yesterday (light grey outline)
- **TopSellingItemsCard**: Numbered list with horizontal mini-bars showing relative revenue share

Color palette remains consistent: Teal (#2c8cb4), Mint (#32c080), Orange (#dc8c3c), Cyan (#64b4e0), Purple (#8b5cf6)

---

## Technical Details

### File Summary


| File                                                  | Action                                                                                    |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/components/dashboard/CollectionSummaryStrip.tsx` | Create -- hero financial cards row                                                        |
| `src/components/dashboard/PaymentMethodChart.tsx`     | Create -- horizontal bar chart for cash/card/etc                                          |
| `src/components/dashboard/OrderTypeBarChart.tsx`      | Create -- vertical bar chart for dine-in/takeaway/etc                                     |
| `src/components/dashboard/HourlyOrdersChart.tsx`      | Create -- bar chart for order count by hour                                               |
| `src/components/dashboard/TopSellingItemsCard.tsx`    | Create -- ranked item list for branch view                                                |
| `src/hooks/useDashboardData.ts`                       | Update -- add collectionSummary, paymentMethodBreakdown, orderTypeBreakdown, hourlyOrders |
| `src/hooks/useBranchDashboardData.ts`                 | Update -- add collectionSummary, topSellingItems, hourlyOrders                            |
| `src/pages/Dashboard.tsx`                             | Update -- integrate new components into both views                                        |


### Data Computation (in hooks)

**collectionSummary** (computed from existing `todayOrders` and `yesterdayOrders`):

```
totalAmount = sum of all orders' total_amount
collected = sum of paid orders' total_amount  
notCollected = sum of pending orders' total_amount
cancelledAmount = sum of cancelled orders' total_amount
vatCollected = sum of paid orders' vat_amount
```

Each field includes a `change` percentage vs yesterday.

**paymentMethodBreakdown** (from `todayPaid`):

```
Group by payment_method -> { method, count, amount }
```

**orderTypeBreakdown** (from `todayOrders`):

```
Group by order_type -> { type, count, amount }
```

**topSellingItems** (from existing `orderItemsQuery` in branch hook):

```
Group by item_name -> { name, quantity: sum(qty), revenue: sum(line_total) }
Sort by revenue desc, take top 10
```

No new database queries needed -- all data is already fetched by existing queries. These are purely computed aggregations.  
  
/ page  
  
also font should be darker / bolder brighter and focused. 