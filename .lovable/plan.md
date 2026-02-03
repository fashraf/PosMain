

# Convert Selection List to Searchable Dropdown

## Overview
Replace the visible list with radio buttons in both `AddIngredientModal` and `AddItemModal` with a clean searchable dropdown (combobox) using Popover + Command components.

---

## Current State (What User Sees)
```text
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Search items for replacement...                              │
└─────────────────────────────────────────────────────────────────┘
│ ○ Spicy Burger - SAR 9.50                     ← ALWAYS VISIBLE  │
│ ● Cheese Burger - SAR 9.00                                      │
│ ○ Veggie Burger - SAR 8.50              [Already Added]         │
└─────────────────────────────────────────────────────────────────┘
```

## New State (Dropdown)
```text
┌─────────────────────────────────────────────────────────────────┐
│ Select ingredient...                                  ▼         │
└─────────────────────────────────────────────────────────────────┘
          ↓ Click to expand
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                                     │
├─────────────────────────────────────────────────────────────────┤
│ Spicy Burger - SAR 9.50                                         │
│ Cheese Burger - SAR 9.00                                        │
│ ✓ Veggie Burger - SAR 8.50              [Already Added]         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Visual Design

### Trigger Button (closed state)
```text
┌─────────────────────────────────────────────────────────────────┐
│ Select ingredient...                                  ▼         │
└─────────────────────────────────────────────────────────────────┘
  Height: 36px (h-9)
  Border: 1px #E5E7EB
  Background: white
  Text: #6B7280 placeholder or selected name
  Icon: ChevronDown, 16px, opacity-50
  Focus ring: #8B5CF6
```

### Trigger Button (after selection)
```text
┌─────────────────────────────────────────────────────────────────┐
│ ✓ Cheese - SAR 12.00/KG                               ▼         │
└─────────────────────────────────────────────────────────────────┘
  Check icon: green #22C55E
  Text: black, name + cost visible
```

### Dropdown Panel (opened)
```text
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                                     │
├─────────────────────────────────────────────────────────────────┤
│   Tomato (KG) - SAR 5.00/KG                                     │
│ ✓ Cheese (KG) - SAR 12.00/KG                  ← selected        │
│   Mushrooms (KG) - SAR 8.00/KG                                  │
│   Chicken (KG) - SAR 12.00/KG                                   │
│   ─────────────────────────────────────────────                 │
│   Olive Oil (L) - SAR 5.00/L              [Already Added]       │
└─────────────────────────────────────────────────────────────────┘
  Width: match trigger width (w-full)
  Max height: 200px, scroll for more
  Background: white, solid (no transparency)
  Border: 1px #E5E7EB
  Shadow: 0 4px 12px rgba(0,0,0,0.1)
  z-index: 50
  Each row: 36px height
  Search input: h-9, border-bottom
  Disabled items: opacity-50, grouped at bottom
```

---

## Implementation Details

### Pattern: Popover + Command (Combobox)
Use the standard shadcn/ui combobox pattern:
```jsx
<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox" aria-expanded={dropdownOpen}>
      {selectedItem ? selectedItem.name : "Select..."}
      <ChevronDown className="ml-auto h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-full p-0">
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map(item => (
            <CommandItem
              key={item.id}
              value={item.name}
              onSelect={() => {
                setSelectedItem(item);
                setDropdownOpen(false);
              }}
            >
              <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

---

## Files to Modify

### 1. AddIngredientModal.tsx
**Changes:**
- Remove: visible list with radio buttons
- Add: Popover + Command combobox
- Keep: Preview section, Configure section, Footer
- Add: `dropdownOpen` state

### 2. AddItemModal.tsx
**Changes:**
- Same pattern as AddIngredientModal
- Remove: visible list with radio buttons
- Add: Popover + Command combobox

---

## Detailed UI for AddIngredientModal

### Before (current)
```text
+─────────────────────────────────────────────────+
│ Add Ingredient                                  │
+─────────────────────────────────────────────────+
│ Step 1: Select Ingredient                       │
│ ┌───────────────────────────────────────────┐   │
│ │ 🔍 Search ingredients...                   │   │
│ └───────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────┐   │
│ │ ○ Tomato (KG) - SAR 5.00/KG               │   │
│ │ ● Cheese (KG) - SAR 12.00/KG              │   │  ← VISIBLE LIST
│ │ ○ Olive Oil (L) - SAR 5.00/L [Already]    │   │
│ └───────────────────────────────────────────┘   │
```

### After (dropdown)
```text
+─────────────────────────────────────────────────+
│ Add Ingredient                                  │
+─────────────────────────────────────────────────+
│ Step 1: Select Ingredient                       │
│ ┌───────────────────────────────────────────┐   │
│ │ Select ingredient...                    ▼ │   │  ← COLLAPSED DROPDOWN
│ └───────────────────────────────────────────┘   │
│                                                 │
│ (click to expand dropdown with search)          │
```

---

## Key Specifications

### Dropdown Trigger
- Height: 36px (`h-9`)
- Border: `border border-input`
- Radius: `rounded-md` (6px)
- Font: 13px (`text-[13px]`)
- Placeholder: "Select ingredient..." / "Select item..."
- Selected state: Shows "✓ [Name] - SAR [Price]"

### Dropdown Content
- Width: Full width of trigger
- Background: `bg-popover` (white)
- Border: `border border-border`
- Shadow: `shadow-md`
- Max height: 200px with scroll
- Search input at top with border-bottom
- Items: 32-36px height each
- Selected item: Check icon visible
- Disabled items: `opacity-50`, `pointer-events-none`
- "Already Added" badge on disabled items

### Focus & Accessibility
- Focus ring: `focus:ring-2 focus:ring-[#8B5CF6]`
- Keyboard navigation: Arrow keys, Enter to select, Escape to close
- ARIA: `role="combobox"`, `aria-expanded`

---

## Implementation Steps

1. **Add state for dropdown open/close**
```typescript
const [dropdownOpen, setDropdownOpen] = useState(false);
```

2. **Replace list section with Popover + Command**
```typescript
<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-full justify-between h-9 text-[13px]">
      {selectedIngredient 
        ? `${getLocalizedName(selectedIngredient)} - SAR ${selectedIngredient.cost_per_unit.toFixed(2)}/${selectedIngredient.unit}`
        : t("itemMapping.selectIngredient")}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
    <Command>
      <CommandInput placeholder={t("itemMapping.searchIngredients")} />
      <CommandList className="max-h-[200px]">
        <CommandEmpty>{t("common.noData")}</CommandEmpty>
        <CommandGroup>
          {filteredIngredients.map((ing) => {
            const isAlreadyMapped = mappedIds.includes(ing.id);
            const isSelected = selectedIngredient?.id === ing.id;
            return (
              <CommandItem
                key={ing.id}
                value={getLocalizedName(ing)}
                disabled={isAlreadyMapped}
                onSelect={() => {
                  setSelectedIngredient(ing);
                  setDropdownOpen(false);
                }}
                className="text-[13px]"
              >
                <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                <span>{getLocalizedName(ing)} ({ing.unit})</span>
                <span className="ml-auto text-muted-foreground">
                  SAR {ing.cost_per_unit.toFixed(2)}/{ing.unit}
                </span>
                {isAlreadyMapped && (
                  <span className="ml-2 text-[11px] bg-muted px-1.5 py-0.5 rounded">
                    {t("itemMapping.alreadyMapped")}
                  </span>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

3. **Remove the old visible list and search input**

4. **Keep the rest of the modal unchanged**
- Preview section (Step 2)
- Configure section (Step 3)
- Footer with Cancel/Confirm

---

## Density Compliance

| Rule | Compliance |
|------|------------|
| Dropdown trigger h-9 (36px) | ✓ |
| Row height 32-36px | ✓ |
| Text 13px | ✓ |
| Border #E5E7EB | ✓ |
| Primary focus #8B5CF6 | ✓ |
| No shadows on inner elements | ✓ (only on popover) |
| Max border-radius 6px | ✓ |
| Background solid white | ✓ (no transparency) |

---

## Summary of Changes

| File | Action |
|------|--------|
| `AddIngredientModal.tsx` | Replace visible list with Popover+Command dropdown |
| `AddItemModal.tsx` | Replace visible list with Popover+Command dropdown |

No new files needed - using existing UI components (Popover, Command).

