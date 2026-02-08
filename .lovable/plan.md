

# POS Card Font/Image Size Bump + Customize Modal 80% Width + Seed Data

## 1. POSItemCard -- Bigger Font and 52x52 Image

**File:** `src/components/pos/items/POSItemCard.tsx`

- Image size: `h-8 w-8` (32px) changes to `h-[52px] w-[52px]` (52px)
- Item name font: `text-sm` changes to `text-base` (16px)
- Price font: `text-sm` changes to `text-base`
- "Custom" badge: `text-[9px]` changes to `text-[10px]`
- Button text: `text-xs` changes to `text-sm`
- Button icons: `h-3 w-3` changes to `h-3.5 w-3.5`

## 2. Customize Modal -- Increase to 80% Width

**File:** `src/components/pos/modals/CustomizeModal.tsx`

- `max-w-[750px] w-[92vw]` changes to `max-w-[80vw] w-[80vw]`

## 3. Seed POS Data -- Ingredients and Replacements

Since the `pos_menu_items`, `pos_item_ingredients`, and `pos_item_replacements` tables are all empty, the modals have no data to display. I will insert seed data via a database migration:

**pos_menu_items** -- 3 items matching the existing `items` table entries:
- Mango Bite (Rs. 10, not customizable, with image)
- Chicken Biryani (Rs. 35, customizable)
- Pepsi (Rs. 3.50, not customizable)

**pos_item_ingredients** -- For Chicken Biryani:
- Rice (default included, removable, no extra cost)
- Chicken (default included, not removable, extra +Rs. 15)
- Onion (default included, removable, no extra cost)
- Cheese (not default, not removable, extra +Rs. 10)

**pos_item_replacements** -- For Chicken Biryani, group "Rice":
- White Rice (default)
- Brown Rice (+Rs. 5)
- Naan Bread (+Rs. 8)

### Hook Fix

The `usePOSItemDetails` hook currently queries `pos_menu_items` for the item, but the POS grid fetches from the `items` table. The item IDs won't match. I will update the hook to query the `items` table for the base item data instead, so clicking Customize on any grid item correctly loads its details.

## Technical Summary

| File | Change |
|------|--------|
| `src/components/pos/items/POSItemCard.tsx` | Image 52x52, bigger fonts |
| `src/components/pos/modals/CustomizeModal.tsx` | Width to 80vw |
| `src/hooks/pos/usePOSItems.ts` | Fix `usePOSItemDetails` to query `items` table instead of `pos_menu_items` |
| Database migration | Seed `pos_item_ingredients` and `pos_item_replacements` with data for Chicken Biryani |
