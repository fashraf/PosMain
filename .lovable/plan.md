

# Fix Translation Keys & Improve Dark Mode Card

## Overview

Add all missing translation keys to the i18n translations file (English, Arabic, Urdu), ensure every sidebar item and profile card title uses proper capitalized labels, and improve the Dark Mode card with a richer visual design.

---

## Part 1: Add Missing Translation Keys

The following keys are referenced in code but missing from `translations.ts`. They currently fall back to hardcoded English strings.

### Navigation keys to add (under `nav`)

| Key | English | Arabic | Urdu |
|-----|---------|--------|------|
| `nav.orders` | Orders | الطلبات | آرڈرز |
| `nav.menu` | Menu | القائمة | مینو |
| `nav.staff` | Staff | الموظفين | عملہ |
| `nav.myProfile` | My Profile | ملفي الشخصي | میری پروفائل |
| `nav.settings` | Settings | الإعدادات | ترتیبات |
| `nav.audit` | Audit | التدقيق | آڈٹ |
| `nav.maintenance` | Maintenance | الصيانة | دیکھ بھال |

### Profile keys to add (new `profile` section)

| Key | English |
|-----|---------|
| `profile.account` | Account Overview |
| `profile.role` | Role & Permissions |
| `profile.darkMode` | Dark Mode |
| `profile.alerts` | Alerts & Notifications |
| `profile.activities` | Recent Activities |
| `profile.quickLinks` | Quick Links |
| `profile.language` | Language |

### Auth keys to add

| Key | English |
|-----|---------|
| `auth.changePassword` | Change Password |

All keys will also be translated for Arabic (`ar`) and Urdu (`ur`) sections.

---

## Part 2: Improve Dark Mode Card

The current `DarkModeCard` is minimal -- just a toggle with two lines of text. The improved version will feature:

- **Visual preview**: A small illustration showing light vs dark mode (using a gradient block or icon pair)
- **Animated toggle**: The Sun/Moon icon transitions smoothly
- **Current status**: Shows "Light Theme" or "Dark Theme" with a colored badge
- **Description**: Brief explanation of benefits
- **Schedule option placeholder**: "Auto (follow system)" badge/note for future

---

## Technical Details

### Files to modify

| File | Changes |
|------|---------|
| `src/lib/i18n/translations.ts` | Add `nav.orders`, `nav.menu`, `nav.staff`, `nav.myProfile`, `nav.settings`, `nav.audit`, `nav.maintenance` to nav section. Add `profile` section with `account`, `role`, `darkMode`, `alerts`, `activities`, `quickLinks`, `language`. Add `auth.changePassword`. Apply to all 3 languages (en, ar, ur). |
| `src/components/profile/DarkModeCard.tsx` | Redesign with animated Sun/Moon transition, mode preview blocks (light/dark mini-cards), status badge, and improved layout |

### No structural or routing changes needed -- this is purely translation keys and visual polish.

