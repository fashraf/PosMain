

# Sidebar Restructure, TopBar Redesign & User Profile Panel

## Overview

This plan covers three major changes:
1. **Sidebar** -- Complete restructuring to match the new menu hierarchy with collapsible modules
2. **TopBar** -- Remove branch selector dropdown, add user profile avatar/dropdown with rich menu (like the reference image)
3. **User Profile Page** -- New `/profile` page with Account, Role, Change Password, Activities, Dark Mode, Alerts, Quick Links, and Language sections

---

## Part 1: Sidebar Restructure

The sidebar menu items will be reorganized into the following hierarchy. All top-level modules are always visible; sub-items collapse by default and expand on click. Active items get a left accent bar (4px indigo border) and bold text.

```text
Dashboard              (LayoutDashboard icon)
Orders                 (ShoppingCart icon)  -- collapsible
  - Order List
  - Kitchen
Menu                   (UtensilsCrossed icon)  -- collapsible
  - Categories
  - Subcategories
  - Items
  - Item Pricing
  - Serving Times
  - Allergens
  - Item Types
Inventory              (Package icon)  -- collapsible
  - Ingredients
  - Stock Operations   -- nested collapsible (Issue, Transfer, Adjustment)
  - Batch & Expiry
  - Storage Groups
  - Units
  - Reports & Alerts
Finance                (TrendingUp icon)  -- collapsible
  - Overview
  - Revenue Report
  - VAT Report
  - Expenses & Profit
  - Sales Channels
Staff                  (Users icon)  -- collapsible
  - Users
  - Role Master
  - Employee Types
  - Shift Management
Settings               (Settings icon)  -- collapsible
  - Branches
  - Print Templates
  - Classification Types
  - Maintenance
Audit                  (FileText icon)  -- standalone (placeholder page)
```

### Visual styling
- Active state: 4px left indigo border + lighter background (`bg-sidebar-accent`) + bold text + primary icon color
- Hover: subtle `bg-sidebar-accent/50` transition
- Sub-items indented with dotted left border line for visual hierarchy
- Collapse/expand uses ChevronDown with rotation animation
- Mini-sidebar mode (icon-only) already supported via existing `collapsible="icon"` prop

---

## Part 2: TopBar Redesign

### Remove
- Branch selector dropdown (the `Select` component with "All Branches")

### Keep
- SidebarTrigger (hamburger)

### New right-side layout (matching reference image)
Left side: SidebarTrigger only
Right side (left to right):
1. **Language switcher** -- compact globe icon with current language code (e.g., "US")
2. **Grid/layout toggle** -- small icon buttons (optional, decorative)
3. **User avatar + name** -- circular avatar with green online ring, clicking opens a rich dropdown

### User dropdown menu items
- **Profile header**: Avatar, full name, email, role badge
- **My Profile** -- links to `/profile`
- **Change Password** -- links to `/profile#password`
- **Dark Mode** -- inline toggle switch
- **Language** -- sub-menu or links to `/profile#language`
- Separator
- **Logout** -- destructive action

---

## Part 3: User Profile Page (`/profile`)

A new full page accessible from the user dropdown. Organized as a tabbed or sectioned card layout:

### Sections

**1. Account Overview** (read-only card)
- Full name, email, role badge, employee ID (from profiles table), join date, last login
- Profile photo placeholder (circular avatar)
- "Edit" button for non-sensitive fields (display name, photo)

**2. Role & Permissions** (read-only card)
- Current role name with colored badge
- Description of access level
- List of granted permissions (fetched from `role_permissions` if available, otherwise static display)

**3. Change Password** (interactive card)
- Current password, new password, confirm new password fields
- Password strength meter
- Calls existing `reset-password` edge function
- Success message with auto-redirect

**4. Activities** (scrollable card)
- Timeline of recent actions (placeholder/mock data for now)
- Filter by date range
- Shows: login events, order actions, clock-in/out

**5. Dark Mode** (toggle card)
- Light/Dark toggle switch
- Uses `next-themes` (already installed) to apply theme
- Persists preference

**6. Alerts / Notifications** (settings card)
- Toggle switches for notification types
- Alert: "Order not closed for 30+ min"
- Alert: "New shift assignment"
- View recent alerts list

**7. Quick Links** (grid of shortcut cards)
- Dashboard, Order, Order List, Kitchen
- Role-based visibility
- Icon + label, clickable navigation

**8. Language** (selector card)
- Reuses the existing language selector pattern from Settings page
- 3 language cards (English, Arabic, Urdu)

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Profile.tsx` | Main profile page with all sections |
| `src/components/profile/AccountCard.tsx` | Read-only account info card |
| `src/components/profile/RoleCard.tsx` | Role & permissions display |
| `src/components/profile/ChangePasswordCard.tsx` | Password change form |
| `src/components/profile/ActivitiesCard.tsx` | Activity timeline (mock) |
| `src/components/profile/DarkModeCard.tsx` | Theme toggle card |
| `src/components/profile/AlertsCard.tsx` | Notification preferences |
| `src/components/profile/QuickLinksCard.tsx` | Shortcut navigation grid |
| `src/components/profile/LanguageCard.tsx` | Language selector card |

### Files to Update

| File | Changes |
|------|---------|
| `src/components/AppSidebar.tsx` | Complete restructure of nav items to match new hierarchy |
| `src/components/TopBar.tsx` | Remove branch selector, add avatar + rich dropdown |
| `src/components/AdminLayout.tsx` | Remove `selectedBranch` state (no longer in TopBar) |
| `src/App.tsx` | Add `/profile` route, add `/audit` placeholder route |
| `src/index.css` | Dark mode variables already exist; ensure sidebar active state styles |

### Routing changes
- New route: `/profile` -- Profile page
- New route: `/audit` -- Placeholder page (coming soon)
- Existing routes for menu items that moved groups (e.g., Categories from `/maintenance/categories` stays the same URL, just sidebar grouping changes)

### Sidebar URL mapping for new groups
- **Orders**: `/pos` (Order), `/pos/orders` (Order List), `/pos/kitchen` (Kitchen)
- **Menu**: `/maintenance/categories`, `/maintenance/subcategories`, `/items`, `/item-pricing`, `/maintenance/serving-times`, `/maintenance/allergens`, `/maintenance/item-types`
- **Inventory**: `/inventory/ingredients`, stock ops sub-menu, `/inventory/batch-expiry`, `/maintenance/storage-types`, `/maintenance/units`, `/inventory/reports`
- **Finance**: `/finance`, `/finance/revenue`, `/finance/vat`, `/finance/expenses`, `/maintenance/sales-channels`
- **Staff**: `/users`, `/roles`, `/maintenance/employee-types`, `/maintenance/shifts`
- **Settings**: `/branches`, `/maintenance/print-templates`, `/maintenance/classification-types`, `/settings` (general maintenance)
- **Audit**: `/audit` (placeholder)

### Dark mode integration
- Wrap the app with `ThemeProvider` from `next-themes`
- Add toggle in profile page and TopBar dropdown
- CSS variables for `.dark` class already defined in `index.css`

