
# Plan: Restore Two-Column Layout for Item Master Forms

## Problem Identified

The Item Master Add/Edit pages (`/items/add` and `/items/:id/edit`) currently use a **single-column stacked layout**, but you expected a **col-4 / col-8 (33% / 67%) two-column split layout**:

```text
┌─────────────────────────────────────────────────────────────┐
│  SectionNavigationBar                                        │
├────────────────────┬────────────────────────────────────────┤
│   LEFT (col-4)     │   RIGHT (col-8)                        │
│   ≈33% width       │   ≈67% width                           │
│                    │                                         │
│  ┌──────────────┐  │  ┌──────────────────────────────────┐  │
│  │ Image Upload │  │  │ Basics Section                   │  │
│  │ (compact)    │  │  │ • Name (EN/AR/UR)                │  │
│  └──────────────┘  │  │ • Description                    │  │
│                    │  │ • Base Cost, Item Type           │  │
│  ┌──────────────┐  │  │ • Combo Toggle                   │  │
│  │ Inventory    │  │  └──────────────────────────────────┘  │
│  │ Progress     │  │                                         │
│  │ Card         │  │  ┌──────────────────────────────────┐  │
│  └──────────────┘  │  │ Classification Section           │  │
│                    │  │ • Category, Subcategories        │  │
│  ┌──────────────┐  │  │ • Serving Times                  │  │
│  │ Status       │  │  └──────────────────────────────────┘  │
│  │ Active/      │  │                                         │
│  │ Inactive     │  │  ┌──────────────────────────────────┐  │
│  └──────────────┘  │  │ Details Section                  │  │
│                    │  │ • Prep Time, Calories            │  │
│                    │  │ • Allergens, Highlights          │  │
│                    │  └──────────────────────────────────┘  │
│                    │                                         │
│                    │  ┌──────────────────────────────────┐  │
│                    │  │ Ingredients Section              │  │
│                    │  └──────────────────────────────────┘  │
│                    │                                         │
│                    │  ┌──────────────────────────────────┐  │
│                    │  │ Items Section (if combo)         │  │
│                    │  └──────────────────────────────────┘  │
├────────────────────┴────────────────────────────────────────┤
│  Fixed Footer: Cancel | Save                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## What Will Be Changed

### 1. Restructure Layout in ItemsAdd.tsx

**Current structure (single column):**
```jsx
<div className="space-y-6">
  <DashedSectionCard title="Basics">...</DashedSectionCard>
  <DashedSectionCard title="Classification">...</DashedSectionCard>
  <DashedSectionCard title="Details">...</DashedSectionCard>
  <DashedSectionCard title="Inventory">...</DashedSectionCard>
  <DashedSectionCard title="Ingredients">...</DashedSectionCard>
</div>
```

**New structure (two columns):**
```jsx
<div className="flex flex-col lg:flex-row gap-6">
  {/* Left Column - 33% */}
  <aside className="w-full lg:w-1/3 space-y-4 lg:sticky lg:top-16 lg:self-start">
    <DashedSectionCard title="Image">
      <ImageUploadHero />
    </DashedSectionCard>
    <DashedSectionCard title="Inventory">
      <InventoryProgressCard />
    </DashedSectionCard>
    <DashedSectionCard title="Status">
      <Switch /> Active/Inactive
      <Switch /> Is Combo
    </DashedSectionCard>
  </aside>

  {/* Right Column - 67% */}
  <main className="w-full lg:w-2/3 space-y-6">
    <DashedSectionCard title="Basics">...</DashedSectionCard>
    <DashedSectionCard title="Classification">...</DashedSectionCard>
    <DashedSectionCard title="Details">...</DashedSectionCard>
    <DashedSectionCard title="Ingredients">...</DashedSectionCard>
    <DashedSectionCard title="Items">...</DashedSectionCard>
  </main>
</div>
```

### 2. Apply Same Layout to ItemsEdit.tsx

The same two-column structure will be applied to the edit page.

### 3. Left Column Contents (Sticky Sidebar)

The left column will contain:
- **Image Upload** (compact 100px square as per memory)
- **Inventory Progress Card** (stock level, threshold inputs)
- **Status Section** (Active/Inactive toggle, Is Combo toggle)

The left column will be `sticky` so it stays visible while scrolling through the right column sections.

### 4. Right Column Contents (Scrollable Sections)

The right column will contain the scrollable form sections:
- Basics (Name, Description, Base Cost, Item Type)
- Classification (Category, Subcategories, Serving Times)
- Details (Prep Time, Calories, Allergens, Highlights)
- Ingredients (Mapping table with add/remove)
- Items (Sub-items for combos)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/ItemsAdd.tsx` | Restructure to col-4/col-8 layout, move Image/Inventory/Status to left sidebar |
| `src/pages/ItemsEdit.tsx` | Same restructure as ItemsAdd.tsx |

---

## Note About Empty Items List

The items table in the database currently has **0 rows**. The previous "items" you saw were mock/hardcoded data that has now been replaced with real database queries. After this layout fix is implemented, you will need to add items using the form to see them in the list.

---

## Technical Details

- **CSS Classes**: `flex flex-col lg:flex-row gap-6` for the main container
- **Left column**: `w-full lg:w-1/3 lg:sticky lg:top-16 lg:self-start`
- **Right column**: `w-full lg:w-2/3 space-y-6`
- **Responsive**: Stacks vertically on mobile/tablet, splits on desktop (lg breakpoint)
