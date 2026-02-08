

# Cart Flash Animation: Green on Add, Red on Remove/Decrement

## Current Issue
- The green flash only works when adding from the item grid, not when pressing `+` in the cart
- No red flash on `-` or remove
- Re-adding the same item doesn't re-trigger the animation (same ID, CSS animation doesn't restart)

## Plan (4 points)

### 1. Track highlight color (green vs red)

Change `highlightedItemId` from a simple string to an object `{ id: string, color: 'green' | 'red' }` in `POSMain.tsx`. This lets us distinguish add (green) from remove/decrement (red).

### 2. Trigger green flash on every add/increment

- Wrap `cart.incrementItem` in `POSMain.tsx` so pressing `+` in cart also triggers the green highlight
- Use a counter or toggle trick to force CSS animation restart on repeated adds of the same item (change the React `key` on the row)

### 3. Trigger red flash on every decrement/remove

- Wrap `cart.decrementItem` and `cart.removeItem` in `POSMain.tsx` to set the highlight with `color: 'red'`
- For remove (item disappears), flash briefly before removing -- or skip since the item is gone

### 4. Add red flash CSS animation

Add a `cart-flash-red` keyframe in `index.css` (red-100 -> transparent) and a corresponding class.

---

## Technical Details

### State shape change (`POSMain.tsx`)
```typescript
// Old
const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

// New
const [highlight, setHighlight] = useState<{ id: string; color: 'green' | 'red'; tick: number } | null>(null);
```
The `tick` counter forces React to re-render a new `key` so the CSS animation restarts even for the same item.

### Wrapped handlers (`POSMain.tsx`)
```typescript
const triggerHighlight = (id: string, color: 'green' | 'red') => {
  clearTimeout(highlightTimer.current);
  setHighlight(prev => ({ id, color, tick: (prev?.tick ?? 0) + 1 }));
  highlightTimer.current = setTimeout(() => setHighlight(null), 2000);
};

const handleIncrement = (itemId: string) => {
  cart.incrementItem(itemId);
  triggerHighlight(itemId, 'green');
};

const handleDecrement = (itemId: string) => {
  cart.decrementItem(itemId);
  triggerHighlight(itemId, 'red');
};

const handleRemove = (itemId: string) => {
  triggerHighlight(itemId, 'red');
  setTimeout(() => cart.removeItem(itemId), 300); // brief flash then remove
};
```

### Props flow
- `CartPanel` receives `highlight` object instead of just `highlightedItemId`
- `CartItemList` passes `isHighlighted` and `highlightColor` to each `CartItemRow`
- `CartItemRow` uses a dynamic `key` suffix from `tick` to force animation restart

### New CSS (`index.css`)
```css
@keyframes cart-flash-red {
  0% { background-color: rgb(254 202 202); }   /* red-200 */
  100% { background-color: transparent; }
}
.animate-cart-flash-red {
  animation: cart-flash-red 2s ease-out forwards;
}
```

### `CartItemRow` class logic
```tsx
className={cn(
  "relative pl-4 pr-3 py-3 ...",
  isHighlighted && highlightColor === 'green' && "animate-cart-flash",
  isHighlighted && highlightColor === 'red' && "animate-cart-flash-red",
)}
```

### Files changed

| File | Change |
|------|--------|
| `POSMain.tsx` | New highlight state shape, wrapped increment/decrement/remove handlers |
| `CartPanel.tsx` | Accept `highlight` object, pass to `CartItemList` |
| `CartItemList.tsx` | Accept highlight, pass `isHighlighted` + `highlightColor` + key to rows |
| `CartItem.tsx` | Accept `highlightColor` prop, apply correct animation class |
| `index.css` | Add `cart-flash-red` keyframes and class |

