

# KDS Visual Enhancement + Sidebar Kitchen Link

## 1. Font Size Increase (+3px across all KDS components)

| Component | Current | New |
|-----------|---------|-----|
| **KitchenStatusBar** title | `text-lg` (18px) | `text-[21px]` |
| **KitchenStatusBar** stats | `text-sm` (14px) | `text-[17px]` |
| **KitchenStatusBar** clock | `text-sm` (14px) | `text-[17px]` |
| **KitchenOrderCard** order number | `text-base` (16px) | `text-[19px]` |
| **KitchenOrderCard** type badge | `text-xs` (12px) | `text-[15px]` |
| **KitchenOrderCard** time ago | `text-xs` (12px) | `text-[15px]` |
| **KitchenOrderCard** progress text | `text-xs` (12px) | `text-[15px]` |
| **KitchenItemRow** item name | `text-[15px]` | `text-[18px]` |
| **KitchenItemRow** quantity badge | `text-xs` (12px) | `text-[15px]` |
| **KitchenItemRow** customizations | `text-xs` (12px) | `text-[15px]` |
| **KitchenItemRow** timer | `text-sm` (14px) | `text-[17px]` |
| **KitchenItemRow** "Done at" | `text-xs` (12px) | `text-[15px]` |
| **KitchenFilters** pills | `text-sm` (14px) | `text-[17px]` |
| **KitchenItemModal** title | `text-lg` (18px) | `text-[21px]` |
| **KitchenItemModal** customization | `text-sm` (14px) | `text-[17px]` |
| **KitchenItemModal** YES button | `text-lg` (18px) | `text-[21px]` |

## 2. Reduce Margins/Padding (tighter, more compact)

- **KitchenDisplay** grid: `gap-4` becomes `gap-3`, `p-4` becomes `p-3`
- **KitchenOrderCard** items list: `p-2` stays, `gap-0.5` stays (already compact)
- **KitchenOrderCard** progress section: `pb-3` becomes `pb-2`
- **KitchenStatusBar**: `py-3` becomes `py-2`, `px-6` becomes `px-4`
- **KitchenFilters**: `py-3` becomes `py-2`, `px-6` becomes `px-4`

## 3. Add "Kitchen" to Sidebar Menu

Add a new entry in the `mainNavItems` array right after "Order List":

```text
{ titleKey: "nav.kitchen", url: "/pos/kitchen", icon: ChefHat }
```

Also add the translation key `"nav.kitchen": "Kitchen"` (and Arabic equivalent) to the translations file.

## 4. Visual Enhancements (making it more attractive)

### a) Gradient top bar on order cards
Replace flat color headers with subtle gradients (e.g., `bg-gradient-to-r from-blue-500 to-blue-600` for dine-in) for a more polished look.

### b) Glassmorphism status bar
Add a subtle gradient to the top status bar: `bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900`.

### c) Card hover glow effect
Add a subtle shadow lift on hover: `hover:shadow-md hover:-translate-y-0.5 transition-all` on order cards for depth.

### d) Animated progress bar color
Change progress bar color based on completion: green when >66%, amber when 33-66%, red when <33%.

### e) Pulsing new-order indicator
Add a subtle `animate-pulse` ring on cards that arrived in the last 60 seconds: `ring-2 ring-amber-400/50 animate-pulse`.

### f) Larger checkboxes
Increase checkbox from `h-6 w-6` to `h-7 w-7` with `rounded-lg` for easier touch targets.

### g) Total order time in card header
Show total elapsed time for the entire order next to the "Xm ago" text, making urgency more visible.

### h) Item count badge in header
Show a small item count badge (e.g., "3 items") in the colored header bar.

## Technical Details

### Files Modified

| File | Changes |
|------|---------|
| `src/components/pos/kitchen/KitchenStatusBar.tsx` | Font +3px, reduced padding, gradient bg |
| `src/components/pos/kitchen/KitchenOrderCard.tsx` | Font +3px, gradient headers, hover glow, new-order pulse, item count badge, progress bar color logic |
| `src/components/pos/kitchen/KitchenItemRow.tsx` | Font +3px, larger checkboxes |
| `src/components/pos/kitchen/KitchenItemModal.tsx` | Font +3px |
| `src/components/pos/kitchen/KitchenFilters.tsx` | Font +3px, reduced padding |
| `src/pages/pos/KitchenDisplay.tsx` | Reduced grid gap/padding |
| `src/components/AppSidebar.tsx` | Add Kitchen nav item with ChefHat icon |
| `src/lib/i18n/translations.ts` | Add `nav.kitchen` key |

