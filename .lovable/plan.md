
# Implementation Plan: Fix Layout, Modal & Replacements

## Summary of All Changes

| Issue | Solution |
|-------|----------|
| 1. Quick Summary Card | Remove `<ItemSummaryCard>` from ItemsAdd.tsx and ItemsEdit.tsx |
| 2. Page footer bleed into sidebar | Fix positioning to respect sidebar width (16rem) |
| 3. Modal 70% width + no caps | Change modal to 70vw, remove uppercase text styling |
| 4. Replacements not working | Copy replacement handlers from ItemIngredientMappingEdit.tsx |

---

## 1. Remove Quick Summary Card

**Files:** `ItemsAdd.tsx`, `ItemsEdit.tsx`

- Remove the `<ItemSummaryCard ... />` component and its wrapper comment
- Remove the `ItemSummaryCard` import if no longer used

---

## 2. Fix Page Footer Bleed

**Problem:** The footer uses `fixed bottom-0 left-0 right-0` which spans the entire viewport, bleeding under the sidebar (which is 16rem wide).

**Solution:** Change the footer to respect the sidebar space using `left-[16rem]` instead of `left-0`.

**Files:** `ItemsAdd.tsx`, `ItemsEdit.tsx`

Current:
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-background border-t z-10">
  <div className="mx-auto py-3 px-4" style={{ maxWidth: "75vw" }}>
```

Fixed:
```tsx
<div className="fixed bottom-0 left-[16rem] right-0 bg-background border-t z-10">
  <div className="py-3 px-4 flex justify-end">
```

This ensures the footer starts after the sidebar (16rem = sidebar width) and doesn't bleed into it.

---

## 3. Modal 70% Width + No Caps

**File:** `ItemSaveConfirmModal.tsx`

### Width Change
Current: `sm:max-w-[900px]`  
New: `sm:max-w-[70vw]`

### Remove Uppercase Styling
Current labels use `uppercase` and `tracking-wide`:
```tsx
<label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
```

New (title case, normal tracking):
```tsx
<label className="text-[11px] font-medium text-muted-foreground">
```

Apply to all instances:
- `ReadOnlyFormField` label
- `ReadOnlyChipsField` label  
- `ReviewSectionCard` title
- Table headers (`th` elements)
- Section divider text

---

## 4. Fix Replacements in Items Grid

**Files:** `ItemsAdd.tsx`, `ItemsEdit.tsx`

Add the following from `ItemIngredientMappingEdit.tsx`:

### A. State for Replacement Modal
```tsx
const [replacementModalState, setReplacementModalState] = useState({
  open: false,
  mappingId: "",
  parentName: "",
});
```

### B. Handler Functions
```tsx
const handleOpenReplacementModal = (mappingId: string) => {
  const mapping = subItemMappings.find((m) => m.id === mappingId);
  if (mapping) {
    setReplacementModalState({
      open: true,
      mappingId,
      parentName: mapping.sub_item_name,
    });
  }
};

const handleReplacementsChange = (replacements: ReplacementItem[]) => {
  setSubItemMappings((prev) =>
    prev.map((m) =>
      m.id === replacementModalState.mappingId
        ? { ...m, replacements }
        : m
    )
  );
};

const handleRemoveReplacement = (mappingId: string, replacementId: string) => {
  setSubItemMappings((prev) =>
    prev.map((m) => {
      if (m.id === mappingId && m.replacements) {
        const filtered = m.replacements.filter((r) => r.id !== replacementId);
        if (filtered.length > 0 && !filtered.some((r) => r.is_default)) {
          filtered[0].is_default = true;
        }
        return { ...m, replacements: filtered };
      }
      return m;
    })
  );
};

const handleViewReplacement = (mappingId: string, _replacementId: string) => {
  handleOpenReplacementModal(mappingId);
};
```

### C. Current Replacements Memo
```tsx
const currentReplacements = useMemo(() => {
  const mapping = subItemMappings.find((m) => m.id === replacementModalState.mappingId);
  return mapping?.replacements || [];
}, [subItemMappings, replacementModalState.mappingId]);
```

### D. Connect to ItemTable
```tsx
<ItemTable
  ...
  onReplacement={handleOpenReplacementModal}
  onRemoveReplacement={handleRemoveReplacement}
  onViewReplacement={handleViewReplacement}
/>
```

### E. Add ReplacementModal Component
Import and render the modal:
```tsx
import { ReplacementModal, type ReplacementItem } from "@/components/item-mapping";

// In JSX after other modals:
<ReplacementModal
  open={replacementModalState.open}
  onOpenChange={(open) => !open && setReplacementModalState(prev => ({ ...prev, open: false }))}
  parentItemName={replacementModalState.parentName}
  parentItemId={replacementModalState.mappingId}
  replacements={currentReplacements}
  onReplacementsChange={handleReplacementsChange}
  availableItems={mockAvailableItems}
  currentLanguage={currentLanguage}
/>
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/ItemsAdd.tsx` | Remove summary card, fix footer, add replacement handlers + modal |
| `src/pages/ItemsEdit.tsx` | Remove summary card, fix footer, add replacement handlers + modal |
| `src/components/items/ItemSaveConfirmModal.tsx` | 70vw width, remove uppercase styling |
| `src/components/item-mapping/index.ts` | Export ReplacementModal and ReplacementItem type |

---

## Visual Before/After

### Footer Fix
Before: Footer bleeds under sidebar on the left  
After: Footer starts at sidebar edge, stays within main content

### Modal
Before: 900px max-width, ALL CAPS labels  
After: 70vw width, Title Case labels, more compact

### Replacements
Before: Clicking replacement button does nothing  
After: Opens replacement modal, allows adding/removing/setting default replacements
