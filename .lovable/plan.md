

# New Order Bell Sound + On/Off Toggle

## Overview
Play the uploaded bell sound (`opening-bell-421471.mp3`) whenever a new order arrives on the Kitchen Display. Add an on/off toggle switch in the status bar to mute/unmute the bell.

---

## 1. Copy Sound File to Project

Copy the uploaded MP3 to `public/sounds/new-order-bell.mp3` so it can be loaded by the browser's `Audio` API at runtime.

## 2. New Order Detection Logic

**File:** `src/pages/pos/KitchenDisplay.tsx`

- Track previously seen order IDs using a `useRef<Set<string>>`.
- On each render when `orders` changes, compare current order IDs against the previous set.
- If new IDs are found and bell is enabled, play the sound.
- Skip the very first load (so the bell does not ring for existing orders when the page opens).

```text
useRef: previousOrderIds (Set<string>)
useRef: isFirstLoad (boolean, starts true)
useEffect on [orders]:
  - if isFirstLoad, populate set and flip flag, return
  - find new IDs not in previous set
  - if any new IDs and bellEnabled -> play sound
  - update set
```

## 3. Bell On/Off Toggle in Status Bar

**File:** `src/components/pos/kitchen/KitchenStatusBar.tsx`

- Accept two new props: `bellEnabled: boolean` and `onToggleBell: () => void`
- Add a `Switch` component (from `@/components/ui/switch`) and a `Bell` / `BellOff` icon next to the clock on the right side of the status bar
- When toggled off, the icon changes to `BellOff` and dims; when on, shows `Bell` in amber

## 4. State Management

**File:** `src/pages/pos/KitchenDisplay.tsx`

- Add `useState<boolean>(true)` for `bellEnabled` (defaults to ON)
- Pass `bellEnabled` and toggle handler down to `KitchenStatusBar`
- The sound play logic checks `bellEnabled` before playing

## 5. Sound Playback

Use the browser's `HTMLAudioElement` API:
```text
const bellAudio = useRef(new Audio("/sounds/new-order-bell.mp3"));
bellAudio.current.play();
```

---

## Files Summary

| File | Changes |
|------|---------|
| `public/sounds/new-order-bell.mp3` | Copy uploaded MP3 here |
| `src/pages/pos/KitchenDisplay.tsx` | Add bell state, new-order detection logic, audio playback |
| `src/components/pos/kitchen/KitchenStatusBar.tsx` | Add bell toggle switch with Bell/BellOff icon |

