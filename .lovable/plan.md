

# Add "Order" Menu Item to Sidebar

## Summary
Add a prominent "Order" navigation link in the admin sidebar that opens the POS module at `/pos`. This provides quick access for staff to switch between admin functions and the ordering interface.

---

## Changes Required

### 1. Update AppSidebar.tsx

**Add ShoppingCart icon import:**
```typescript
import { ShoppingCart } from "lucide-react";
```

**Add Order item to mainNavItems array** (positioned prominently near the top):
```typescript
const mainNavItems = [
  { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "nav.order", url: "/pos", icon: ShoppingCart },  // NEW
  { titleKey: "nav.salesChannels", url: "/sales-channels", icon: Store },
  { titleKey: "nav.ingredients", url: "/inventory/ingredients", icon: Carrot },
];
```

---

### 2. Update Translations

**English (nav section):**
```typescript
nav: {
  // ... existing
  order: "Order",
}
```

**Arabic:**
```typescript
nav: {
  order: "طلب",
}
```

**Urdu:**
```typescript
nav: {
  order: "آرڈر",
}
```

---

## Visual Result

The sidebar will show:
```text
┌────────────────────────┐
│ [P] POS Admin          │
│     Management System  │
├────────────────────────┤
│ 📊 Dashboard           │
│ 🛒 Order          ← NEW│
│ 🏪 Sales Channels      │
│ 🥕 Ingredients         │
│ 📦 Inventory      ▼    │
│ 🔧 Maintenance    ▼    │
│ ...                    │
└────────────────────────┘
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/AppSidebar.tsx` | Add ShoppingCart icon import, add Order nav item |
| `src/lib/i18n/translations.ts` | Add `nav.order` translations for EN/AR/UR |

---

## Behavior Notes

1. Clicking "Order" navigates to `/pos` route
2. The POS module opens in its own full-screen layout (no sidebar)
3. To return to admin, user can use browser back or add a "Back to Admin" button in POS header (future enhancement)

