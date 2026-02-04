
# Items Add/Edit Page - Complete Redesign Plan

## Overview
Redesign the `/items/add` and `/items/edit` pages with a two-column layout (Col-4 + Col-6), featuring dashed-border section cards, dynamic EN/AR/UR language indicators, inventory progress bar, and enhanced visual design matching the reference screenshot.

---

## Target Layout (Based on Reference Image)

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Add Item / Edit Item                                                                             │
├──────────────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ LEFT COLUMN (col-4 / ~33%)                   │ RIGHT COLUMN (col-8 / ~66%)                          │
│                                              │                                                      │
│ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│ ┊ 📝 Basic Information    [purple]       ┊  │ ┊ 📝 Basic Information                  [purple] ┊  │
│ ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │ ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│ ┊  ┌────────────────────────────────┐    ┊  │ ┊  Item Type          │ Base Cost (SAR)         ┊  │
│ ┊  │        📷 Image                │    ┊  │ ┊  ┌───────────────┐  │ ┌─────────────────────┐ ┊  │
│ ┊  │     300×300 aspect-1:1         │    ┊  │ ┊  │ Edible      ▼ │  │ │ 12.99               │ ┊  │
│ ┊  │    Click to upload             │    ┊  │ ┊  └───────────────┘  │ └─────────────────────┘ ┊  │
│ ┊  │    PNG, JPG up to 5MB          │    ┊  │ ┊                                               ┊  │
│ ┊  └────────────────────────────────┘    ┊  │ ┊  [⚪ Is Combo (i)]     [🟢 Active]            ┊  │
│ ┊                                        ┊  │ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│ ┊  Item Name * [EN🟢|AR🔴|UR🔴]          ┊  │                                                      │
│ ┊  ┌────────────────────────────────┐    ┊  │ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│ ┊  │ Margherita Pizza              │    ┊  │ ┊ 🏷️ Classification                    [green]  ┊  │
│ ┊  └────────────────────────────────┘    ┊  │ ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│ ┊                                        ┊  │ ┊  Category *           │ Subcategory           ┊  │
│ ┊  Description [EN🟢|AR🔴|UR🔴]          ┊  │ ┊  ┌────────────────┐   │ ┌─[Pizza ×]────────┐  ┊  │
│ ┊  ┌────────────────────────────────┐    ┊  │ ┊  │ Non-Vegetarian │   │ │                  │  ┊  │
│ ┊  │ Classic pizza with tomato      │    ┊  │ ┊  └────────────────┘   │ └──────────────────┘  ┊  │
│ ┊  │ and mozzarella                 │    ┊  │ ┊                                               ┊  │
│ ┊  └────────────────────────────────┘    ┊  │ ┊  Serving Time *                               ┊  │
│ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │ ┊  ☐ Breakfast ☑ Lunch Specials ☑ Dinner ☐ Snacks┊  │
│                                              │ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │                                                      │
│ ┊ 📦 Combo Items (EDIT ONLY)   [amber]   ┊  │ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│ ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │ ┊ ⏱️ Details                             [blue]   ┊  │
│ ┊  → 2x Margherita                       ┊  │ ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│ ┊  → 4x Chicken BBQ                      ┊  │ ┊  Prep Time (i)    │ Calories (i) │ Highlights ┊  │
│ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │ ┊  ┌───────┐ min    │ ┌──────┐ kcal│ ┌─────────┐ ┊  │
│                                              │ ┊  │ 20    │        │ │ 850  │     │ │Crispy...│ ┊  │
│ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │ ┊  └───────┘        │ └──────┘     │ └─────────┘ ┊  │
│ ┊ 📊 Inventory                [amber]    ┊  │ ┊                                               ┊  │
│ ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │ ┊  Allergens (i)                                ┊  │
│ ┊  ┌──────────────────────────────────┐  ┊  │ ┊  [🥜Nuts] [🥛Dairy✓] [🌾Gluten✓] [🥚Eggs] ... ┊  │
│ ┊  │████████████████░░░░░░│ 68%       │  ┊  │ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│ ┊  └──────────────────────────────────┘  ┊  │                                                      │
│ ┊  Current Stock     Low Stock Threshold ┊  │                                                      │
│ ┊  ┌───────────┐     ┌───────────┐       ┊  │                                                      │
│ ┊  │ 68        │     │ 10        │       ┊  │                                                      │
│ ┊  └───────────┘     └───────────┘       ┊  │                                                      │
│ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │                                                      │
├──────────────────────────────────────────────┴──────────────────────────────────────────────────────┤
│                                                        [× Cancel]   [✓ Save]                        │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features to Implement

### 1. Two-Column Layout
- **Left Column (~33% - lg:col-span-4)**: Image upload, Item Name, Description, Combo Items (edit only), Inventory
- **Right Column (~66% - lg:col-span-8)**: Item Type, Base Cost, Toggles, Classification, Details

### 2. Dynamic EN/AR/UR Language Indicators
```tsx
// New component: MultiLanguageInputWithIndicators
// - Compact tabs with color indicators
// - Green text (text-success) when field has content
// - Red text (text-danger) when field is empty
// - 12px font size for language labels
```

### 3. New Inventory Section (Left Column)
- Progress bar showing stock availability percentage
- Dynamic color: Green (>70%), Yellow (30-70%), Red (<30%)
- Fields: Current Stock (number), Low Stock Threshold (number)
- Percentage displayed prominently

### 4. Combo Items Section
- **Only visible when:** `isCombo === true` AND editing existing item (not on Add New)
- Shows list of items in combo with arrow prefix (→)
- Quantity indicators (2x, 4x, etc.)
- Simple list styling, no complex editing

### 5. Enhanced Toggles
- Is Combo toggle with tooltip icon
- Active toggle with visual purple/gray styling
- Aligned in a row on right side

---

## Component Changes

### New Components to Create

#### 1. `MultiLanguageInputWithIndicators.tsx`
```tsx
interface MultiLanguageInputWithIndicatorsProps {
  label: string;
  values: { en: string; ar: string; ur: string };
  onChange: (lang: "en" | "ar" | "ur", value: string) => void;
  multiline?: boolean;
  required?: boolean;
}

// Features:
// - Language tabs with filled/empty color indicators
// - Tab labels: "EN" / "AR" / "UR"
// - Filled = text-success (green), Empty = text-danger (red)
// - Right-aligned language indicator badges next to input
```

#### 2. `InventoryProgressCard.tsx`
```tsx
interface InventoryProgressCardProps {
  currentStock: number;
  maxStock?: number; // defaults to 100
  lowStockThreshold: number;
  onCurrentStockChange: (value: number) => void;
  onThresholdChange: (value: number) => void;
}

// Features:
// - Progress bar with dynamic color
// - Percentage label in center or to the side
// - Two input fields below
```

#### 3. `ComboItemsList.tsx` (Simple read-only list)
```tsx
interface ComboItemsListProps {
  items: Array<{ name: string; quantity: number }>;
}

// Features:
// - Arrow prefix (→) for each item
// - Quantity prefix (2x, 4x)
// - Only visible when isCombo && isEditMode
```

### Files to Modify

| Action | File | Changes |
|--------|------|---------|
| CREATE | `src/components/shared/MultiLanguageInputWithIndicators.tsx` | New compact multilingual input with color indicators |
| CREATE | `src/components/shared/InventoryProgressCard.tsx` | New inventory section with progress bar |
| CREATE | `src/components/items/ComboItemsList.tsx` | Simple combo items display |
| MODIFY | `src/pages/ItemsAdd.tsx` | Complete redesign with 2-column layout |
| MODIFY | `src/pages/ItemsEdit.tsx` | Complete redesign + combo items visible |
| MODIFY | `src/components/shared/DashedSectionCard.tsx` | Add support for all variants (purple, green, blue, amber) |
| MODIFY | `src/lib/i18n/translations.ts` | Add inventory-related translation keys |

---

## Detailed Implementation

### Form State Additions
```typescript
// Add to existing form state
const [formData, setFormData] = useState({
  // ... existing fields
  
  // New inventory fields
  current_stock: 100,
  low_stock_threshold: 10,
});
```

### Progress Bar Color Logic
```typescript
const getProgressColor = (percentage: number) => {
  if (percentage >= 70) return "bg-green-500";
  if (percentage >= 30) return "bg-yellow-500";
  return "bg-red-500";
};
```

### Language Indicator Logic
```typescript
// For each language input, check if it has content
const getLanguageIndicatorColor = (value: string) => {
  return value.trim().length > 0 ? "text-success" : "text-danger";
};
```

### Two-Column Grid Structure
```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  {/* Left Column - 4/12 */}
  <div className="lg:col-span-4 space-y-5">
    {/* Basic Info Left (Image, Name, Description) */}
    <DashedSectionCard title="Basic Information" icon={FileText} variant="purple">
      <ImageUploadHero ... />
      <MultiLanguageInputWithIndicators label="Item Name" required ... />
      <MultiLanguageInputWithIndicators label="Description" multiline ... />
    </DashedSectionCard>
    
    {/* Combo Items - Only on Edit when isCombo */}
    {isEditMode && formData.is_combo && (
      <DashedSectionCard title="Combo Items" icon={Package} variant="amber">
        <ComboItemsList items={comboItems} />
      </DashedSectionCard>
    )}
    
    {/* Inventory Section */}
    <DashedSectionCard title="Inventory" icon={BarChart} variant="amber">
      <InventoryProgressCard ... />
    </DashedSectionCard>
  </div>
  
  {/* Right Column - 8/12 */}
  <div className="lg:col-span-8 space-y-5">
    {/* Basic Info Right (Type, Cost, Toggles) */}
    <DashedSectionCard title="Basic Information" icon={FileText} variant="purple">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Item Type" ... />
        <Input label="Base Cost (SAR)" ... />
      </div>
      <div className="flex items-center gap-6 mt-4">
        <Switch label="Is Combo" with tooltip ... />
        <Switch label="Active" ... />
      </div>
    </DashedSectionCard>
    
    {/* Classification */}
    <DashedSectionCard title="Classification" icon={Tags} variant="green">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category *" ... />
        <MultiSelectBadges label="Subcategory" ... />
      </div>
      <div className="mt-4">
        <Label>Serving Time *</Label>
        <CheckboxGroup ... />
      </div>
    </DashedSectionCard>
    
    {/* Details */}
    <DashedSectionCard title="Details" icon={Clock} variant="blue">
      <div className="grid grid-cols-3 gap-4">
        <Input label="Prep Time" suffix="min" with tooltip />
        <Input label="Calories" suffix="kcal" with tooltip />
        <Input label="Highlights" with tooltip />
      </div>
      <AllergenPicker ... />
    </DashedSectionCard>
  </div>
</div>
```

---

## Translation Keys to Add

```typescript
items: {
  // ... existing keys
  
  // New inventory section
  inventory: "Inventory",
  currentStock: "Current Stock",
  lowStockThreshold: "Low Stock Threshold",
  stockAvailable: "Available",
  stockPercentage: "{{percentage}}% Available",
  
  // Combo items
  comboItems: "Combo Items",
  itemsInCombo: "Items in this Combo",
},
```

---

## Visual Specifications

| Element | Specification |
|---------|---------------|
| Left column width | `lg:col-span-4` (33.33%) |
| Right column width | `lg:col-span-8` (66.67%) |
| Section gap | `gap-5` (20px) |
| Card radius | `rounded-xl` (12px) |
| Card border | `border-2 border-dashed` |
| Image upload size | 280×280px (centered, aspect-square) |
| Language indicator font | `text-[12px]` |
| Progress bar height | `h-3` (12px) |
| Input height | `h-10` (40px) |

### Color Variants (Enhanced)
| Section | Border | Header BG | Icon/Title |
|---------|--------|-----------|------------|
| Basic Info | `border-purple-300/40` | `bg-purple-50` | `text-purple-600/700` |
| Classification | `border-green-300/40` | `bg-green-50` | `text-green-600/700` |
| Details | `border-blue-300/40` | `bg-blue-50` | `text-blue-600/700` |
| Combo Items | `border-amber-300/40` | `bg-amber-50` | `text-amber-600/700` |
| Inventory | `border-amber-300/40` | `bg-amber-50` | `text-amber-600/700` |

---

## Implementation Order

1. **Create `MultiLanguageInputWithIndicators.tsx`** - New input with color-coded language tabs
2. **Create `InventoryProgressCard.tsx`** - Progress bar + stock inputs
3. **Create `ComboItemsList.tsx`** - Simple combo items display
4. **Update `DashedSectionCard.tsx`** - Ensure all color variants work
5. **Redesign `ItemsAdd.tsx`** - Two-column layout, new sections (no combo items section)
6. **Redesign `ItemsEdit.tsx`** - Same as Add but with combo items section visible when applicable
7. **Update `translations.ts`** - Add new keys for inventory and combo sections

---

## Technical Considerations

### Responsive Behavior
- On mobile (`< lg`): Single column, sections stack vertically
- On desktop (`lg+`): Two-column layout as shown

### Combo Items Visibility Logic
```typescript
// Only show combo items section when:
// 1. We are in edit mode (not add)
// 2. The item is marked as a combo
const showComboSection = isEditMode && formData.is_combo;
```

### Form Validation
- Required fields: Item Name (EN), Category, Serving Time (at least one)
- Show validation errors before confirmation modal
- Red asterisk on required field labels

### Sticky Footer
- Fixed at bottom of viewport
- Offset by sidebar width (`ps-[16rem]`)
- Contains Cancel and Save buttons

---

## Summary

This redesign transforms the current vertical single-column layout into a modern, space-efficient two-column design with:
1. Left column for image/name/description + inventory
2. Right column for type/cost/toggles + classification + details
3. Dynamic EN/AR/UR language indicators (green=filled, red=empty)
4. New inventory section with smart progress bar
5. Conditional combo items section (edit mode only)
6. Consistent dashed-border section cards with color variants
7. Improved mobile responsiveness
