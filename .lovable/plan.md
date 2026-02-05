
# Fix Plan: RLS Policy Violation on Maintenance Tables

## Problem Summary

All maintenance pages (Categories, Subcategories, Allergens, etc.) fail on **INSERT, UPDATE, and DELETE** operations with:
> "new row violates row-level security policy for table..."

| Issue | Root Cause |
|-------|------------|
| Current auth system | Uses hardcoded credentials + localStorage (NOT Supabase Auth) |
| RLS policies | Require `auth.uid()` for authenticated check and `is_admin()` for write access |
| Result | `auth.uid()` returns NULL since no real Supabase session exists |

---

## Solution Options

### Option A: Proper Supabase Authentication (Recommended)
Replace the fake auth system with real Supabase Auth:
- Create admin user in Supabase
- Implement proper login with `supabase.auth.signInWithPassword()`
- Assign admin role in `user_roles` table
- All RLS policies will work correctly

**Pros:** Secure, production-ready, follows best practices
**Cons:** Requires more implementation effort

### Option B: Temporary Bypass for Development
Allow public write access temporarily (INSECURE - only for development):
- Add permissive policies that allow unauthenticated writes
- Remove these before production

**Pros:** Quick fix for testing
**Cons:** Major security vulnerability, not recommended

---

## Recommended Implementation: Option A

### Phase 1: Update Auth System

**File: `src/hooks/useAuth.tsx`**

Replace hardcoded auth with Supabase Auth:

```typescript
import { supabase } from "@/integrations/supabase/client";

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ...rest of provider
};
```

### Phase 2: Create Admin User

**Database Migration:**

```sql
-- 1. First, sign up user via Supabase Auth dashboard or API
-- 2. Then assign admin role (replace USER_ID with actual auth.users id):

INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');
```

### Phase 3: Update Login Page

**File: `src/pages/Login.tsx`**

Update to use Supabase sign-in:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!error) {
    toast({ title: "Welcome back!" });
    navigate("/", { replace: true });
  } else {
    toast({ 
      title: "Invalid credentials", 
      description: error.message,
      variant: "destructive" 
    });
  }

  setIsLoading(false);
};
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAuth.tsx` | Replace localStorage auth with Supabase Auth |
| `src/pages/Login.tsx` | Use `supabase.auth.signInWithPassword()` |
| `src/components/ProtectedRoute.tsx` | Check Supabase session instead of context |
| Database | Create admin user + add role assignment |

---

## Affected CRUD Operations

Once fixed, these will all work correctly:

| Page | INSERT | UPDATE | DELETE | TOGGLE STATUS |
|------|--------|--------|--------|---------------|
| Categories | ✓ | ✓ | ✓ | ✓ |
| Subcategories | ✓ | ✓ | ✓ | ✓ |
| Serving Times | ✓ | ✓ | ✓ | ✓ |
| Allergens | ✓ | ✓ | ✓ | ✓ |
| Item Types | ✓ | ✓ | ✓ | ✓ |
| Classification Types | ✓ | ✓ | ✓ | ✓ |
| Units | ✓ | ✓ | ✓ | ✓ |
| Storage Types | ✓ | ✓ | ✓ | ✓ |
| Ingredient Groups | ✓ | ✓ | ✓ | ✓ |

---

## Security Notes

- Never store roles in localStorage
- Always validate admin status server-side via RLS
- The existing `is_admin()` function correctly checks `user_roles` table
- No changes needed to RLS policies - they are correctly configured
