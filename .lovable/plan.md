

# Login Page Implementation Plan

## Overview
Create a beautiful login page matching the reference design with a split-screen layout (decorative left panel + login form right), using hardcoded credentials for a simple authentication flow that redirects to the Dashboard.

---

## Visual Design (Based on Reference Image)

### Layout Structure
```text
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐ │
│  │                              │  │                                     │ │
│  │   [Abstract gradient art]    │  │         ☰ POS Admin                │ │
│  │   Pink/Purple/Blue waves     │  │                                     │ │
│  │                              │  │         Welcome Back                │ │
│  │                              │  │   Enter your email and password     │ │
│  │                              │  │   to access your account            │ │
│  │                              │  │                                     │ │
│  │                              │  │   Email                             │ │
│  │   "A WISE QUOTE"             │  │   ┌───────────────────────────────┐ │ │
│  │                              │  │   │ Enter your email              │ │ │
│  │   Get Everything             │  │   └───────────────────────────────┘ │ │
│  │   You Want                   │  │                                     │ │
│  │                              │  │   Password                          │ │
│  │   Motivational subtext       │  │   ┌────────────────────────────┐👁│ │ │
│  │                              │  │   │ Enter your password         │ │ │ │
│  │                              │  │   └─────────────────────────────────┘ │ │
│  │                              │  │                                     │ │
│  │                              │  │   ☐ Remember me    Forgot Password │ │
│  │                              │  │                                     │ │
│  │                              │  │   ┌───────────────────────────────┐ │ │
│  │                              │  │   │           Sign In             │ │ │
│  │                              │  │   └───────────────────────────────┘ │ │
│  │                              │  │                                     │ │
│  └─────────────────────────────┘  └─────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Color Palette
| Element | Color |
|---------|-------|
| Background (outer) | Dark (#0D0D0D / near black) |
| Left panel gradient | Pink → Purple → Blue gradient waves |
| Right panel bg | White (#FFFFFF) |
| Input border | #E5E7EB |
| Input focus ring | #8B5CF6 (primary purple) |
| Sign In button | Dark (#1F2937 / near black) |
| Text primary | #1F2937 |
| Text secondary | #6B7280 |

---

## Technical Implementation

### 1. New Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Login.tsx` | Main login page component |
| `src/hooks/useAuth.tsx` | Simple auth context for session management |
| `src/components/ProtectedRoute.tsx` | HOC to protect routes requiring auth |

### 2. Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add AuthProvider, Login route, protect other routes |
| `src/lib/i18n/translations.ts` | Add login-related translation keys |

---

## Component Details

### Login.tsx Structure
```tsx
// Split screen layout - 50/50
// Left: Decorative gradient panel with overlay text
// Right: Login form centered

// Form fields:
// - Email input (type="email")
// - Password input (type="password" with toggle visibility)
// - Remember me checkbox
// - Forgot password link (disabled/placeholder)
// - Sign In button

// Validation:
// - Check credentials against hardcoded values
// - Show error toast on failure
// - Redirect to "/" on success
```

### Credentials (Hardcoded)
```typescript
const VALID_EMAIL = "fhd.ashraf@gmail.com";
const VALID_PASSWORD = "Nikenike@90";
```

### useAuth.tsx Hook
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Uses localStorage to persist session
// Key: "pos_admin_auth"
```

### ProtectedRoute Component
```tsx
// Wraps routes that require authentication
// If not authenticated → redirect to /login
// If authenticated → render children
```

---

## Routing Changes

### Updated Route Structure
```tsx
<Routes>
  {/* Public route */}
  <Route path="/login" element={<Login />} />
  
  {/* Protected routes (wrapped in AdminLayout) */}
  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/sales-channels" element={<ProtectedRoute><SalesChannels /></ProtectedRoute>} />
  // ... all other routes wrapped in ProtectedRoute
</Routes>
```

### App.tsx Modifications
- Wrap app in `AuthProvider`
- Add `/login` route outside AdminLayout
- Move AdminLayout inside protected routes
- Conditionally render layout based on route

---

## Login Form Visual Specifications

### Input Styling
- Height: 44px (h-11)
- Border: 1px #E5E7EB
- Border radius: 8px
- Padding: 0 14px
- Font: 14px
- Focus: 2px ring #8B5CF6

### Sign In Button
- Full width
- Height: 44px
- Background: #1F2937 (dark)
- Text: White, 14px, font-medium
- Border radius: 8px
- Hover: slightly lighter

### Password Toggle
- Eye/EyeOff icon (18px)
- Position: right side of input
- Color: #6B7280

### Left Panel (Decorative)
- CSS gradient background (no actual image)
- Gradient: linear from pink → purple → blue
- Overlay text: "A WISE QUOTE" label, "Get Everything You Want" heading
- Subtitle: motivational text
- Rounded corners: 12px

---

## Translation Keys to Add

```typescript
auth: {
  welcomeBack: "Welcome Back",
  enterCredentials: "Enter your email and password to access your account",
  email: "Email",
  emailPlaceholder: "Enter your email",
  password: "Password",
  passwordPlaceholder: "Enter your password",
  rememberMe: "Remember me",
  forgotPassword: "Forgot Password",
  signIn: "Sign In",
  invalidCredentials: "Invalid email or password",
  signInSuccess: "Welcome back!",
  wiseQuote: "A WISE QUOTE",
  getEverything: "Get Everything You Want",
  motivationalText: "You can get everything you want if you work hard, trust the process, and stick to the plan.",
}
```

---

## Security Note

This implementation uses hardcoded credentials for simplicity as requested. For production use, this should be replaced with proper Supabase authentication with:
- Secure password hashing
- Email verification
- Session tokens
- Rate limiting

---

## Flow Summary

```text
1. User visits any route
2. ProtectedRoute checks localStorage for auth
3. If not authenticated → redirect to /login
4. User enters email + password
5. On submit → validate against hardcoded credentials
6. If valid → save to localStorage, redirect to /
7. If invalid → show error toast
8. User lands on Dashboard with full AdminLayout
9. Logout clears localStorage and redirects to /login
```

---

## Files Summary

| Action | File |
|--------|------|
| CREATE | `src/pages/Login.tsx` |
| CREATE | `src/hooks/useAuth.tsx` |
| CREATE | `src/components/ProtectedRoute.tsx` |
| MODIFY | `src/App.tsx` |
| MODIFY | `src/lib/i18n/translations.ts` |

