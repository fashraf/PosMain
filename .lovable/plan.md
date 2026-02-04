

# Item Master Add/Edit - Major UI Overhaul Plan

## Overview
This plan addresses ALL mandatory fixes for `/items/add` and `/items/:id/edit` pages, focusing on:
1. Page width expansion to 75% (max-width constraint)
2. Dynamic header titles with tight margins
3. Dashed border cards with completion tick icons
4. Footer save button contained within page (not global)
5. Image upload fix (50% smaller + file persistence)
6. Mandatory validation with scroll-to-first-error
7. Enhanced Ingredients/Items grids with premium styling
8. Loading overlay for save operations
9. Quick navigation bar (existing, will refine)
10. Multilingual indicators (12px, green/red)
11. Confirmation modal with summary
12. Summary card showing key values

---

## Current State Analysis

The existing Item Add/Edit pages already have:
- Section navigation bar with completion indicators
- Dashed section cards with colored headers
- Image upload (140px, blob URL only - not persisted)
- Ingredients/Items mapping tables with modal-based add
- Footer with sticky save/cancel buttons

**Issues to Fix:**
1. Image upload uses blob URLs (temporary, lost on page refresh)
2. Footer bleeds into sidebar area due to `ps-[16rem]` positioning
3. No page width constraint (uses full container)
4. No loading overlay during save
5. Validation shows toast only, doesn't scroll to field
6. Ingredients grid uses basic styling (needs premium enhancement)
7. No live summary card for quick review

---

## File Changes Required

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/components/shared/LoadingOverlay.tsx` | Full-screen spinner overlay |
| CREATE | `src/components/shared/ItemSummaryCard.tsx` | Compact summary showing key filled values |
| MODIFY | `src/components/shared/ImageUploadHero.tsx` | Store File object for future upload |
| MODIFY | `src/components/item-mapping/IngredientTable.tsx` | Premium styling + beautiful Add button |
| MODIFY | `src/components/item-mapping/ItemTable.tsx` | Premium styling + beautiful Add button |
| MODIFY | `src/pages/ItemsAdd.tsx` | Width constraint, loading overlay, validation scroll, summary card |
| MODIFY | `src/pages/ItemsEdit.tsx` | Same changes + dynamic header title |
| MODIFY | `src/components/items/ItemSaveConfirmModal.tsx` | Add ingredient/item counts to summary |
| MODIFY | `src/index.css` | Enhanced density-table styles with animations |

---

## Detailed Changes

### 1. Page Width Constraint (75% max)

Wrap content in a constrained container:

```tsx
// ItemsAdd.tsx / ItemsEdit.tsx
<div className="mx-auto" style={{ maxWidth: '75vw' }}>
  {/* All page content */}
</div>
```

### 2. Dynamic Header Title

Edit page shows item name:
```tsx
// ItemsEdit.tsx
<h1 className="text-xl font-semibold text-foreground">
  Item Master - Edit {formData.name_en || "Item"}
</h1>
```

Add page:
```tsx
// ItemsAdd.tsx
<h1 className="text-xl font-semibold text-foreground">
  Item Master - Add
</h1>
```

### 3. Compact Margins (tight layout)

Reduce spacing throughout:
- Section gaps: `gap-4` instead of `gap-5`
- Card padding: `p-3` instead of `p-4`
- Header padding: `py-1.5` instead of `py-2.5`

### 4. Footer Fix (Contained within page area)

Remove sidebar offset, use page-relative positioning:

```tsx
// Before (bleeds into sidebar)
<div className="fixed bottom-0 inset-x-0 ps-[16rem] pe-4 ...">

// After (contained within main content)
<div className="fixed bottom-0 left-[var(--sidebar-width)] right-0 bg-background border-t p-3 z-10">
  <div className="max-w-[75vw] mx-auto flex justify-end gap-2">
    <Button variant="outline" ...>Cancel</Button>
    <Button ...>Save</Button>
  </div>
</div>
```

### 5. Image Upload Fix

The current `ImageUploadHero` creates blob URLs which are lost on refresh. Since we're deferring auth/storage setup, we'll:
1. Store the File object in state alongside the preview URL
2. Pass the File to the save handler for future upload
3. Add clear TODO comment about backend integration

```tsx
// ImageUploadHero.tsx - add onFileChange callback
interface ImageUploadHeroProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onFileChange?: (file: File | null) => void; // NEW
  size?: number;
  ...
}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange(url);
    onFileChange?.(file); // Pass file for later upload
  }
};
```

### 6. Loading Overlay Component

New component for blocking UI during save:

```tsx
// src/components/shared/LoadingOverlay.tsx
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = "Saving..." }: LoadingOverlayProps) {
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
```

### 7. Validation with Scroll-to-Field

Enhanced validation that scrolls to and focuses the first invalid field:

```tsx
// ItemsAdd.tsx - handleSave function
const handleSave = () => {
  // Validation checks
  const errors: { field: string; ref: RefObject<HTMLElement>; message: string }[] = [];
  
  if (!formData.name_en) {
    errors.push({ field: 'name_en', ref: nameInputRef, message: 'Please fill Item Name' });
  }
  if (!formData.category) {
    errors.push({ field: 'category', ref: categoryRef, message: 'Please select a Category' });
  }
  if (formData.serving_times.length === 0) {
    errors.push({ field: 'serving_times', ref: servingTimeRef, message: 'Please select at least one Serving Time' });
  }
  
  if (errors.length > 0) {
    const firstError = errors[0];
    
    // Scroll to the field
    firstError.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus the field
    setTimeout(() => {
      const input = firstError.ref.current?.querySelector('input, select, button');
      (input as HTMLElement)?.focus();
    }, 400);
    
    // Show toast
    toast({
      title: "Validation Error",
      description: firstError.message,
      variant: "destructive"
    });
    return;
  }
  
  setShowConfirmModal(true);
};
```

### 8. Enhanced Ingredients/Items Tables

Premium styling with animations and beautiful add buttons:

```tsx
// IngredientTable.tsx - Updated
<div className="border-2 border-dashed border-green-300/50 rounded-lg overflow-hidden shadow-sm">
  {/* Header with premium button */}
  <div className="flex items-center justify-between h-10 px-3 bg-green-50 border-b border-green-200/50">
    <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">
      Ingredients
    </span>
    <Button
      type="button"
      onClick={onAdd}
      size="sm"
      className="h-7 px-3 rounded-full bg-primary hover:bg-primary/90 text-xs"
    >
      <PlusCircle className="h-3.5 w-3.5 me-1" />
      Add Ingredient
    </Button>
  </div>

  {/* Table with enhanced styling */}
  <table className="w-full">
    <thead>
      <tr className="bg-muted/50">
        <th className="h-9 px-3 text-left text-xs font-medium text-muted-foreground uppercase">
          Ingredient
        </th>
        <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase">
          Qty
        </th>
        <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase">
          Cost
        </th>
        <th className="h-9 w-10"></th>
      </tr>
    </thead>
    <tbody>
      {mappings.map((mapping, index) => (
        <tr 
          key={mapping.id}
          className={cn(
            "h-10 border-b border-border/50 transition-all duration-200",
            "animate-in fade-in slide-in-from-top-2",
            index % 2 === 0 ? "bg-white" : "bg-muted/30",
            "hover:bg-primary/5 hover:shadow-sm"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* ... row content ... */}
        </tr>
      ))}
    </tbody>
    <tfoot className="bg-muted/30 border-t-2 border-primary/20">
      <tr>
        <td colSpan={2} className="h-10 px-3 text-right text-xs font-semibold uppercase">
          Ingredients Total
        </td>
        <td className="h-10 px-3 text-right font-bold text-primary">
          SAR {totalCost.toFixed(2)}
        </td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</div>
```

### 9. Summary Card Component

Compact card showing key filled values for quick review:

```tsx
// src/components/shared/ItemSummaryCard.tsx
interface ItemSummaryCardProps {
  name: string;
  category: string;
  baseCost: number;
  ingredientCount: number;
  itemCount: number;
  isCombo: boolean;
}

export function ItemSummaryCard(props: ItemSummaryCardProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-3 bg-muted/20">
      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
        Quick Summary
      </h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium ms-1">{props.name || "—"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Category:</span>
          <span className="font-medium ms-1">{props.category || "—"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Price:</span>
          <span className="font-medium ms-1">SAR {props.baseCost.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Ingredients:</span>
          <span className="font-medium ms-1">{props.ingredientCount}</span>
        </div>
        {props.isCombo && (
          <div>
            <span className="text-muted-foreground">Items:</span>
            <span className="font-medium ms-1">{props.itemCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 10. CSS Enhancements

Add animation classes to index.css:

```css
/* Row animations */
.density-table tbody tr {
  animation: fadeInRow 0.2s ease-out;
}

@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced hover */
.density-table tbody tr:hover td {
  background: hsl(var(--primary) / 0.05);
  box-shadow: 0 1px 3px hsl(var(--muted-foreground) / 0.1);
}
```

---

## Visual Layout Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ ← Item Master - Edit [Margherita Pizza]                                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ [📋 Basics ✓] [🏷️ Class ✓] [⏰ Details ○] [📦 Inv ○] [🥕 Ingred ✓] [🍕 Items ○]      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                           ╭───────────────────────╮                                 │
│  ╭──────────────────────╮ │   QUICK SUMMARY       │                                 │
│  │ 📷 [100px]          │ │   Name: Margherita    │                                 │
│  │ Image Upload        │ │   Category: Pizza     │                                 │
│  │ (smaller 50%)       │ │   Price: SAR 12.99    │                                 │
│  ╰──────────────────────╯ │   Ingredients: 4      │                                 │
│                           ╰───────────────────────╯                                 │
│  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐   │
│  ┊ 🥕 INGREDIENTS                                        [+ Add Ingredient]  ┊   │
│  ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤   │
│  ┊ Ingredient          │    Qty      │   Cost    │  ×  ┊                           │
│  ├─────────────────────┼─────────────┼───────────┼─────┤                           │
│  ┊ Tomato              │  [−] 0.2 [+]│  SAR 1.00 │  🗑 ┊   ← zebra stripe          │
│  ┊ Cheese              │  [−] 0.15[+]│  SAR 1.80 │  🗑 ┊   ← hover glow            │
│  ┊ Olive Oil           │  [−] 0.05[+]│  SAR 0.25 │  🗑 ┊                           │
│  ├─────────────────────┴─────────────┴───────────┴─────┤                           │
│  ┊                    INGREDIENTS TOTAL:  SAR 3.05    ┊                           │
│  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘   │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                    [× Cancel]   [✓ Save Item]      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Order

1. **Create `LoadingOverlay.tsx`** - New overlay component
2. **Create `ItemSummaryCard.tsx`** - Summary card component
3. **Modify `ImageUploadHero.tsx`** - Add onFileChange callback
4. **Modify `IngredientTable.tsx`** - Premium styling + Add button
5. **Modify `ItemTable.tsx`** - Premium styling + Add button
6. **Modify `index.css`** - Animation keyframes
7. **Modify `ItemsAdd.tsx`**:
   - Add max-width constraint
   - Update header title
   - Add loading overlay state
   - Add validation with scroll-to-field
   - Add summary card
   - Fix footer positioning
8. **Modify `ItemsEdit.tsx`** - Same changes + dynamic title
9. **Modify `ItemSaveConfirmModal.tsx`** - Include mapping counts

---

## Image Persistence Note

The image upload currently creates temporary blob URLs. To properly persist images:

1. **When ready for backend**: Set up a storage bucket in your backend
2. **Upload flow**: On form submit, upload the File object to storage
3. **Save URL**: Store the returned permanent URL in the items table

For now, the form will capture the File object and pass it to the save handler, with a TODO comment indicating where to add the actual upload logic.

---

## Validation Rules

| Field | Required | Validation |
|-------|----------|------------|
| Item Name (EN) | Yes | Non-empty string |
| Category | Yes | Must be selected |
| Serving Time | Yes | At least 1 selected |
| Base Cost | Yes | Number >= 0 |
| Item Type | Yes | Default "edible" |

---

## Summary Card Placement

Position in the left column, below the image upload:

```text
Left Column (4/12):
├── Basic Info Card
│   └── Image Upload (100px)
│   └── Name (multi-lang)
│   └── Description (multi-lang)
├── Summary Card ← NEW
├── Inventory Card
```

---

## Confirmation Modal Enhancement

Update to show ingredient/item counts:

```tsx
// ItemSaveConfirmModal.tsx
interface ItemSaveConfirmModalProps {
  item: {
    name: string;
    image_url?: string | null;
    category: string;
    base_cost: number;
    ingredientCount: number;  // NEW
    itemCount: number;        // NEW
    isCombo: boolean;         // NEW
    // ...
  };
}

// In modal content:
<p className="text-xs text-muted-foreground">
  {item.ingredientCount} ingredients
  {item.isCombo && ` · ${item.itemCount} items`}
</p>
```

