

# POS Order Page Redesign -- Premium Dark Theme with Detail and Customize Modals

## Visual Overview

The POS screen gets a complete visual overhaul with a dark theme, redesigned item cards with conditional button logic, and two new modals (Item Details read-only + Customize modal). The existing 70/30 split layout, cart logic, and checkout flow remain unchanged.

```text
+-----------------------------------------------------------------------+
| [All] [Burgers] [Drinks] [Combos] [Desserts] [*Favorites]            |  <-- Dark pill bar
+-----------------------------------------------------------------------+
|                                           |                           |
|  +----------+  +----------+  +----------+ |  CART                     |
|  | [Image]  |  | [Image]  |  |          | |  +-----------------------+|
|  |          |  |          |  | Pepsi    | |  | (c) Biryani Combo  x1 ||
|  | Biryani  |  | Mango    |  | Rs.50.00 | |  |   + Extra Cheese     ||
|  | Combo    |  | Bite     |  |          | |  |   - No Onion         ||
|  | Rs.350   |  | Rs.120   |  | [  ADD  ]| |  |  [-] 1 [+]    350.00 ||
|  |[Customizable]|          |  +----------+ |  +-----------------------+|
|  |[ADD][CUSTOMIZE]| [  ADD  ]|             |  | Subtotal       350.00 ||
|  +----------+  +----------+               |  | VAT 15%         52.50 ||
|  +----------+  +----------+  +----------+ |  | TOTAL          402.50 ||
|  |          |  |          |  |          | |  +-----------------------+|
|  | ...      |  | ...      |  | ...      | |  [        PAY 402.50    ]||
|  +----------+  +----------+  +----------+ |                           |
+-----------------------------------------------------------------------+
```

## Design System (Dark POS Theme)

| Element | Value |
|---------|-------|
| Background | `#0F1217` (dark charcoal) |
| Card BG | `#1A1F2E` |
| Card hover | `#232938` |
| Category Bar BG | `#151920` |
| Active Category Pill | Green `#22C55E` |
| Inactive Pill | `#1E2433` |
| Add Button | Solid green `#22C55E` |
| Customize Button | Outline `#64748B` border |
| Price text | `#FBBF24` (amber) or white |
| Removed ingredient | Red `#EF4444` line-through |
| Extra badge | Green `#22C55E` |
| Cart Panel BG | `#111318` |

These are applied via a scoped `.pos-dark` class on the POS layout wrapper -- the admin panel's light theme is NOT affected.

## Changes Summary

### New Files

| File | Purpose |
|------|---------|
| `src/components/pos/items/POSItemCard.tsx` | Redesigned dark-theme item card with image-first layout, conditional Add/Customize buttons, "Customizable" badge |
| `src/components/pos/items/POSItemGrid.tsx` | Redesigned grid with responsive 2-4 columns |
| `src/components/pos/modals/ItemDetailsModal.tsx` | Read-only modal showing ingredients list + combo items + replacement mapping |
| `src/components/pos/modals/CustomizeModal.tsx` | Full customization modal with live price, ingredient toggles (switch-style Remove/Extra), replacement radio pills, dirty-state guard |
| `src/components/pos/modals/IngredientRow.tsx` | Single ingredient row with Remove toggle + Extra toggle (switch style per uploaded image) |
| `src/components/pos/modals/ReplacementPills.tsx` | Radio-pill row for replacement selection (per uploaded image style) |
| `src/components/pos/modals/index.ts` | Barrel export |
| `src/components/pos/modals/PriceAnimator.tsx` | Small component that animates price changes with a green flash |

### Modified Files

| File | Change |
|------|---------|
| `src/pages/pos/POSMain.tsx` | Add state for Item Details modal, wire new card click handlers, replace `ItemGrid` with `POSItemGrid`, add both modals |
| `src/components/pos/layout/POSLayout.tsx` | Add `pos-dark` scoped class for dark theme |
| `src/components/pos/shared/ItemImage.tsx` | Add `xl` size variant (80x80) for modal headers; no placeholder when `src` is null (just hide) |
| `src/index.css` | Add `.pos-dark` scoped CSS variables for the dark POS palette |
| `src/components/pos/items/index.ts` | Add new exports |

### Unchanged Files (no modifications)

Cart components, checkout flow, hooks, cart utils, price calculations -- all remain as-is.

## Component Details

### 1. POSItemCard (New)

```text
+-----------------------------+
| [  Image (4:3 ratio)     ]  |   <-- If image exists, fills top
| [  or Name spans full    ]  |   <-- If no image, name is large centered
|-----------------------------|
|  Chicken Biryani Combo      |
|  Rs. 350.00          [badge]|   <-- "Customizable" badge if is_customizable
|-----------------------------|
|  [ ADD ]  [ CUSTOMIZE ]     |   <-- Two buttons if customizable
|  [ ADD  (full width)   ]    |   <-- One button if not customizable
+-----------------------------+
```

**Logic:**
- Card body click (not buttons) --> opens Item Details modal
- `is_customizable === true` --> show ADD + CUSTOMIZE buttons
- `is_customizable === false` --> show only ADD button (full width)
- Image: if `image_url` exists, show it at 4:3 ratio at top with lazy loading; if null, skip image section entirely and make name larger
- ADD button: vibrant green solid, 48px min height
- CUSTOMIZE button: outline with subtle border, 48px min height

### 2. Item Details Modal (Read-only)

```text
+---------------------------------------------------+
|  [X]  Item Details: Chicken Biryani Combo          |
+---------------------------------------------------+
|  Left Column (50%)       |  Right Column (50%)     |
|                          |                         |
|  INGREDIENTS             |  COMBO ITEMS            |
|  +---------------------+ |  +-------------------+  |
|  | Cheese    Qty: 2    | |  | Rice (default)   |  |
|  | Extra: Yes Remove:No| |  | Can replace with: |  |
|  |---------------------| |  |  Naan (+Rs.20)   |  |
|  | Onion     Qty: 1    | |  |  Bread (+Rs.0)   |  |
|  | Extra: No  Remove:Yes| |  +-------------------+  |
|  +---------------------+ |                         |
|                          |  BASE PRICE: Rs. 350.00 |
+---------------------------------------------------+
```

- Opens via Dialog (not Drawer) at ~65% width, max 700px
- Fetches data using existing `usePOSItemDetails` hook
- Left: ingredient list with name, qty, extra allowed, removable flags
- Right: replacement groups with original item + available replacements + price diffs
- Close via X button or Escape
- No editing capability

### 3. Customize Modal

```text
+---------------------------------------------------+
|  CUSTOMIZE: Chicken Biryani Combo                  |
|                               Total: Rs. 370.00   |  <-- Live animated price
+---------------------------------------------------+
|  INGREDIENTS                | REPLACEMENTS         |
|                             |                      |
|  Cheese (Rs.20.00)          | Replace Rice:        |
|  Remove [off] Extra [ON]    | [*Naan +20] [Bread]  |  <-- Radio pills
|                             | [Rice (default)]     |
|  Onion                      |                      |
|  Remove [ON]  Extra [off]   |                      |
|  ~~Onion~~ (struck through) |                      |
|                             |                      |
+---------------------------------------------------+
|  [Cancel]       [ ADD TO CART -- Rs. 370.00 ]      |  <-- Sticky footer
+---------------------------------------------------+
```

- Opens via Dialog at ~70% width
- Uses existing `usePOSItemDetails` hook for data
- Left column: Ingredients with Remove/Extra toggle switches (matching uploaded image style)
  - Remove and Extra are mutually exclusive (toggling one turns off the other)
  - Zero-price extras: Extra toggle hidden/disabled if `extra_price === 0`
  - Removed items shown with red strikethrough
  - Extra items shown with green "+Extra" badge
- Right column: Replacement groups rendered as horizontal radio pills (matching uploaded image style)
  - Selected pill is green filled, others are outline
  - Shows price difference on each pill
  - Cannot select same item as replacement (self-replacement blocked)
- Live price: animated with `PriceAnimator` (green flash on change)
- Dirty state: tracks if any changes made; if user tries to close with changes, shows confirm dialog
- Footer: Cancel + "ADD TO CART -- Rs. X.XX" green button
- Reuses existing `buildCustomizationData`, `calculateLivePrice` from `priceCalculations.ts`
- On submit: calls `cart.addItem()` or `cart.updateItemCustomization()` (same as current CustomizeDrawer)

### 4. Dark Theme Scoping

Add to `src/index.css`:

```css
.pos-dark {
  --background: 220 20% 7%;
  --foreground: 220 10% 93%;
  --card: 222 20% 12%;
  --card-foreground: 220 10% 93%;
  --muted: 222 15% 18%;
  --muted-foreground: 220 10% 60%;
  --border: 222 15% 20%;
  --primary: 142 71% 45%;
  --primary-foreground: 0 0% 100%;
  --accent: 222 15% 22%;
  --accent-foreground: 220 10% 85%;
}
```

The `POSLayout` wrapper gets `className="pos-dark"` so ALL Tailwind `bg-background`, `text-foreground`, etc. automatically pick up the dark palette without affecting the admin panel.

### 5. Category Bar + Cart Panel

These components already use Tailwind theme variables (`bg-background`, `text-foreground`, etc.), so they will automatically adapt to the dark theme from the `.pos-dark` scoping. No code changes needed in CategoryBar, CategoryPill, CartPanel, CartHeader, CartTotals, or PayButton.

### 6. POSMain.tsx Updates

- Add `detailsItem` state for the read-only modal
- Add `customizeModalItem` state (separate from existing `customizeItem` which drives the Drawer)
- Replace current `<ItemGrid>` with new `<POSItemGrid>`
- Card body click --> `setDetailsItem(item)`
- ADD button --> `handleAddItem(item)` (unchanged logic)
- CUSTOMIZE button --> `setCustomizeModalItem(item)`
- Keep existing `CustomizeDrawer` for cart item editing (when user clicks edit in cart)
- Add `<ItemDetailsModal>` and `<CustomizeModal>` components

## Micro-interactions

- **Price flash**: When live price changes in Customize modal, the total briefly flashes green (`animate-pulse` for 300ms)
- **Button press**: All touch buttons use `active:scale-95 transition-transform duration-100`
- **Card press**: Cards use `active:bg-[#232938]` for instant feedback
- **Badge pulse**: "Customizable" badge has a subtle `animate-pulse` on first render, then stops
- **Toggle switches**: Smooth 200ms slide transition for Remove/Extra toggles

## What Stays The Same

- All cart logic (hash merging, quantity, totals)
- Checkout flow and drawer
- Data fetching hooks (`usePOSItems`, `usePOSItemDetails`, `usePOSCategories`)
- Price calculation utilities
- Cart components (CartPanel, CartItem, CartTotals, PayButton)
- The existing CustomizeDrawer (still used for editing cart items)

