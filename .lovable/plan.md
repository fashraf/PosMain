
# Plan: Fix Item Master Data Display Issues

## Issues Identified

### Issue 1: Item List Shows Empty
**Root Cause**: The RLS policy on `items` table restricts SELECT to only rows where `is_active = true`. However, the network request from `/items` page returned an empty array `[]` despite your item being active.

Looking at the network logs, the query at `/items` returns `[]` while a direct database query confirms the item exists with `is_active = true`. The issue is that the Items list page (`src/pages/Items.tsx`) queries **all items** without the `is_active` filter, but the RLS policy **only allows selecting active items** for non-admin authenticated users.

The current RLS policy:
```sql
Policy: "Authenticated users can view active items"
FOR SELECT USING (is_active = true)
```

This is intentional for POS (customers should only see active items), but for the **admin Item Master list**, admins need to see ALL items (both active and inactive) to manage them.

**Fix**: The RLS policy for `items` already has "Admins can manage items" with `ALL` permission using `is_admin(auth.uid())`. However, the SELECT-specific policy may be overriding it for non-admin queries. We need to update the RLS to allow admins to see all items.

### Issue 2: Modal Shows IDs Instead of Names
**Root Cause**: In `ItemsEdit.tsx` lines 1047-1048, the modal receives:
```javascript
subcategories: formData.subcategories,  // Array of UUIDs
serving_times: formData.serving_times,   // Array of UUIDs
```

The `ItemSaveConfirmModal` displays these directly as chips without resolving the UUIDs to their human-readable names.

**Fix**: Before passing to the modal, map the UUID arrays to their corresponding localized names using the already-loaded `subcategories` and `servingTimes` data.

### Issue 3: Ingredients Not Shown in Add Ingredient Modal
**Root Cause**: The `ingredients` table is empty (no data). Users need to first add ingredients via the Ingredient Master (`/inventory/ingredients`) before they can map them to items.

**Additional Issue**: Even when ingredients exist, the `ingredients` RLS policy only allows SELECT for `is_active = true`, which is correct.

**Fix**: This is expected behavior - the modal is correctly showing "No data" because there are no ingredients in the database. Users need to populate the Ingredient Master first.

### Issue 4: Items Not Shown in Add Item Modal (Combo)
**Root Cause**: In `ItemsEdit.tsx` lines 52-57 and 1006, the `AddItemModal` is passed `mockAvailableItems` (hardcoded array) instead of real database items:
```javascript
const mockAvailableItems: AvailableItem[] = [
  { id: "101", name_en: "Margherita Pizza", ... },
  ...
];
...
<AddItemModal
  items={mockAvailableItems}  // Should be real data
  ...
/>
```

**Fix**: Replace `mockAvailableItems` with a real query to fetch items from the database.

---

## Implementation Plan

### Step 1: Fix Items RLS Policy for Admin Visibility
**Database Migration**:
- Update the `items` SELECT policy to allow admins to see all items OR authenticated users to see only active items.

```sql
DROP POLICY IF EXISTS "Authenticated users can view active items" ON public.items;
CREATE POLICY "Users can view items based on role"
ON public.items FOR SELECT
USING (
  is_admin(auth.uid()) OR is_active = true
);
```

### Step 2: Fix Modal Showing UUIDs Instead of Names
**File**: `src/pages/ItemsEdit.tsx`
**Changes**:
- Map `formData.subcategories` (UUID array) to localized names using the `subcategories` data
- Map `formData.serving_times` (UUID array) to localized names using the `servingTimes` data

```javascript
// In ItemSaveConfirmModal props:
subcategories: formData.subcategories.map(id => {
  const sub = subcategories?.find(s => s.id === id);
  return sub ? getLocalizedLabel(sub) : id;
}),
serving_times: formData.serving_times.map(id => {
  const st = servingTimes?.find(s => s.id === id);
  return st ? getLocalizedLabel(st) : id;
}),
```

**File**: `src/pages/ItemsAdd.tsx`
**Same changes** to maintain consistency.

### Step 3: Replace Mock Items with Real Database Query in Add Item Modal
**File**: `src/pages/ItemsEdit.tsx`
**Changes**:
1. Remove `mockAvailableItems` constant
2. Add a React Query hook to fetch items from database
3. Pass the fetched items to `AddItemModal`

```javascript
// Add query for available items
const { data: dbItems = [] } = useQuery({
  queryKey: ["items-for-combo"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("is_active", true)
      .order("name_en");
    if (error) throw error;
    return (data || []).map(item => ({
      id: item.id,
      name_en: item.name_en,
      name_ar: item.name_ar || "",
      name_ur: item.name_ur || "",
      base_cost: Number(item.base_cost),
      is_combo: item.is_combo,
    }));
  },
});

// Pass to modal
<AddItemModal
  items={dbItems}
  ...
/>
```

**File**: `src/pages/ItemsAdd.tsx`
**Same changes**.

---

## Files to Modify

| File | Changes |
|------|---------|
| SQL Migration | Update RLS policy for items to allow admins to see all items |
| `src/pages/ItemsEdit.tsx` | 1. Map subcategory/serving time IDs to names for modal<br>2. Replace mockAvailableItems with real DB query |
| `src/pages/ItemsAdd.tsx` | Same changes as ItemsEdit.tsx |

---

## Expected Results After Implementation

1. **Item List**: Will show all items (active and inactive) for admin users
2. **Save Confirmation Modal**: Will display proper names for subcategories and serving times instead of UUIDs
3. **Add Item Modal (Combo)**: Will show real items from the database instead of hardcoded mock data
4. **Add Ingredient Modal**: Will work correctly once ingredients are added to the Ingredient Master

---

## Note on Empty Data

The Ingredient Master (`/inventory/ingredients`) and Items database are currently empty. After these fixes are applied, you will need to:
1. Add ingredients via `/inventory/ingredients`
2. Add items via `/items/add`
3. Then you can test the combo item mapping with real data
