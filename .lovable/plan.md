

# Redesign Finance Charts to Match Premium Dashboard Pattern

## Visual Style (from reference image)

The reference image shows a modern analytics dashboard with these design characteristics:
- **Gradient area fills** under line charts (cyan-to-transparent, purple-to-transparent)
- **Data point labels** shown on peaks with rounded badges
- **Dual-tone bar charts** using purple-to-cyan gradients
- **Stacked area charts** with layered purple/blue fills
- **Clean donut charts** with bold center values
- **Big number KPI strips** below charts with descriptions
- **Dotted leader lines** in legend lists connecting label to value
- **Rounded, soft color palette**: cyan (`#00d4ff`), purple (`#7c3aed`), pink (`#ec4899`), soft blue (`#6366f1`)

## Changes

### 1. New Chart Components

**`FinanceAreaChart.tsx`** (new)
- Gradient-filled area chart like the "LATINE" and "CHORO" examples
- Supports single or stacked areas
- Data point labels on peaks (customizable)
- Used for: Revenue trends, VAT trends, profit trends

**`FinanceStackedAreaChart.tsx`** (new)
- Multi-series stacked area with layered gradient fills (purple/blue/cyan)
- Legend strip below with colored dots and values
- Used for: Revenue composition, expense breakdown over time

**`FinanceGradientBarChart.tsx`** (new)
- Vertical bars with gradient fills (purple-to-cyan)
- Value labels on top of each bar
- Monthly axis labels
- Used for: Branch comparisons, category breakdowns

**`FinanceLegendList.tsx`** (new)
- Horizontal dotted leader lines between label and value (like "VOCIBUS" section)
- Colored dots for each item
- Used alongside donut charts and standalone

### 2. Redesign Existing Components

**`FinanceLineChart.tsx`** -- Redesign
- Add gradient area fill beneath each line
- Show data point circles with white fill + colored stroke
- Add value labels on key data points
- Softer grid lines, remove axis strokes
- New color palette: cyan, purple, pink

**`FinanceBarChart.tsx`** -- Redesign
- Apply linear gradient fill (bottom purple to top cyan)
- Value labels above each bar
- Rounded top corners (already has radius)
- Lighter grid, no axis stroke

**`FinanceDonutChart.tsx`** -- Redesign
- Bold center label showing total/primary value
- Updated colors to match palette
- Replace default legend with `FinanceLegendList`

**`SparklineChart.tsx`** -- Redesign
- Use updated gradient colors matching new palette

**`FinanceKPICard.tsx`** -- Redesign
- Add big number stat strips below charts (3 across) showing key metrics with descriptions
- Bolder value typography

### 3. Update All Finance Pages

**`FinanceOverview.tsx`**
- Replace existing line chart with new `FinanceAreaChart` for revenue trend
- Add a `FinanceStackedAreaChart` showing revenue composition
- Replace bar chart with `FinanceGradientBarChart`
- Add `FinanceLegendList` alongside donut chart
- Add a KPI stat strip row (3 big numbers with descriptions)

**`RevenueReport.tsx`**
- Replace bar chart with `FinanceGradientBarChart`
- Replace donut with redesigned donut + legend list
- Add area chart for revenue over time in branch tab

**`VATReport.tsx`**
- Add `FinanceAreaChart` showing VAT trend over time
- Add big number strip: Total Taxable, Total VAT, Total Inclusive

**`CancellationsReport.tsx`**
- Replace line chart with `FinanceAreaChart` (orange/pink gradient)
- Redesign donut chart with center label showing count
- Add stat strip below trend chart

**`ExpensesProfit.tsx`**
- Replace bar chart with `FinanceGradientBarChart`
- Add `FinanceStackedAreaChart` for expense categories over time
- Add margin trend area chart

### 4. New Color Palette

| Usage | Color | Hex |
|-------|-------|-----|
| Primary / Revenue | Cyan | `#00d4ff` |
| Secondary / Profit | Purple | `#7c3aed` |
| Accent / VAT | Indigo | `#6366f1` |
| Warning / Cancel | Pink | `#ec4899` |
| Neutral | Soft Blue | `#60a5fa` |
| Muted | Light Purple | `#a78bfa` |

### 5. File Summary

| File | Action |
|------|--------|
| `src/components/finance/FinanceAreaChart.tsx` | Create |
| `src/components/finance/FinanceStackedAreaChart.tsx` | Create |
| `src/components/finance/FinanceGradientBarChart.tsx` | Create |
| `src/components/finance/FinanceLegendList.tsx` | Create |
| `src/components/finance/FinanceStatStrip.tsx` | Create |
| `src/components/finance/FinanceLineChart.tsx` | Redesign |
| `src/components/finance/FinanceBarChart.tsx` | Redesign |
| `src/components/finance/FinanceDonutChart.tsx` | Redesign |
| `src/components/finance/SparklineChart.tsx` | Redesign |
| `src/components/finance/FinanceKPICard.tsx` | Redesign |
| `src/components/finance/index.ts` | Update exports |
| `src/pages/finance/FinanceOverview.tsx` | Update with new charts |
| `src/pages/finance/RevenueReport.tsx` | Update with new charts |
| `src/pages/finance/VATReport.tsx` | Update with new charts |
| `src/pages/finance/CancellationsReport.tsx` | Update with new charts |
| `src/pages/finance/ExpensesProfit.tsx` | Update with new charts |

