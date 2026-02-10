
# User Form Page: Compact Overhaul + Fixes

## Overview

Fix branch fetching, restructure sections, add section navigation tabs with completion indicators, make nationality a dropdown, add email field, auto-focus on validation errors, and reduce all margins to maximum 5px for a truly compact layout.

---

## Issues to Fix

1. **Branches don't load** -- The `branches` table exists but has no data rows. The form needs to show a helpful empty state and/or allow the user to add branches. The query itself is correct (`supabase.from("branches").select("id, name").eq("is_active", true)`) but the table is empty.
2. **Security section** -- Move into "Employment & Access" card
3. **Status section** -- Move into "Profile Information" card
4. **Email field** -- Add to Profile Information (not mandatory)
5. **Nationality** -- Change from text Input to a Select dropdown with options: Saudi, Indian, Egyptian, Bangladeshi
6. **Focus on error** -- On validation failure, scroll to and focus the first field with an error
7. **Section navigation tabs** -- Add a sticky `SectionNavigationBar` on the right column showing completion status (green check) for each section
8. **Compact margins** -- Reduce all `space-y-3` to `space-y-1.5`, all `gap-3` to `gap-1.5`, and `p-4` to `p-2` everywhere

---

## Section Restructure

### Left Column (col-span-8) -- 3 sections instead of 5:

**1. Profile Information** (purple)
- Image upload + Full Name + Mobile + Email (new, optional) + Age + Nationality (dropdown) + **Status (Active/Inactive)** (moved here)

**2. Identification (Optional)** (amber)
- National ID / Iqama + Expiry + Passport + Expiry + warning text (unchanged)

**3. Employment & Access** (blue)
- Employee Type + Default Language + **Security sub-section** (password, force change, reset) merged here

### Right Column (col-span-4):

**Section Navigation Tabs** (sticky at top)
- Vertical tab list showing each section with green checkmark when complete:
  - Profile Information: complete when full_name + phone filled
  - Identification: always complete (optional)
  - Employment & Access: complete when role + branches selected
  - Role & Branches: complete when role + at least 1 branch selected

**Role & Branches** card (unchanged, below tabs)

**Role Preview Panel** (unchanged, below role card)

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/users/UserFormPage.tsx` | Full rewrite: merge Security into Employment, merge Status into Profile, add email field, nationality dropdown, section nav tabs on right, auto-focus errors, compact spacing |
| `src/components/shared/DashedSectionCard.tsx` | Reduce internal padding from `p-4` to `p-2`, header padding from `px-4 py-2.5` to `px-3 py-1.5` |

### Nationality Dropdown Options
- Saudi
- Indian
- Egyptian
- Bangladeshi
- Pakistani
- Yemeni
- Sudanese
- Other

### Validation + Focus Logic
```
const validate = () => {
  // ... existing validation ...
  if (Object.keys(newErrors).length > 0) {
    const firstErrorKey = Object.keys(newErrors)[0];
    const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (el?.querySelector('input, select, button') as HTMLElement)?.focus();
  }
};
```

### Section Completion Logic (for right-side tabs)
- **Profile**: `full_name` and `phone` are filled
- **Identification**: Always true (all fields optional)
- **Employment**: `role_id` is set and `branch_ids.length > 0`

### Spacing Changes (global across UserFormPage)
- `space-y-3` becomes `space-y-1.5`
- `gap-3` becomes `gap-1.5`
- `gap-4` becomes `gap-2`
- `pb-20` becomes `pb-14`
- DashedSectionCard inner padding: `p-4` to `p-2`
- DashedSectionCard header: `px-4 py-2.5` to `px-3 py-1.5`

### Empty Branches Handling
- Show a warning message: "No branches found. Please add branches first."
- Add a link to `/branches/add` from the empty state
