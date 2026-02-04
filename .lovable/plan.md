

# Implementation Plan: Update Modal UI Styling

## Overview

Based on the reference image, I'll update the `ItemSaveConfirmModal.tsx` with the following changes:

| Change | Current | New |
|--------|---------|-----|
| Font Size | 10px-11px | **13px** for content text |
| Border Style | `border` or `border-2 border-dashed` | Consistent **dotted borders** (`border-2 border-dotted`) |
| Text Sharpness | Lighter weight, muted | **font-medium** for clarity |
| Section Cards | `border-dashed` with varied opacity | Uniform **dotted light gray** borders |
| Table Text | `text-xs` (12px) | **text-[13px]** |

---

## Detailed Changes

### 1. ReadOnlyFormField (lines 100-120)

**Current:**
```tsx
<label className="text-[11px] font-medium text-muted-foreground">
<div className="flex h-8 ... text-xs">
```

**Updated:**
```tsx
<label className="text-[13px] font-medium text-muted-foreground">
<div className="flex h-9 ... text-[13px] font-medium">
```

---

### 2. ReadOnlyChipsField (lines 122-151)

**Current:**
```tsx
<label className="text-[11px] font-medium text-muted-foreground">
<span className="... text-[10px] ...">
```

**Updated:**
```tsx
<label className="text-[13px] font-medium text-muted-foreground">
<span className="... text-[13px] ..."> // chips inside
```

---

### 3. ReviewSectionCard (lines 153-176)

**Current:**
```tsx
<div className="rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden">
  <div className="... border-b border-dashed border-muted-foreground/20">
    <span className="text-[11px] font-semibold text-muted-foreground">
```

**Updated:**
```tsx
<div className="rounded-lg border-2 border-dotted border-muted-foreground/40 overflow-hidden">
  <div className="... border-b border-dotted border-muted-foreground/30">
    <span className="text-[13px] font-semibold text-muted-foreground">
```

---

### 4. Hero Section Name Field (lines 250-253)

**Current:**
```tsx
<div className="flex h-8 ... text-sm font-semibold truncate">
```

**Updated:**
```tsx
<div className="flex h-9 ... text-[13px] font-semibold truncate rounded-md border-2 border-dotted border-muted-foreground/40">
```

---

### 5. Hero Overview Panel Border (line 231)

**Current:**
```tsx
<div className="rounded-lg border bg-muted/20 p-3">
```

**Updated:**
```tsx
<div className="rounded-lg border-2 border-dotted border-muted-foreground/40 bg-muted/20 p-3">
```

---

### 6. Language Indicators (lines 261-271)

**Current:**
```tsx
<span className="... text-[9px] ...">
```

**Updated:**
```tsx
<span className="... text-[11px] ...">
```

---

### 7. Status Badges (lines 278-290)

**Current:**
```tsx
<span className="... text-[10px] ...">
```

**Updated:**
```tsx
<span className="... text-[12px] ...">
```

---

### 8. Mapping Tables Section

#### Table Headers (lines 398-401, 439-442)
**Current:**
```tsx
<th className="h-7 px-2 text-left text-[11px] font-medium text-muted-foreground">
```

**Updated:**
```tsx
<th className="h-8 px-3 text-left text-[13px] font-medium text-muted-foreground">
```

#### Table Cells (lines 404-410, 445-451)
**Current:**
```tsx
<td className="px-2 text-foreground">
```

**Updated:**
```tsx
<td className="px-3 text-[13px] text-foreground font-medium">
```

#### Table Footer (lines 414-421, 473-479)
**Current:**
```tsx
<td className="... text-[11px] font-semibold ...">
<td className="... font-bold text-primary text-xs">
```

**Updated:**
```tsx
<td className="... text-[13px] font-semibold ...">
<td className="... text-[13px] font-bold text-primary">
```

---

### 9. Recipe Mappings Divider (lines 373-379)

**Current:**
```tsx
<span className="text-[11px] font-semibold text-muted-foreground">
```

**Updated:**
```tsx
<span className="text-[13px] font-semibold text-muted-foreground">
```

---

### 10. Ingredient/Combo Item Table Borders

**Current:**
```tsx
<div className="rounded-lg border border-input overflow-hidden">
```

**Updated:**
```tsx
<div className="rounded-lg border-2 border-dotted border-muted-foreground/40 overflow-hidden">
```

---

## Summary of Border Updates

All major visual elements will use consistent dotted borders:
- `border-2 border-dotted border-muted-foreground/40` for cards and tables
- `border-dotted border-muted-foreground/30` for internal section headers

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/items/ItemSaveConfirmModal.tsx` | Update font sizes to 13px, change all dashed borders to dotted, increase text weights for clarity |

