

# Add Replacement Button + Tooltip to Item Grid

## What Changes

The "Replacement" column in the Item grid will become interactive:
- **No replacements**: Shows a grey "+" icon button (click opens the Replacement Modal)
- **Has replacements**: Shows a green "2x +" badge (count of replacements) with a tooltip listing the replacement item names and their extra costs; clicking opens the Replacement Modal for editing

## Technical Details

### 1. Update ItemTable Component

**File**: `src/components/item-mapping/ItemTable.tsx`

- Add `onOpenReplacement?: (mappingId: string) => void` prop to `ItemTableProps`
- Pass it down to `SortableItemRow`
- Replace the current static text in the Replacement column (line 82-84) with:
  - If `mapping.replacements` has items: a green badge showing `{count}x` with a `+` icon, wrapped in a Tooltip that lists each replacement name and extra cost
  - If no replacements: a grey `PlusCircle` icon button
  - Both click to call `onOpenReplacement(mapping.id)`

### 2. Wire Up in Parent Pages

**Files**: `src/pages/ItemsAdd.tsx`, `src/pages/ItemsEdit.tsx`, `src/pages/ItemIngredientMappingEdit.tsx`

- Pass `onOpenReplacement={handleOpenReplacementModal}` prop to `<ItemTable>` (the handler already exists in all three pages)

## Files Modified

| File | Changes |
|------|---------|
| `src/components/item-mapping/ItemTable.tsx` | Add `onOpenReplacement` prop, interactive replacement column with count badge, tooltip, and "+" button |
| `src/pages/ItemsAdd.tsx` | Pass `onOpenReplacement` to ItemTable |
| `src/pages/ItemsEdit.tsx` | Pass `onOpenReplacement` to ItemTable |
| `src/pages/ItemIngredientMappingEdit.tsx` | Pass `onOpenReplacement` to ItemTable |
