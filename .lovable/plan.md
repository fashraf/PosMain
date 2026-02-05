
## What I found (root causes mapped to your 4 bug groups)

### A) You currently have 3 different “item/ingredient systems” in the UI
1) **/items** (intended Item Master)
- `/items` list page **does** query `public.items` correctly.
- But `/items/add` and `/items/:id/edit` are still **mock-only**: they show a rich form UI but **never INSERT/UPDATE anything** (they just `setTimeout` + toast).  
  Result: table stays empty forever, “save” appears to do nothing after refresh.

2) **/inventory/ingredients** (Ingredient Master you’re on now)
- `src/pages/inventory/IngredientMaster.tsx` is **mock data** list.
- `IngredientMasterAdd/Edit` are also **mock** (Edit literally hardcodes “Chicken Breast” after a timeout).  
  Result: wrong ingredient shown, and saving never updates backend.

3) **Legacy routes /ingredients and /inventory/items**
- `/ingredients/*` pages are also mock-based (older prototype).
- `/inventory/items/*` is a separate “Stock Item Master” mock module, which violates your “single Item Master” rule.

### B) POS customization is still wired to the old POS tables
- `usePOSItems()` was switched to `items` (good).
- But `usePOSItemDetails()` still queries `pos_menu_items`, `pos_item_ingredients`, `pos_item_replacements`, so customization/extras/removals will not reflect your Item Master mappings.

---

## Implementation Plan (high priority, end-to-end, no partials)

### 1) Fix Item Master visibility + saving at `/items`
**Goal:** Add item → immediately appears in `/items` list; refresh keeps it; edit updates; status toggle persists.

**Work:**
1. **Replace mock “save” logic in:**
   - `src/pages/ItemsAdd.tsx`
   - `src/pages/ItemsEdit.tsx`

   With real backend mutations:
   - `INSERT INTO public.items (...)`
   - `UPDATE public.items SET ... WHERE id=...`

2. **React Query cache correctness**
   - Standardize the query key to one canonical key, e.g. `["items"]` (or keep `["items-master"]`, but use it everywhere).
   - After successful create/update, call:
     - `queryClient.invalidateQueries({ queryKey: ["items-master"] })`
   - Ensure edit page loads the item via backend by ID (no mock `mockItems.find`).

3. **Backend RLS sanity**
   - Ensure the roles that should manage master data can actually insert/update items.
   - Your current policy is “Admins can manage items”. If your users are not admins, inserts will fail even after we wire the mutation.
   - Fix by expanding manage permissions to required roles (recommended: `admin` + `manager`), while keeping SELECT safe.

**UI confirmation checklist for this step:**
- Go to `/items` → list loads.
- `/items/add` → Save → toast success → redirected to list → item is visible.
- Refresh browser → item remains.
- Edit item → Save → list updates.

---

### 2) Ingredients in `/items` must come from Ingredient Master + full add/remove/extra controls
**Goal:** In item add/edit, the ingredients section pulls from the real Ingredient Master table and supports:
- Add ingredient from searchable dropdown
- Remove mapped ingredient
- Toggle “removable”
- Toggle “allow extra” + set extra cost
- Reorder (optional but recommended since you asked for “completely and correctly”)

#### 2.1 Create real backend tables for Ingredient Master + item-to-ingredient mappings
**Database changes (new migration):**
1) `public.ingredients` (Ingredient Master)
- `id uuid pk default gen_random_uuid()`
- `name_en text not null`, `name_ar text`, `name_ur text`
- `unit_id uuid null` (or `unit_symbol text`) depending on how you want to bind to `units`
- `cost_price numeric not null default 0`
- `is_active boolean not null default true`
- timestamps

2) `public.item_ingredients`
- `id uuid pk default gen_random_uuid()`
- `item_id uuid not null references public.items(id) on delete cascade`
- `ingredient_id uuid not null references public.ingredients(id)`
- `quantity numeric not null default 1`
- `sort_order int not null default 0`
- `can_remove boolean not null default true`
- `can_add_extra boolean not null default false`
- `extra_cost numeric null`
- timestamps

**RLS**
- `admin/manager` can manage (insert/update/delete) both tables
- authenticated users can SELECT active ingredients
- authenticated users can SELECT item_ingredients for active items (needed by POS customization)

#### 2.2 Wire Ingredient Master lookup into `/items`
**Work in:**
- `src/pages/ItemsAdd.tsx`
- `src/pages/ItemsEdit.tsx`
- `src/components/item-mapping/AddIngredientModal.tsx` (or the picker component it uses)

Replace:
- `mockAvailableIngredients` with real `useQuery()` fetching from `ingredients`

Map fields into the UI shape `AvailableIngredient` expects.

#### 2.3 Add “extras/removals” UI controls (and keep them persisted)
Right now your item mapping UI uses `IngredientTable` which:
- shows add/remove
- but does not expose per-row remove/extra toggles.

You already have a better component:  
`src/components/item-mapping/IngredientMappingList.tsx`
- supports reorder (DnD)
- has checkboxes for remove + extra
- has extra cost input
- has delete icons

**Plan:**
- Replace the current `IngredientTable` usage in `/items/add` and `/items/:id/edit` with `IngredientMappingList` (or enhance `IngredientTable` to include those toggles; I recommend using the existing MappingList to avoid regressions).

#### 2.4 Persist mappings on item save
On create/update item:
- Upsert item row first
- Then persist mappings:
  - delete existing `item_ingredients` rows for that item
  - insert the current array in the correct `sort_order`

This guarantees no stale mappings and makes the behavior deterministic.

**UI confirmation checklist for this step:**
- Create ingredient in Ingredient Master
- In `/items/add`, open ingredients section → search & add ingredient → see row with removable/extra toggles
- Toggle “extra” and set extra cost
- Save item → refresh → edit item → mapping still present

---

### 3) Increase modal sizes for add/edit item + ingredient modals in `/items`
You’re using several dialogs that are currently too small:
- `src/components/item-mapping/AddIngredientModal.tsx` (480px)
- `src/components/item-mapping/AddItemModal.tsx` (480px)
- `src/components/item-mapping/ReplacementModal.tsx` (540px)
- `src/components/items/ItemDialog.tsx` (600px) (even if not used today, we’ll fix it to prevent regressions)
- `src/components/ingredients/IngredientDialog.tsx` (600px)

**Plan:**
- Switch dialog sizing to a “large” responsive layout:
  - `w-[95vw] sm:max-w-5xl`
  - `h-[90vh] max-h-[90vh]`
  - ensure internal scroll areas are used (`overflow-y-auto` / `ScrollArea`)
- Ensure footer stays visible and content scrolls.

**UI confirmation checklist:**
- Add ingredient modal is comfortably wide (desktop)
- Long lists scroll correctly without clipping
- No layout overflow on smaller screens

---

### 4) Fix `/inventory/ingredients/:id/edit` wrong record + no update
**Goal:** Edit route fetches ingredient by the URL id, displays correct ingredient, saves to backend with success toast, and reload shows updated record.

#### 4.1 Make `/inventory/ingredients` real (no mock)
Update:
- `src/pages/inventory/IngredientMaster.tsx`
to fetch from `public.ingredients` with React Query, add loading + empty states.

#### 4.2 Make Add/Edit real (no mock timeouts)
Update:
- `src/pages/inventory/IngredientMasterAdd.tsx` → `INSERT ingredients`
- `src/pages/inventory/IngredientMasterEdit.tsx`:
  - fetch with `.eq("id", id).maybeSingle()`
  - if null → show “Not found” state
  - on save → `UPDATE ingredients SET ... WHERE id=...`
  - proper toasts for success/error

**Important:**
- Remove the current hardcoded `setTimeout()` data population that causes the “wrong ingredient shown” bug.

**UI confirmation checklist:**
- Open `/inventory/ingredients` list, click edit on a specific ingredient
- URL id matches the record shown
- Save → toast success → list shows updated value
- Refresh edit page → still correct

---

### 5) Enforce “SINGLE Item Master” rule: remove redundant item list at `/inventory/items`
You explicitly require this, so we will do it cleanly:

**Work:**
1) In `src/App.tsx`
- Remove routes:
  - `/inventory/items`
  - `/inventory/items/add`
  - `/inventory/items/:id/edit`
- Replace with redirect(s) to `/items` to avoid broken links.

2) In `src/components/AppSidebar.tsx`
- Remove the `nav.itemMaster` entry that points to `/inventory/items`

3) Optional cleanup
- If there are other entry points pointing there, update them too.

---

### 6) Make POS customization use Item Master mappings (so “extras/removals” actually work when ordering)
Even after steps 1–4, ordering customization will still be broken unless we align the detail hook.

**Work:**
- Update `src/hooks/pos/usePOSItems.ts`:
  - Keep as-is (already reads from `items`).
- Update `src/hooks/pos/usePOSItems.ts` → `usePOSItemDetails()`:
  - Fetch item from `items` (not `pos_menu_items`)
  - Fetch ingredient mappings from `item_ingredients` joined with `ingredients` (so drawer can show names and prices)
  - Map into `POSItemIngredient` shape expected by `CustomizeDrawer`
  - If you want replacements, we’ll introduce `item_replacements` later; for now, ensure extras/removals work first (your bug report is focused on ingredients).

**UI confirmation checklist:**
- In `/pos`, open an item marked customizable
- Drawer shows ingredient list
- Tap EXTRA/REMOVE → price updates → add to cart
- Checkout flow works

---

## Files that will be modified (summary)
### Database migration
- New migration to add:
  - `public.ingredients`
  - `public.item_ingredients`
  - RLS + updated_at triggers

### Frontend (critical paths)
- Items:
  - `src/pages/Items.tsx` (minor: query key consistency if needed)
  - `src/pages/ItemsAdd.tsx` (real insert + mappings persistence, replace ingredient mocks)
  - `src/pages/ItemsEdit.tsx` (real fetch/update + mappings persistence, replace ingredient mocks)
- Ingredient Master:
  - `src/pages/inventory/IngredientMaster.tsx` (real list)
  - `src/pages/inventory/IngredientMasterAdd.tsx` (real insert)
  - `src/pages/inventory/IngredientMasterEdit.tsx` (real fetch/update)
- Modals sizing:
  - `src/components/item-mapping/AddIngredientModal.tsx`
  - `src/components/item-mapping/AddItemModal.tsx`
  - `src/components/item-mapping/ReplacementModal.tsx`
  - `src/components/items/ItemDialog.tsx`
  - `src/components/ingredients/IngredientDialog.tsx`
- POS detail wiring:
  - `src/hooks/pos/usePOSItems.ts` (fix `usePOSItemDetails()` sources)
- Remove duplicate inventory item master:
  - `src/App.tsx`
  - `src/components/AppSidebar.tsx`

---

## End-to-end test script (what I will run through in the UI after implementation)
1) Ingredient Master
- Add ingredient → appears in `/inventory/ingredients`
- Edit ingredient → correct record → updates persist after refresh

2) Item Master
- Add item → appears in `/items` immediately and after refresh
- Edit item → updates persist
- Toggle active → persists

3) Item ↔ Ingredients mapping
- In `/items/add`, add ingredients from Ingredient Master search
- Set removable + allow extra + extra cost
- Save item → reopen edit → all mappings retained

4) POS
- Go `/pos`
- Item appears (active items)
- If customizable, drawer shows ingredient list
- EXTRA/REMOVE works and affects pricing and cart line

---

## Notes on “no regressions”
- We will remove all remaining mock lists that cause silent divergence (especially `/inventory/ingredients` and `/ingredients` legacy flows).
- We will ensure all create/update paths show success + error feedback (toasts) and that queries are invalidated so the UI updates immediately without manual refresh.
