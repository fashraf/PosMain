
# Restaurant POS System - Tablet-First Implementation Plan

## Executive Summary
Build a dedicated tablet-optimized Point of Sale module for restaurant waiters and cashiers. This is a **new standalone module** within the existing admin system, accessible via `/pos` route, with its own layout optimized for 10-13 inch landscape tablets.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         POS MAIN SCREEN                             │
├──────────────────────────────────────┬──────────────────────────────┤
│           LEFT PANEL (70%)           │    RIGHT PANEL (30%)         │
│  ┌────────────────────────────────┐  │  ┌────────────────────────┐  │
│  │      CATEGORY BAR (STICKY)     │  │  │     CART HEADER        │  │
│  │ [Breakfast][Lunch][Dinner][⭐]  │  │  │     Order #1234        │  │
│  └────────────────────────────────┘  │  └────────────────────────┘  │
│  ┌────────────────────────────────┐  │  ┌────────────────────────┐  │
│  │                                │  │  │                        │  │
│  │      SCROLLABLE ITEM GRID      │  │  │    CART ITEMS LIST     │  │
│  │    (3-4 cards per row)         │  │  │    (Scrollable)        │  │
│  │                                │  │  │                        │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐   │  │  │  Pepsi x1        1.00  │  │
│  │  │ Item │ │ Item │ │ Item │   │  │  │  (c) Masala x2  40.00  │  │
│  │  │ Card │ │ Card │ │ Card │   │  │  │    +Cheese            │  │
│  │  └──────┘ └──────┘ └──────┘   │  │  │    -Onion             │  │
│  │                                │  │  │                        │  │
│  └────────────────────────────────┘  │  └────────────────────────┘  │
│                                      │  ┌────────────────────────┐  │
│                                      │  │  Subtotal       41.00  │  │
│                                      │  │  VAT 15%         6.15  │  │
│                                      │  │  ─────────────────────  │  │
│                                      │  │  TOTAL          47.15  │  │
│                                      │  └────────────────────────┘  │
│                                      │  ┌────────────────────────┐  │
│                                      │  │    [ PAY 47.15 ]       │  │
│                                      │  │    (Sticky Button)     │  │
│                                      │  └────────────────────────┘  │
└──────────────────────────────────────┴──────────────────────────────┘
```

---

## Database Schema Changes

### New Tables Required

#### 1. `pos_menu_items` - POS-specific item configuration
```sql
CREATE TABLE pos_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT,
  name_ur TEXT,
  description_en TEXT,
  category_id UUID REFERENCES maintenance_categories(id),
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_customizable BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. `pos_item_ingredients` - Ingredients that can be modified
```sql
CREATE TABLE pos_item_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  ingredient_name_en TEXT NOT NULL,
  ingredient_name_ar TEXT,
  extra_price DECIMAL(10,2) DEFAULT 0,
  is_removable BOOLEAN DEFAULT true,
  is_default_included BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3. `pos_item_replacements` - Replacement options (e.g., drinks)
```sql
CREATE TABLE pos_item_replacements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  replacement_group TEXT NOT NULL, -- e.g., "Drink", "Side"
  replacement_name_en TEXT NOT NULL,
  replacement_name_ar TEXT,
  price_difference DECIMAL(10,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 4. `pos_orders` - Order header
```sql
CREATE TABLE pos_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  order_type TEXT CHECK (order_type IN ('pay_order', 'delivery', 'takeaway', 'dine_in')),
  customer_mobile TEXT,
  customer_name TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  vat_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  payment_method TEXT,
  taken_by UUID REFERENCES profiles(id),
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 5. `pos_order_items` - Order line items with customization
```sql
CREATE TABLE pos_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES pos_orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES pos_menu_items(id),
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  customization_json JSONB, -- Stores extras, removals, replacements
  customization_hash TEXT, -- For matching identical customizations
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## File Structure

```text
src/
├── pages/
│   └── pos/
│       ├── POSMain.tsx              # Main split-screen layout
│       ├── POSCheckout.tsx          # Checkout modal/drawer
│       └── index.ts
│
├── components/
│   └── pos/
│       ├── layout/
│       │   ├── POSLayout.tsx        # Tablet-optimized wrapper (no sidebar)
│       │   ├── SplitPanelContainer.tsx
│       │   └── index.ts
│       │
│       ├── category/
│       │   ├── CategoryBar.tsx      # Horizontal scrolling pills
│       │   ├── CategoryPill.tsx     # Individual category button
│       │   └── index.ts
│       │
│       ├── items/
│       │   ├── ItemGrid.tsx         # Grid container
│       │   ├── ItemCard.tsx         # Individual item card
│       │   ├── SimpleItemCard.tsx   # Non-customizable item
│       │   ├── CustomizableItemCard.tsx # With Customize button
│       │   └── index.ts
│       │
│       ├── cart/
│       │   ├── CartPanel.tsx        # Right sidebar cart
│       │   ├── CartHeader.tsx       # Order info
│       │   ├── CartItemList.tsx     # Scrollable items
│       │   ├── CartItem.tsx         # Individual cart row
│       │   ├── CartTotals.tsx       # Subtotal, VAT, Total
│       │   ├── PayButton.tsx        # Sticky pay button
│       │   └── index.ts
│       │
│       ├── customization/
│       │   ├── CustomizeDrawer.tsx  # Bottom sheet modal
│       │   ├── DrawerHeader.tsx     # Item name + image
│       │   ├── IngredientSection.tsx # Remove/Extra toggles
│       │   ├── IngredientCard.tsx   # Individual ingredient
│       │   ├── ReplacementSection.tsx # Radio group replacements
│       │   ├── ReplacementCard.tsx  # Selectable replacement
│       │   ├── PriceSummary.tsx     # Live price calculation
│       │   └── index.ts
│       │
│       ├── checkout/
│       │   ├── CheckoutDrawer.tsx   # Full checkout modal
│       │   ├── OrderSummary.tsx     # Final order review
│       │   ├── OrderTypeSelector.tsx # Pay/Delivery/Takeaway/Dine-In
│       │   ├── CustomerForm.tsx     # Mobile + Name inputs
│       │   ├── PaymentOptions.tsx   # Pay Now / Pay Later
│       │   ├── OrderTakenBy.tsx     # User dropdown
│       │   └── index.ts
│       │
│       └── shared/
│           ├── TouchButton.tsx      # 48x48 min touch target
│           ├── ItemImage.tsx        # 40x40 with placeholder
│           └── index.ts
│
├── hooks/
│   └── pos/
│       ├── usePOSCart.ts           # Cart state management
│       ├── usePOSItems.ts          # Items query hook
│       ├── usePOSCategories.ts     # Categories query hook
│       ├── useCustomization.ts     # Customization state
│       ├── useCheckout.ts          # Checkout flow
│       └── index.ts
│
└── lib/
    └── pos/
        ├── cartUtils.ts            # Hash generation, merging logic
        ├── priceCalculations.ts    # VAT, totals
        └── types.ts                # TypeScript interfaces
```

---

## Component Specifications

### 1. POSLayout.tsx
- Full-screen layout without admin sidebar
- Fixed landscape orientation optimization
- No page reloads - single page application
- Touch-optimized scrolling

### 2. CategoryBar.tsx
```text
┌─────────────────────────────────────────────────────────────────┐
│ ← [Breakfast] [Lunch] [Dinner] [Drinks] [Desserts] [⭐ Favorites] → │
└─────────────────────────────────────────────────────────────────┘
```
- Height: 56px minimum
- Horizontal scroll with swipe
- Active state: filled primary color
- Inactive: outlined

### 3. ItemCard.tsx
```text
SIMPLE ITEM:
┌────────────────────────────────┐
│ [40px IMG]   🍹 Pepsi          │
│              Rs. 1.00          │
│                                │
│     [ ➕ ADD ]  (56px height)  │
└────────────────────────────────┘

CUSTOMIZABLE ITEM:
┌────────────────────────────────┐
│ [40px IMG]   🥘 Masala Paneer  │
│              Rs. 228.00        │
│                                │
│ [ ➕ ADD ]    [ ✏️ CUSTOMIZE ]  │
└────────────────────────────────┘
```
- Card min-width: 200px
- Button height: 56px minimum
- ADD: Primary filled
- CUSTOMIZE: Secondary outlined
- Image: 40x40, rounded-lg, object-cover

### 4. CartItem.tsx
```text
┌─────────────────────────────────────────────┐
│ Pepsi              [ - ]  1  [ + ]    1.00  │
├─────────────────────────────────────────────┤
│ (c) Masala Paneer  [ - ]  2  [ + ]   40.00  │
│     + Cheese (+7.00)                        │
│     - Onion                                 │
│     Replace: Coke                           │
└─────────────────────────────────────────────┘
```
- (c) indicator for customized items
- Inline quantity controls
- Click to edit customization
- Swipe to delete (optional)

### 5. CustomizeDrawer.tsx
Bottom sheet using `vaul` Drawer component:
- 80% viewport height
- Scrollable content area
- Sticky footer with "Add to Cart" button
- Live price updates

### 6. IngredientCard.tsx
```text
┌──────────────────────────────────────────┐
│ 🧀 Cheese                                │
│    Rs. 7.00                              │
│                                          │
│ [ ➖ REMOVE ]          [ ➕ EXTRA ]       │
│  (red when active)    (green when active)│
└──────────────────────────────────────────┘
```
- Mutually exclusive states
- Visual feedback: red outline for REMOVE, green for EXTRA
- Touch targets: 48x48 minimum

### 7. ReplacementCard.tsx
```text
UNSELECTED:                    SELECTED:
┌──────────────┐              ┌──────────────┐
│ 🥤 Pepsi     │              │ 🥤 Coke ✔️   │ ← Green bg
│ Rs. 0.00     │              │ +Rs. 0.00    │   White text
└──────────────┘              └──────────────┘
```
- Radio behavior (single selection)
- Entire card clickable
- Selected: green background, white text, checkmark

---

## State Management

### Cart Context (usePOSCart.ts)
```typescript
interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  customization: {
    extras: Array<{ name: string; price: number }>;
    removals: string[];
    replacement?: { name: string; priceDiff: number };
  };
  customizationHash: string; // MD5 of sorted customization
  lineTotal: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}
```

### Customization Merging Logic
```typescript
// Same item + same customization = merge quantities
function addToCart(newItem: CartItem, cart: CartItem[]) {
  const existing = cart.find(
    item => item.menuItemId === newItem.menuItemId 
         && item.customizationHash === newItem.customizationHash
  );
  
  if (existing) {
    existing.quantity += newItem.quantity;
    existing.lineTotal = existing.quantity * calculateItemPrice(existing);
  } else {
    cart.push(newItem);
  }
}
```

---

## Routing Changes

Update `src/App.tsx`:
```typescript
// Add new POS route (outside AdminLayout)
<Route path="/pos" element={
  <ProtectedRoute>
    <POSLayout>
      <POSMain />
    </POSLayout>
  </ProtectedRoute>
} />
```

---

## Styling Guidelines

### Touch Target Enforcement
```css
.touch-target {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 16px;
}
```

### Button Styles
```css
.pos-btn-primary {
  @apply h-14 min-h-[56px] text-base font-medium;
  @apply bg-primary text-primary-foreground;
  @apply active:scale-95 transition-transform;
}

.pos-btn-secondary {
  @apply h-14 min-h-[56px] text-base font-medium;
  @apply border-2 border-primary bg-transparent text-primary;
}
```

### Item Card Grid
```css
.item-grid {
  @apply grid gap-4;
  @apply grid-cols-2 md:grid-cols-3 lg:grid-cols-4;
}

.item-card {
  @apply bg-card border rounded-xl p-4;
  @apply min-w-[180px];
  @apply active:bg-accent/50 transition-colors;
}
```

---

## Implementation Phases

### Phase 1: Foundation (Priority: HIGH)
1. Database migrations for all POS tables
2. POSLayout.tsx - tablet-optimized wrapper
3. SplitPanelContainer.tsx - 70/30 layout
4. Basic routing setup

### Phase 2: Category & Items (Priority: HIGH)
1. CategoryBar.tsx with horizontal scroll
2. ItemGrid.tsx with responsive columns
3. ItemCard.tsx (simple + customizable variants)
4. usePOSItems.ts and usePOSCategories.ts hooks
5. ItemImage.tsx with lazy loading + placeholder

### Phase 3: Cart Functionality (Priority: HIGH)
1. usePOSCart.ts context/hook
2. CartPanel.tsx layout
3. CartItem.tsx with quantity controls
4. CartTotals.tsx with VAT calculation
5. PayButton.tsx sticky footer

### Phase 4: Customization (Priority: MEDIUM)
1. CustomizeDrawer.tsx using vaul
2. IngredientSection.tsx with toggle logic
3. ReplacementSection.tsx with radio behavior
4. PriceSummary.tsx live calculation
5. Hash generation for customization matching

### Phase 5: Checkout (Priority: MEDIUM)
1. CheckoutDrawer.tsx full-screen modal
2. OrderSummary.tsx review list
3. OrderTypeSelector.tsx tab group
4. CustomerForm.tsx mobile + name
5. PaymentOptions.tsx pay now/later
6. Order creation API integration

### Phase 6: Polish (Priority: LOW)
1. Favorites filtering
2. Search functionality
3. Order history view
4. Receipt printing integration
5. Offline support (PWA)

---

## Translation Keys to Add

```typescript
pos: {
  title: "Point of Sale",
  addToCart: "Add to Cart",
  customize: "Customize",
  cart: "Cart",
  emptyCart: "Your cart is empty",
  subtotal: "Subtotal",
  vat: "VAT",
  total: "Total",
  pay: "Pay",
  remove: "Remove",
  extra: "Extra",
  replacement: "Replace",
  checkout: "Checkout",
  orderType: "Order Type",
  payOrder: "Pay & Order",
  delivery: "Delivery",
  takeaway: "Take Away",
  dineIn: "Dine-In",
  customerMobile: "Mobile Number",
  customerName: "Customer Name",
  payNow: "Pay Now",
  payLater: "Pay Later",
  orderTakenBy: "Order Taken By",
  placeOrder: "Place Order",
  quantity: "Qty",
  favorites: "Favorites",
  customized: "Customized",
  basePrice: "Base Price",
  extras: "Extras",
  itemTotal: "Item Total",
}
```

---

## Performance Considerations

1. **Lazy Loading Images**: Use `loading="lazy"` and intersection observer
2. **Virtualized Lists**: Consider react-virtual for long item grids
3. **Optimistic Updates**: Update cart UI immediately, sync in background
4. **Memoization**: useMemo for filtered items, useCallback for handlers
5. **Code Splitting**: Dynamic imports for customization drawer

---

## Summary of Files to Create

| Category | Files | Count |
|----------|-------|-------|
| Pages | POSMain.tsx, POSCheckout.tsx | 2 |
| Layout Components | POSLayout.tsx, SplitPanelContainer.tsx | 2 |
| Category Components | CategoryBar.tsx, CategoryPill.tsx | 2 |
| Item Components | ItemGrid.tsx, ItemCard.tsx, SimpleItemCard.tsx, CustomizableItemCard.tsx | 4 |
| Cart Components | CartPanel.tsx, CartHeader.tsx, CartItemList.tsx, CartItem.tsx, CartTotals.tsx, PayButton.tsx | 6 |
| Customization Components | CustomizeDrawer.tsx, DrawerHeader.tsx, IngredientSection.tsx, IngredientCard.tsx, ReplacementSection.tsx, ReplacementCard.tsx, PriceSummary.tsx | 7 |
| Checkout Components | CheckoutDrawer.tsx, OrderSummary.tsx, OrderTypeSelector.tsx, CustomerForm.tsx, PaymentOptions.tsx, OrderTakenBy.tsx | 6 |
| Shared Components | TouchButton.tsx, ItemImage.tsx | 2 |
| Hooks | usePOSCart.ts, usePOSItems.ts, usePOSCategories.ts, useCustomization.ts, useCheckout.ts | 5 |
| Utilities | cartUtils.ts, priceCalculations.ts, types.ts | 3 |
| **Total** | | **39 files** |

### Database Migrations
- 5 new tables with RLS policies
- Seed data for testing

### Route Updates
- App.tsx routing modifications
- Translation additions
