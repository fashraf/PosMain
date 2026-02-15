
# POS Category Bar Redesign -- Premium Floating Home + Bouncy Pills

## What Changes

The CategoryBar on `/pos` gets a complete visual overhaul with a floating Dashboard home button, thicker/shorter selected pill with bouncy spring animation, and a premium dashed-border container.

---

## Visual Design

```text
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│                                                                           │
│  [Dashboard]     [All]  Vegetarian  Non-Veg  Drinks  Sheesha  Desserts  Fav  │
│   (Home icon)    (blue,                                          (star)  │
│   floating       thick)                                                  │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

### Key visual details:
- **Dashed border container** around the entire bar (matching app design language)
- **Dashboard button**: Appears on extreme left, slightly overlapping the bar top/bottom for a floating premium feel. Uses a `Home` icon with tooltip "Dashboard". Links back to `/` (main dashboard)
- **20% left offset**: Invisible left padding (~20% of bar width) between the Dashboard button and the first pill, pushing categories toward center-right
- **Selected pill (blue)**: Shorter text but thicker vertical padding (`py-3.5`), indigo/primary background, `rounded-full`, bold white text
- **Unselected pills**: Light grey background (`bg-slate-100`), dark text, thinner padding
- **Bouncy animation**: When switching categories, the selected pill uses a CSS spring/bounce keyframe animation (`animate-bounce-in`) -- quick scale from 0.85 to 1.05 back to 1.0
- **Favorites pill**: Star icon + "Favorites" label, same pill style

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/pos/category/CategoryBar.tsx` | Add Dashboard home button with `useNavigate`, add left spacer div for 20% offset, wrap in dashed border container |
| `src/components/pos/category/CategoryPill.tsx` | Update selected/unselected styles (thicker selected, lighter unselected), add bounce animation class when `isSelected` transitions |
| `src/index.css` | Add `@keyframes bounce-in` animation (scale 0.85 -> 1.05 -> 1.0, 400ms cubic-bezier spring) |

### Animation Keyframes (added to index.css or tailwind config)

```css
@keyframes bounce-in {
  0%   { transform: scale(0.85); }
  50%  { transform: scale(1.08); }
  75%  { transform: scale(0.97); }
  100% { transform: scale(1); }
}
```

Duration: 400ms with ease-out timing for a "super bouncy" feel. Applied via a `key` prop change on the pill so React re-mounts and re-triggers the animation on selection change.

### Dashboard Button
- Uses `react-router-dom`'s `useNavigate` to go to `/`
- Styled as a rounded square button with `Home` icon from lucide-react
- Positioned with negative margin (`-my-2`) to slightly overlap the bar border
- Has a `Tooltip` wrapper showing "Dashboard" on hover
- Subtle shadow for floating effect (`shadow-md`)

### CategoryPill Updates
- Selected: `bg-indigo-600 text-white py-3.5 px-5 font-bold shadow-sm` + bounce animation
- Unselected: `bg-slate-100 text-slate-600 py-2.5 px-5 font-medium hover:bg-slate-200`
- The bounce animation triggers via a CSS class `animate-[bounce-in_0.4s_ease-out]` applied only when `isSelected` is true, using a `key` that includes selection state to force re-mount
