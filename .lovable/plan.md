
# Improve Shifts Grid View and Filters

## Changes

### 1. Replace inline filters with `GridFilters` component
The Shifts page currently uses manually coded search and filter elements. We'll replace them with the reusable `GridFilters` component (already used across other pages) for consistency: debounced search, status dropdown filter, and the "Add Shift" button all in one clean row.

### 2. Upgrade table header to premium gradient style
Replace the plain `MaintenanceTable` with a custom table that uses the premium gradient header pattern (`bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80`) matching the User Management grid. Each column header will include a small muted icon for visual polish.

### 3. Merge page header and filters into a single compact bar
Combine the title, subtitle, filters, and action button into a unified top section -- removing the separate header block and filter row to save vertical space.

---

## Technical Details

### File: `src/pages/maintenance/Shifts.tsx`

**Remove**: The two separate header blocks (title + filters) at lines 158-187.

**Replace with**: A single `GridFilters` bar containing:
- Title: "Shift Management"
- Status filter dropdown (All / Active / Inactive)
- Debounced search input (placeholder: "Search shifts...")
- Add Shift button as `actionButton`

**Replace `MaintenanceTable`** usage with a custom inline table using:
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` from `@/components/ui/table`
- Gradient header row: `className="bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80 h-[42px]"`
- Column headers with small icons (Clock for Timing, Calendar for Period, ToggleLeft for Status, etc.)
- Zebra striping and lavender hover preserved
- Inline Switch + Edit button in actions column
- Serial number column

**Imports to add**: `Table, TableHeader, TableBody, TableRow, TableHead, TableCell`, `Calendar, ToggleLeft`, `GridFilters`

**Imports to remove**: `Search, Info` (no longer needed), `Input`, standalone `Select` components, `Tooltip`
