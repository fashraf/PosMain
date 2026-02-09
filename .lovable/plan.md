

# POS Order List -- Modern Redesign with Roboto Condensed

## Overview

Complete visual overhaul of the Order List page to create a calm, professional POS interface using Roboto Condensed font, muted colors, subtle shadows, and a refined layout. Replaces the current bright/bold design with a sophisticated, minimal aesthetic optimized for high-volume cashier workflows.

## Visual Design System

### Color Palette (Muted, Professional)
- **Background**: White (#FFFFFF) with #FAFAFA for nested areas
- **Text primary**: Muted navy (#1E293B)
- **Text secondary**: Slate gray (#64748B)
- **Active tab underline**: Muted navy (#334155)
- **Unpaid indicator**: Muted red (#DC2626 at low opacity)
- **Stat card icons**: Soft muted backgrounds (slate-100, amber-50, emerald-50, rose-50)
- **Shadows**: `shadow-sm` only -- barely visible depth
- **Borders**: #E2E8F0 (very light slate)

### Typography
- Import **Roboto Condensed** from Google Fonts
- Applied globally to the POS layout via a `.pos-orders-font` class
- Dense, condensed feel ideal for data-heavy POS screens

## Changes

### 1. Font Integration
- Add Roboto Condensed Google Font import to `index.css`
- Apply it to the Order List page via a wrapper class

### 2. Redesigned Stat Cards
- Smaller, more compact cards with soft pastel icon backgrounds (not solid dark)
- Subtle `shadow-sm` and rounded-lg (8px)
- Icon in a soft-colored circle (e.g., slate-100 bg with slate-600 icon)
- 4th card becomes **Total Sales** (sum of paid order totals) instead of duplicating "Payment Pending"
- Dense typography: medium-weight number, small muted label

### 3. Tabs with Dynamic Counts
- Remove the filled TabsList background -- use plain text tabs with bottom underline
- Active tab: muted navy underline (2px), semibold text
- Unpaid tab: muted red text with a small red dot indicator
- Each tab shows its count in parentheses: "All (5)", "Active (2)", etc.
- Hover: subtle underline fade-in
- Counts fetched from the existing `useOrderStats` hook (extended with per-tab counts)

### 4. "Time Ago" Column
- New column showing relative time ("2 min ago", "1h ago")
- Color logic:
  - Less than 15 min: muted gray (#94A3B8)
  - 15-30 min: soft amber (#D97706)
  - More than 30 min AND unpaid: muted orange (#EA580C)
  - More than 60 min: orange text + small AlertTriangle icon
- Replaces or supplements the existing "Time" column (keep both: Time shows HH:mm, Time Ago shows relative)

### 5. Single "View" Button Replaces Row Actions
- Remove the multi-icon action column (Edit, Pay, Cancel, Delete)
- Replace with a single **"View"** button per row (subtle outline, small)
- Clicking "View" opens the **right slide panel** (50% width, full height)
- The panel contains ALL actions: Edit, Collect Payment, Cancel, Delete, Print

### 6. Right Slide Panel (Redesigned OrderDetailDrawer)
- Width: 50% of screen (`w-1/2`) instead of current 420px
- Full height with light overlay
- Structured in 3 sections:

  **Header**: Order #, type badge, time, status badge

  **Section 1 -- Order Items** (scrollable):
  - Compact item cards with name, qty, price
  - Customizations listed as bullet points
  - Inline quantity +/- controls and remove button (for edit mode)

  **Section 2 -- Payment** (priority section):
  - Subtotal, tax, discount, total breakdown
  - Payment method buttons (Cash, Card, Wallet)
  - If unpaid: "Mark as Paid" primary button
  - If paid: locked fields with "Paid" badge

  **Section 3 -- Actions** (bottom, light bg #F8FAFC):
  - Large touch-friendly buttons with icons:
    - Print Bill (Printer icon)
    - Print to Kitchen (ChefHat icon)
    - Edit Order (Pencil icon)
    - Cancel Order (XCircle, soft red text, requires confirmation)

### 7. Unpaid Row Indicator
- Instead of full-row blinking, unpaid rows get a thin **left border line** (3px, muted red)
- Much calmer than the current pulse animation
- Status badge still shows "Unpaid" in muted red

### 8. Compact Table Rows
- Hover: very light gray background (#F8FAFC), no lavender
- Row height stays at 42px
- Tighter padding throughout
- Chevron expand toggle retained for nested grid

### 9. Nested Grid Polish
- Background: #FAFAFA (instead of muted/30)
- Very light `shadow-inner` or `shadow-sm` behind nested area
- Rounded corners on the nested container
- Per-item edit (Pencil) and remove (Trash2) icons (small, muted)

## Technical Details

### Files Modified

1. **`src/index.css`**
   - Add Roboto Condensed Google Font import
   - Add `.pos-orders-font` class with `font-family: 'Roboto Condensed'`
   - Soften `.animate-pulse-red` to be less aggressive (reduce to left-border indicator style)
   - Add `.pos-tab-underline` custom tab styles

2. **`src/pages/pos/OrderList.tsx`** (major rewrite)
   - Wrap in `.pos-orders-font` class
   - Replace Tabs component with custom underline-style tabs with counts
   - Add "Time Ago" column with color-coded relative time
   - Replace Actions column with single "View" button
   - Unpaid rows: add `border-l-3 border-red-400` instead of full pulse
   - Update stat cards section to use redesigned component

3. **`src/components/pos/orders/OrderStatCards.tsx`**
   - Redesign with soft pastel icon backgrounds
   - Add `shadow-sm` and rounded-lg
   - Change 4th card to "Total Sales" (sum)
   - Apply Roboto Condensed font

4. **`src/hooks/pos/usePOSOrders.ts`**
   - Extend `OrderStats` to include `totalSales: number` (sum of paid totals)
   - Add per-tab counts: `allCount`, `activeCount`, `unpaidCount`, `completedCount`, `cancelledCount`

5. **`src/components/pos/orders/OrderDetailDrawer.tsx`** (major rewrite)
   - Change width to 50% (`w-1/2`)
   - Add 3-section layout: Items (scrollable), Payment (with action buttons), Actions (bottom bar)
   - Add inline payment collection (move CollectPaymentModal logic into the panel)
   - Add action buttons: Print Bill, Print Kitchen, Edit, Cancel
   - Add quantity +/- controls on items

6. **`src/components/pos/orders/OrderStatusBadge.tsx`**
   - Soften colors to match muted palette
   - Remove pulse animation from badge (handled by row border instead)

7. **`src/components/pos/orders/ExpandedOrderItems.tsx`**
   - Update background to #FAFAFA
   - Add subtle shadow and rounded corners
   - Add small edit/remove icons per item row

8. **`src/components/pos/orders/OrderItemsTooltip.tsx`**
   - Apply Roboto Condensed font
   - Match the muted color scheme

### Time Ago Logic (utility)
```text
function getTimeAgo(createdAt: string): { text: string; level: 'normal' | 'warning' | 'urgent' | 'critical' }
  diff = now - createdAt (in minutes)
  < 1 min  -> "Just now", normal
  < 15 min -> "X min ago", normal
  < 30 min -> "X min ago", warning (amber)
  < 60 min -> "X min ago", urgent (orange, only if unpaid)
  >= 60    -> "Xh ago", critical (orange + icon)
```

### Tab Counts Data Flow
The existing `useOrderStats` hook will be extended to return counts per tab. Since it already fetches all `payment_status` values for the date range, we just add the counting logic client-side -- no additional queries needed.

