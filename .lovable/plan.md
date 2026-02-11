

# Restaurant Group Real-Time Dashboard

## Overview

Replace the current basic Dashboard page with a comprehensive, visually rich restaurant group dashboard featuring KPI gauges, revenue charts, staff metrics, and actionable alerts. Uses the specified color palette (teal headers, mint green positives, soft orange warnings) with Recharts for all visualizations.

Since the database has minimal live data, the dashboard will use realistic mock data that represents a 5-branch restaurant group. The architecture is designed so mock data sources can be swapped for real Supabase queries later.

---

## Color Palette (CSS Custom Properties)

| Token | Hex | Usage |
|-------|-----|-------|
| `--dash-teal` | `#2c8cb4` | Section headers, borders |
| `--dash-mint` | `#32c080` | Positive metrics, gains |
| `--dash-orange` | `#dc8c3c` | Warnings, money highlights |
| `--dash-cyan` | `#64b4e0` | Good performance, secondary |
| `--dash-warm-gray` | `#a09888` | Neutral/secondary text |

---

## Page Structure

```text
+------------------------------------------------------------------+
| HEADER BAR: Restaurant Group   Date/Time   Branches: 5   Status  |
+------------------------------------------------------------------+
| ROW 1: 4x KPI Gauge Cards (Revenue, Avg Check, Prep Time, CSAT) |
|   + Quick stats strip (Orders, Guests, Online Share)             |
+------------------------------------------------------------------+
| ROW 2: Revenue Trend Chart (AreaChart)  |  Branch Contribution   |
|         Hourly line with peak marker    |  (Horizontal BarChart) |
+------------------------------------------------------------------+
| ROW 3: Staff Attendance Card            |  Other Key Metrics     |
|   Gauge bar + productivity stats        |  6x mini stat cards    |
+------------------------------------------------------------------+
| ROW 4: Alerts & Actionable Insights                              |
|   Warning/success items with icons                               |
+------------------------------------------------------------------+
```

---

## Components to Create

### 1. `src/components/dashboard/DashboardHeader.tsx`
- Full-width teal-tinted header strip
- Shows: "Restaurant Group Dashboard", current date/time (auto-updating), branch count, currency, status badge ("Peak Lunch" / "Normal" based on hour)

### 2. `src/components/dashboard/KPIGaugeCard.tsx`
- Reusable card with: large value, label, trend indicator (up/down arrow + percentage), target comparison text
- Circular progress ring or mini radial chart using Recharts `RadialBarChart`
- Color-coded by performance (mint for good, orange for warning)

### 3. `src/components/dashboard/QuickStatsStrip.tsx`
- Horizontal strip below KPI cards
- Shows: Orders count, Guests count, Online+Delivery share with trend arrows
- Subtle background, inline layout

### 4. `src/components/dashboard/RevenueTrendChart.tsx`
- Recharts `AreaChart` showing hourly revenue (08:00-22:00)
- Gradient fill in teal/cyan
- Peak hour annotation marker
- Custom tooltip showing SAR amount + hour

### 5. `src/components/dashboard/BranchContributionChart.tsx`
- Recharts horizontal `BarChart`
- 5 branches with percentage labels
- Bars colored in teal gradient

### 6. `src/components/dashboard/StaffAttendanceCard.tsx`
- Progress bar gauge (attendance %)
- Stats grid: Scheduled hrs, Clocked hrs, Overtime, Absenteeism
- Sales per server hour, top branch highlight

### 7. `src/components/dashboard/KeyMetricsGrid.tsx`
- 6 mini cards in a 3x2 grid
- Each: icon, metric name, value, small trend
- Metrics: Order Accuracy, Complaint Resolution, Repeat Guest Rate, App Orders Growth, Peak Hour Contribution, Top Category

### 8. `src/components/dashboard/AlertsPanel.tsx`
- List of alert items with warning (orange) and success (mint) icons
- Each alert: icon + message text
- "Next Action" item at bottom

### 9. `src/components/dashboard/mockDashboardData.ts`
- All mock data in one file for easy future replacement
- Typed interfaces for each data section

---

## Technical Details

### Chart Library
Already installed: `recharts ^2.15.4` -- used via existing `chart.tsx` UI component.

Charts used:
- `RadialBarChart` for KPI gauge rings
- `AreaChart` for revenue hourly trend
- `BarChart` (horizontal) for branch contribution
- `PieChart` (optional) for channel mix

### Styling Approach
- Dashboard-specific colors applied via inline styles and Tailwind arbitrary values
- Cards use existing `Card` component with custom border colors
- Section headers use the teal color with left border accent
- All cards have subtle shadows and hover effects

### Mock Data Structure
```typescript
interface DashboardData {
  kpis: { revenue, avgCheck, prepTime, csatScore }
  quickStats: { orders, guests, onlineShare }
  hourlyRevenue: Array<{ hour, revenue, target }>
  branchContribution: Array<{ name, percentage, revenue }>
  staffMetrics: { scheduled, clocked, overtime, attendance, salesPerHour }
  keyMetrics: Array<{ label, value, trend, trendDirection }>
  alerts: Array<{ type, message }>
}
```

### Responsive Behavior
- 4-col KPI grid collapses to 2-col on medium screens
- Chart row splits to stacked on smaller screens
- Staff + metrics row stacks vertically on mobile

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/dashboard/mockDashboardData.ts` | Create -- all mock data |
| `src/components/dashboard/DashboardHeader.tsx` | Create -- top header strip |
| `src/components/dashboard/KPIGaugeCard.tsx` | Create -- radial gauge card |
| `src/components/dashboard/QuickStatsStrip.tsx` | Create -- inline stats |
| `src/components/dashboard/RevenueTrendChart.tsx` | Create -- hourly area chart |
| `src/components/dashboard/BranchContributionChart.tsx` | Create -- horizontal bar chart |
| `src/components/dashboard/StaffAttendanceCard.tsx` | Create -- attendance gauge |
| `src/components/dashboard/KeyMetricsGrid.tsx` | Create -- 6 mini metrics |
| `src/components/dashboard/AlertsPanel.tsx` | Create -- alerts list |
| `src/pages/Dashboard.tsx` | Rewrite -- compose all sections |

No database changes required -- this is a UI-only feature using mock data.

