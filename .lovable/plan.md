

# Fix: Logout Button and User Display in TopBar

## Problem
The logout button in the top bar dropdown menu has **no click handler** — clicking it does nothing. Additionally, the user name and email are hardcoded as "Admin User" and "admin@example.com" instead of showing the actual logged-in user's information.

## Changes

### `src/components/TopBar.tsx`
1. Import `useAuth` hook and `useNavigate` from react-router-dom
2. Wire the logout `DropdownMenuItem` to call `logout()` from the auth context, then navigate to `/login`
3. Display the actual user's name and email from auth context / profile data instead of hardcoded values

### Technical Details
- Add `onClick` handler to the logout menu item that calls `await logout()` followed by `navigate("/login", { replace: true })`
- Replace hardcoded "Admin User" with the user's display name (from `user.user_metadata.full_name` or email fallback)
- Replace hardcoded "admin@example.com" with `user.email`

This is a single-file change with no backend modifications needed.
