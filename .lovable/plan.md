

# Implementation Plan: Full Width Layout, Header Redesign & Image Upload Fix

## Overview

Based on your feedback and the reference images, I'll implement three key changes:

1. **Remove max-width constraint** - Use full page width instead of `75vw`
2. **Redesign header** - Remove the "← Edit Item" title row and add a "BACK" button to the right side of the section navigation bar
3. **Fix image upload** - Set up storage bucket and implement actual image persistence
4. **Make modal compact** - Keep the confirmation modal but reduce its width

---

## Changes Summary

| File | Change |
|------|--------|
| `ItemsAdd.tsx` | Remove max-width, update header layout, add BACK button |
| `ItemsEdit.tsx` | Remove max-width, update header layout, add BACK button |
| `SectionNavigationBar.tsx` | Add optional BACK button prop on the right |
| `ItemSaveConfirmModal.tsx` | Reduce width from 75vw to a more compact size |
| `ImageUploadHero.tsx` | Connect to storage bucket for persistence |
| Database Migration | Create `item-images` storage bucket |

---

## Detailed Changes

### 1. Remove Max-Width (Full Page Width)

**Files:** `ItemsAdd.tsx`, `ItemsEdit.tsx`

Remove the `style={{ maxWidth: "75vw" }}` constraint to use full available width:

```tsx
// Before
<div className="mx-auto" style={{ maxWidth: "75vw" }}>

// After
<div>
```

---

### 2. Redesign Header with BACK Button

Based on your reference image, the new layout will be:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [📋 Basics] [🏷️ Class] [⏰ Details] [📦 Inventory] [🥕 Ingredients]          [← BACK]   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Changes to `SectionNavigationBar.tsx`:**
- Add optional `onBack` and `backLabel` props
- Render a BACK button on the right side when `onBack` is provided

**Changes to `ItemsAdd.tsx` and `ItemsEdit.tsx`:**
- Remove the entire "← Edit Item" / "Item Master - Add" header row
- Pass `onBack` callback to `SectionNavigationBar`

---

### 3. Fix Image Upload (Storage Bucket)

**Database Migration:**
Create a storage bucket for item images:

```sql
-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true);

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images');

-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'item-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'item-images');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'item-images');
```

**Changes to `ImageUploadHero.tsx`:**
- Add `onUpload` callback that accepts a File and returns the permanent URL
- Show upload progress indicator
- Store the permanent Supabase Storage URL

**Changes to `ItemsAdd.tsx` and `ItemsEdit.tsx`:**
- Implement `handleImageUpload` function that uploads to Supabase Storage
- On save, use the permanent URL instead of blob URL

---

### 4. Make Modal Compact

**File:** `ItemSaveConfirmModal.tsx`

Reduce the modal width from `75vw` to a more compact size:

```tsx
// Before
<DialogContent className="sm:max-w-[75vw] ...">

// After  
<DialogContent className="sm:max-w-[900px] ...">
```

Also reduce padding and spacing throughout for a more compact feel:
- Header padding: `px-4 py-3` instead of `px-6 py-4`
- Body padding: `p-4` instead of `p-6`
- Gap between sections: `gap-3` instead of `gap-4`
- Image size in hero: 56px instead of 72px

---

## Visual Comparison

**Before (Current):**
```text
┌─────────────────────────────────────────┐
│ ← Edit Item                             │   ← Title row (will remove)
├─────────────────────────────────────────┤
│ [Basics] [Class] [Details] ...          │   ← Nav bar
├─────────────────────────────────────────┤
│        (75vw constrained content)       │
│                                         │
└─────────────────────────────────────────┘
```

**After (New):**
```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [📋 Basics] [🏷️ Class] [⏰ Details] [📦 Inv] [🥕 Ingr]        [← BACK]   │
├──────────────────────────────────────────────────────────────────────────┤
│                        (full width content)                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Order

1. Create storage bucket migration for image uploads
2. Update `SectionNavigationBar.tsx` with BACK button support
3. Update `ImageUploadHero.tsx` with storage upload capability
4. Update `ItemsAdd.tsx`:
   - Remove max-width
   - Remove header row
   - Add BACK button to nav bar
   - Implement image upload
5. Update `ItemsEdit.tsx`:
   - Same changes as Add page
6. Update `ItemSaveConfirmModal.tsx`:
   - Make modal more compact

---

## Technical Notes

### Image Upload Flow

1. User selects image → Creates blob preview immediately (good UX)
2. When user clicks Save → Upload to Supabase Storage
3. Get permanent URL → Save to database

### Storage Path Convention
Images will be stored as: `item-images/{timestamp}_{filename}`

This ensures unique file names and prevents conflicts.

