

# Cart Item Card Redesign

Based on the reference image, here are the 4 clear changes:

## 1. Remove gap between items, use centered dotted divider

- Remove `gap-3` from `CartItemList.tsx`
- Remove `rounded-2xl border shadow-sm` card styling from each `CartItemRow`
- Add a **75% width, center-aligned dotted line** between items (not after the last one)

## 2. Restructure layout: Name + unit price on left, controls center, total right

Rearrange the main row into a 12-column grid:

- **Col-5 (left)**: Item name (bold, top) and single unit price below it (smaller, muted)
- **Col-4 (center)**: Quantity controls ( - qty + )
- **Col-3 (right)**: Line total (right-aligned, bold)

## 3. Remove pencil edit icon, add red left-border marker for customized items

- Remove the `Pencil` icon button entirely
- For customized items, add a **4px red left border** on the card (like the reference image shows a red vertical bar on the left edge)

## 4. Clicking the entire card row opens the edit/customize modal

- Make the whole card row clickable via `onClick` that calls `onEditCustomization(item.id)`
- Add `cursor-pointer` and hover feedback
- Prevent click bubbling from the quantity +/- buttons so they still work independently

---

## Mockup UI

```text
+----------------------------------------------------------+
| Chicken Biryani       [ - ]  4  [ + ]          140.00    |
| 140.00                                                   |
+----------------------------------------------------------+
              - - - - - - - - - - - - -                      (75% dotted line)
+----------------------------------------------------------+
|RED| Chicken Biryani    [ - ]  1  [ + ]           35.00   |
|BAR| 35.00                                                |
|   |  -> Pepsi                              +3.00 SAR     |
|   |                                      * 38.00         |
+----------------------------------------------------------+
```

- Top item: no red bar (not customized), clean 3-column layout
- Bottom item: red left border (customized), modifications listed below, green dot total

---

## Technical Details

### Files changed

| File | Change |
|------|--------|
| `CartItem.tsx` | Remove card border/shadow, add grid cols layout, remove pencil icon, add red left border for customized, make row clickable |
| `CartItemList.tsx` | Remove `gap-3`, add dotted separator between items |

### CartItemRow structure (new):
```tsx
<div onClick={...} className="relative pl-3 py-3 cursor-pointer grid grid-cols-12 items-center">
  {/* Red marker */}
  {isCustomized && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-red-500" />}
  
  {/* Col-5: Name + unit price */}
  <div className="col-span-5">
    <span className="font-bold">{item.name}</span>
    <span className="text-sm text-muted-foreground">{item.basePrice.toFixed(2)}</span>
  </div>
  
  {/* Col-4: Qty controls */}
  <div className="col-span-4 flex items-center justify-center gap-1.5">
    <button>-</button> <span>{qty}</span> <button>+</button>
  </div>
  
  {/* Col-3: Line total */}
  <div className="col-span-3 text-right font-bold">
    {lineTotal.toFixed(2)}
  </div>
</div>
{/* Modification lines below the grid row */}
```

### CartItemList separator:
```tsx
{items.map((item, idx) => (
  <React.Fragment key={item.id}>
    <CartItemRow ... />
    {idx < items.length - 1 && (
      <div className="flex justify-center">
        <div className="w-3/4 border-b border-dotted border-gray-300" />
      </div>
    )}
  </React.Fragment>
))}
```
