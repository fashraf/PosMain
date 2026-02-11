

# Fix Branch Saving + Enhanced Tax Tooltip

## Issue 1: Branch Not Saving (Error `[object Object]`)

**Root Cause**: Your user account does not have the "Admin" role assigned in the database. The security policy requires admin access to create/update branches. The `[object Object]` error happens because the Supabase error object is not being properly converted to a readable message.

**Fix (2 parts)**:

1. **Assign Admin role to your account** via a database migration -- insert a row into `user_roles` linking your user ID to the Admin role.

2. **Fix error display** in `BranchFormPage.tsx` -- the catch block at line 203 shows `String(error)` which produces `[object Object]` for Supabase errors. Update to properly extract `.message` from the error object.

## Issue 2: Tax Inclusive vs Exclusive Tooltip

Replace the small tooltip on "Pricing Mode" with a rich, detailed tooltip that explains both modes using a 100 Riyal bill example.

**New tooltip content** (wider, with structured example):
- **Tax Exclusive**: Price = 100 SAR, Tax (15%) = 15 SAR, Customer pays **115 SAR**
- **Tax Inclusive**: Price = 100 SAR (already includes tax), Base = 86.96 SAR, Tax = 13.04 SAR, Customer pays **100 SAR**

The `TooltipInfo` component will be enhanced to support a `richContent` prop (React node) for rendering structured HTML tooltips with a wider max-width (400px).

## Issue 3: Tax is Mandatory (at least 1)

Add validation in `BranchFormPage.tsx` that requires at least one tax rule before saving. If no taxes exist, show an error message under the Tax Configuration section and block the save.

---

## Technical Details

### Database Fix
```sql
INSERT INTO user_roles (user_id, role_id)
VALUES ('222d0e7a-8f79-4b75-a858-676b59886c25', 'ce3de3f2-aa33-480f-81f3-634583cdb3f0');
```

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/shared/TooltipInfo.tsx` | Add optional `richContent` prop (ReactNode) for structured tooltip content, increase max-width to 400px when rich content is used |
| `src/components/branches/BranchFormPage.tsx` | 1) Replace Pricing Mode tooltip with rich content showing the 100 SAR example. 2) Add validation: `if (form.taxes.length === 0)` set error and block save. 3) Fix error catch to handle Supabase error objects properly |

### Pricing Mode Tooltip Design
The tooltip will show a mini comparison table:
```
Tax Exclusive:
  Bill: 100 SAR + 15% tax = 115 SAR total

Tax Inclusive:
  Bill: 100 SAR (includes tax)
  Base: 86.96 SAR | Tax: 13.04 SAR
```

### Validation Rule
In the `validate()` function, add:
```typescript
if (form.taxes.length === 0) {
  newErrors.taxes = "At least one tax rule is required";
}
```
Display the error below the "No taxes configured" text in the Tax Configuration section.
