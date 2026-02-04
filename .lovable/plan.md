
# Ingredient Master Form - Refined Layout Plan

## Overview
Refine the Ingredient Master Add/Edit forms to:
1. Remove image upload component
2. Place Ingredient Name (col-6) and Short Description (col-6) side-by-side
3. Convert all dropdowns to searchable Select2-style using Popover + Command pattern (like reference image)

---

## Target Layout Design

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Add Ingredient / Edit Ingredient                                                                   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                        │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 🥕 Ingredient Basics                                                            [purple header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Ingredient Name * [EN🟢|AR🔴|UR🔴]    │  Short Description [EN🟢|AR🔴|UR🔴]                     ┊  │
│  ┊  ┌──────────────────────────────────┐   │  ┌──────────────────────────────────────────────────┐  ┊  │
│  ┊  │ Chicken Breast                   │   │  │ Fresh boneless chicken for grilling             │  ┊  │
│  ┊  └──────────────────────────────────┘   │  └──────────────────────────────────────────────────┘  ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│                                                                                                        │
│  ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮  │
│  ┊ 🏷️ Classification                                                               [green header] ┊  │
│  ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  │
│  ┊  Type * (Searchable)    │  Unit * (Searchable)   │  Storage * (Searchable)  │  Category/Group  ┊  │
│  ┊  ┌──🔍 Solid ──────▼ ┐  │  ┌──🔍 KG ──────▼ ┐    │  ┌──🔍 Freezer ───▼ ┐     │  ┌─[Meat ×]───┐   ┊  │
│  ┊  └───────────────────┘  │  └────────────────┘    │  └────────────────────┘   │  └─────────────┘  ┊  │
│  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯  │
│  ... (remaining sections unchanged)                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Changes

| Feature | Current | New |
|---------|---------|-----|
| Image Upload | 280x280 ImageUploadHero on left | **REMOVED** |
| Name/Description Layout | Stacked vertically (image + inputs) | **Side-by-side (col-6 each)** |
| Dropdowns | Standard Radix Select | **Searchable Combobox (Popover + Command)** |

---

## Component Changes

### 1. Create Reusable `SearchableSelect.tsx` Component

A new reusable component following the existing pattern from `InventoryItemPicker.tsx`:

```tsx
interface SearchableSelectOption {
  id: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}
```

Features:
- Uses Popover + Command pattern (like reference image with search icon)
- Shows selected value in trigger button
- Searchable dropdown list with keyboard navigation
- Check icon for selected item
- ChevronsUpDown indicator

### 2. Update `IngredientMasterAdd.tsx`

Section 1 (Basics) changes:
- Remove `ImageUploadHero` component and `imageUrl` state
- Change layout from `flex gap-6` to `grid grid-cols-1 md:grid-cols-2 gap-4`
- Both Name and Description become side-by-side at equal widths

Section 2 (Classification) changes:
- Replace all `<Select>` components with new `<SearchableSelect>` component
- Type, Unit, Storage Type all become searchable

### 3. Update `IngredientMasterEdit.tsx`

Apply the same changes as Add page:
- Remove image upload
- Side-by-side Name/Description
- Searchable dropdowns

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/components/shared/SearchableSelect.tsx` | Reusable searchable dropdown (Select2 style) |
| MODIFY | `src/pages/inventory/IngredientMasterAdd.tsx` | Remove image, side-by-side layout, searchable selects |
| MODIFY | `src/pages/inventory/IngredientMasterEdit.tsx` | Same changes as Add page |

---

## SearchableSelect Component Design

Following the reference image style (similar to "Search for company" field):

```tsx
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-full justify-between h-10"
    >
      {selectedLabel || (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-full p-0" align="start">
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              value={option.label}
              onSelect={() => {
                onChange(option.id);
                setOpen(false);
              }}
            >
              <Check className={cn("mr-2 h-4 w-4", value === option.id ? "opacity-100" : "opacity-0")} />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

---

## Basics Section Layout Change

Before:
```tsx
<div className="flex gap-6">
  <div className="flex-shrink-0">
    <ImageUploadHero value={imageUrl} onChange={setImageUrl} size={280} />
  </div>
  <div className="flex-1 flex flex-col gap-4">
    <MultiLanguageInputWithIndicators label="Name" ... />
    <MultiLanguageInputWithIndicators label="Description" ... />
  </div>
</div>
```

After:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <MultiLanguageInputWithIndicators label="Ingredient Name" required singleLine ... />
  <MultiLanguageInputWithIndicators label="Short Description" singleLine ... />
</div>
```

---

## Implementation Order

1. **Create `SearchableSelect.tsx`** - New reusable component for searchable dropdowns
2. **Update `IngredientMasterAdd.tsx`**:
   - Remove ImageUploadHero import and usage
   - Remove imageUrl state
   - Update Basics section to grid layout
   - Replace Select with SearchableSelect for Type, Unit, Storage Type
3. **Update `IngredientMasterEdit.tsx`** - Apply identical changes

---

## Visual Specifications

| Element | Value |
|---------|-------|
| Name field width | `col-6` (50%) |
| Description field width | `col-6` (50%) |
| Grid gap | `gap-4` (16px) |
| Input height | `h-10` (40px) |
| Dropdown trigger | Outline button with ChevronsUpDown icon |
| Search input | CommandInput with search icon |
| Selected indicator | Check icon (like reference image) |
