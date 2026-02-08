

# Fix POS Customization Data to Match Item Master

## Problem

The seed data currently in `pos_item_ingredients` and `pos_item_replacements` is fabricated dummy data (Rice, Chicken, Onion, Cheese ingredients + Rice replacement group). The actual Item Master configuration for Chicken Biryani is:

- **1 Ingredient**: Tomato (can_remove = true, can_add_extra = false, no extra cost)
- **1 Sub-Item**: Pepsi (from the combo items list, though sub-items are not yet persisted to a database table)
- **No replacements** configured

## Changes Required

### 1. Clean Up Dummy Data

Delete all existing rows from `pos_item_ingredients` and `pos_item_replacements` for Chicken Biryani (`cef55e70-b359-4ebb-9b73-5fb43d2b2823`).

### 2. Insert Correct Ingredient Data

Insert into `pos_item_ingredients` for Chicken Biryani:

| ingredient_name_en | is_removable | is_default_included | extra_price |
|---|---|---|---|
| Tomato | true | true | 0.00 |

This matches the `item_ingredients` record: ingredient = Tomato, can_remove = true, can_add_extra = false.

### 3. No Replacements

The `pos_item_replacements` table should remain empty for this item since no replacements are configured in the Item Master.

### 4. No Sub-Items Table

The combo sub-items (like Pepsi) are managed in-memory on the form and are not yet persisted to any database table. There is no `item_sub_items` table in the schema. This means the POS Customize modal will only show the Tomato ingredient for now.

## Technical Summary

| Action | Details |
|---|---|
| DELETE from `pos_item_ingredients` | Remove 4 dummy rows (Rice, Chicken, Onion, Cheese) |
| DELETE from `pos_item_replacements` | Remove 3 dummy rows (White Rice, Brown Rice, Naan) |
| INSERT into `pos_item_ingredients` | 1 row: Tomato, removable, default included, no extra cost |
| No code changes needed | The hook and modal code already work correctly |

