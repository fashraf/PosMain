

# Switch Customize Modal from Dark Theme to White/Light Theme

## Overview

Change the Customize Modal's color scheme from the current dark theme (`#0f1217` background, white text) to a clean white/light theme that matches the POS module's existing light design language.

## Color Mapping

| Element | Current (Dark) | New (Light) |
|---|---|---|
| Modal background | `bg-[#0f1217]` | `bg-white` |
| Text color | `text-white` | `text-gray-900` |
| Header border | `border-gray-800` | `border-gray-200` |
| Cards background | `bg-[#1a1f2e]` | `bg-gray-50` |
| Card borders | `border-gray-700/50` | `border-gray-200` |
| Section titles | `text-gray-400` | `text-gray-500` |
| Footer border | `border-gray-800` | `border-gray-200` |
| Close button bg | `bg-gray-800 hover:bg-gray-700` | `bg-gray-100 hover:bg-gray-200` |
| Close button icon | `text-gray-400` | `text-gray-500` |

## Files Changed (5)

### 1. `CustomizeModal.tsx`
- Modal: `bg-[#0f1217] text-white` → `bg-white text-gray-900`
- Header title: `text-white` → `text-gray-900`
- Header borders: `border-gray-800` → `border-gray-200`
- Price labels: `text-gray-400` → `text-gray-500`, values: `text-white` → `text-gray-900`
- Close button: `bg-gray-800 hover:bg-gray-700` → `bg-gray-100 hover:bg-gray-200`
- Body cards: `bg-[#1a1f2e]` → `bg-gray-50`
- Card header borders: `border-gray-700/50` → `border-gray-200`
- Section titles: keep uppercase style, change `text-gray-400` → `text-gray-500`
- Footer: `border-gray-800` → `border-gray-200`
- Cancel button: `border-gray-600 text-gray-400 hover:bg-gray-800` → `border-gray-300 text-gray-600 hover:bg-gray-100`
- Add to Cart button: keep `bg-primary text-white` (no change needed)
- Dirty warning dialog: `bg-[#1a1f2e] border-gray-700 text-white` → `bg-white border-gray-200 text-gray-900`

### 2. `IngredientRow.tsx`
- Default card: `bg-[#111827] border-gray-700/50` → `bg-white border-gray-200`
- Remove ON state: `bg-red-950/30 border-red-500/30` → `bg-red-50 border-red-200`
- Extra ON state: `bg-emerald-950/20 border-emerald-500/30` → `bg-emerald-50 border-emerald-200`
- Name text: `text-white` → `text-gray-900`
- Removed name: `text-red-400` → `text-red-500`
- Price text: `text-gray-400` → `text-gray-500`
- Toggle labels: `text-gray-400` → `text-gray-500`
- Extra badge: `bg-emerald-500/20 text-emerald-400` → `bg-emerald-100 text-emerald-700`

### 3. `ReplacementPills.tsx`
- Group header: `text-gray-400` → `text-gray-500`
- Selected row: `bg-primary/15 border-primary/30` → `bg-primary/10 border-primary/30` (keep similar)
- Unselected row: `hover:bg-white/5` → `hover:bg-gray-50`
- Radio circle border: `border-gray-600` → `border-gray-300`
- Selected name: `text-white` → `text-gray-900`
- Unselected name: `text-gray-400` → `text-gray-500`
- Price: `text-gray-400` → `text-gray-500`
- Default badge: `bg-gray-700 text-gray-300` → `bg-gray-200 text-gray-600`

### 4. `ChangesSummary.tsx`
- "Changes Applied" header: `text-gray-500` → `text-gray-400`
- Change text: `text-gray-300` → `text-gray-600`
- Extra item names: `text-white` → `text-gray-900`
- Price values: `text-gray-400` → `text-gray-500`
- Separator: `border-gray-700` → `border-gray-200`
- Total text: `text-white` → `text-gray-900`

### 5. `PriceAnimator.tsx`
- No color changes needed (colors are passed via className prop)

## No logic changes -- only CSS class swaps.

