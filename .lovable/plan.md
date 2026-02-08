

# Fix: Proper Slot Grouping for Combo Replacements

## Problem

The database correctly stores:
- Mango Bite (`is_default: true`, sort_order: 1)
- Pepsi (`is_default: false`, sort_order: 2) -- replacement of Mango Bite
- Curd (`is_default: true`, sort_order: 3) -- separate slot

But `usePOSItems.ts` assigns **every** sub-item `replacement_group: "combo"`, so the CustomizeModal groups them all into one flat list instead of two separate slots.

## Solution

In `usePOSItems.ts`, build slot groups dynamically: each `is_default: true` row starts a new group, and subsequent `is_default: false` rows belong to that group. The group name uses the default item's name (e.g., "Mango Bite", "Curd").

## Change (1 file)

**`src/hooks/pos/usePOSItems.ts`** -- lines 138-152

Replace the flat mapping with slot-aware grouping:

```typescript
// Build replacements grouped by slot (each default starts a new slot)
let replacements: POSItemReplacement[] = [];
if (subItems && subItems.length > 0) {
  let currentGroup = "combo";
  for (const si of subItems) {
    const isDefault = si.is_default ?? false;
    if (isDefault) {
      // Each default item starts a new slot group, named after itself
      currentGroup = si.sub_item?.name_en || "combo";
    }
    replacements.push({
      id: si.id,
      menu_item_id: itemId,
      replacement_group: currentGroup,
      replacement_name_en: si.sub_item?.name_en || "Unknown",
      replacement_name_ar: si.sub_item?.name_ar || null,
      replacement_name_ur: si.sub_item?.name_ur || null,
      price_difference: isDefault ? 0 : Number(si.replacement_price) || 0,
      is_default: isDefault,
      sort_order: si.sort_order || 0,
      created_at: si.created_at,
    });
  }
}
```

### Result

With the current DB data, this produces two groups:
- Group "Mango Bite": Mango Bite (default) + Pepsi (replacement)
- Group "Curd": Curd (default, standalone)

Separated visually by the dotted line, matching the reference image exactly.

No other files need changes -- `CustomizeModal` already groups by `replacement_group` and `ReplacementPills` already renders the dotted separator between groups.
