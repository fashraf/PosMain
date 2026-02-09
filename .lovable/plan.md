

# Aesthetic Polish for Checkout Modal

## What Changes

Soften the overall look with pastel tones, rounded corners, dotted separators, subtle gradients, and gentle shadows. Add a contextual hint next to the "Submit Order" button.

## Technical Details

### 1. CheckoutModal.tsx (Main Container + Footer)
- Modal header: add a subtle bottom border with dotted style, softer title color
- Column dividers: replace solid `divide-x` with custom dotted vertical borders
- Middle column bg: softer tint (`bg-violet-50/30` instead of `bg-muted/20`)
- Footer: dotted top border, softer background tint
- **Submit hint**: Add a small muted text line below/next to the Submit button like "Review items, select type and payment" that dynamically shows what's missing (e.g., "Enter tendered amount" or "Add delivery address")
- Clear Order button: softer outline with rounded-xl

### 2. OrderReviewColumn.tsx
- Section header: add a small decorative dot/circle before "Order Review"
- Item rows: add `rounded-lg` hover with very soft lavender bg (`hover:bg-violet-50/50`)
- Item dividers: already dotted -- keep, make slightly lighter color
- Totals section: rounded-lg card with soft gradient bg (`bg-gradient-to-r from-violet-50/50 to-transparent`), dotted top border
- TOTAL line: slightly softer primary color

### 3. OrderTypeColumn.tsx
- Type cards: increase border-radius to `rounded-2xl`, add soft shadow on selected (`shadow-md shadow-primary/10`)
- Unselected cards: lighter dotted border (`border-violet-200/60`)
- Selected card: soft gradient bg (`bg-gradient-to-br from-primary/5 to-violet-50`)
- Customer details section: wrap in a dotted-border rounded card with subtle bg
- Input fields: rounded-xl with softer border

### 4. PaymentColumn.tsx
- Total display card: soft gradient (`bg-gradient-to-br from-violet-50 to-blue-50/30`), rounded-2xl, dotted border
- Method buttons: rounded-2xl, softer dotted borders, gentle shadow on selected
- Quick-add buttons: rounded-xl, softer styling
- Change display: rounded-xl, softer green/red pastel tones
- Card/Pay Later info boxes: rounded-xl with dotted border

### 5. OrderConfirmation.tsx
- Success icon: wrap in a soft gradient circle
- Order number: softer primary shade
- Buttons: rounded-xl with gentle shadow

### 6. Submit Hint Logic
Dynamic hint text next to submit button based on current state:
- Cart empty: "Add items to your cart"
- Cash + tendered < total: "Enter tendered amount >= total"
- Delivery + no address: "Enter delivery address"
- All good: "Ready to submit!"

Displayed as a small italic muted text to the left of the Submit button.
