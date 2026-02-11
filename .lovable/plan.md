

# Cleanup and Enhancement Plan

## 1. Global Scrollbar Styling

Add custom scrollbar CSS to `src/index.css` using WebKit and Firefox scrollbar properties:
- 6px thin scrollbar with rounded edges
- Semi-transparent track, slightly visible thumb
- Darker thumb on hover
- Applied globally via `*` selector
- No layout shift (overlay scrollbar where supported)

## 2. Remove Unused Modules

### Routes to remove from `src/App.tsx`:
- `/categories`, `/categories/add`, `/categories/:id/edit`
- `/item-ingredient-mapping`, `/item-ingredient-mapping/:id/edit`
- `/inventory/items`, `/inventory/items/add`, `/inventory/items/:id/edit`
- All associated imports (Categories, CategoriesAdd, CategoriesEdit, ItemIngredientMapping, ItemIngredientMappingEdit, ItemMaster, ItemMasterAdd, ItemMasterEdit)

### Sidebar entries to remove from `src/components/AppSidebar.tsx` (`otherNavItems`):
- Categories (`/categories`)
- Item Ingredients (`/item-ingredient-mapping`)
- Item Master from `inventorySubItems` (`/inventory/items`)

### Files left in place (not deleted) to avoid orphan imports elsewhere, but fully disconnected from navigation and routing.

## 3. Item Pricing - Fetch from /items

Update `src/pages/ItemPricing.tsx`:
- Replace `mockItems` with a Supabase query to the `items` table
- Replace `mockChannels` with a Supabase query to the `sales_channels` table
- Add loading state
- Items list dynamically reflects any changes made in `/items`

## 4. Move Sales Channels into Maintenance

### Sidebar (`src/components/AppSidebar.tsx`):
- Remove `salesChannels` entry from `mainNavItems`
- Add `Sales Channels` as a new sub-item in `maintenanceSubItems` array

### Routes (`src/App.tsx`):
- Change `/sales-channels` to `/maintenance/sales-channels`
- Change `/sales-channels/add` to `/maintenance/sales-channels/add`
- Change `/sales-channels/:id/edit` to `/maintenance/sales-channels/:id/edit`

### Update navigation references in:
- `src/pages/SalesChannels.tsx` (add button navigates)
- `src/pages/SalesChannelsAdd.tsx` (back/save redirects)
- `src/pages/SalesChannelsEdit.tsx` (back/save redirects)

## 5. Rename "Orders" to "Order List"

### Sidebar (`src/components/AppSidebar.tsx`):
- Change the label for `/pos/orders` entry: update `titleKey` translation value from "Orders" to "Order List"

### Translations (`src/lib/i18n/translations.ts`):
- EN: `orderList: "Order List"` (was "Orders")
- AR: `orderList: "قائمة الطلبات"` (was "الطلبات")  
- UR: `orderList: "آرڈر لسٹ"` (was "آرڈرز")

Route stays at `/pos/orders` (already correct per requirement).

## 6. Validation

All changes are cosmetic/structural with no database schema modifications. The POS flow, order processing, and existing pricing logic remain untouched.

---

## Technical Summary

| File | Change |
|------|--------|
| `src/index.css` | Add global custom scrollbar styles |
| `src/App.tsx` | Remove 8 route entries, update 3 sales-channel routes |
| `src/components/AppSidebar.tsx` | Remove 3 nav entries, move Sales Channels to maintenance, remove unused imports |
| `src/pages/ItemPricing.tsx` | Replace mock data with Supabase queries for items and sales_channels |
| `src/pages/SalesChannels.tsx` | Update navigation paths |
| `src/pages/SalesChannelsAdd.tsx` | Update navigation paths |
| `src/pages/SalesChannelsEdit.tsx` | Update navigation paths |
| `src/lib/i18n/translations.ts` | Rename "Orders" to "Order List" in all 3 languages |

