
# Inventory Module - Comprehensive UI Prototype Plan

## Overview
This plan introduces a complete Inventory Module with hierarchical menu structure, covering Item Master (Stock Items), Ingredient Master, Stock Operations (Issue, Transfer, Adjustment), Batch & Expiry Tracking, and Reports & Alerts. The design follows the established compact enterprise UX patterns with FormSectionCard, FormRow, and FormField components.

---

## 1. Navigation Structure

### Sidebar Update
The current flat navigation will be enhanced with a collapsible "Inventory" parent menu:

```text
📊 Dashboard
🏪 Sales Channels
📦 Inventory (NEW - Expandable)
    ├── 📋 Item Master
    ├── 🥕 Ingredient Master  
    ├── 📤 Stock Operations
    │     ├── Issue
    │     ├── Transfer
    │     └── Adjustment
    ├── 📅 Batch & Expiry
    └── 📈 Reports & Alerts
🍽️ Items
🏷️ Categories
...
```

### New Routes
```text
/inventory/items              - Item Master list
/inventory/items/add          - Add stock item
/inventory/items/:id/edit     - Edit stock item

/inventory/ingredients        - Ingredient Master list  
/inventory/ingredients/add    - Add ingredient
/inventory/ingredients/:id/edit - Edit ingredient

/inventory/operations/issue        - Issue stock
/inventory/operations/transfer     - Transfer stock
/inventory/operations/adjustment   - Stock adjustment

/inventory/batch-expiry       - Batch & expiry tracking

/inventory/reports            - Reports & alerts dashboard
```

---

## 2. Item Master (Stock Items)

### List Page Layout

```text
+------------------------------------------------------------------+
| 📦 Item Master                              [+ Add Stock Item]    |
+==================================================================+
| 🔍 Search...  | Category [All ▼] | Storage [All ▼] | Status [▼] |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| Code    | Name      | Category | Unit | Stock  | Status | Actions|
|---------|-----------|----------|------|--------|--------|--------|
| STK001  | Tomatoes  | Raw      | Kg   | 🟢 150 | Active | 👁 ✏️  |
| STK002  | Flour     | Raw      | Kg   | 🟡 25  | Active | 👁 ✏️  |
| STK003  | Chicken   | Raw      | Kg   | 🔴 5   | Active | 👁 ✏️  |
+------------------------------------------------------------------+
| Stock Indicators: 🟢 Healthy  🟡 Low (≤ Reorder)  🔴 Critical (≤ Min) |
+------------------------------------------------------------------+
```

### Add/Edit Page Layout (Compact Cards with Sections)

```text
+------------------------------------------------------------------+
| ← Add Stock Item                                                  |
+==================================================================+

+------------------------------------------------------------------+
| 📋 Basic Information                                              |
+------------------------------------------------------------------+
| Item Code          | Item Name                                    |
| [AUTO_GEN]         | [EN|AR|UR] Tomatoes...                       |
|------------------------------------------------------------------|
| Category               | Sub-Category                             |
| [Raw ▼]                | [Vegetables ▼]                           |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 📏 Units & Conversion                                             |
+------------------------------------------------------------------+
| Purchase Unit      | Consumption Unit    | Conversion Factor      |
| [Box ▼]            | [Piece ▼]           | [1 Box = 12 Pieces]    |
|------------------------------------------------------------------|
| Base Unit of Measure    | Shelf Life (days)                       |
| [Kg ▼]                  | [30]                                     |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 🏪 Storage & Stock Levels                                         |
+------------------------------------------------------------------+
| Storage Type       | Min Stock ℹ️   | Reorder Level ℹ️  | Max Stock|
| [Chiller ▼]        | [10]           | [25]              | [100]    |
|------------------------------------------------------------------|
| Costing Method ℹ️                                                 |
| ○ FIFO (First In, First Out)                                     |
| ○ Weighted Average                                                |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 💰 Pricing & Tax                                                  |
+------------------------------------------------------------------+
| Cost Price         | Selling Price (optional)                     |
| [$5.00]            | [$7.50]                                      |
|------------------------------------------------------------------|
| ○ Taxable    ○ Non-Taxable                                       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| ⚙️ Advanced Options (Collapsed by Default)                        |
+------------------------------------------------------------------+
| ▼ Click to expand                                                 |
|   Barcode/QR Code: [________________]                             |
|   HACCP Critical Item: ☐                                          |
|   Allergens: ☐ Gluten ☐ Dairy ☐ Nuts ☐ Eggs ☐ Soy                |
|   Linked Suppliers: [+ Add Supplier]                              |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 📊 Status                                                         |
+------------------------------------------------------------------+
| ● Active    ○ Inactive                                           |
+------------------------------------------------------------------+

+==================================================================+
|                            [Cancel]  [Save]                       |
+==================================================================+
```

---

## 3. Ingredient Master

### List Page

```text
+------------------------------------------------------------------+
| 🥕 Ingredient Master                        [+ Add Ingredient]    |
+==================================================================+
| 🔍 Search...  | Prep Type [All ▼] | Linked [All ▼]               |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| Name     | Linked Item | Unit | Yield% | Wastage% | Cost | Status|
|----------|-------------|------|--------|----------|------|-------|
| Tomato   | STK001      | Kg   | 85%    | 5%       | $5.88| Active|
| Onion    | ⚠️ None     | Kg   | 90%    | 3%       | -    | Active|
+------------------------------------------------------------------+
| ⚠️ Warning: Ingredients without linked items won't deduct from inventory |
+------------------------------------------------------------------+
```

### Add/Edit Page Layout

```text
+------------------------------------------------------------------+
| 🥕 Basic Information                                              |
+------------------------------------------------------------------+
| Ingredient Name                | Linked Stock Item ℹ️             |
| [EN|AR|UR] Diced Tomatoes      | [STK001 - Tomatoes ▼]           |
|------------------------------------------------------------------|
| Default Unit        | Preparation Type                           |
| [Kg ▼]              | ○ Raw  ○ Cooked  ○ Marinated               |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 📊 Yield & Wastage                                                |
+------------------------------------------------------------------+
| Yield Percentage ℹ️           | Wastage Percentage ℹ️             |
| [85] %                        | [5] %                             |
|------------------------------------------------------------------|
| Usable Quantity Calculation:                                      |
| 100g raw → 85g after cleaning → 80.75g usable (after wastage)    |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 💰 Cost Calculation                                               |
+------------------------------------------------------------------+
| Base Cost (from item)         | True Cost (after yield/wastage)  |
| $5.00 / Kg                    | $6.19 / Kg (auto-calculated)     |
+------------------------------------------------------------------+
```

---

## 4. Stock Operations

### 4.1 Stock Issue Page

```text
+------------------------------------------------------------------+
| 📤 Stock Issue                                                    |
+==================================================================+

+------------------------------------------------------------------+
| 📋 Issue Details                                                  |
+------------------------------------------------------------------+
| Issue Type                    | Issue To                          |
| ○ Manual  ○ Auto (POS)  ○ Recipe | [Kitchen ▼]                   |
|------------------------------------------------------------------|
| Issue Date          | Reference Number                           |
| [2026-02-03]        | [ISS-2026-0001]                            |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 📦 Items to Issue                                    [+ Add Item] |
+------------------------------------------------------------------+
| Item Code | Item Name    | Available | Issue Qty | Unit  | Action |
|-----------|--------------|-----------|-----------|-------|--------|
| STK001    | Tomatoes     | 150 Kg    | [10]      | Kg    | ✕      |
| STK002    | Flour        | 25 Kg     | [5]       | Kg    | ✕      |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 📝 Notes & Authorization                                          |
+------------------------------------------------------------------+
| Notes: [________________________________]                         |
| Authorized By: [John Manager ▼] (Role-based)                     |
+------------------------------------------------------------------+
```

### 4.2 Stock Transfer Page

```text
+------------------------------------------------------------------+
| 🔄 Stock Transfer                                                 |
+==================================================================+

+------------------------------------------------------------------+
| 📋 Transfer Details                                               |
+------------------------------------------------------------------+
| From Location           | To Location                            |
| [Main Store ▼]          | [Kitchen Store ▼]                      |
|------------------------------------------------------------------|
| Transfer Type           | Transfer Date                           |
| ○ Internal  ○ Inter-Branch | [2026-02-03]                        |
|------------------------------------------------------------------|
| Reference: [TRF-2026-0001]                                       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 📦 Items to Transfer                                 [+ Add Item] |
+------------------------------------------------------------------+
| Item     | Batch     | Available | Transfer Qty | Status         |
|----------|-----------|-----------|--------------|----------------|
| Tomatoes | B-001     | 50 Kg     | [20]         | ● Pending      |
| Flour    | B-002     | 25 Kg     | [10]         | ● Pending      |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| Transfer Status Flow:                                             |
| ● Pending → 🚚 In-Transit → ✅ Received → 📋 Completed            |
+------------------------------------------------------------------+
```

### 4.3 Stock Adjustment Page

```text
+------------------------------------------------------------------+
| ⚙️ Stock Adjustment                                               |
+==================================================================+

+------------------------------------------------------------------+
| 📋 Adjustment Details                                             |
+------------------------------------------------------------------+
| Adjustment Date       | Reference Number                         |
| [2026-02-03]          | [ADJ-2026-0001]                          |
|------------------------------------------------------------------|
| Reason (Required) ℹ️                                              |
| ○ Physical Count Variance                                        |
| ○ Damage                                                          |
| ○ Spoilage                                                        |
| ○ Theft                                                           |
| ○ Other: [________________]                                       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 📦 Items to Adjust                                   [+ Add Item] |
+------------------------------------------------------------------+
| Item     | Current Stock | New Stock | Variance | Value Impact   |
|----------|---------------|-----------|----------|----------------|
| Tomatoes | 150 Kg        | [145]     | -5 Kg    | -$25.00        |
| Flour    | 25 Kg         | [27]      | +2 Kg    | +$10.00        |
+------------------------------------------------------------------+
| Total Impact: -$15.00                                             |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 🔒 Approval (Required for Critical Items)                         |
+------------------------------------------------------------------+
| Adjusted By: [Current User]                                       |
| Approved By: [Manager Dropdown ▼] (if critical)                  |
| Notes: [________________________________]                         |
+------------------------------------------------------------------+
```

---

## 5. Batch & Expiry Tracking

### List View

```text
+------------------------------------------------------------------+
| 📅 Batch & Expiry Tracking                                        |
+==================================================================+
| View: ○ All Batches  ○ Near Expiry (7 days)  ○ Expired           |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| Batch ID | Item     | Supplier  | Qty   | Expiry     | Status    |
|----------|----------|-----------|-------|------------|-----------|
| B-001    | Tomatoes | ABC Foods | 50 Kg | 2026-02-10 | 🟡 7 days |
| B-002    | Milk     | Dairy Co  | 20 L  | 2026-02-05 | 🔴 2 days |
| B-003    | Flour    | Mill Corp | 100Kg | 2026-06-01 | 🟢 118 d  |
| B-004    | Chicken  | Farm Ltd  | 5 Kg  | 2026-02-01 | ⛔ Expired|
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| Legend:                                                           |
| 🟢 Safe (>14 days)  🟡 Near Expiry (≤14 days)                    |
| 🔴 Critical (≤3 days)  ⛔ Expired (Blocked)                       |
+------------------------------------------------------------------+
```

### Batch Detail Modal

```text
+------------------------------------------------------------------+
| 📋 Batch Details: B-001                                           |
+------------------------------------------------------------------+
| Item: Tomatoes (STK001)                                           |
| Supplier: ABC Foods                                               |
| Received: 2026-01-15                                              |
| Expiry: 2026-02-10 (7 days remaining)                            |
|------------------------------------------------------------------|
| Traceability:                                                     |
| Supplier → Stock Item → Ingredients → Dishes                      |
| ABC Foods → Tomatoes → Diced Tomato → Pizza Margherita           |
+------------------------------------------------------------------+
```

---

## 6. Reports & Alerts Dashboard

```text
+------------------------------------------------------------------+
| 📈 Inventory Reports & Alerts                                     |
+==================================================================+

+------------------------+------------------------+
| 🔴 Low Stock Items     | 📅 Near Expiry Items   |
| ┌────────────────────┐ | ┌────────────────────┐ |
| │ Chicken    5 Kg    │ | │ Milk     2 days    │ |
| │ Onions     8 Kg    │ | │ Yogurt   5 days    │ |
| │ Eggs       12 pcs  │ | │ Tomatoes 7 days    │ |
| └────────────────────┘ | └────────────────────┘ |
+------------------------+------------------------+

+------------------------------------------------------------------+
| 📊 Quick Reports                                                  |
+------------------------------------------------------------------+
| [Stock Valuation]  [Movement Report]  [Wastage Report]           |
| [Expiry Report]    [Consumption Analysis]                         |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| 🔔 Recent Alerts                                                  |
+------------------------------------------------------------------+
| ⚠️ 10:30 AM - Chicken stock below reorder level (5 Kg)           |
| ⚠️ 09:15 AM - Milk batch B-002 expires in 2 days                 |
| ✅ 08:00 AM - Transfer TRF-001 received at Kitchen               |
+------------------------------------------------------------------+
```

---

## 7. Component Architecture

### New Shared Components

**1. StockLevelIndicator**
```typescript
interface StockLevelIndicatorProps {
  current: number;
  min: number;
  reorder: number;
  max: number;
  unit: string;
}
// Renders: 🟢 150 Kg or 🟡 25 Kg or 🔴 5 Kg
```

**2. ExpiryBadge**
```typescript
interface ExpiryBadgeProps {
  expiryDate: Date;
}
// Renders: 🟢 45 days or 🟡 7 days or 🔴 2 days or ⛔ Expired
```

**3. InventoryItemPicker**
```typescript
interface InventoryItemPickerProps {
  value: string;
  onChange: (itemId: string) => void;
  showStock?: boolean;
}
// Searchable dropdown with stock levels visible
```

**4. YieldCalculator**
```typescript
interface YieldCalculatorProps {
  baseQty: number;
  yieldPercent: number;
  wastagePercent: number;
}
// Shows: 100g → 85g → 80.75g usable
```

**5. OperationsTimeline**
```typescript
interface OperationsTimelineProps {
  operations: Array<{type, date, user, status}>;
}
// Transfer/Issue history with status flow
```

---

## 8. Database Schema Design

### Core Tables

```sql
-- Stock Items (Item Master)
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_ur TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('raw', 'semi_prepared', 'finished', 'beverage', 'non_food')),
  sub_category TEXT,
  -- Units
  base_unit TEXT NOT NULL,
  purchase_unit TEXT,
  consumption_unit TEXT,
  conversion_factor DECIMAL(10,4) DEFAULT 1,
  -- Storage & Levels
  shelf_life_days INTEGER,
  storage_type TEXT CHECK (storage_type IN ('dry', 'chiller', 'freezer')),
  min_stock_level DECIMAL(10,2) DEFAULT 0,
  reorder_level DECIMAL(10,2) DEFAULT 0,
  max_stock_level DECIMAL(10,2),
  current_stock DECIMAL(10,2) DEFAULT 0,
  -- Costing
  costing_method TEXT DEFAULT 'fifo' CHECK (costing_method IN ('fifo', 'weighted_avg')),
  cost_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2),
  is_taxable BOOLEAN DEFAULT true,
  -- Advanced
  barcode TEXT,
  is_haccp_critical BOOLEAN DEFAULT false,
  allergens JSONB DEFAULT '[]',
  -- Status
  is_active BOOLEAN DEFAULT true,
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ingredient Master (Recipe Ingredients)
CREATE TABLE inventory_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_ur TEXT NOT NULL,
  linked_item_id UUID REFERENCES inventory_items(id),
  default_unit TEXT NOT NULL,
  preparation_type TEXT CHECK (preparation_type IN ('raw', 'cooked', 'marinated')),
  yield_percentage DECIMAL(5,2) DEFAULT 100,
  wastage_percentage DECIMAL(5,2) DEFAULT 0,
  calculated_cost DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Stock Batches
CREATE TABLE inventory_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number TEXT UNIQUE NOT NULL,
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  supplier_id UUID, -- Future: link to suppliers table
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  received_date DATE NOT NULL,
  expiry_date DATE,
  cost_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Stock Operations
CREATE TABLE inventory_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('issue', 'transfer', 'adjustment', 'receipt')),
  reference_number TEXT UNIQUE NOT NULL,
  operation_date DATE NOT NULL,
  -- Issue specific
  issue_to TEXT, -- kitchen, bar, housekeeping
  issue_type TEXT, -- manual, auto_pos, recipe
  -- Transfer specific
  from_location UUID,
  to_location UUID,
  transfer_type TEXT, -- internal, inter_branch
  transfer_status TEXT, -- pending, in_transit, received, completed
  -- Adjustment specific
  adjustment_reason TEXT,
  -- Common
  notes TEXT,
  created_by UUID,
  approved_by UUID,
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Operation Line Items
CREATE TABLE inventory_operation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID NOT NULL REFERENCES inventory_operations(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  batch_id UUID REFERENCES inventory_batches(id),
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  unit_cost DECIMAL(10,2),
  -- For adjustments
  previous_quantity DECIMAL(10,2),
  new_quantity DECIMAL(10,2),
  variance DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Item-Supplier Mapping (for future supplier module)
CREATE TABLE inventory_item_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  supplier_name TEXT NOT NULL, -- Temporary, will be FK later
  supplier_code TEXT,
  is_preferred BOOLEAN DEFAULT false,
  lead_time_days INTEGER,
  min_order_qty DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 9. New i18n Keys

```text
// Navigation
nav.inventory, nav.itemMaster, nav.ingredientMaster, nav.stockOperations
nav.stockIssue, nav.stockTransfer, nav.stockAdjustment
nav.batchExpiry, nav.reportsAlerts

// Item Master
inventory.itemMaster, inventory.addStockItem, inventory.editStockItem
inventory.itemCode, inventory.itemName, inventory.category, inventory.subCategory
inventory.categoryRaw, inventory.categorySemiPrepared, inventory.categoryFinished
inventory.categoryBeverage, inventory.categoryNonFood
inventory.purchaseUnit, inventory.consumptionUnit, inventory.conversionFactor
inventory.baseUnit, inventory.shelfLife, inventory.shelfLifeDays
inventory.storageType, inventory.storageDry, inventory.storageChiller, inventory.storageFreezer
inventory.minStockLevel, inventory.reorderLevel, inventory.maxStockLevel
inventory.costingMethod, inventory.costingFifo, inventory.costingWeightedAvg
inventory.costPrice, inventory.sellingPrice, inventory.taxable, inventory.nonTaxable
inventory.barcode, inventory.haccpCritical, inventory.linkedSuppliers

// Stock Levels
inventory.stockHealthy, inventory.stockLow, inventory.stockCritical
inventory.currentStock, inventory.noStockItems

// Ingredient Master
inventory.ingredientMaster, inventory.addIngredient, inventory.editIngredient
inventory.linkedItem, inventory.linkedItemTooltip, inventory.noLinkedItem
inventory.preparationType, inventory.prepRaw, inventory.prepCooked, inventory.prepMarinated
inventory.yieldPercentage, inventory.yieldTooltip
inventory.wastagePercentage, inventory.wastageTooltip
inventory.usableQuantity, inventory.trueCost, inventory.baseCost

// Stock Operations
inventory.stockOperations, inventory.stockIssue, inventory.stockTransfer, inventory.stockAdjustment
inventory.issueType, inventory.issueManual, inventory.issueAuto, inventory.issueRecipe
inventory.issueTo, inventory.issueToKitchen, inventory.issueToBar, inventory.issueToHousekeeping
inventory.issueDate, inventory.referenceNumber
inventory.itemsToIssue, inventory.addItem, inventory.available, inventory.issueQty
inventory.authorizedBy, inventory.notes

// Transfer
inventory.fromLocation, inventory.toLocation
inventory.transferType, inventory.transferInternal, inventory.transferInterBranch
inventory.transferDate, inventory.transferStatus
inventory.statusPending, inventory.statusInTransit, inventory.statusReceived, inventory.statusCompleted
inventory.itemsToTransfer

// Adjustment
inventory.adjustmentReason, inventory.reasonPhysicalCount, inventory.reasonDamage
inventory.reasonSpoilage, inventory.reasonTheft, inventory.reasonOther
inventory.currentStock, inventory.newStock, inventory.variance, inventory.valueImpact
inventory.adjustedBy, inventory.approvedBy, inventory.approvalRequired

// Batch & Expiry
inventory.batchExpiry, inventory.batchId, inventory.supplier
inventory.receivedDate, inventory.expiryDate, inventory.daysRemaining
inventory.viewAll, inventory.nearExpiry, inventory.expired
inventory.batchDetails, inventory.traceability

// Reports & Alerts
inventory.reportsAlerts, inventory.lowStockItems, inventory.nearExpiryItems
inventory.stockValuation, inventory.movementReport, inventory.wastageReport
inventory.expiryReport, inventory.consumptionAnalysis
inventory.recentAlerts

// Tooltips
tooltips.minStock: "Minimum stock level before operations are affected"
tooltips.reorderLevel: "Stock level that triggers a reorder notification"  
tooltips.fifo: "First In, First Out - oldest stock is used first"
tooltips.weightedAvg: "Average cost calculated from all purchases"
tooltips.yield: "Percentage of usable product after cleaning/trimming"
tooltips.wastage: "Percentage lost during preparation"
tooltips.linkedItem: "Link to inventory item for automatic stock deduction"
tooltips.adjustmentReason: "Reason is required for audit trail"
```

---

## 10. File Structure

### New Files to Create

```text
src/pages/inventory/
  ├── ItemMaster.tsx
  ├── ItemMasterAdd.tsx
  ├── ItemMasterEdit.tsx
  ├── IngredientMaster.tsx
  ├── IngredientMasterAdd.tsx
  ├── IngredientMasterEdit.tsx
  ├── StockIssue.tsx
  ├── StockTransfer.tsx
  ├── StockAdjustment.tsx
  ├── BatchExpiry.tsx
  └── ReportsAlerts.tsx

src/components/inventory/
  ├── ItemMasterTable.tsx
  ├── IngredientMasterTable.tsx
  ├── StockLevelIndicator.tsx
  ├── ExpiryBadge.tsx
  ├── InventoryItemPicker.tsx
  ├── YieldCalculator.tsx
  ├── OperationItemsTable.tsx
  ├── BatchTable.tsx
  ├── BatchDetailModal.tsx
  ├── OperationsTimeline.tsx
  └── AlertsPanel.tsx
```

### Files to Modify

```text
src/components/AppSidebar.tsx - Add expandable Inventory menu
src/App.tsx - Add all new inventory routes
src/lib/i18n/translations.ts - Add inventory i18n keys
```

---

## 11. Implementation Order

1. **Phase 1: Foundation**
   - Create shared inventory components (StockLevelIndicator, ExpiryBadge)
   - Add all i18n keys
   - Update sidebar with expandable menu

2. **Phase 2: Item Master**
   - List, Add, Edit pages
   - All core fields with compact UX

3. **Phase 3: Ingredient Master**
   - List, Add, Edit pages
   - Yield/Wastage calculations

4. **Phase 4: Stock Operations**
   - Issue, Transfer, Adjustment pages
   - Approval workflows

5. **Phase 5: Batch & Expiry**
   - Batch tracking list
   - Expiry alerts and blocking

6. **Phase 6: Reports & Alerts**
   - Dashboard with quick reports
   - Alert notifications

7. **Phase 7: Database Migrations**
   - Create all tables with RLS policies
   - Link to existing branches structure

---

## 12. Design Principles Applied

| Principle | Implementation |
|-----------|----------------|
| Minimal data entry friction | Auto-generated codes, smart defaults |
| Smart defaults | Default units, categories pre-selected |
| Progressive disclosure | Advanced fields hidden by default |
| Grouped menus | Collapsible Inventory parent menu |
| Consistent terminology | Same terms across POS, Inventory, Reports |
| Visual stock indicators | Color-coded 🟢🟡🔴 badges |
| Role-based controls | Approval required for critical operations |
| Audit trail | All operations logged with timestamps |
| Future-proof | Supplier ID fields ready for integration |

---

## 13. Modal & Alert Patterns

### Low Stock Alert Modal
```text
+------------------------------------------+
| ⚠️ Low Stock Alert                        |
+------------------------------------------+
| The following items need attention:       |
|                                          |
| 🔴 Chicken - 5 Kg (Min: 10 Kg)           |
| 🟡 Onions - 8 Kg (Reorder: 15 Kg)        |
|                                          |
| [Create Purchase Order]  [Dismiss]        |
+------------------------------------------+
```

### Expiry Warning Modal
```text
+------------------------------------------+
| ⚠️ Expiry Warning                         |
+------------------------------------------+
| Batch B-002 (Milk) expires in 2 days!    |
|                                          |
| Options:                                  |
| • Use immediately in recipes              |
| • Mark for disposal                       |
| • Request admin override                  |
|                                          |
| [Use Now]  [Dispose]  [Admin Override]   |
+------------------------------------------+
```

### Recipe Blocked Modal
```text
+------------------------------------------+
| 🚫 Recipe Unavailable                     |
+------------------------------------------+
| "Pizza Margherita" cannot be prepared:   |
|                                          |
| ❌ Mozzarella Cheese - Out of stock      |
| ⚠️ Tomatoes - Low stock (5 Kg)           |
|                                          |
| Suggested alternatives:                   |
| • Pizza Vegetarian (all ingredients OK)  |
|                                          |
| [View Alternatives]  [Close]              |
+------------------------------------------+
```

This comprehensive plan ensures the Inventory Module integrates seamlessly with existing POS Admin patterns while providing enterprise-grade stock management capabilities.
