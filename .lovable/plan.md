
# Item Add/Edit Page Enhancement - Complete Plan

## Overview
Enhance the Item Add/Edit pages (`/items/add` and `/items/:id/edit`) with:
1. Smaller image upload (50% reduction: 280px -> 140px)
2. Fix uploaded item not saving (investigate blob URL issue)
3. Add 2 new mapping cards (Ingredients + Items) - same as Item-Ingredient Mapping page
4. Quick navigation bar with section anchors
5. Section completion indicators (tick icons for mandatory fields)

---

## Target Layout Design

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Add Item / Edit Item                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │  [📋 Basics ✓] [🏷️ Classification ✓] [⏰ Details ○] [📦 Inventory ○] [🥕 Ingredients ○] [🍕 Items ○]││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                         │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 📋 Basic Info                     [✓] ┊  ┊ 📋 Basic Info                                        ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  ┌─────────┐                         ┊  ┊  Item Type    │  Base Cost (SAR)                      ┊  │
│  ┊  │  📷     │  Name [EN🟢|AR🔴|UR🔴]  ┊  ┊  ┌──────────┐ │  ┌────────────┐                       ┊  │
│  ┊  │ 140×140 │  ┌──────────────────┐   ┊  ┊  │ Edible ▼ │ │  │ SAR 12.99  │                       ┊  │
│  ┊  │         │  │ Margherita Pizza │   ┊  ┊  └──────────┘ │  └────────────┘                       ┊  │
│  ┊  └─────────┘  └──────────────────┘   ┊  ┊                                                       ┊  │
│  ┊               Description            ┊  ┊  [Switch: Is Combo] [Switch: Active/Inactive]         ┊  │
│  ┊               ┌──────────────────┐   ┊  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│  ┊               │ Classic pizza... │   ┊                                                            │
│  ┊               └──────────────────┘   ┊  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  ┊ 🏷️ Classification                              [✓] ┊  │
│                                            ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  ┊  Category *     │  Subcategory                        ┊  │
│  ┊ 📦 Inventory                      [○] ┊  ┊  ┌───────────┐ │  ┌───────────────────────────────┐   ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  ┊  │ Veg     ▼ │ │  │ [Pizza ×] [BBQ ×]            │   ┊  │
│  ┊  Stock Progress Bar + Inputs         ┊  ┊  └───────────┘ │  └───────────────────────────────┘   ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  ┊                                                       ┊  │
│                                            ┊  Serving Time *: [☑ Breakfast] [☑ Lunch] [☐ Dinner]   ┊  │
│                                            ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                         │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ ⏰ Details                                                                                    [○] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Prep Time (min) │ Calories (kcal) │ Highlights │ Allergens                                      ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                         │
│  ════════════════════════════════════════════════════════════════════════════════════════════════════   │
│  NEW: INGREDIENT & ITEM MAPPING CARDS (50/50 split like /item-ingredient-mapping/1/edit)                │
│  ════════════════════════════════════════════════════════════════════════════════════════════════════   │
│                                                                                                         │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 🥕 Ingredients                           [+] ┊ ┊ 🍕 Items (for Combo)                       [+] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤ ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊ Name         │ Qty    │ Cost                 ┊ ┊ Name        │ Repl │ Qty   │ Combo │ Cost     ┊  │
│  ├──────────────┼────────┼──────────────────────┤ ├─────────────┼──────┼───────┼───────┼──────────┤  │
│  ┊ Tomato       │ [−1+]  │ SAR 1.00             ┊ ┊ Soft Drink  │ [3]  │ [−6+] │ 0     │ SAR 15.00┊  │
│  ┊ Cheese       │ [−1+]  │ SAR 1.80             ┊ ┊ → Cola ★    │      │       │ +0    │          ┊  │
│  ┊ Olive Oil    │ [−1+]  │ SAR 0.25             ┊ ┊ → Sprite    │      │       │ +1.00 │          ┊  │
│  ├──────────────┴────────┴──────────────────────┤ ├─────────────┴──────┴───────┴───────┴──────────┤  │
│  ┊ INGREDIENTS TOTAL           SAR 3.05        ┊ ┊ ITEMS TOTAL                     SAR 61.92     ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│  (Items section only visible when is_combo = true)                                                      │
│                                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                        [× Cancel]   [✓ Save Item / Update Item]        │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Changes Summary

| Feature | Current | New |
|---------|---------|-----|
| Image Size | 280×280px | **140×140px** (50% smaller) |
| Image Saving | Blob URL only (not persisted) | **Note: Requires storage bucket** - will add TODO comment |
| Ingredient Mapping | Separate page (`/item-ingredient-mapping`) | **Integrated in Item form** |
| Items Mapping (Combo) | Separate page | **Integrated in Item form** |
| Navigation | None | **Sticky horizontal nav with section anchors** |
| Section Completion | Not shown | **Tick icons on headers (✓ complete / ○ incomplete)** |

---

## New Components to Create

### 1. `SectionNavigationBar.tsx`
Sticky horizontal navigation bar with:
- Section chips/pills with icons
- Completion indicators (✓ for complete, ○ for incomplete)
- Click to scroll to section (smooth scroll)
- Visual highlight for active/visible section

```tsx
interface SectionNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isComplete: boolean;
  ref: RefObject<HTMLDivElement>;
}

interface SectionNavigationBarProps {
  sections: SectionNavItem[];
  activeSection?: string;
}
```

### 2. Update `DashedSectionCard.tsx`
Add `id` prop for anchor navigation and completion indicator in header:

```tsx
interface DashedSectionCardProps {
  // ...existing props
  id?: string;             // For scroll anchor
  isComplete?: boolean;    // Show ✓ or ○ in header
}
```

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/components/shared/SectionNavigationBar.tsx` | Sticky section nav with completion indicators |
| MODIFY | `src/components/shared/DashedSectionCard.tsx` | Add id prop and completion indicator |
| MODIFY | `src/components/shared/ImageUploadHero.tsx` | Default size reduction (280 -> 140) |
| REWRITE | `src/pages/ItemsAdd.tsx` | Add nav, ingredient/item mapping cards, completion logic |
| REWRITE | `src/pages/ItemsEdit.tsx` | Same changes as Add page |
| MODIFY | `src/lib/i18n/translations.ts` | Add new translation keys |

---

## Section Completion Logic

| Section | Mandatory Fields | Complete When |
|---------|-----------------|---------------|
| Basic Info | `name_en` | Name is filled |
| Classification | `category`, `serving_times` | Category selected AND at least 1 serving time |
| Details | None mandatory | Always shows ○ (optional section) |
| Inventory | None mandatory | Always shows ○ (optional section) |
| Ingredients | None mandatory | Shows ✓ when at least 1 ingredient mapped |
| Items (Combo) | None mandatory | Shows ✓ when at least 1 item mapped (only for combos) |

---

## Navigation Bar Design

```tsx
// Compact horizontal bar, sticky below header
<div className="sticky top-0 z-20 bg-background border-b">
  <div className="flex items-center gap-2 p-2 overflow-x-auto">
    {sections.map(section => (
      <button
        key={section.id}
        onClick={() => scrollToSection(section.id)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
          "border transition-colors whitespace-nowrap",
          activeSection === section.id 
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-muted/50 border-border hover:bg-muted"
        )}
      >
        <section.icon className="h-4 w-4" />
        <span>{section.label}</span>
        {section.isComplete ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
    ))}
  </div>
</div>
```

---

## Ingredient/Item Mapping Integration

### State Structure
```tsx
// Add to formData state
const [ingredientMappings, setIngredientMappings] = useState<IngredientMappingItem[]>([]);
const [subItemMappings, setSubItemMappings] = useState<SubItemMappingItem[]>([]);

// Modal states
const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
const [showAddItemModal, setShowAddItemModal] = useState(false);
const [removeConfirm, setRemoveConfirm] = useState<{...} | null>(null);
```

### Mapping Section Layout
- Full width section below Details
- 50/50 split grid: Ingredients (left) | Items (right)
- Reuse existing `IngredientTable` and `ItemTable` components
- Reuse existing `AddIngredientModal` and `AddItemModal` components
- Items section only visible when `is_combo = true`

---

## Image Upload Fix

The current `ImageUploadHero` creates a blob URL which is temporary and not persisted. To properly save images:

1. **Short-term (this implementation)**: Keep blob URL for preview, add clear TODO comment about storage requirement
2. **Future**: Integrate with Lovable Cloud Storage to upload and store images

```tsx
// ImageUploadHero.tsx - reduce default size
size = 140 // Changed from 200

// Add comment about persistence
<p className="text-[11px] text-muted-foreground mt-2 text-center">
  {/* TODO: Connect to storage bucket for persistence */}
  Image preview only (requires storage setup)
</p>
```

---

## Translation Keys to Add

```typescript
items: {
  // Navigation
  sectionNavigation: "Section Navigation",
  jumpToSection: "Jump to section",
  
  // Completion
  sectionComplete: "Section complete",
  sectionIncomplete: "Section incomplete",
  
  // Mapping sections
  ingredientMapping: "Ingredients",
  itemMapping: "Items",
  noIngredientsAdded: "No ingredients added yet",
  noItemsAdded: "No items added yet",
  addIngredientToItem: "Add ingredients to define the recipe",
  addItemToCombo: "Add items to build the combo",
  
  // Preview message
  imagePreviewOnly: "Image preview only",
},
```

---

## Visual Specifications

| Element | Value |
|---------|-------|
| Image size | **140×140px** (was 280px) |
| Nav bar height | `h-12` (48px) |
| Nav pill padding | `px-3 py-1.5` |
| Nav pill radius | `rounded-full` |
| Completion icon size | `h-3.5 w-3.5` |
| Mapping grid | `grid-cols-1 md:grid-cols-2` |
| Section gap | `gap-5` |

---

## Implementation Order

1. **Update `ImageUploadHero.tsx`** - Reduce default size to 140px
2. **Create `SectionNavigationBar.tsx`** - New navigation component
3. **Update `DashedSectionCard.tsx`** - Add id and isComplete props
4. **Rewrite `ItemsAdd.tsx`**:
   - Add section refs for scroll navigation
   - Add completion calculation logic
   - Add navigation bar
   - Add ingredient/item mapping state and modals
   - Add mapping section (50/50 grid)
   - Reduce image size prop to 140
5. **Rewrite `ItemsEdit.tsx`** - Mirror all Add page changes with pre-fill
6. **Update translations** - Add new keys

---

## Mock Data for Mapping

Reuse the same mock data structure from `ItemIngredientMappingEdit.tsx`:

```tsx
const mockAvailableIngredients: AvailableIngredient[] = [
  { id: "1", name_en: "Tomato", ... },
  { id: "2", name_en: "Cheese", ... },
  // etc.
];

const mockAvailableItems: AvailableItem[] = [
  { id: "1", name_en: "Margherita Pizza", ... },
  { id: "2", name_en: "Chicken Burger", ... },
  // etc.
];
```

---

## Technical Notes

1. **Scroll to Section**: Use `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` with offset for sticky header
2. **Active Section Detection**: Use `IntersectionObserver` to detect which section is visible
3. **Completion State**: Calculate in real-time using `useMemo` based on form state
4. **Image Persistence**: Currently blob URLs only - requires storage bucket integration for actual persistence (out of scope for this task, will add TODO)
