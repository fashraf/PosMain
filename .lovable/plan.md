

# Dashboard: All Branches + Per-Branch Toggle

## Overview

Add an "All Branches" option to the branch dropdown. When selected, show the group-level overview dashboard (aggregated across all branches with Branch Contribution chart). When a specific branch is selected, show the branch-specific dashboard (current layout with donuts, cashier table, scrollable lists).

---

## How It Works

The branch selector dropdown gets a new first option: **"All Branches"**. This uses a sentinel value `"__all__"` instead of a real branch UUID.

- `selectedBranchId === "__all__"` --> render group dashboard (existing `useDashboardData` hook)
- `selectedBranchId === "<uuid>"` --> render branch dashboard (existing `useBranchDashboardData` hook)
- Default selection on load: `"__all__"`

---

## Changes

### 1. `src/components/dashboard/DashboardHeader.tsx`

- Add `"All Branches"` as the first `SelectItem` with value `"__all__"`
- Update the title logic: when `"__all__"` is selected, show "All Branches -- Dashboard"
- Keep `onBranchChange` signature the same (still `(id: string) => void`)

### 2. `src/pages/Dashboard.tsx`

- Change default `selectedBranchId` from `null` to `"__all__"` (no more auto-select first branch)
- Conditionally call both hooks (both always called for React rules, but `useBranchDashboardData` gets `null` when "All Branches" is selected so it returns empty/skipped data)
- Render two different layouts based on selection:
  - **All Branches view**: KPI Gauges (4 cards), Quick Stats Strip, Revenue Trend (Today vs Yesterday), Branch Contribution Chart + Staff Attendance Card side-by-side, Key Metrics Grid, Alerts Panel
  - **Branch view**: Current layout (3 KPI cards, Quick Stats, 3 Donuts, Revenue Trend, Cashier Table + Key Metrics, 3 Scrollable Lists, Alerts)

### 3. `src/hooks/useDashboardData.ts`

- No changes needed -- already works as a group-level aggregator

### 4. `src/hooks/useBranchDashboardData.ts`

- No changes needed -- already accepts `branchId | null` and skips queries when null

---

## Layout Comparison

**All Branches selected:**
```text
+------------------------------------------------------------------+
| HEADER: [All Branches v] | Date/Time | Status | Refresh          |
+------------------------------------------------------------------+
| ROW 1: 4x KPI Gauges (Revenue, Avg Check, Orders, Cancelled)    |
+------------------------------------------------------------------+
| ROW 2: Quick Stats (Paid, Pending, Active Branches, Active Staff)|
+------------------------------------------------------------------+
| ROW 3: Revenue Trend (full width, Today vs Yesterday)            |
+------------------------------------------------------------------+
| ROW 4: Branch Contribution Chart | Staff Attendance Card         |
+------------------------------------------------------------------+
| ROW 5: Key Metrics Grid (full width)                             |
+------------------------------------------------------------------+
| ROW 6: Alerts Panel                                              |
+------------------------------------------------------------------+
```

**Specific Branch selected:**
```text
+------------------------------------------------------------------+
| HEADER: [Downtown Main v] | Date/Time | Status | Refresh        |
+------------------------------------------------------------------+
| ROW 1: 3x KPI Gauges (Revenue, Avg Check, Orders)               |
+------------------------------------------------------------------+
| ROW 2: Quick Stats (Paid, Pending, Cancelled, Staff)             |
+------------------------------------------------------------------+
| ROW 3: 3x Donut Charts (Payment, Category, Order Types)         |
+------------------------------------------------------------------+
| ROW 4: Revenue Trend (full width)                                |
+------------------------------------------------------------------+
| ROW 5: Cashier Duty Table | Key Metrics Grid                    |
+------------------------------------------------------------------+
| ROW 6: 3x Scrollable Lists (Recent, Slowest, Staff)             |
+------------------------------------------------------------------+
| ROW 7: Alerts Panel                                              |
+------------------------------------------------------------------+
```

---

## Technical Details

### Sentinel Value
```typescript
const ALL_BRANCHES = "__all__";
const isAllBranches = selectedBranchId === ALL_BRANCHES;
```

### Both hooks called unconditionally (React rules)
```typescript
const groupData = useDashboardData();
const branchData = useBranchDashboardData(isAllBranches ? null : selectedBranchId);
```

When `isAllBranches` is true, `branchData` queries are all skipped (`enabled: !!branchId` returns false), so no unnecessary network calls.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/Dashboard.tsx` | Conditional rendering for All vs Branch view, default to `"__all__"` |
| `src/components/dashboard/DashboardHeader.tsx` | Add "All Branches" option to dropdown |

No new files, no database changes.

also 

   -webkit-text-size-adjust:100%;
        tab-size: 4;
        line-height: 1.5;
        font-family: var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");
        font-feature-settings: var(--default-font-feature-settings,normal);
        font-variation-settings: var(--default-font-variation-settings,normal);
        -webkit-tap-highlight-color: transparent

as a uniform style everywhere 

