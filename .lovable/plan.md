
# Item Edit Form - Complete Redesign Plan

## Overview
Transform the current full-page `ItemsEdit.tsx` into a beautiful, compact modal-style form matching the reference design with dashed-border section cards, multi-column layouts, and enhanced fields (Category, Subcategory, Serving Time).

---

## Target Design Layout (Based on Reference Image)

```text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Edit Item                                                                    ×   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ 📷 Image Upload (320x320 aspect-square, camera overlay, live preview)       │   │
│  │     [Click or drag to upload]                                               │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮   │
│  ┊ 📝 Basic Information                                    [purple header]  ┊   │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤   │
│  ┊  Item Name *          │ Item Type           │ Base Cost (SAR)           ┊   │
│  ┊  ┌─[EN|AR|UR]───────┐ │ ┌────────────────┐ │ ┌────────────────────────┐┊   │
│  ┊  │ Margherita Pizza │ │ │ Edible      ▼  │ │ │ SAR 12.99              │┊   │
│  ┊  └──────────────────┘ │ └────────────────┘ │ └────────────────────────┘┊   │
│  ┊                                                                         ┊   │
│  ┊  Description                                                            ┊   │
│  ┊  ┌─[EN|AR|UR]─────────────────────────────────────────────────────────┐┊   │
│  ┊  │ Classic pizza with fresh tomatoes and mozzarella                   │┊   │
│  ┊  └────────────────────────────────────────────────────────────────────┘┊   │
│  ┊                                                                         ┊   │
│  ┊  ☐ Is Combo (i)        ☑ Active                                        ┊   │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯   │
│                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮   │
│  ┊ 🏷️ Classification                                       [green header] ┊   │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤   │
│  ┊  Category *                        │ Subcategory                        ┊   │
│  ┊  ┌──────────────────────────────┐  │ ┌────────────────────────────────┐┊   │
│  ┊  │ Non-Vegetarian            ▼  │  │ │ Pizza × Sea Food ×          ▼ │┊   │
│  ┊  └──────────────────────────────┘  │ └────────────────────────────────┘┊   │
│  ┊                                                                         ┊   │
│  ┊  Serving Time *                                                         ┊   │
│  ┊  ☑ Breakfast   ☑ Lunch Specials   ☑ Dinner   ☐ Snacks                   ┊   │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯   │
│                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮   │
│  ┊ ⏱️ Details                                               [blue header]  ┊   │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤   │
│  ┊  Prep Time         │ Calories      │ Highlights                         ┊   │
│  ┊  ┌──────────────┐  │ ┌──────────┐  │ ┌────────────────────────────────┐┊   │
│  ┊  │ 20       min │  │ │ 850 kcal │  │ │ Crispy, Fresh, Authentic      │┊   │
│  ┊  └──────────────┘  │ └──────────┘  │ └────────────────────────────────┘┊   │
│  ┊                                                                         ┊   │
│  ┊  Allergens                                                              ┊   │
│  ┊  [Nuts] [Dairy✓] [Gluten✓] [Eggs] [Soy] [Shellfish] [Wheat]             ┊   │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯   │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                            [Cancel]  [✓ Save Item]                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Visual Design Elements

### 1. Dashed-Border Section Cards
```tsx
// New component: DashedSectionCard
<div className="rounded-xl border-2 border-dashed border-[color]/40 overflow-hidden">
  <div className="px-4 py-2.5 bg-[color]/10 border-b border-dashed border-[color]/30">
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[color]" />
      <h3 className="text-sm font-semibold text-[color]">Section Title</h3>
    </div>
  </div>
  <div className="p-4">
    {children}
  </div>
</div>
```

### 2. Color Variants for Sections
| Section | Header Color | Border Color |
|---------|--------------|--------------|
| Basic Information | Purple (`#8B5CF6`) | `border-purple-300/40` |
| Classification | Green (`#22C55E`) | `border-green-300/40` |
| Details | Blue (`#3B82F6`) | `border-blue-300/40` |

### 3. Hero Image Upload
- Centered, 200x200px square
- `aspect-square` with rounded-xl corners
- Dashed border when empty
- Camera icon overlay button
- Live preview on file selection
- Gray placeholder background

---

## New Fields to Add

### Category (Single Select - Required)
```typescript
const CATEGORIES = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "non_vegetarian", label: "Non-Vegetarian" },
  { id: "drinks", label: "Drinks" },
  { id: "sheesha", label: "Sheesha" },
  { id: "desserts", label: "Desserts" },
];
```

### Subcategory (Multi-Select)
```typescript
const SUBCATEGORIES = [
  { id: "seafood", label: "Sea Food" },
  { id: "pancake", label: "Pan Cake" },
  { id: "pizza", label: "Pizza" },
  { id: "soft_drinks", label: "Soft Drinks" },
  { id: "tea_coffee", label: "Tea and Coffee" },
  { id: "bbq", label: "BBQ" },
  { id: "shawarma", label: "Shawarma" },
  { id: "smoking_zone", label: "Smoking Zone" },
];
```

### Serving Time (Multi-Select Checkboxes - Required)
```typescript
const SERVING_TIMES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch Specials" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
];
```

### Highlights (Text Input)
- Comma-separated tags
- Placeholder: "e.g., Crispy, Fresh, Authentic"

---

## Implementation Details

### New Component: DashedSectionCard.tsx
```tsx
interface DashedSectionCardProps {
  title: string;
  icon: LucideIcon;
  variant: "purple" | "green" | "blue" | "amber";
  children: ReactNode;
}

// Color mapping
const variants = {
  purple: {
    border: "border-purple-300/40",
    headerBg: "bg-purple-50",
    headerBorder: "border-purple-200/50",
    iconColor: "text-purple-600",
    titleColor: "text-purple-700",
  },
  green: {
    border: "border-green-300/40",
    headerBg: "bg-green-50",
    headerBorder: "border-green-200/50",
    iconColor: "text-green-600",
    titleColor: "text-green-700",
  },
  // ... blue, amber
};
```

### New Component: ImageUploadHero.tsx
```tsx
// 200x200 centered image upload with:
// - Dashed border placeholder
// - Camera icon overlay
// - File input with accept="image/*"
// - Live preview using URL.createObjectURL
// - Clear button on hover when image present
```

### New Component: MultiSelectBadges.tsx
```tsx
// Chip-style multi-select matching reference image
// - Shows selected items as removable badges
// - Dropdown for adding more
// - Uses Popover + Command pattern
```

### Updated Form State
```typescript
const [formData, setFormData] = useState({
  // Existing fields
  name_en: "",
  name_ar: "",
  name_ur: "",
  description_en: "",
  description_ar: "",
  description_ur: "",
  item_type: "edible",
  base_cost: 0,
  is_combo: false,
  image_url: null,
  is_active: true,
  preparation_time_minutes: 15,
  allergens: [],
  calories: null,
  
  // New fields
  category: "",                    // Single select - required
  subcategories: [] as string[],   // Multi-select
  serving_times: [] as string[],   // Multi-select checkboxes - required
  highlights: "",                  // Comma-separated text
});
```

---

## Save Confirmation Modal Design

```text
┌─────────────────────────────────────────────────────────────┐
│                                                         ×   │
│                                                             │
│           🍕                                                │
│     Looks Delicious!                                        │
│                                                             │
│     Ready to save this item?                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📷 [Image]  Margherita Pizza                        │   │
│  │             Non-Vegetarian · Pizza                  │   │
│  │             SAR 12.99 · 850 kcal · 20 min          │   │
│  │             Breakfast, Lunch, Dinner               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                 [No, Go Back]   [Yes, Save! ✓]              │
└─────────────────────────────────────────────────────────────┘
```

### Friendly confirmation component
```tsx
interface ItemSaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  item: {
    name: string;
    image_url?: string | null;
    category: string;
    subcategories: string[];
    base_cost: number;
    calories?: number | null;
    prep_time: number;
    serving_times: string[];
  };
  isLoading?: boolean;
}
```

---

## Layout Grid Strategy

### Desktop (3-4 columns)
- Use `grid grid-cols-2 lg:grid-cols-3 gap-4` for form rows
- Name spans 1 col, Type 1 col, Cost 1 col
- Description spans full width
- Category 1 col, Subcategory 1 col
- Prep/Calories/Highlights: 3 columns

### Mobile Responsive
- Single column on mobile
- Sections stack vertically
- Image upload stays centered but smaller (160px)

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/components/shared/DashedSectionCard.tsx` | Dashed-border section wrapper |
| CREATE | `src/components/shared/ImageUploadHero.tsx` | Hero image upload component |
| CREATE | `src/components/shared/MultiSelectBadges.tsx` | Chip-style multi-select |
| CREATE | `src/components/items/ItemSaveConfirmModal.tsx` | Friendly save confirmation |
| MODIFY | `src/pages/ItemsEdit.tsx` | Complete redesign with new layout |
| MODIFY | `src/pages/ItemsAdd.tsx` | Apply same design for consistency |
| MODIFY | `src/lib/i18n/translations.ts` | Add new translation keys |

---

## Translation Keys to Add

```typescript
items: {
  // ... existing
  category: "Category",
  subcategory: "Subcategory",
  servingTime: "Serving Time",
  highlights: "Highlights",
  highlightsPlaceholder: "e.g., Crispy, Fresh, Authentic",
  selectCategory: "Select category",
  selectSubcategories: "Select subcategories",
  comboTooltip: "Combo = bundle of 2+ items at special price. Category & subcategory become non-editable after save.",
  
  // Categories
  vegetarian: "Vegetarian",
  nonVegetarian: "Non-Vegetarian",
  drinks: "Drinks",
  sheesha: "Sheesha",
  desserts: "Desserts",
  
  // Subcategories
  seaFood: "Sea Food",
  panCake: "Pan Cake",
  pizza: "Pizza",
  softDrinks: "Soft Drinks",
  teaCoffee: "Tea and Coffee",
  bbq: "BBQ",
  shawarma: "Shawarma",
  smokingZone: "Smoking Zone",
  
  // Confirmation modal
  looksDelicious: "Looks Delicious!",
  readyToSave: "Ready to save this item?",
  noGoBack: "No, Go Back",
  yesSave: "Yes, Save!",
},
```

---

## Visual Specifications

| Element | Value |
|---------|-------|
| Card border | `border-2 border-dashed` |
| Card radius | `rounded-xl` (12px) |
| Header padding | `px-4 py-2.5` |
| Content padding | `p-4` |
| Input height | `h-10` (40px) |
| Label size | `text-sm font-medium` |
| Grid gap | `gap-4` (16px) |
| Section gap | `gap-5` (20px) |
| Image size | 200×200px |
| Required marker | `text-red-500 *` |
| Footer | sticky, bg-white, shadow-sm |

---

## Tooltip Additions

| Field | Tooltip Text |
|-------|--------------|
| Is Combo | "Combo = bundle of 2+ items at special price. Category & subcategory become non-editable after save." |
| Prep Time | "Estimated time in minutes to prepare this item." |
| Calories | "Optional calorie information for health-conscious customers." |
| Allergens | "Tag allergens to inform customers about potential allergic reactions." |
| Highlights | "Comma-separated keywords that describe this item's special qualities." |

---

## Technical Considerations

### Form Validation
- Required: Name (EN), Category, Serving Time (at least one)
- Show red asterisk on required labels
- Validate before showing confirmation modal
- Toast error for missing required fields

### Combo Logic
When `is_combo` is checked:
- Show tooltip explaining combo behavior
- Category and Subcategory become read-only after first save (for editing)
- Visual indicator (lock icon or disabled styling)

### Image Upload (UI Only for now)
- Accept `image/*` files
- Show live preview using `URL.createObjectURL`
- Note: Actual file storage to be implemented later
- Placeholder text: "Image upload coming soon"

---

## Summary

This redesign transforms the current vertical scrolling form into a compact, visually appealing modal-style layout with:
1. Hero image upload section at top
2. Three dashed-border section cards (Basic Info, Classification, Details)
3. Multi-column responsive grid layout
4. New mandatory fields (Category, Subcategory, Serving Time)
5. Friendly "Looks Delicious!" confirmation modal
6. Consistent with project's high-density, flat design system
