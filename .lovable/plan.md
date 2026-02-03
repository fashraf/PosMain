

# High-Density Premium Grid System Implementation

## Overview
Create a reusable, consistent, premium-feeling data grid system starting with the Items list, then propagate to all other tables (Ingredients, Sales Channels, etc.). The system follows a flat, density-first design with 15-row pagination.

---

## Visual Design Specifications

### Grid Layout Reference
```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  Items                                                   [Status ▼] [Type ▼] [🔍 Search] │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ #  │ IMG │ Name          │ Type   │ Cost     │ Total    │ ☐ │ ⚠ │ Status   │ Actions   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 1  │ 📷  │ Margherita... │ Single │ SAR 12.99│ SAR 12.99│   │   │ ●Active  │ 👁 ✏️ 🗑   │
│ 2  │ 📷  │ Chicken Bur...│ Single │ SAR 8.99 │ SAR 8.99 │   │   │ ●Active  │ 👁 ✏️ 🗑   │
│ 3  │ 📷  │ Family Meal...│ Combo  │ SAR 45.99│ SAR 92.00│ ☑ │   │ ●Active  │ 👁 ✏️ 🗑   │
│    │     │ └─ 2x Pizza   │        │          │          │   │   │          │           │
│    │     │ └─ 4x Burger  │        │          │          │   │   │          │           │
│ 4  │ 📷  │ Paper Napkins │ Single │ SAR 2.99 │ SAR 2.99 │   │ ⚠ │ ○Inactive│ 👁 ✏️ 🗑   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                               ◀ 1  2  3  ...  10 ▶                    Showing 1-15 of 45│
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Color Palette (Exact Hex)
| Element | Color | Notes |
|---------|-------|-------|
| Background | `#FFFFFF` | Table base |
| Zebra stripe | `#F9FAFB` | Alternating rows |
| Header bg | `#F9FAFB` | Sticky header |
| Border | `#E5E7EB` | 1px horizontal only |
| Text primary | `#111827` | Names, numbers |
| Text secondary | `#6B7280` | Serial, labels |
| Primary accent | `#8B5CF6` | Active states, sorting |
| Hover row | `#F3F0FF` | Subtle lavender |
| Success badge bg | `#DCFCE7` | Active status |
| Success badge text | `#166534` | |
| Success badge border | `#86EFAC` | |
| Inactive badge bg | `#F3F4F6` | |
| Inactive badge text | `#4B5563` | |
| Warning icon | `#F59E0B` | Alert triangle |
| Danger | `#EF4444` | Delete hover |

---

## Component Architecture

### New Files to Create
| File | Purpose |
|------|---------|
| `src/components/shared/PremiumDataGrid.tsx` | Reusable premium grid wrapper |
| `src/components/shared/GridFilters.tsx` | Filter bar component (search + dropdowns) |
| `src/components/shared/GridPagination.tsx` | Simple numbered pagination (15 per page) |
| `src/components/shared/GridStatusBadge.tsx` | Premium pill status badge |
| `src/components/shared/GridActionButtons.tsx` | Icon-only action buttons with tooltips |

### Files to Modify
| File | Changes |
|------|---------|
| `src/components/items/ItemTable.tsx` | Replace with new premium grid |
| `src/pages/Items.tsx` | Update filters, pagination logic, remove Card wrappers |
| `src/components/ui/table.tsx` | Update base styles for premium feel |
| `src/components/shared/StatusBadge.tsx` | Enhance with new pill design |
| `src/index.css` | Add premium grid utility classes |

---

## Detailed Component Specifications

### 1. PremiumDataGrid.tsx - Wrapper Component
```tsx
interface PremiumDataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number; // default 15
  onRowClick?: (row: T) => void;
  expandableRows?: boolean;
  renderExpandedRow?: (row: T) => React.ReactNode;
  emptyState?: React.ReactNode;
}
```

**Features:**
- Sticky header with `position: sticky; top: 0; z-index: 10`
- Zebra striping via `nth-child(even)` selector
- Row hover: `#F3F0FF` background
- 40-44px row height
- Horizontal scroll on mobile
- Priority columns pinned left

### 2. GridFilters.tsx - Top Filter Bar
**Layout:**
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Items (16px bold)     [Status ▼] [Type ▼]    [🔍 Search by name, type...] │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specs:**
- `justify-between` flex layout
- Left: Title (optional)
- Right: Filters + Search grouped tight
- Dropdowns: 120-140px wide, subtle border, clearable
- Search: 280-320px wide, debounce 300ms, lucide-search icon 16px

### 3. GridPagination.tsx - Simple Numbered Pagination
```text
◀  1  2  3  ...  10  ▶     Showing 1-15 of 150
```

**Specs:**
- Page buttons: 32x32px, current page bold with `#8B5CF6` text
- Arrows: ChevronLeft/Right icons
- Info text: `text-[13px] text-[#6B7280]`
- 15 items per page by default

### 4. GridStatusBadge.tsx - Premium Pill Badge
```tsx
// Active state
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium uppercase
  bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
  Active
</span>

// Inactive state
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium uppercase
  bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
  Inactive
</span>
```

### 5. GridActionButtons.tsx - Icon Actions with Tooltips
```tsx
<div className="flex items-center justify-end gap-2">
  <Tooltip><TooltipTrigger>
    <button className="w-6 h-6 flex items-center justify-center hover:bg-[#F3F0FF] rounded">
      <Eye size={16} strokeWidth={1.5} className="text-[#6B7280] hover:text-[#8B5CF6]" />
    </button>
  </TooltipTrigger><TooltipContent>View</TooltipContent></Tooltip>
  
  <Tooltip><TooltipTrigger>
    <button className="...">
      <Pencil size={16} strokeWidth={1.5} className="text-[#6B7280] hover:text-[#8B5CF6]" />
    </button>
  </TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
  
  <Tooltip><TooltipTrigger>
    <button className="...">
      <Trash2 size={16} strokeWidth={1.5} className="text-[#6B7280] hover:text-[#EF4444]" />
    </button>
  </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
</div>
```

---

## Items Grid Column Specifications

| # | Column | Width | Align | Content |
|---|--------|-------|-------|---------|
| 1 | Ser.No | 60px | center | Auto-increment `#6B7280` |
| 2 | Image | 52px | center | 36x36px rounded-[4px] thumbnail |
| 3 | Name | flex | left | Bold `#111827`, truncate + tooltip |
| 4 | Type | 80px | left | "Single" / "Combo" text or small badge |
| 5 | Cost | 100px | right | SAR XX.XX, bold if > 50 |
| 6 | Total | 100px | right | Calculated, right-aligned |
| 7 | Is Combo | 50px | center | Package icon (lucide-box) 16px, click expands |
| 8 | Warning | 40px | center | AlertTriangle `#F59E0B` with tooltip |
| 9 | Status | 90px | center | Premium pill badge |
| 10 | Actions | 100px | right | View, Edit, Delete icons |

### Sortable Columns (with chevron indicator)
- Name (asc/desc)
- Cost (asc/desc)
- Total (asc/desc)
- Active column header: text `#8B5CF6`

---

## Table Styling Updates (table.tsx)

### New Base Styles
```tsx
const Table = React.forwardRef<...>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn(
      "w-full caption-bottom text-[14px] border-collapse",
      className
    )} {...props} />
  </div>
));

const TableHeader = React.forwardRef<...>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(
    "sticky top-0 z-10 bg-[#F9FAFB] border-b border-[#E5E7EB]",
    "[&_tr]:border-b-0",
    className
  )} {...props} />
));

const TableHead = React.forwardRef<...>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn(
    "h-11 px-3 py-2 text-left align-middle font-semibold text-[13px] text-[#111827]",
    "[&:has([role=checkbox])]:pr-0",
    className
  )} {...props} />
));

const TableRow = React.forwardRef<...>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn(
    "h-[42px] border-b border-[#E5E7EB] transition-colors",
    "even:bg-[#F9FAFB] odd:bg-white",
    "hover:bg-[#F3F0FF] cursor-pointer",
    "data-[state=selected]:bg-[#F3F0FF]",
    className
  )} {...props} />
));

const TableCell = React.forwardRef<...>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn(
    "px-3 py-2 align-middle text-[14px]",
    "[&:has([role=checkbox])]:pr-0",
    className
  )} {...props} />
));
```

---

## Items.tsx Page Refactor

### New Structure
```tsx
export default function Items() {
  // State
  const [items, setItems] = useState<Item[]>(mockItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "single" | "combo">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const PAGE_SIZE = 15;

  // Filtering logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // status filter
      // type filter
      // search filter
    });
  }, [items, statusFilter, typeFilter, searchQuery]);

  // Sorting logic
  const sortedItems = useMemo(() => { ... }, [filteredItems, sortConfig]);

  // Pagination logic
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedItems.slice(start, start + PAGE_SIZE);
  }, [sortedItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Top Controls - No Card wrapper */}
      <GridFilters
        title={t("items.title")}
        filters={[
          { key: "status", label: "Status", options: [...] },
          { key: "type", label: "Type", options: [...] },
        ]}
        searchPlaceholder="Search by name, type..."
        onFilterChange={...}
        onSearch={...}
        actionButton={<Button><Plus /> Add Item</Button>}
      />

      {/* Table - No Card wrapper, flat design */}
      <div className="border border-[#E5E7EB] rounded-md overflow-hidden">
        {paginatedItems.length === 0 ? (
          <EmptyState ... />
        ) : (
          <ItemsGrid
            items={paginatedItems}
            startIndex={(currentPage - 1) * PAGE_SIZE}
            expandedRows={expandedRows}
            onToggleExpand={...}
            sortConfig={sortConfig}
            onSort={...}
            onView={...}
            onEdit={...}
            onDelete={...}
            onToggleStatus={...}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <GridPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
```

---

## Expandable Combo Rows

When a combo item is clicked (Package icon), expand to show sub-items:
```text
│ 3  │ 📷  │ Family Meal   │ Combo  │ SAR 45.99│ SAR 92.00│ 📦 │   │ ●Active  │ 👁 ✏️ 🗑   │
│    ├─────┴───────────────────────────────────────────────────────┴───────────┴───────────┤
│    │     → 2x Margherita Pizza         SAR 12.99 each                                    │
│    │     → 4x Chicken Burger           SAR 8.99 each                                     │
│    ├─────────────────────────────────────────────────────────────────────────────────────┤
```

**Styling:**
- Indented 24px from left
- Same row height (40px)
- Arrow prefix `→`
- Lighter text `#6B7280`
- No zebra striping in sub-rows
- Smooth height transition (150ms)

---

## CSS Additions (index.css)

```css
@layer components {
  /* Premium Grid Styles */
  .premium-grid {
    @apply border border-[#E5E7EB] rounded-md overflow-hidden;
  }
  
  .premium-grid-header {
    @apply sticky top-0 z-10 bg-[#F9FAFB] border-b border-[#E5E7EB];
  }
  
  .premium-grid-row {
    @apply h-[42px] border-b border-[#E5E7EB];
    @apply even:bg-[#F9FAFB] odd:bg-white;
    @apply hover:bg-[#F3F0FF] transition-colors;
  }
  
  .premium-grid-cell {
    @apply px-3 py-2 align-middle text-[14px];
  }
  
  .premium-grid-cell-number {
    @apply text-right font-medium tabular-nums;
  }
  
  .premium-grid-cell-serial {
    @apply text-center text-[#6B7280] text-[13px];
  }
  
  /* Sortable column header */
  .sortable-header {
    @apply cursor-pointer select-none;
    @apply hover:text-[#8B5CF6];
  }
  
  .sortable-header.active {
    @apply text-[#8B5CF6];
  }
  
  /* Action icon button */
  .grid-action-btn {
    @apply w-6 h-6 inline-flex items-center justify-center rounded;
    @apply hover:bg-[#F3F0FF] transition-colors;
  }
  
  .grid-action-btn svg {
    @apply text-[#6B7280];
  }
  
  .grid-action-btn:hover svg {
    @apply text-[#8B5CF6];
  }
  
  .grid-action-btn.danger:hover svg {
    @apply text-[#EF4444];
  }
}
```

---

## Translation Keys to Add

```typescript
grid: {
  showingOf: "Showing {{start}}-{{end}} of {{total}}",
  noResults: "No results found",
  clearFilters: "Clear filters",
  allStatuses: "All Statuses",
  allTypes: "All Types",
  searchPlaceholder: "Search...",
  sortAsc: "Sort ascending",
  sortDesc: "Sort descending",
  expand: "Expand",
  collapse: "Collapse",
}
```

---

## Accessibility Requirements

| Feature | Implementation |
|---------|----------------|
| Icon buttons | `aria-label` on all action buttons |
| Sortable headers | `aria-sort="ascending|descending|none"` |
| Expanded rows | `aria-expanded` on trigger, `aria-controls` linking |
| Pagination | `aria-label="Pagination"`, `aria-current="page"` |
| Filters | Proper labels, keyboard navigation |
| Focus visible | Custom focus ring `ring-2 ring-[#8B5CF6]` |

---

## Propagation to Other Tables

After Items grid is complete, apply same pattern to:
1. `IngredientTable.tsx` - Add serial, warning column
2. `SalesChannelTable.tsx` - Same styling, fewer columns
3. Future tables (Customers, Products, Leads)

Each table inherits:
- Same base styling from updated `table.tsx`
- Reusable components: `GridFilters`, `GridPagination`, `GridActionButtons`, `GridStatusBadge`
- Consistent color palette and spacing

---

## Implementation Order

1. **Update `src/index.css`** - Add premium grid utility classes
2. **Update `src/components/ui/table.tsx`** - New base styles
3. **Create `GridStatusBadge.tsx`** - Premium pill badge
4. **Create `GridActionButtons.tsx`** - Icon actions with tooltips
5. **Create `GridPagination.tsx`** - Simple numbered pagination
6. **Create `GridFilters.tsx`** - Top filter bar
7. **Refactor `ItemTable.tsx`** - New premium grid with all columns
8. **Refactor `Items.tsx`** - Integrate filtering, sorting, pagination
9. **Update translations** - Add grid keys

---

## Technical Summary

| Aspect | Specification |
|--------|---------------|
| Row height | 42px |
| Header height | 44px |
| Cell padding | 12px horizontal, 8px vertical |
| Font size body | 14px |
| Font size header | 13px |
| Font size serial | 13px |
| Border | 1px #E5E7EB horizontal only |
| Zebra stripe | #F9FAFB |
| Hover | #F3F0FF |
| Primary accent | #8B5CF6 |
| Page size | 15 rows |
| Icons | lucide-react, 16px, strokeWidth 1.5 |

