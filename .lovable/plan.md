

# Item Save Confirmation Modal - Full Implementation Plan

## Overview
Implement the premium "review before save" confirmation modal with **form-control styling** for all read-only fields, making it look like a proper form review rather than a summary card.

---

## Design Specifications

### Modal Structure
- **Width**: `75vw` (max-width)
- **Max Height**: `85vh` with internal scroll
- **Header**: Compact with emoji + title
- **Body**: Scrollable content area
- **Footer**: Fixed with Cancel/Save buttons

### Form-Control Styling for Read-Only Fields
All values will be displayed in **input-like containers** with:
- Border: `border border-input`
- Background: `bg-muted/30` (subtle gray to indicate read-only)
- Padding: `px-3 py-2`
- Rounded: `rounded-md`
- Height: `h-10` for single-line fields

---

## Layout Structure

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  🍕 Ready to Save This Item?                                                           [×] │
│  Review all details before saving                                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  ╭─────────────────────────────────────────────────────────────────────────────────────────╮│
│  │  ┌──────┐   ITEM NAME                                    [Active] [Combo]              ││
│  │  │  📷  │   ┌──────────────────────────────────────────────────────────────┐           ││
│  │  │ 72px │   │ Margherita Pizza                                             │           ││
│  │  └──────┘   └──────────────────────────────────────────────────────────────┘           ││
│  │             [EN ✓] [AR ✓] [UR ○]                                                       ││
│  ╰─────────────────────────────────────────────────────────────────────────────────────────╯│
│                                                                                             │
│  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐ │
│  ┊ 📋 BASICS                                                                              ┊ │
│  ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤ │
│  ┊  ITEM TYPE                    BASE COST (SAR)                                          ┊ │
│  ┊  ┌────────────────────┐       ┌────────────────────┐                                   ┊ │
│  ┊  │ Edible             │       │ SAR 12.99          │                                   ┊ │
│  ┊  └────────────────────┘       └────────────────────┘                                   ┊ │
│  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘ │
│                                                                                             │
│  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐ │
│  ┊ 🏷️ CLASSIFICATION                                                                      ┊ │
│  ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤ │
│  ┊  CATEGORY                     SUBCATEGORIES                                            ┊ │
│  ┊  ┌────────────────────┐       ┌────────────────────────────────────┐                   ┊ │
│  ┊  │ Vegetarian         │       │ [Pizza] [Italian]                  │                   ┊ │
│  ┊  └────────────────────┘       └────────────────────────────────────┘                   ┊ │
│  ┊                                                                                        ┊ │
│  ┊  SERVING TIMES                                                                         ┊ │
│  ┊  ┌─────────────────────────────────────────────────────────────────┐                   ┊ │
│  ┊  │ [Breakfast] [Lunch] [Dinner]                                    │                   ┊ │
│  ┊  └─────────────────────────────────────────────────────────────────┘                   ┊ │
│  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘ │
│                                                                                             │
│  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐ │
│  ┊ ⏰ DETAILS                                                                             ┊ │
│  ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤ │
│  ┊  PREP TIME               CALORIES              HIGHLIGHTS                              ┊ │
│  ┊  ┌──────────────┐        ┌──────────────┐      ┌─────────────────────────────┐         ┊ │
│  ┊  │ 15 min       │        │ 450 kcal     │      │ Fresh, Organic, Homemade    │         ┊ │
│  ┊  └──────────────┘        └──────────────┘      └─────────────────────────────┘         ┊ │
│  ┊                                                                                        ┊ │
│  ┊  ALLERGENS                                                                             ┊ │
│  ┊  ┌─────────────────────────────────────────────────────────────────┐                   ┊ │
│  ┊  │ [🌾 Gluten] [🥛 Dairy]                                          │                   ┊ │
│  ┊  └─────────────────────────────────────────────────────────────────┘                   ┊ │
│  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘ │
│                                                                                             │
│  ═══════════════════════════════════════════════════════════════════════════════════════   │
│                                    RECIPE MAPPINGS                                          │
│  ═══════════════════════════════════════════════════════════════════════════════════════   │
│                                                                                             │
│  ╭─────────────────────────────────────────╮ ╭─────────────────────────────────────────╮   │
│  │ 🥕 INGREDIENTS                     (4)  │ │ 🍕 COMBO ITEMS                     (2)  │   │
│  ├─────────────────────────────────────────┤ ├─────────────────────────────────────────┤   │
│  │ Ingredient      │ Qty   │ Cost          │ │ Item            │ Qty  │ Price         │   │
│  ├─────────────────┼───────┼───────────────┤ ├─────────────────┼──────┼───────────────┤   │
│  │ Tomato          │ 0.20  │ SAR 1.00      │ │ Soft Drink      │ 1    │ SAR 5.00      │   │
│  │ Mozzarella      │ 0.15  │ SAR 1.80      │ │  → Cola ★       │      │ +0.00         │   │
│  │ Olive Oil       │ 0.05  │ SAR 0.25      │ │  → Sprite       │      │ +1.00         │   │
│  │ Basil           │ 0.02  │ SAR 0.10      │ │ Fries           │ 1    │ SAR 3.00      │   │
│  ├─────────────────┴───────┴───────────────┤ ├─────────────────┴──────┴───────────────┤   │
│  │           TOTAL:         SAR 3.15       │ │           TOTAL:        SAR 8.00       │   │
│  ╰─────────────────────────────────────────╯ ╰─────────────────────────────────────────╯   │
│                                                                                             │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                              [× No, Go Back]   [✓ Yes, Save Item]          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/items/ItemSaveConfirmModal.tsx` | Complete rewrite with form-control styling |
| `src/pages/ItemsAdd.tsx` | Pass comprehensive data to modal |
| `src/pages/ItemsEdit.tsx` | Pass comprehensive data to modal |

---

## Component: ReadOnlyFormField

A helper component for displaying read-only values with form-control styling:

```tsx
function ReadOnlyFormField({ 
  label, 
  value, 
  className 
}: { 
  label: string; 
  value: string | React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}
```

---

## Component: ReadOnlyChipsField

For displaying multiple values as chips inside a form-control container:

```tsx
function ReadOnlyChipsField({ 
  label, 
  chips 
}: { 
  label: string; 
  chips: string[]; 
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-muted/30 px-3 py-2">
        {chips.length > 0 ? (
          chips.map((chip) => (
            <span 
              key={chip} 
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {chip}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}
```

---

## Props Interface (Expanded)

```typescript
interface ItemSaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  item: {
    // Identity
    name_en: string;
    name_ar?: string;
    name_ur?: string;
    description_en?: string;
    image_url?: string | null;

    // Classification
    item_type: string;
    category: string;
    subcategories: string[];
    serving_times: string[];
    
    // Status
    is_active: boolean;
    is_combo: boolean;
    base_cost: number;

    // Details
    prep_time: number;
    calories?: number | null;
    highlights?: string;
    allergens?: string[];

    // Inventory
    current_stock?: number;
    low_stock_threshold?: number;

    // Mappings
    ingredientCount?: number;
    itemCount?: number;
    ingredientMappings?: IngredientMappingItem[];
    itemMappings?: SubItemMappingItem[];
    ingredientTotalCost?: number;
    itemTotalCost?: number;
  };
  isLoading?: boolean;
  isEdit?: boolean;
}
```

---

## Section Cards Design

Each section uses dashed-card styling:

```tsx
<div className="rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden">
  {/* Header */}
  <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-dashed border-muted-foreground/20">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      Section Name
    </span>
  </div>
  {/* Content */}
  <div className="p-4 grid grid-cols-2 gap-3">
    <ReadOnlyFormField label="Field" value="Value" />
  </div>
</div>
```

---

## Mapping Tables Design

Compact read-only tables with:
- Sticky header row
- Zebra striping
- Total row with primary color
- Border styling matching form-controls

```tsx
<div className="rounded-lg border border-input overflow-hidden">
  {/* Header */}
  <div className="flex items-center justify-between px-3 py-2 bg-green-50 border-b">
    <span className="text-xs font-semibold text-green-700 uppercase">
      🥕 Ingredients
    </span>
    <span className="text-xs text-muted-foreground">(4)</span>
  </div>
  
  {/* Table */}
  <table className="w-full text-sm">
    <thead className="bg-muted/50">
      <tr>
        <th className="h-8 px-3 text-left text-[11px] font-medium uppercase">Name</th>
        <th className="h-8 px-3 text-center text-[11px] font-medium uppercase">Qty</th>
        <th className="h-8 px-3 text-right text-[11px] font-medium uppercase">Cost</th>
      </tr>
    </thead>
    <tbody>
      {/* Rows with zebra striping */}
    </tbody>
    <tfoot className="bg-primary/5 border-t-2 border-primary/20">
      <tr>
        <td colSpan={2} className="h-9 px-3 text-right text-xs font-semibold uppercase">
          Total
        </td>
        <td className="h-9 px-3 text-right font-bold text-primary">
          SAR 3.15
        </td>
      </tr>
    </tfoot>
  </table>
</div>
```

---

## Implementation Order

1. **Rewrite `ItemSaveConfirmModal.tsx`**
   - Create ReadOnlyFormField helper
   - Create ReadOnlyChipsField helper
   - Build modal structure with all sections
   - Add mapping tables
   - Style footer buttons

2. **Update `ItemsAdd.tsx`**
   - Build comprehensive `confirmModalItem` object
   - Include all form data + mappings

3. **Update `ItemsEdit.tsx`**
   - Same as Add page with `isEdit={true}`

---

## Visual Specifications

| Element | Specification |
|---------|---------------|
| Modal width | `max-w-[75vw]` |
| Modal max-height | `max-h-[85vh]` |
| Form field height | `h-10` |
| Form field border | `border border-input` |
| Form field bg | `bg-muted/30` |
| Label size | `text-[11px] uppercase` |
| Section header bg | `bg-muted/30` |
| Chip style | `bg-primary/10 text-primary rounded-full px-2 py-0.5` |
| Table row height | `h-9` |
| Total row | `bg-primary/5 border-t-2 border-primary/20` |

---

## Multilingual Indicators

Display language status chips below the name:

```tsx
<div className="flex items-center gap-1.5 mt-1">
  {[
    { code: "EN", hasContent: !!name_en },
    { code: "AR", hasContent: !!name_ar },
    { code: "UR", hasContent: !!name_ur },
  ].map((lang) => (
    <span
      key={lang.code}
      className={cn(
        "px-1.5 py-0.5 text-[10px] font-medium rounded",
        lang.hasContent 
          ? "bg-green-100 text-green-700" 
          : "bg-red-100 text-red-500"
      )}
    >
      {lang.code} {lang.hasContent ? "✓" : "○"}
    </span>
  ))}
</div>
```

---

## Status Badges

Top-right of hero section:

```tsx
<div className="flex items-center gap-2">
  <span className={cn(
    "px-2 py-0.5 text-xs font-medium rounded-full",
    is_active 
      ? "bg-green-100 text-green-700" 
      : "bg-gray-100 text-gray-600"
  )}>
    {is_active ? "Active" : "Inactive"}
  </span>
  {is_combo && (
    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
      Combo
    </span>
  )}
</div>
```

