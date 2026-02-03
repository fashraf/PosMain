
# POS Admin Application - Phase 1 Prototype

## Overview
A modern, multi-location restaurant POS admin system with full internationalization (English, Arabic, Urdu), role-based access, and a hybrid management approach where HQ sets defaults and branches can override.

---

## Design System
- **Primary**: Purple (#9b87f5)
- **Dark**: Charcoal (#221F26)
- **Style**: Modern minimal with soft grays, white backgrounds, subtle shadows
- **Typography**: Inter font
- **Layout**: Card-based with clean spacing

---

## 1. Application Shell & Navigation
**Left Sidebar** with collapsible navigation:
- Dashboard
- Sales Channels
- Ingredients
- Items
- Item Pricing
- Settings

**Top Bar**:
- Language switcher (EN/AR/UR) with flag icons
- Branch selector dropdown
- User profile with role indicator

**RTL Support**: Automatic layout flip for Arabic

---

## 2. Authentication & Roles
**Login Page**:
- Email/password authentication
- Clean purple-accented form

**Role Structure**:
- **Admin**: Full access to all locations
- **Manager**: Access to assigned branch(es)
- **Cashier**: View-only access (for future POS)

---

## 3. Language & Localization Screen
**Language Selector Component**:
- Three language tiles (English, العربية, اردو)
- Visual confirmation of selection
- Instant UI direction change for RTL

**Technical**: All text via i18n keys, localStorage persistence

---

## 4. Sales Channel Management
**Table View**:
- Channel name (In-Store, Zomato, Swiggy, etc.)
- Status toggle (Active/Inactive)
- Icon indicator
- Edit/Delete actions

**Add/Edit Modal**:
- Channel name (multilingual input)
- Icon selection
- Status toggle

---

## 5. Ingredient Management
**List View** (filterable table):
- Ingredient name
- Current quantity & unit
- Cost per unit
- Low stock alert threshold
- "Can sell individually" badge
- "Can add as extra" badge

**Add/Edit Form**:
- Name (multilingual)
- Unit type (kg, g, pieces, liters)
- Cost per unit
- Current stock quantity
- Alert threshold
- Toggle: Can be sold individually
- Toggle: Can be added as extra (with extra cost field)

---

## 6. Item Management
**Grid/List Toggle View**:
- Item image thumbnail
- Name
- Type badge (Edible/Non-Edible)
- Base cost
- Status (Active/Inactive/Out of Stock)

**Add/Edit Form**:
- Name (multilingual)
- Description
- Type selector (Edible/Non-Edible)
- Image upload with preview
- Base cost
- Status dropdown

---

## 7. Item-Ingredient Mapping
**Nested within Item Detail**:
- List of linked ingredients per item
- For each ingredient:
  - Quantity used per item
  - "Can remove" toggle (customer can ask for no onion)
  - "Can add extra" toggle
  - Extra cost & maximum extra quantity

**Visual Builder**: Drag-drop style ingredient cards

---

## 8. Item Pricing per Sales Channel
**Price Matrix Grid**:
- Rows: All items
- Columns: All active sales channels
- Inline editable price cells
- Visual indicator if price differs from base cost
- Bulk edit option for quick updates

---

## Backend Setup (Lovable Cloud)
- **Tables**: users, user_roles, branches, sales_channels, ingredients, items, item_ingredients, item_channel_pricing
- **RLS Policies**: Role-based access with branch filtering
- **Edge Functions**: For complex operations

