
# Connect POS to Item Master Data

## Summary
Create a proper database table for Item Master items and connect the POS module to fetch items from this table. Also increase the size of category buttons.

---

## Current State

| Component | Current Status |
|-----------|----------------|
| Item Master (`/items`) | Uses **mock data** (hardcoded array in code) |
| POS Menu Items | Fetches from `pos_menu_items` table (empty) |

---

## Changes Required

### 1. Create `items` Database Table

Create a new table to store Item Master data:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name_en | TEXT | English name (required) |
| name_ar | TEXT | Arabic name |
| name_ur | TEXT | Urdu name |
| description_en | TEXT | English description |
| description_ar | TEXT | Arabic description |
| description_ur | TEXT | Urdu description |
| item_type | TEXT | 'edible' or 'non_edible' |
| base_cost | NUMERIC | Base cost/price |
| is_combo | BOOLEAN | Whether it's a combo item |
| image_url | TEXT | Image URL (nullable, user uploads) |
| is_active | BOOLEAN | Active status |
| is_customizable | BOOLEAN | For POS customization |
| is_favorite | BOOLEAN | For POS favorites filter |
| category_id | UUID | Foreign key to maintenance_categories |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

**RLS Policies:**
- Admins can manage all items
- Authenticated users can view active items

---

### 2. Update POS to Fetch from `items` Table

**File:** `src/hooks/pos/usePOSItems.ts`

Change the query from:
```typescript
supabase.from("pos_menu_items")
```

To:
```typescript
supabase.from("items")
```

Also update field mappings to match the new table structure.

---

### 3. Update Item Master Page to Use Database

**File:** `src/pages/Items.tsx`

Replace mock data with Supabase query:
```typescript
const { data: items, isLoading } = useQuery({
  queryKey: ["items"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data;
  },
});
```

---

### 4. Increase Category Button Size

**File:** `src/components/pos/category/CategoryPill.tsx`

Update styling:
```css
/* From */
min-h-[44px] px-5 py-2.5 text-sm font-medium

/* To */
min-h-[56px] px-6 py-3 text-base font-semibold
```

---

### 5. Update POS Types

**File:** `src/lib/pos/types.ts`

Update `POSMenuItem` interface to match the new `items` table structure.

---

## Files to Modify

| File | Change |
|------|--------|
| Database migration | Create `items` table with RLS |
| `src/hooks/pos/usePOSItems.ts` | Query from `items` table |
| `src/pages/Items.tsx` | Replace mock data with Supabase query |
| `src/lib/pos/types.ts` | Update POSMenuItem to match items table |
| `src/components/pos/category/CategoryPill.tsx` | Increase button size |

---

## Result

1. Item Master will save/load from the database
2. POS will display items created in Item Master
3. Images will only appear when uploaded by users in Item Master
4. Category buttons will be larger (56px height) for better touch targets
