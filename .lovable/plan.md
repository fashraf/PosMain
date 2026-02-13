

# Fix: Reset Password Edge Function - Admin Check Query

## Problem

The `reset-password` edge function fails with a non-2xx status because its admin verification query references a non-existent column `role` on the `user_roles` table. The table only has `user_id`, `role_id`, and `id`.

The working `update-user` function uses the correct pattern:
```typescript
await supabaseAdmin.from('user_roles').select('role_id, roles(name)').eq('user_id', requestingUserId);
const isAdmin = (adminCheck || []).some((r: any) => r.roles?.name === 'Admin');
```

## Fix

**File: `supabase/functions/reset-password/index.ts`**

Replace lines 55-67 (the broken admin check) with the same pattern used in `update-user`:

```typescript
const { data: adminCheck } = await supabaseAdmin
  .from('user_roles')
  .select('role_id, roles(name)')
  .eq('user_id', requestingUserId);

const isAdmin = (adminCheck || []).some((r: any) => r.roles?.name === 'Admin');

if (!isAdmin) {
  return new Response(
    JSON.stringify({ error: 'Only admins can reset passwords' }),
    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

This is a one-file change. The edge function will be redeployed automatically.
