

# Redesign: Horizontal Pill-Style Combo Replacements

## Overview

Rewrite the `ReplacementPills.tsx` component to display combo replacement items as **horizontal inline pills** per slot instead of a vertical radio list. This matches the reference screenshot where Mango Bite and Pepsi sit side-by-side as tappable pill buttons with radio indicators.

---

## ReplacementPills.tsx -- Full Rewrite

### Layout per slot group

```text
Combo (Choose 1)
+---------------------+  +---------------------+  +---------------------+
| (o) Mango Bite      |  | ( ) Pepsi            |  | ( ) Coke            |
|     default          |  |     +3.50 SAR        |  |     +0.00 SAR       |
+---------------------+  +---------------------+  +---------------------+
...............................................................................
```

### Slot header
- Text: `text-sm font-bold uppercase tracking-wider text-gray-500`
- Format: `{groupName} (Choose 1)`
- Margin bottom: `mb-3`

### Pill container
- `flex flex-wrap gap-3` -- items flow horizontally, wrap if needed
- After each slot group: dotted separator `border-b border-dotted border-gray-300 pb-4 mb-4` (except last)

### Individual pill styling

**Default item (is_default = true):**
- Background: `bg-purple-100` (light purple, ~#E9D5FF)
- Border: `border-2 border-purple-200`
- When selected (default state): `bg-purple-200 border-purple-400`
- Radio dot: filled purple `bg-primary`
- Badge: `[default]` small gray pill below name (`bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full`)
- No price shown (always +0.00)
- No delete/remove capability

**Replacement item (is_default = false):**
- Background: `bg-white`
- Border: `border-2 border-purple-400` (solid purple)
- When selected: `bg-primary text-white border-primary` (purple fill, white text)
- When unselected: white bg, purple border, dark text
- Radio dot: outline when unselected, filled white when selected on purple bg
- Price: show below name `text-xs text-gray-500` -- e.g. `+3.50 SAR` or `0.00 SAR`

**Common pill properties:**
- `min-h-[60px] min-w-[130px] px-4 py-3 rounded-xl`
- `cursor-pointer transition-all duration-200`
- `active:scale-95 touch-manipulation`
- `flex items-center gap-3`
- Radio circle on the left: `h-5 w-5 rounded-full border-2`
- Right side: name (font-medium text-sm) + subtitle (price or default badge)

### Selection behavior (no logic changes)
- Clicking default item clears selection (returns to default)
- Clicking a replacement selects it (deselects others in same group)
- Clicking already-selected replacement deselects it (returns to default)

---

## CustomizeModal.tsx -- Minor tweak

No structural changes. The only adjustment is to the right card's inner padding and scroll area to accommodate horizontal pill layout better. May need to remove `space-y-5` in favor of the slot-level spacing handled by `ReplacementPills` itself.

---

## Files Changed (2)

| File | Change |
|---|---|
| `src/components/pos/modals/ReplacementPills.tsx` | Full rewrite: vertical radio list to horizontal pill layout with purple/white color scheme, default badge, dotted separators |
| `src/components/pos/modals/CustomizeModal.tsx` | Minor: adjust spacing wrapper in the replacements scroll area to work with new horizontal layout |

### No changes to:
- State management, selection logic, price calculation
- IngredientRow, ChangesSummary, PriceAnimator
- Types, hooks, cart integration

---

## Technical Details

### ReplacementPills component structure (pseudocode)

```
<div>
  <h4>{groupName} (Choose 1)</h4>
  <div className="flex flex-wrap gap-3">
    {replacements.map(rep => (
      <button
        className={cn(
          "pill-base",
          rep.is_default
            ? isSelected ? "bg-purple-200 border-purple-400" : "bg-purple-100 border-purple-200"
            : isSelected ? "bg-primary text-white border-primary" : "bg-white border-purple-400"
        )}
      >
        <RadioDot selected={isSelected} light={isSelected && !rep.is_default} />
        <div>
          <span>{rep.name}</span>
          {rep.is_default
            ? <span className="badge">default</span>
            : <span>{price} SAR</span>
          }
        </div>
      </button>
    ))}
  </div>
</div>
```

