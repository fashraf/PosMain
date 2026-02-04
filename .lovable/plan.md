
# Ingredient Master Add/Edit - Refined UI Plan

## Overview
Refine the Ingredient Master form to support both **Add** and **Edit** modes with a more compact, visually polished layout featuring image upload, dynamic EN/AR/UR indicators, and a small stock availability ribbon instead of large progress bar.

---

## Target Layout Design

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Add Ingredient / Edit Ingredient                                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 🥕 Ingredient Basics                                                         [purple header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  ┌────────────────┐    │  Ingredient Name * [EN🟢|AR🔴|UR🔴]                                  ┊  │
│  ┊  │     📷         │    │  ┌──────────────────────────────────────────────────────────────┐   ┊  │
│  ┊  │   Image        │    │  │ Chicken Breast                                               │   ┊  │
│  ┊  │  280×280       │    │  └──────────────────────────────────────────────────────────────┘   ┊  │
│  ┊  │ aspect-1:1     │    │                                                                      ┊  │
│  ┊  │               │    │  Short Description [EN🟢|AR🔴|UR🔴]                                  ┊  │
│  ┊  └────────────────┘    │  ┌──────────────────────────────────────────────────────────────┐   ┊  │
│  ┊   Click to upload      │  │ Fresh boneless chicken for grilling (same height as name)   │   ┊  │
│  ┊   PNG, JPG 5MB         │  └──────────────────────────────────────────────────────────────┘   ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 🏷️ Classification                                                            [green header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Type *          │  Unit *         │  Storage Type *    │  Category/Group                   ┊  │
│  ┊  ┌─────────────┐ │  ┌────────────┐ │  ┌───────────────┐ │  ┌─[Meat ×][Poultry ×]─────────┐  ┊  │
│  ┊  │ Solid     ▼ │ │  │ KG       ▼ │ │  │ Freezer     ▼ │ │  │                           ▼ │  ┊  │
│  ┊  └─────────────┘ │  └────────────┘ │  └───────────────┘ │  └─────────────────────────────┘  ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈[🟢 68%]┈╮  │
│  ┊ ⚠️ Inventory & Alerts                                                         [amber header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Min Stock *(i)    │  Shelf Life (i)      │  PAR Level (i)     │  Current Stock             ┊  │
│  ┊  ┌───────────────┐ │  ┌────────────┐ days │  ┌───────────────┐ │  ┌───────────────────────┐  ┊  │
│  ┊  │ 10            │ │  │ 7          │      │  │ 25            │ │  │ 100                   │  ┊  │
│  ┊  └───────────────┘ │  └────────────┘      │  └───────────────┘ │  └───────────────────────┘  ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 💰 Pricing                                                                    [blue header]  ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Cost Price * (SAR)     │  Selling Price        │  ☑ Can Purchase    ☐ Return on Cancel     ┊  │
│  ┊  ┌──────────────────┐   │  ┌──────────────────┐ │                                            ┊  │
│  ┊  │ SAR 15.00        │   │  │ SAR 20.00        │ │                                            ┊  │
│  ┊  └──────────────────┘   │  └──────────────────┘ │                                            ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                     │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 📋 Details                                                                    [muted header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Yield % (i)             │  Supplier/Vendor                                                  ┊  │
│  ┊  ┌────────────────────┐  │  ┌────────────────────────────────────────────────────────────┐   ┊  │
│  ┊  │ 85              %  │  │  │ Fresh Foods Co.                                            │   ┊  │
│  ┊  └────────────────────┘  │  └────────────────────────────────────────────────────────────┘   ┊  │
│  ┊                                                                                              ┊  │
│  ┊  Allergen Flags                                                                              ┊  │
│  ┊  [🥜Nuts] [🥛Dairy ✓] [🌾Gluten] [🥚Eggs] [🫘Soy] [🦐Shellfish] [🌾Wheat]                     ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                     [× Cancel]   [✓ Save / Update Ingredient]      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Changes from Current Implementation

| Feature | Current | New |
|---------|---------|-----|
| Basics Section | Two inputs side-by-side, no image | Image left (280px), Name + Description right (same height) |
| Progress Bar | Large full-width bar in Inventory card | Small ribbon/pill badge on card header corner |
| EN/AR/UR indicators | 11px font | **12px exactly**, dynamic green/red colors |
| Description height | min-h-[80px] (taller) | **Same height as Name input** (h-10 / 40px) |
| Edit Mode | No edit page exists | Create `IngredientMasterEdit.tsx` with pre-fill |
| Button Text | "Save" always | "Save" on add, **"Update"** on edit |
| Confirmation | Same message | Different message for add vs edit |

---

## Component Changes

### 1. Update `DashedSectionCard.tsx`
Add optional `rightBadge` prop for the stock availability ribbon:

```tsx
interface DashedSectionCardProps {
  title: string;
  icon?: LucideIcon;
  variant?: ColorVariant;
  rightBadge?: ReactNode; // NEW - for stock ribbon
  children: ReactNode;
}
```

### 2. Create `StockAvailabilityBadge.tsx`
Small pill/ribbon showing stock percentage:
- Color: Green (>70%), Yellow (30-70%), Red (<30%)
- Format: "68% Available" or just "68%"
- Small, elegant, positioned in header

### 3. Update `MultiLanguageInputWithIndicators.tsx`
- Font-size: Change from `text-[11px]` to **`text-[12px]`**
- Add `singleLine` prop for description to match name height

### 4. Rewrite `IngredientMasterAdd.tsx`
- Add **ImageUploadHero** on left side
- Place Name + Description on right side (same input heights)
- Replace progress bar with **StockAvailabilityBadge** in Inventory card header
- Keep all other sections

### 5. Create `IngredientMasterEdit.tsx`
- Clone of Add page with:
  - Pre-fill form data from route params (mock for now)
  - Button text: "Update" instead of "Save"
  - Page title: "Edit Ingredient"
  - Confirmation modal text: "Updated! Ready to apply changes?"

### 6. Update `IngredientSaveConfirmModal.tsx`
- Add `isEditMode` prop
- Different title/message for edit mode

### 7. Add route for edit
- `/inventory/ingredients/:id/edit` → `IngredientMasterEdit`

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/components/shared/StockAvailabilityBadge.tsx` | Small stock ribbon component |
| MODIFY | `src/components/shared/DashedSectionCard.tsx` | Add rightBadge prop |
| MODIFY | `src/components/shared/MultiLanguageInputWithIndicators.tsx` | 12px font, singleLine option |
| REWRITE | `src/pages/inventory/IngredientMasterAdd.tsx` | New layout with image + refined UI |
| CREATE | `src/pages/inventory/IngredientMasterEdit.tsx` | Edit page with pre-fill |
| MODIFY | `src/components/ingredients/IngredientSaveConfirmModal.tsx` | Edit mode messaging |
| MODIFY | `src/App.tsx` | Add edit route |
| MODIFY | `src/lib/i18n/translations.ts` | Add edit mode strings |

---

## Visual Specifications

| Element | Specification |
|---------|---------------|
| Image size | 280×280px (aspect-square) |
| Name input height | `h-10` (40px) |
| Description height | `h-10` (40px) - matches name |
| EN/AR/UR label font | **`text-[12px]`** |
| Stock badge | Small pill, positioned in header right |
| Card shadows | `shadow-sm` for subtle depth |
| Input borders | `border rounded-md` with focus ring |

### Stock Badge Colors
| Range | Background | Text |
|-------|------------|------|
| >70% | `bg-green-100` | `text-green-700` |
| 30-70% | `bg-yellow-100` | `text-yellow-700` |
| <30% | `bg-red-100` | `text-red-700` |

---

## Section 1: Ingredient Basics Layout

```tsx
<DashedSectionCard title="Ingredient Basics" icon={Carrot} variant="purple">
  <div className="flex gap-6">
    {/* Left: Image Upload */}
    <div className="flex-shrink-0">
      <ImageUploadHero value={imageUrl} onChange={setImageUrl} size={280} />
    </div>
    
    {/* Right: Name + Description (stacked, same height) */}
    <div className="flex-1 flex flex-col gap-4">
      <MultiLanguageInputWithIndicators
        label="Ingredient Name"
        values={{ en, ar, ur }}
        onChange={handleNameChange}
        required
        singleLine  // h-10
      />
      <MultiLanguageInputWithIndicators
        label="Short Description"
        values={{ en, ar, ur }}
        onChange={handleDescChange}
        singleLine  // h-10 same as name
      />
    </div>
  </div>
</DashedSectionCard>
```

---

## Inventory Card with Stock Badge

```tsx
<DashedSectionCard
  title="Inventory & Alerts"
  icon={AlertTriangle}
  variant="amber"
  rightBadge={<StockAvailabilityBadge percentage={68} />}
>
  {/* No progress bar - just the fields */}
  <div className="grid grid-cols-4 gap-4">
    <FormField label="Min Stock Alert" tooltip="..." required>...</FormField>
    <FormField label="Shelf Life" tooltip="...">...</FormField>
    <FormField label="PAR Level" tooltip="...">...</FormField>
    <FormField label="Current Stock">...</FormField>
  </div>
</DashedSectionCard>
```

---

## Translation Keys to Add

```typescript
ingredients: {
  // Edit mode
  editIngredient: "Edit Ingredient",
  updateIngredient: "Update Ingredient",
  
  // Confirmation modal
  perfectReady: "Perfect!",
  readyToSave: "Ready to save this ingredient?",
  updated: "Updated!",
  readyToApply: "Ready to apply changes?",
},

common: {
  update: "Update",
}
```

---

## Implementation Order

1. **Create `StockAvailabilityBadge.tsx`** - New small badge component
2. **Update `DashedSectionCard.tsx`** - Add rightBadge prop support
3. **Update `MultiLanguageInputWithIndicators.tsx`** - 12px font, singleLine prop
4. **Rewrite `IngredientMasterAdd.tsx`** - Image + refined layout
5. **Create `IngredientMasterEdit.tsx`** - Pre-fill + edit mode
6. **Update `IngredientSaveConfirmModal.tsx`** - Edit mode support
7. **Update `App.tsx`** - Add edit route
8. **Update `translations.ts`** - Edit strings

---

## Form Validation

Required fields (same for add & edit):
- Ingredient Name (EN)
- Type
- Unit
- Storage Type
- Min Stock Alert
- Cost Price

---

## Edit Mode Detection

```tsx
// In IngredientMasterEdit.tsx
const { id } = useParams();
const isEditMode = !!id;

// Pre-fill mock data (later: fetch from Supabase)
useEffect(() => {
  if (id) {
    // Mock data for now
    setFormData({
      name_en: "Chicken Breast",
      ingredient_type: "solid",
      // ...pre-filled values
    });
  }
}, [id]);
```

---

## Summary

This refined design creates a polished, efficient Ingredient Master form that:

1. Adds **image upload** capability (left side, 280px square)
2. Keeps Name & Description **same height** (compact, no gaps)
3. Replaces large progress bar with **small stock ribbon** badge
4. Uses **12px font** for EN/AR/UR indicators
5. Supports both **Add** and **Edit** modes
6. Shows **"Update"** button text in edit mode
7. Has **different confirmation messages** for add vs edit
8. Maintains all dashed-border section cards with color variants
