

# Print Template Form Polish

## Overview

Four improvements: remove static "Sample Restaurant" from preview, improve logo upload appearance, add red border validation on empty required fields, and convert all checkbox groups into attractive toggle cards.

---

## 1. Remove Static "Sample Restaurant" from Receipt Preview

**File: `ReceiptPreview.tsx`**

- Remove the standalone `restaurantName` heading at lines 122-124 (the one that always shows "Sample Restaurant" from defaultData)
- The `show_branch_name` checkbox already controls showing the restaurant name in the branch info block at line 128
- Change line 128 fallback: when `show_branch_name` is true and `restaurant_name_en` is empty, show nothing (no fallback text)
- Change `defaultData.restaurant_name_en` from `"Sample Restaurant"` to `""` in `PrintTemplateFormPage.tsx` line 55

---

## 2. Improve Logo Upload Area

**File: `PrintTemplateFormPage.tsx`**

Replace the current `ImageUploadHero` (64px, looks cramped) with a cleaner, wider rectangular upload zone:
- Use a custom inline upload area: 120px wide x 60px tall rounded rectangle
- Dashed border with a subtle background
- Show a small image icon + "Upload Logo" text when empty
- Show the uploaded image with a remove button when filled
- This replaces the square `ImageUploadHero` with something more appropriate for a logo (landscape aspect ratio)

---

## 3. Red Border Validation on Empty Required Fields

**File: `PrintTemplateFormPage.tsx`**

- Add a `validationErrors` state: `Record<string, boolean>` tracking which fields have errors
- On save click, set errors for empty required fields (name, restaurant_name_en)
- Apply `border-red-500 focus:ring-red-500` class to inputs that have errors
- Clear the error for a field when the user types in it
- The existing toast + scroll + focus behavior remains

---

## 4. Convert Checkboxes to Attractive Toggle Cards

**File: `PrintTemplateFormPage.tsx`**

Replace all checkbox groups (Header toggles, Body toggles) with styled toggle cards:

Each toggle option becomes a small card:
- Rounded border (`rounded-lg border`)
- Padding `px-3 py-2`
- When checked: `bg-primary/5 border-primary/40` with a filled checkbox
- When unchecked: `bg-white border-gray-200` with an empty checkbox
- Hover effect: `hover:border-primary/30 hover:bg-primary/5`
- Checkbox + label inline, cursor-pointer on the whole card
- Cards arranged in a responsive grid (`grid grid-cols-3 gap-2` for Header, `grid grid-cols-4 gap-2` for Body)

This applies to:
- **Header section**: The 6 visibility toggles (Restaurant Name, Branch Mobile, Order ID, Order Taken By, CR Number, VAT Number) -- grid-cols-3
- **Body section**: The 8 column toggles (Item Name, Qty, Price, etc.) -- grid-cols-4
- **QR section**: The 2 sub-toggles (Amount Above QR, Order ID Near QR) -- grid-cols-2
- **Footer section**: The Show Footer toggle -- single card

---

## Technical Details

### Validation state management
```typescript
const [errors, setErrors] = useState<Record<string, boolean>>({});

// Clear error on change
const set = (key, val) => {
  setData(prev => ({ ...prev, [key]: val }));
  if (errors[key]) setErrors(prev => ({ ...prev, [key]: false }));
};

// Input className
className={cn("h-9 text-[13px]", errors.name && "border-red-500 focus-visible:ring-red-500")}
```

### Toggle card component (inline)
```typescript
const ToggleCard = ({ checked, onChange, id, label }) => (
  <label
    htmlFor={id}
    className={cn(
      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all",
      checked
        ? "bg-primary/5 border-primary/40 shadow-sm"
        : "bg-white border-gray-200 hover:border-primary/30 hover:bg-primary/[0.02]"
    )}
  >
    <Checkbox checked={checked} onCheckedChange={onChange} id={id} />
    <span className="text-xs font-medium select-none">{label}</span>
  </label>
);
```

### Files changed

| File | Change |
|------|--------|
| `PrintTemplateFormPage.tsx` | Remove default "Sample Restaurant", add validation errors state with red borders, convert checkboxes to toggle cards, improve logo upload area |
| `ReceiptPreview.tsx` | Remove standalone restaurant name heading, update branch name fallback |
