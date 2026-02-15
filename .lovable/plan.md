
# Category Bar: Item Counts + Horizontal Scroll + Remove Margins

## Changes

### 1. Add item counts to each category pill
Fetch item counts per category from the `items` table using a new hook `usePOSCategoryCounts`. Each pill will display the count in parentheses: `All (48)`, `Vegetarian (23)`, `Favorites (9)`.

### 2. Horizontal scroll when categories overflow
The pill container already has `overflow-x-auto`, but needs better behavior:
- Remove `snap-x snap-mandatory` (causes janky scrolling)
- Add smooth scroll-behavior
- Ensure pills don't wrap -- they slide left/right naturally when there are more than fit on screen

### 3. Remove outer margins
Remove `mx-2 mt-2` from the CategoryBar container so it sits flush edge-to-edge.

---

## Technical Details

### New hook: `src/hooks/pos/usePOSCategoryCounts.ts`
Fetches a single query grouping active items by `category_id` and returns a `Record<string, number>` map plus a total count and favorites count.

```text
SELECT category_id, count(*) FROM items WHERE is_active = true GROUP BY category_id
SELECT count(*) FROM items WHERE is_active = true AND is_favorite = true
```

Results cached for 5 minutes (same as categories).

### Files to modify

| File | Changes |
|------|---------|
| `src/hooks/pos/usePOSCategoryCounts.ts` | New hook -- fetches item counts grouped by category_id |
| `src/hooks/pos/index.ts` | Export the new hook |
| `src/components/pos/category/CategoryBar.tsx` | Remove `mx-2 mt-2` margins. Pass `count` prop to each `CategoryPill`. Remove `snap-x snap-mandatory`. Accept and use `categoryCounts` prop |
| `src/components/pos/category/CategoryPill.tsx` | Add optional `count` prop. Display as `Label (count)` inside the pill |
| `src/pages/pos/POSMain.tsx` | Import and call `usePOSCategoryCounts`, pass counts down to `CategoryBar` |

### CategoryPill display
- Props: add `count?: number`
- Render: `{label} {count !== undefined && <span className="opacity-70">({count})</span>}`
- Same styling otherwise -- selected/unselected states unchanged

### CategoryBar changes
- Container: `mx-2 mt-2` removed, becomes flush `mx-0 mt-0`
- Scrollable div: remove `snap-x snap-mandatory`, keep `overflow-x-auto scrollbar-hide`
- "All" pill gets total count (sum of all categories)
- Each category pill gets its specific count from the map
- "Favorites" pill gets favorites count
