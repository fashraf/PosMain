

# Fix Foreign Key Error and Add Order Complete Page

## Problem

1. **Foreign key error**: The `pos_order_items.menu_item_id` column has a foreign key pointing to the `pos_menu_items` table, but the app actually fetches items from the `items` table. When inserting order items, the item IDs from `items` don't exist in `pos_menu_items`, causing the constraint violation.

2. **Post-submit experience**: Currently the order confirmation is shown inside the modal. The request is to navigate to a dedicated `/pos/order-complete` page that shows:
   - For new orders: "New Order Created: Order #112318"
   - For updates: "Order #112318 Updated" with a change summary (items added/removed)

## Technical Details

### 1. Database Migration -- Fix Foreign Key

Drop the existing FK on `pos_order_items.menu_item_id` that references `pos_menu_items` and re-create it to reference the `items` table instead.

```sql
ALTER TABLE public.pos_order_items
  DROP CONSTRAINT pos_order_items_menu_item_id_fkey;

ALTER TABLE public.pos_order_items
  ADD CONSTRAINT pos_order_items_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES public.items(id);
```

### 2. New Page: `/pos/order-complete`

Create `src/pages/pos/OrderComplete.tsx` that reads order data from route state (passed via `useNavigate`).

**Displays:**
- Success icon and "New Order Created" heading
- Order number prominently (#112318)
- Summary table of ordered items (name, qty, unit price, line total)
- Order totals (subtotal, VAT, grand total)
- Order type and payment method badges
- Action buttons: "New Order" (navigates back to `/pos`), "Print Receipt" (disabled placeholder)

**For future update support**, the page will accept a `mode` flag (`"new"` or `"update"`) and an optional `changes` array via route state, enabling display of:
- "Order #112318 Updated"
- "Added 2 items: Mango Bite, Curd"
- "Removed 1 item: Pepsi"

### 3. Update CheckoutModal -- Navigate Instead of Showing In-Modal Confirmation

After successful order submission, instead of setting `orderResult` state, use `useNavigate` to redirect to `/pos/order-complete` with order data in route state:

```typescript
navigate("/pos/order-complete", {
  state: {
    mode: "new",
    orderNumber: order.order_number,
    items: cart.items,
    subtotal: cart.subtotal,
    vatAmount: cart.vatAmount,
    total: cart.total,
    orderType: formData.orderType,
    paymentMethod: formData.paymentMethod,
  }
});
```

Remove the in-modal `OrderConfirmation` component usage and the `orderResult` state.

### 4. Add Route in App.tsx

Add a new route under the POS layout:

```
/pos/order-complete -> OrderComplete (wrapped in POSLayout + ProtectedRoute)
```

### 5. Files to Create / Edit

| File | Action |
|------|--------|
| Database migration | Drop + re-create FK on `pos_order_items.menu_item_id` to reference `items` |
| `src/pages/pos/OrderComplete.tsx` | **NEW** -- order complete page with summary |
| `src/components/pos/checkout/CheckoutModal.tsx` | Remove in-modal confirmation, navigate to new page on success |
| `src/App.tsx` | Add `/pos/order-complete` route |
| `src/pages/pos/index.ts` | Export new page |

