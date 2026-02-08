

# Fix: Combo Slot/Replacement Architecture

## Problem

When adding items to a combo, every item (including replacements like Pepsi) appears as a **separate independent row** in the combo list. The replacement relationship is lost because:

1. The "Add Item" button adds every item as a top-level entry
2. The save logic treats all entries as flat rows (using array index to determine default)
3. The replacements added via ReplacementModal are stored in client state but **never persisted** to the database
4. On edit/load, replacements are not reconstructed from the database

## Root Cause

The save logic in both `ItemsAdd.tsx` and `ItemsEdit.tsx` ignores the `replacements[]` array on each sub-item mapping. It saves all `subItemMappings` as flat `item_sub_items` rows using index position to decide default vs replacement. The ReplacementModal correctly manages client-side state, but its data is discarded at save time.

## Solution

### 1. Fix Save Logic (ItemsAdd.tsx + ItemsEdit.tsx)

Change the sub-item save to flatten slots + their replacements into `item_sub_items` rows:

- For each sub-item mapping (slot), insert one row with `is_default = true`, `replacement_price = 0`
- For each entry in that slot's `replacements[]` array, insert an additional row with `is_default = false`, `replacement_price = extra_cost`, and the replacement's `sub_item_id`

Before (broken):
```
subItemMappings.map((m, index) => ({
  sub_item_id: m.sub_item_id,
  is_default: index === 0,  // Only first item is default
  replacement_price: index === 0 ? 0 : m.unit_price,
}))
```

After (correct):
```
For each slot in subItemMappings:
  -> Insert default row: { sub_item_id: slot.sub_item_id, is_default: true, replacement_price: 0 }
  -> For each replacement in slot.replacements:
     -> Insert: { sub_item_id: replacement.item_id, is_default: false, replacement_price: replacement.extra_cost }
```

### 2. Fix Load Logic (ItemsEdit.tsx)

When loading existing `item_sub_items` from the database, reconstruct the slot/replacement grouping:

- Find all rows where `is_default = true` -- these are slots
- Find all rows where `is_default = false` -- these are replacements
- Attach non-default rows as `replacements[]` on the default slot entry

### 3. UI Improvements for Clarity

**ItemTable.tsx** -- Make the slot/replacement relationship obvious:

- Default items show a `[Default]` badge and a locked icon (no delete button)
- The "Replacement" column shows the count badge (already exists) linking to ReplacementModal
- Replacement items are NOT shown as separate rows -- they only appear via the ReplacementModal or as a count badge

**AddItemModal** -- Each item added via "Add Item" creates a new **slot** (always the default for that slot). The button label can stay "Add Item" since it adds a combo slot.

No changes needed to ReplacementModal -- it already correctly manages the replacement list within a slot.

### 4. Prevent Default Item Removal

In the remove handler and ItemTable, check if the item being removed is the only default in any slot. If it has replacements, block removal with a toast: "Remove all replacements first before removing the default item."

## Files Changed

| File | Change |
|---|---|
| `src/pages/ItemsAdd.tsx` | Fix save logic to flatten slots + replacements into `item_sub_items` rows |
| `src/pages/ItemsEdit.tsx` | Fix save logic (same as above) + fix load logic to reconstruct slots from DB |
| `src/components/item-mapping/ItemTable.tsx` | Add [Default] badge, lock icon on default items, hide delete for defaults with replacements |

## Technical Details

### Save format in `item_sub_items` table

For a combo "Chicken Biryani" with slot: Mango Bite (default) + Pepsi (replacement +3.50):

| item_id | sub_item_id | is_default | replacement_price | sort_order |
|---|---|---|---|---|
| biryani | mango_bite | true | 0 | 1 |
| biryani | pepsi | false | 3.50 | 2 |

### Load reconstruction logic (ItemsEdit)

```
const defaults = itemSubItems.filter(r => r.is_default);
const nonDefaults = itemSubItems.filter(r => !r.is_default);

const mappings = defaults.map(d => ({
  ...mapToSubItemMapping(d),
  replacements: nonDefaults.map(nd => ({
    id: nd.id,
    item_id: nd.sub_item_id,
    item_name: nd.sub_item?.name_en,
    extra_cost: Number(nd.replacement_price),
    is_default: false,
  })),
}));
```

This ensures the ReplacementModal shows existing replacements when editing, and the save logic correctly persists them.

