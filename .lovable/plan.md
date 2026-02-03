

# Item-Ingredient Mapping - Revised UI Plan

## Overview
This plan redesigns the Edit Mapping page with a clean two-column layout (Ingredients | Items), adds confirmation modals for all add/remove actions, implements +/- quantity controls, and removes drag-and-drop from the main grid view.

---

## 1. Main Grid View Changes (ItemIngredientMapping.tsx)

### Remove Drag-and-Drop Reordering
The main list should be a simple read-only grid without the grip handles.

**Current State:**
```text
| ≡ | Item Name           | Type    | Ingredients | Sub-Items | ⚙️ |
|---|---------------------|---------|-------------|-----------|-----|
| ≡ | Margherita Pizza    | Edible  | 4           | -         | ✏️  |
```

**New State:**
```text
| Item Name            | Type    | Ingredients | Items | ⚙️ |
|----------------------|---------|-------------|-------|-----|
| Margherita Pizza     | Edible  | 4           | -     | ✏️  |
| 🏷️ Family Combo      | Combo   | 6           | 3     | ✏️  |
```

**Changes:**
- Remove `GripVertical` icon and drag functionality
- Rename "Sub-Items" column header to "Items"
- Remove the drag hint text at the bottom
- Keep expandable row functionality for viewing details

---

## 2. Edit Mapping Page - New Two-Column Layout

### Page Structure

```text
+------------------------------------------------------------------+
| ← Edit Mapping: Margherita Pizza                   [Save Changes] |
+==================================================================+

+------------------------------------------------------------------+
| 📋 Item Details (Read-Only)                                       |
+------------------------------------------------------------------+
| Name: Margherita Pizza  |  Type: Edible  |  Cost: $12.99         |
+------------------------------------------------------------------+

+-------------------------------+----------------------------------+
|  INGREDIENTS (Left Col-6)     |  ITEMS (Right Col-6)             |
+-------------------------------+----------------------------------+
| [+ Add Ingredient]            | [+ Add Item]                     |
|                               | (Hidden if not a combo)          |
+-------------------------------+----------------------------------+
| ┌─────────────────────────┐   | ┌─────────────────────────────┐ |
| │ Tomato                  │   | │ Margherita Pizza            │ |
| │ 0.2 Kg                  │   | │ 2 pcs                        │ |
| │ [−] [0.2] [+]  🗑       │   | │ [−] [2] [+]       🗑        │ |
| │ ☐ Remove  ☐ Extra $1.50 │   | │ $12.99 × 2 = $25.98          │ |
| └─────────────────────────┘   | └─────────────────────────────┘ |
|                               |                                  |
| ┌─────────────────────────┐   | ┌─────────────────────────────┐ |
| │ Cheese                  │   | │ Chicken Burger              │ |
| │ 0.15 Kg                 │   | │ 4 pcs                        │ |
| │ [−] [0.15] [+]  🗑      │   | │ [−] [4] [+]       🗑        │ |
| │ ☐ Remove  ☐ Extra $2.00 │   | │ $8.99 × 4 = $35.96           │ |
| └─────────────────────────┘   | └─────────────────────────────┘ |
+-------------------------------+----------------------------------+
| Total: $3.45                  | Total: $61.94                   |
+-------------------------------+----------------------------------+

+==================================================================+
|                                      [Cancel]  [Save Changes]     |
+==================================================================+
```

---

## 3. Component Architecture

### New Components to Create

**1. ConfirmActionModal** (`src/components/shared/ConfirmActionModal.tsx`)
A reusable modal for confirming add/remove actions.

```typescript
interface ConfirmActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;          // "Confirm Action"
  message: string;        // "Are you sure you want to add this Ingredient?"
  confirmLabel?: string;  // "Confirm"
  cancelLabel?: string;   // "Cancel"
  variant?: "default" | "destructive";
}
```

**2. IngredientCard** (`src/components/item-mapping/IngredientCard.tsx`)
Replaces the sortable row with a cleaner card layout.

```typescript
interface IngredientCardProps {
  mapping: IngredientMappingItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onToggleCanRemove: (value: boolean) => void;
  onToggleCanExtra: (value: boolean) => void;
  onExtraCostChange: (cost: number | null) => void;
}
```

Features:
- Name + Unit display
- Quantity controls: [-] [input] [+]
- Remove icon (🗑) with tooltip
- Checkboxes for "Can Remove" and "Can Add Extra"
- Extra cost input (visible when "Extra" is checked)

**3. ItemCard** (`src/components/item-mapping/ItemCard.tsx`)
For combo sub-items display.

```typescript
interface ItemCardProps {
  mapping: SubItemMappingItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}
```

Features:
- Item name display
- Quantity controls: [-] [input] [+]
- Unit price × quantity = subtotal display
- Remove icon (🗑) with tooltip

**4. DuplicateSaveWarningModal** (`src/components/item-mapping/DuplicateSaveWarningModal.tsx`)
Warning modal shown on save when duplicates exist.

```typescript
interface DuplicateSaveWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  duplicates: { name: string; count: number; type: "ingredient" | "item" }[];
}
```

---

## 4. Confirmation Modal Patterns

### Add Ingredient Confirmation
```text
+--------------------------------------------------+
| ⚠️ Confirm Action                                 |
+==================================================+
|                                                   |
| Are you sure you want to add "Tomato"?            |
|                                                   |
+--------------------------------------------------+
| [Cancel]                              [Confirm]   |
+--------------------------------------------------+
```

### Remove Ingredient Confirmation
```text
+--------------------------------------------------+
| ⚠️ Confirm Action                                 |
+==================================================+
|                                                   |
| Are you sure you want to remove "Cheese"?         |
|                                                   |
+--------------------------------------------------+
| [Cancel]                              [Remove]    |
+--------------------------------------------------+
```

### Duplicate Warning on Save
```text
+--------------------------------------------------+
| ⚠️ Duplicates Detected                            |
+==================================================+
|                                                   |
| You have added the same Ingredient/Item more      |
| than once. Please confirm before saving.          |
|                                                   |
| Duplicates found:                                 |
| • Cheese (added 2 times)                          |
| • Tomato (added 2 times)                          |
|                                                   |
+--------------------------------------------------+
| [Go Back]                      [Confirm & Save]   |
+--------------------------------------------------+
```

---

## 5. Terminology Updates

| Old Term | New Label |
|----------|-----------|
| Ingredient Mapping | Ingredient |
| Combo Sub-Items | Items |
| Delete | Remove |
| Save Mapping | Save Changes |
| Sub-Item Count | Items |

---

## 6. Quantity Controls Behavior

### Increment/Decrement Logic
```typescript
const handleIncrement = (current: number, step: number = 0.01) => {
  return Math.round((current + step) * 100) / 100; // Prevent floating point issues
};

const handleDecrement = (current: number, step: number = 0.01) => {
  const newValue = Math.round((current - step) * 100) / 100;
  return Math.max(0.01, newValue); // Prevent negative values, minimum 0.01
};
```

### Visual Design
```text
┌─────────────────────────────────────┐
│ Tomato                              │
│ ─────────────────────────────────── │
│ Quantity: [−] [0.20] [+]  Kg    🗑  │
│ ─────────────────────────────────── │
│ ☐ Customer can remove               │
│ ☐ Customer can add extra            │
│   └─ Extra cost: $[1.50]            │
└─────────────────────────────────────┘
```

---

## 7. Detailed Edit Page Flow

### Add Ingredient Flow
1. User clicks [+ Add Ingredient]
2. Searchable dropdown appears (filtered to non-mapped ingredients)
3. User selects an ingredient
4. **Confirmation Modal**: "Are you sure you want to add [Ingredient Name]?"
5. On Confirm: Ingredient is added to the list (temporary state)
6. On Cancel: Nothing happens

### Remove Ingredient Flow
1. User clicks Remove icon (🗑) on an ingredient card
2. **Confirmation Modal**: "Are you sure you want to remove [Ingredient Name]?"
3. On Confirm: Ingredient is removed from the list (temporary state)
4. On Cancel: Nothing happens

### Add Item Flow (Combo Only)
1. User clicks [+ Add Item] (only visible if parent item is a combo)
2. Searchable dropdown appears (shows non-combo items, excludes self)
3. User selects an item
4. **Confirmation Modal**: "Are you sure you want to add [Item Name]?"
5. On Confirm: Item is added to the list (temporary state)
6. On Cancel: Nothing happens

### Save Flow
1. User clicks [Save Changes]
2. System checks for duplicates
3. **If duplicates exist**: Show DuplicateSaveWarningModal
4. **If no duplicates**: Show ConfirmChangesModal (existing pattern)
5. On Confirm: Validate and save in single transaction
6. On Success: Toast notification + navigate back
7. On Failure: Toast error + rollback

---

## 8. Files to Modify

### Modified Files
```text
src/pages/ItemIngredientMapping.tsx
  - Remove DndContext, SortableContext, useSortable
  - Remove GripVertical icons
  - Rename "Sub-Items" header to "Items"
  - Remove drag hint text

src/pages/ItemIngredientMappingEdit.tsx
  - Redesign to two-column layout
  - Add confirmation modals for add/remove
  - Implement +/- quantity controls
  - Add duplicate detection on save
  - Rename "Combo Sub-Items" section to "Items"

src/components/item-mapping/MappingSummaryTable.tsx
  - Remove drag-and-drop functionality
  - Remove GripVertical column
  - Rename "Sub-Items" to "Items"

src/lib/i18n/translations.ts
  - Update terminology (subItems → items, delete → remove)
  - Add new modal messages
```

### New Files
```text
src/components/shared/ConfirmActionModal.tsx
src/components/item-mapping/IngredientCard.tsx
src/components/item-mapping/ItemCard.tsx
src/components/item-mapping/DuplicateSaveWarningModal.tsx
```

---

## 9. New i18n Keys

```text
// Confirmation Modals
confirmAction.title: "Confirm Action"
confirmAction.addIngredient: "Are you sure you want to add this Ingredient?"
confirmAction.removeIngredient: "Are you sure you want to remove this Ingredient?"
confirmAction.addItem: "Are you sure you want to add this Item?"
confirmAction.removeItem: "Are you sure you want to remove this Item?"
confirmAction.confirm: "Confirm"
confirmAction.remove: "Remove"

// Duplicate Warning
itemMapping.duplicatesDetected: "Duplicates Detected"
itemMapping.duplicateWarningMessage: "You have added the same Ingredient/Item more than once. Please confirm before saving."
itemMapping.duplicatesFound: "Duplicates found:"
itemMapping.addedTimes: "added {count} times"
itemMapping.goBack: "Go Back"
itemMapping.confirmAndSave: "Confirm & Save"

// Terminology Updates
itemMapping.items: "Items"  // Renamed from "Sub-Items"
common.remove: "Remove"     // Renamed from "Delete"
common.saveChanges: "Save Changes"

// Quantity Controls
itemMapping.quantity: "Quantity"
itemMapping.increment: "Increase quantity"
itemMapping.decrement: "Decrease quantity"

// Card Labels
itemMapping.customerCanRemove: "Customer can remove"
itemMapping.customerCanAddExtra: "Customer can add extra"
itemMapping.extraCost: "Extra cost"
```

---

## 10. Responsive Design

### Desktop (>= 768px)
- Two-column layout: 50% / 50%
- Cards display inline

### Mobile (< 768px)
- Single column layout
- Ingredients section first
- Items section below (with separator)
- Cards stack vertically

```text
+----------------------------------+
| INGREDIENTS                      |
| [+ Add Ingredient]               |
+----------------------------------+
| ┌──────────────────────────────┐ |
| │ Tomato - 0.2 Kg              │ |
| │ [−] [0.2] [+]       🗑       │ |
| │ ☐ Remove  ☐ Extra            │ |
| └──────────────────────────────┘ |
+----------------------------------+
| ITEMS                            |
| [+ Add Item]                     |
+----------------------------------+
| ┌──────────────────────────────┐ |
| │ Margherita Pizza - 2 pcs     │ |
| │ [−] [2] [+]         🗑       │ |
| │ $12.99 × 2 = $25.98          │ |
| └──────────────────────────────┘ |
+----------------------------------+
```

---

## 11. Implementation Order

### Phase 1: Main Grid Cleanup
1. Remove drag-and-drop from MappingSummaryTable
2. Rename column headers (Sub-Items → Items)
3. Remove drag hint text

### Phase 2: New Components
1. Create ConfirmActionModal (reusable)
2. Create IngredientCard with +/- controls
3. Create ItemCard with +/- controls
4. Create DuplicateSaveWarningModal

### Phase 3: Edit Page Redesign
1. Implement two-column layout
2. Wire up add confirmation modals
3. Wire up remove confirmation modals
4. Implement duplicate detection on save

### Phase 4: i18n & Polish
1. Add new translation keys
2. Update existing terminology
3. Add tooltips to all action icons
4. Test responsive layout

---

## 12. Key UX Improvements

| Improvement | Implementation |
|-------------|----------------|
| Safety | All add/remove actions require confirmation |
| Clarity | Renamed "Sub-Items" to "Items" |
| Simplicity | Removed drag-and-drop from main grid |
| Control | +/- buttons for intuitive quantity adjustment |
| Consistency | Using terminology table across all labels |
| Validation | Duplicate warning before save |
| Feedback | Toast notifications for success/failure |
| Accessibility | Tooltips on all action icons |

