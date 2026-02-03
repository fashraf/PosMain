
# Phase 1 Admin Pages Implementation Plan

## Overview
Building the content for 6 admin pages: Sales Channels, Ingredients, Items, Item-Ingredient Mapping, Item Pricing, and Settings (Language Section). All pages will use the existing design system, i18n infrastructure, and UI components. The design will be modernized to match the reference image with a light purple/lavender accent sidebar feel and clean minimal cards.

---

## Design System Updates

### Color Refinements (Based on Reference Image)
- Light lavender accent for active menu items: `#f3f0ff`
- Softer purple for highlights: `#9b87f5`
- Clean white cards with subtle shadows
- Light gray table headers
- Status badges with color-coded indicators (green for active, gray for inactive)

---

## New i18n Keys Required

Add translations for all three languages (EN, AR, UR):

```text
salesChannels.code, salesChannels.editChannel, salesChannels.deleteChannel, salesChannels.confirmDelete, salesChannels.noChannels
ingredients.type, ingredients.liquid, ingredients.solid, ingredients.baseUnit, ingredients.sellingPrice, ingredients.editIngredient, ingredients.noIngredients
items.isCombo, items.editItem, items.noItems, items.uploadImage
itemPricing.saveAll, itemPricing.noItems
settings.languageDescription
common.activate, common.deactivate, common.type, common.code
```

---

## Database Schema Required

### Tables to Create

1. **sales_channels**
   - id (uuid, PK)
   - name_en (text)
   - name_ar (text)
   - name_ur (text)
   - code (text, unique)
   - icon (text, nullable)
   - is_active (boolean, default true)
   - created_at, updated_at (timestamps)

2. **ingredients**
   - id (uuid, PK)
   - name_en, name_ar, name_ur (text)
   - type (enum: liquid, solid)
   - base_unit (text - kg, g, pieces, liters, ml)
   - current_quantity (decimal)
   - alert_threshold (decimal)
   - cost_price (decimal)
   - selling_price (decimal, nullable)
   - can_sell_individually (boolean)
   - can_add_extra (boolean)
   - extra_cost (decimal, nullable)
   - is_active (boolean)
   - branch_id (uuid, FK to branches, nullable for HQ items)
   - created_at, updated_at

3. **items**
   - id (uuid, PK)
   - name_en, name_ar, name_ur (text)
   - description_en, description_ar, description_ur (text, nullable)
   - item_type (enum: edible, non_edible)
   - base_cost (decimal)
   - is_combo (boolean)
   - image_url (text, nullable)
   - is_active (boolean)
   - branch_id (uuid, FK, nullable)
   - created_at, updated_at

4. **item_ingredients**
   - id (uuid, PK)
   - item_id (uuid, FK)
   - ingredient_id (uuid, FK)
   - quantity_used (decimal)
   - can_remove (boolean)
   - can_add_extra (boolean)
   - extra_quantity_limit (decimal, nullable)
   - extra_cost (decimal, nullable)
   - created_at

5. **item_channel_pricing**
   - id (uuid, PK)
   - item_id (uuid, FK)
   - channel_id (uuid, FK)
   - price (decimal)
   - branch_id (uuid, FK, nullable)
   - created_at, updated_at

---

## Page Implementations

### 1. Sales Channels Page (`src/pages/SalesChannels.tsx`)

**Components:**
- Page header with "Add Channel" button
- Data table with columns: Name, Code, Status, Actions
- Status toggle switch inline
- Edit/Delete action buttons
- Modal dialog for Add/Edit

**Features:**
- Table displays all sales channels
- Inline status toggle (Active/Inactive)
- "Add Channel" opens modal with form:
  - Name (multi-language tabs: EN/AR/UR)
  - Code (auto-generated or manual)
  - Icon selector (optional)
  - Status toggle
- Edit action opens same modal pre-filled
- Delete with confirmation dialog
- Toast notifications for success/error
- Empty state when no channels exist

**File Structure:**
```text
src/pages/SalesChannels.tsx (main page)
src/components/sales-channels/SalesChannelTable.tsx
src/components/sales-channels/SalesChannelDialog.tsx
```

---

### 2. Ingredients Management Page (`src/pages/Ingredients.tsx`)

**Components:**
- Page header with "Add Ingredient" button
- Filterable/searchable data table
- Pagination component
- Add/Edit modal dialog

**Table Columns:**
- Name (translated based on current language)
- Type (Liquid/Solid badge)
- Base Unit
- Current Quantity
- Alert Threshold
- Cost Price
- Selling Price
- Can Sell Individually (Yes/No badge)
- Can Add Extra (Yes/No badge)
- Status (Active/Inactive toggle)
- Actions (Edit)

**Add/Edit Form Fields:**
- Name tabs (EN/AR/UR)
- Type dropdown (Liquid/Solid)
- Unit dropdown (kg, g, pieces, liters, ml)
- Quantity input
- Alert threshold input
- Cost price input
- Selling price input
- Toggle: Can be sold individually
- Toggle: Can add extra
- Extra cost input (visible only when "Can add extra" is true)
- Status toggle

**File Structure:**
```text
src/pages/Ingredients.tsx
src/components/ingredients/IngredientTable.tsx
src/components/ingredients/IngredientDialog.tsx
src/components/ingredients/IngredientFilters.tsx
```

---

### 3. Items Management Page (`src/pages/Items.tsx`)

**Components:**
- Page header with "Add Item" button
- View toggle (Grid/List)
- Data table or grid cards
- Add/Edit modal

**Table/Grid Columns:**
- Image thumbnail
- Name (translated)
- Item Type (Edible/Non-Edible badge)
- Base Cost
- Is Combo (Yes/No badge)
- Status
- Actions

**Add/Edit Form Fields:**
- Name tabs (EN/AR/UR)
- Description tabs (optional)
- Item Type dropdown
- Base cost input
- Is Combo toggle
- Image upload placeholder (with preview area)
- Status toggle

**Note:** No ingredient mapping in this page (separate page for that)

**File Structure:**
```text
src/pages/Items.tsx
src/components/items/ItemTable.tsx
src/components/items/ItemGrid.tsx
src/components/items/ItemDialog.tsx
```

---

### 4. Item-Ingredient Mapping Page (`src/pages/ItemIngredientMapping.tsx`)

**New Route:** `/items/:itemId/ingredients` or a standalone page with item selector

**Components:**
- Item selector dropdown (search/filter enabled)
- Selected item card showing item details
- Ingredient mapping list
- Add ingredient row button

**For Each Ingredient Mapping Row:**
- Ingredient selector dropdown
- Quantity used input
- Can be removed toggle
- Can add extra toggle
- Extra quantity limit input (visible when can add extra = true)
- Extra cost input (visible when can add extra = true)
- Remove row button

**Features:**
- Dynamic row adding/removing
- Validation before save
- Toast notifications
- Empty state when no item selected or no mappings

**File Structure:**
```text
src/pages/ItemIngredientMapping.tsx (or extend Items.tsx with tab)
src/components/item-mapping/ItemSelector.tsx
src/components/item-mapping/IngredientMappingRow.tsx
src/components/item-mapping/IngredientMappingList.tsx
```

---

### 5. Item Pricing per Sales Channel (`src/pages/ItemPricing.tsx`)

**Components:**
- Price matrix grid/table
- Horizontal scroll for many channels
- Save all button

**Grid Structure:**
- First column: Item name (with image thumbnail)
- Subsequent columns: One per active sales channel
- Each cell: Editable price input
- Visual indicator when price differs from base cost

**Features:**
- Auto-loads all items and active channels
- Inline editing of prices
- Batch save functionality
- Visual highlight for modified cells
- Empty state messaging

**File Structure:**
```text
src/pages/ItemPricing.tsx
src/components/pricing/PricingMatrix.tsx
src/components/pricing/PricingCell.tsx
```

---

### 6. Settings Page - Language Section (`src/pages/Settings.tsx`)

**Already Exists - Minor Enhancements:**
- Keep existing language selector cards
- Add current language highlight with check icon (already implemented)
- Ensure proper RTL support (already working)
- Use existing `changeLanguage` hook

**No changes needed** - the existing implementation is already correct.

---

## Shared Components to Create

### MultiLanguageInput Component
```text
src/components/shared/MultiLanguageInput.tsx
```
A tabbed input component for EN/AR/UR text entry used across all forms.

### StatusBadge Component
```text
src/components/shared/StatusBadge.tsx
```
Reusable badge showing Active (green) / Inactive (gray) status.

### DataTable Component
```text
src/components/shared/DataTable.tsx
```
Generic table wrapper with consistent styling, pagination, and empty state.

### EmptyState Component
```text
src/components/shared/EmptyState.tsx
```
Consistent empty state with icon and message.

---

## Technical Notes

### Data Fetching Pattern
- Use React Query (`@tanstack/react-query`) for data fetching
- Create hooks for each entity: `useSalesChannels`, `useIngredients`, `useItems`, etc.
- Implement optimistic updates for toggle actions

### Form Handling
- Use `react-hook-form` with `zod` validation
- All forms are controlled components
- Modal dialogs handle create/edit modes

### RTL Support
- All components use `isRTL` from `useLanguage` hook
- Flex containers use `flex-row-reverse` when RTL
- Tables handle RTL automatically via CSS

### Mock Data Strategy
- Start with mock data arrays in each page
- Structure matches database schema exactly
- Easy swap to real API calls later

---

## Implementation Order

1. **Translations** - Add all new i18n keys first
2. **Shared Components** - MultiLanguageInput, StatusBadge, EmptyState
3. **Sales Channels** - Table, Dialog, CRUD operations
4. **Ingredients** - Table with filters, Dialog, pagination
5. **Items** - Table/Grid view, Dialog
6. **Item-Ingredient Mapping** - Selector, dynamic rows
7. **Item Pricing Matrix** - Grid with editable cells
8. **Database Migrations** - Create all tables with RLS policies

---

## File Summary

### New Files to Create
```text
src/components/shared/MultiLanguageInput.tsx
src/components/shared/StatusBadge.tsx
src/components/shared/EmptyState.tsx
src/components/shared/DataTablePagination.tsx
src/components/sales-channels/SalesChannelTable.tsx
src/components/sales-channels/SalesChannelDialog.tsx
src/components/ingredients/IngredientTable.tsx
src/components/ingredients/IngredientDialog.tsx
src/components/items/ItemTable.tsx
src/components/items/ItemDialog.tsx
src/components/item-mapping/IngredientMappingList.tsx
src/components/pricing/PricingMatrix.tsx
```

### Files to Modify
```text
src/lib/i18n/translations.ts (add new keys)
src/pages/SalesChannels.tsx (full implementation)
src/pages/Ingredients.tsx (full implementation)
src/pages/Items.tsx (full implementation)
src/pages/ItemPricing.tsx (full implementation)
src/App.tsx (add new route for item-ingredient mapping if separate page)
```
