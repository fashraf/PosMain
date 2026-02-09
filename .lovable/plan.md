

# POS Order List -- 10-Point Refinement

## Overview

Apply 10 specific tweaks to the Order List page based on the user's feedback. This is a focused polish pass -- no new features, just corrections and visual adjustments.

## Changes

### 1. Move "Last updated" next to stat cards (reference image style)

**File: `src/pages/pos/OrderList.tsx`**
- The "updated: Just now" text is already positioned next to the stat cards (line 138-140). Adjust styling to match the reference image: lighter color, slightly smaller text, placed inline right of the first stat card row (not below).

### 2. Replace "Total Sales" card with "Total Unpaid Orders"

**File: `src/components/pos/orders/OrderStatCards.tsx`**
- Change the 4th card from `totalSales` / "Total Sales" to `paymentPending` / "Total Unpaid"
- Remove the `isCurrency` flag
- Change icon to `AlertCircle` with soft red background (`bg-red-50`, `text-red-500`)

### 3. Change "Order #" column header to just "#"

**File: `src/pages/pos/OrderList.tsx`**
- Change header text from `Order #` to just `#`
- Keep the `Hash` icon
- Reduce column width from `w-[70px]` to `w-[50px]`

### 4. Add dotted lines between ALL table rows

**File: `src/pages/pos/OrderList.tsx`**
- Change `TableRow` border class from `border-slate-100` to `border-dotted border-slate-200` on every order row
- The main table header row keeps its solid border

### 5. Remove "Orders" header and "New Order" button

**File: `src/pages/pos/OrderList.tsx`**
- Remove the entire sticky header block (lines 117-126) containing the ClipboardList icon, "Orders" title, and "New Order" button
- The stat cards become the top element
- Update the sticky tabs `top` offset from `top-[57px]` to `top-0`

### 6. Items column: badge design with light blue, 16px, underline for customized

**File: `src/components/pos/orders/OrderItemsTooltip.tsx`**
- Change the inline preview to render each item as a small badge/pill: light blue background (`bg-blue-50 text-blue-700`), rounded, `text-[16px]` font
- Format stays `{qty} x {name}`
- If an item has customizations, the item text gets `underline` decoration instead of `(c)` suffix
- Remove the `(c)` marker entirely

### 7. Fix customization data in nested grid AND right slider

**File: `src/components/pos/orders/ExpandedOrderItems.tsx`**
- Ensure `removedIngredients` and `addedIngredients` from `customization_json` are properly displayed
- Show removed as "- {name}" in red-ish muted text
- Show added as "+ {name}" in green-ish muted text
- If no customizations, show nothing (no dash)

**File: `src/components/pos/orders/OrderDetailDrawer.tsx`**
- Already shows customizations (lines 101-106), but verify the data path works correctly
- Format removed ingredients as "- No {name}" and added as "+ Extra {name}" consistently
- Ensure `customization_json` is properly parsed (handle both object and string formats)

### 8. Time Ago format: remove "ago", use dash separator

**File: `src/lib/pos/timeAgo.ts`**
- Change format from `"4m ago"` to `"- 4m"`
- Change from `"1h 23m ago"` to `"- 1h 23m"`  
- Change "Just now" to `"- 0m"`
- The dash acts as a visual prefix

### 9. Curved corners (already 8px / rounded-lg, but ensure consistency)

**File: `src/pages/pos/OrderList.tsx`**
- Ensure the main table container has `rounded-lg overflow-hidden`
- All filter selects, buttons, and inputs use `rounded-lg` (8px)

### 10. Light grey background for nested gridview

**File: `src/components/pos/orders/ExpandedOrderItems.tsx`**
- Already using `bg-[#FAFAFA]` -- confirmed correct. No change needed here.

## Summary of Files Modified

| File | Changes |
|------|---------|
| `src/pages/pos/OrderList.tsx` | Remove header, "#" column, dotted row borders, rounded table |
| `src/components/pos/orders/OrderStatCards.tsx` | Replace Total Sales with Total Unpaid |
| `src/components/pos/orders/OrderItemsTooltip.tsx` | Badge pills, light blue, 16px, underline for customized |
| `src/components/pos/orders/ExpandedOrderItems.tsx` | Fix customization display with add/remove labels |
| `src/components/pos/orders/OrderDetailDrawer.tsx` | Verify/fix customization data display |
| `src/lib/pos/timeAgo.ts` | Change format to "- Xh Xm" without "ago" |

