

# Fix Combo Sub-Item Persistence and Cart Clear All UI

## Problem 1: Combo Sub-Items Don't Save

When creating a combo item (e.g., Chicken Biryani with Pepsi), the sub-items added in the Items section are never saved to the database. The save function only persists ingredients to `item_ingredients` but skips sub-item mappings entirely because there is no database table for them.

### Solution

1. **Create a new `item_sub_items` table** to persist combo sub-item mappings:

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| item_id | uuid (FK to items) | The parent combo item |
| sub_item_id | uuid (FK to items) | The child item (e.g., Pepsi) |
| quantity | integer | Default 1 |
| sort_order | integer | Display order |
| is_default | boolean | First added = true (default item, always 0 cost) |
| replacement_price | numeric | Price for replacement items (non-default) |
| can_remove | boolean | Whether user can remove this from cart (false for replacements) |

2. **Update the save function** in `ItemsAdd.tsx` (and `ItemsEdit.tsx`) to insert sub-item mappings into the new table after saving the item.

3. **Update the edit page** to load existing sub-item mappings from the database when editing a combo item.

## Problem 2: Combo Sub-Item POS Logic

The business rules for combo sub-items in POS:
- The **first sub-item** added is the **default** -- it always costs 0 (included in the combo price)
- Subsequent sub-items are **replacements** -- they have an additional cost
- Replacements **cannot be removed** from the order (you can only swap between them)

This logic will need to be reflected when syncing to `pos_item_replacements` or handled directly from `item_sub_items` in the POS hooks.

### Solution

Update the POS item details hook (`usePOSItemDetails`) to also fetch from `item_sub_items` and build replacement groups from them:
- Default sub-item becomes the "default" replacement option (price = 0)
- Other sub-items become replacement alternatives (with their replacement_price)

## Problem 3: Clear All Button UI

The current "Clear All" is a small text link. Per the reference image, it should be a proper button with a trash icon and confirmation before clearing.

### Solution

- Style "Clear All" as a visible button with the trash icon (matching the reference image layout)
- Add a confirmation dialog: "Are you sure you want to clear all items from the cart?"

## Technical Details

### Database Migration

Create table `item_sub_items` with RLS policies matching `item_ingredients`.

### Files to Modify

| File | Change |
|---|---|
| `src/pages/ItemsAdd.tsx` | Add sub-item insert logic after item save (lines ~600-616) |
| `src/pages/ItemsEdit.tsx` | Load existing sub-items on edit; save updates |
| `src/hooks/pos/usePOSItemDetails.ts` (or equivalent) | Fetch `item_sub_items` and build replacement data from them |
| `src/components/pos/cart/CartHeader.tsx` | Restyle "Clear All" as a proper button |
| `src/components/pos/cart/CartPanel.tsx` | Add clear-all confirmation dialog |

### Sequence

1. Create `item_sub_items` table via migration
2. Update ItemsAdd save logic to persist sub-items
3. Update ItemsEdit to load and save sub-items
4. Update POS hooks to read from `item_sub_items` for replacement data
5. Update CartHeader Clear All button styling and add confirmation modal

