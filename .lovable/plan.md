

# Redesign: Tablet-First POS Customize Modal (Complete Rewrite)

This plan provides a pixel-precise specification for all 4 files that make up the Customize Modal. The existing logic (state, hooks, cart integration) is correct and will be preserved -- only the JSX/styling is being rebuilt.

---

## Modal Shell -- `CustomizeModal.tsx`

### Sizing and Behavior
- **Height**: `h-[85vh]` (85% of viewport, almost full-screen)
- **Width**: `w-[85vw]` on tablets
- **Border radius**: `rounded-2xl` (16px)
- **Background**: Dark -- `bg-[#0f1217]` with `text-white`
- **Shadow**: `shadow-2xl`
- **Remove the `pos-light` class** -- this modal gets its own dark theme
- **Close button**: The default Radix `X` button is restyled to be larger (`h-8 w-8`) and obvious
- **Open animation**: `data-[state=open]:zoom-in-95` (already present via Dialog)
- **Dirty state guard**: Already implemented, keep as-is

### Layout (top to bottom, flexbox column)

```text
+------------------------------------------------------------------+
| HEADER (sticky, border-b, px-6 py-4)                            |
|  "Customize: Chicken Biryani"  (text-2xl bold)                   |
|  Right: Base 35.00 SAR | Current 38.50 SAR (green if > base)    |
+------------------------------------------------------------------+
| BODY (flex-1, overflow-hidden, px-6 py-5)                        |
|  grid-cols-2 gap-5 h-full                                        |
|  +---------------------------+  +------------------------------+ |
|  | INGREDIENTS card          |  | COMBO REPLACEMENTS card      | |
|  | bg-[#1a1f2e] rounded-xl   |  | bg-[#1a1f2e] rounded-xl      | |
|  | px-5 py-4                 |  | px-5 py-4                    | |
|  | ScrollArea inside         |  | ScrollArea inside            | |
|  +---------------------------+  +------------------------------+ |
+------------------------------------------------------------------+
| FOOTER (sticky, border-t, px-6 py-4)                            |
|  Left: ChangesSummary (changes + price breakdown)                |
|  Right: Cancel (outline) + ADD TO CART (blue, large)             |
+------------------------------------------------------------------+
```

### Header Details
- Title: `text-2xl font-bold text-white`
- Base price: `text-gray-400` label + `text-white font-semibold tabular-nums` value
- Current price: `text-gray-400` label + green color (`text-emerald-400`) when total > base, white otherwise
- PriceAnimator used for Current value with green flash animation

### Footer Details
- `flex items-stretch gap-6`
- Left side: `ChangesSummary` component (flex-1)
- Right side: `flex flex-col gap-2 justify-center min-w-[280px]`
  - Cancel button: `h-12 rounded-xl border border-gray-600 text-gray-400 font-medium text-base`
  - Add to Cart button: `h-14 rounded-xl bg-primary text-white font-bold text-base` with ShoppingCart icon

---

## Ingredient Row -- `IngredientRow.tsx` (full rewrite)

Each ingredient rendered as a card inside the left column.

### Layout per row
```text
+--------------------------------------------------------------+
|  Cheese                          Remove [===O]  Extra [O===] |
|                                                 +3.50 SAR    |
+--------------------------------------------------------------+
```

### Styling
- Container: `rounded-xl bg-[#111827] border border-gray-700/50 px-5 py-4`
- **When Remove ON**: `bg-red-950/30 border-red-500/30`, name gets `line-through text-red-400`
- **When Extra ON**: `bg-emerald-950/20 border-emerald-500/30`, green `+Extra` badge appears
- Name: `text-base font-semibold text-white` (min 16px)
- Extra price shown below name: `text-sm text-gray-400` showing `+{price} SAR`

### Toggle switches
- Use existing `Switch` component but with custom colors:
  - Remove switch: `data-[state=checked]:bg-red-500`
  - Extra switch: `data-[state=checked]:bg-emerald-500`
- Labels "Remove" and "Extra": `text-sm text-gray-400 font-medium`
- **Scale**: Remove `scale-90`, use default size for touch-friendliness (48px target)
- **Interaction**: When Remove is ON, Extra toggle is **disabled** (grayed out, `opacity-40 pointer-events-none`)
- Transition on toggle: `transition-all duration-200`

### Visibility rules (unchanged logic)
- Remove toggle visible when `ingredient.is_removable === true`
- Extra toggle visible when `ingredient.can_add_extra === true`

---

## Replacement Radio List -- `ReplacementPills.tsx` (full rewrite)

Rendered inside the right column card. Grouped by slot.

### Group header
- `text-sm font-bold uppercase tracking-wider text-gray-400`
- Example: "COMBO (CHOOSE 1)"

### Each radio row
```text
+--------------------------------------------------------------+
|  (o) Pepsi                    0.00 SAR          [default]    |
|  ( ) Coke                     0.00 SAR                       |
|  ( ) Ice Tea                 +3.00 SAR                       |
+--------------------------------------------------------------+
```

### Styling
- Each row: `rounded-xl px-5 py-4 flex items-center gap-4 cursor-pointer transition-all duration-150`
- **Selected**: `bg-primary/15 border border-primary/30` + bold text
- **Unselected**: `border border-transparent hover:bg-white/5`
- Radio circle: `h-5 w-5 rounded-full border-2` -- filled with `bg-primary` dot when selected
- Name: `text-base font-medium` -- white when selected, `text-gray-400` when not
- Price: `text-sm tabular-nums text-gray-400` -- show `+X.XX SAR` only if price_difference != 0, otherwise `0.00 SAR`
- Default badge: `rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-300`
- **Touch target**: min height 48px per row
- **Animation on select**: `active:scale-[0.98]`

---

## Changes Summary -- `ChangesSummary.tsx` (restyle for dark theme)

### Layout
- Single column, compact
- "CHANGES APPLIED" header: `text-xs font-bold uppercase tracking-wider text-gray-500`
- Change bullets: `text-sm text-gray-300`
  - Extra items: white text with `(+X.XX SAR)` in gray
  - Removed items: `text-red-400`
  - Replacements: white text with price diff in gray

### Price Breakdown
- Each line: `flex justify-between text-sm text-gray-400`
- Labels: Base, Extras and Additions, Replacement Difference
- Values: `tabular-nums`
- Separator: `border-t border-gray-700`
- Final Total line: `font-bold text-base text-white`

---

## PriceAnimator -- `PriceAnimator.tsx` (minor fix)

- Remove the hardcoded `prefix="Rs. "` default -- change to empty string `""` since the modal passes prices without prefix
- Keep the green flash animation on value change

---

## Files Changed (5 total)

| File | Action |
|---|---|
| `src/components/pos/modals/CustomizeModal.tsx` | Rewrite JSX/styling: dark theme, 85vh, 85vw, new header/footer layout |
| `src/components/pos/modals/IngredientRow.tsx` | Rewrite: dark cards, larger toggles, disable Extra when Remove ON, color-coded states |
| `src/components/pos/modals/ReplacementPills.tsx` | Rewrite: dark radio list, larger touch targets, price + default badge |
| `src/components/pos/modals/ChangesSummary.tsx` | Restyle: dark theme colors (gray-400/500/700 palette) |
| `src/components/pos/modals/PriceAnimator.tsx` | Fix default prefix from "Rs. " to "" |

### No changes to:
- State management logic (extras, removals, replacement selection)
- Data hooks (`usePOSItemDetails`)
- Price calculation functions
- Cart integration
- Dirty state warning dialog
- Types

