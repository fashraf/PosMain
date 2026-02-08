

# Three UI Tweaks: Item Card, Customize Header, Cart Footer

## 1. Item Card Button: Replace "CUSTOMIZE" text with icon + "EDIT"

**File**: `src/components/pos/items/POSItemCard.tsx` (line 88) and `src/components/pos/items/ItemCard.tsx` (line 52-53)

- Change the customize button label from `CUSTOMIZE` to `EDIT`
- Keep the `Settings2` icon (POSItemCard) / change `Pencil` to `Settings2` icon (ItemCard)
- This matches the reference showing a shorter, cleaner button label

## 2. Remove "Customize:" text from modal header

**File**: `src/components/pos/modals/CustomizeModal.tsx` (line 175-176)

- Change `Customize: {menuItem?.name_en}` to just `{menuItem?.name_en}`
- The modal context already makes it clear this is customization

## 3. Cart Footer: Add subtotal/VAT summary, change button text

**File**: `src/components/pos/cart/PayButton.tsx`

- Add a small summary section above the button row showing:
  - Subtotal (right-aligned)
  - VAT X% (right-aligned)
- Change button text from `Confirm & Pay -> {total} SAR` to `Confirm -> {total} SAR`
- Remove the total line from the summary (it's already on the button)
- Add `subtotal`, `vatRate`, `vatAmount` props to `PayButton`

**File**: `src/components/pos/cart/CartPanel.tsx`

- Pass `subtotal`, `vatRate`, `vatAmount` to `PayButton`

## Technical Details

### PayButton new props:
```
subtotal: number
vatRate: number
vatAmount: number
```

### PayButton layout:
```text
| Subtotal         120.00 |
| VAT 15%           18.00 |
|-------------------------|
| [Clear]   [Confirm -> 138.00 SAR] |
```

### Files changed:
| File | Change |
|------|--------|
| `POSItemCard.tsx` | "CUSTOMIZE" -> "EDIT" |
| `ItemCard.tsx` | "CUSTOMIZE" -> "EDIT", icon to Settings2 |
| `CustomizeModal.tsx` | Remove "Customize:" prefix from header |
| `PayButton.tsx` | Add subtotal/VAT summary, change "Confirm & Pay" to "Confirm ->" |
| `CartPanel.tsx` | Pass subtotal, vatRate, vatAmount to PayButton |
