import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Check, 
  ImageIcon, 
  Clock, 
  Flame, 
  Carrot, 
  Package, 
  FileText, 
  Tags, 
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for mappings
interface IngredientMappingItem {
  id: string;
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  can_remove?: boolean;
  can_add_extra?: boolean;
  extra_cost?: number | null;
  sort_order: number;
}

interface ReplacementItem {
  id: string;
  item_id: string;
  item_name: string;
  extra_cost: number;
  is_default: boolean;
}

interface SubItemMappingItem {
  id: string;
  sub_item_id: string;
  sub_item_name: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
  combo_price?: number;
  replacements?: ReplacementItem[];
}

interface ItemSaveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  item: {
    // Identity
    name_en: string;
    name_ar?: string;
    name_ur?: string;
    description_en?: string;
    image_url?: string | null;

    // Classification
    item_type: string;
    category: string;
    subcategories: string[];
    serving_times: string[];
    
    // Status
    is_active: boolean;
    is_combo: boolean;
    base_cost: number;

    // Details
    prep_time: number;
    calories?: number | null;
    highlights?: string;
    allergens?: string[];

    // Inventory
    current_stock?: number;
    low_stock_threshold?: number;

    // Mappings
    ingredientCount?: number;
    itemCount?: number;
    ingredientMappings?: IngredientMappingItem[];
    itemMappings?: SubItemMappingItem[];
    ingredientTotalCost?: number;
    itemTotalCost?: number;
  };
  isLoading?: boolean;
  isEdit?: boolean;
}

// Helper: Read-only form field with form-control styling
function ReadOnlyFormField({ 
  label, 
  value, 
  className 
}: { 
  label: string; 
  value: string | React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}

// Helper: Read-only chips field
function ReadOnlyChipsField({ 
  label, 
  chips 
}: { 
  label: string; 
  chips: string[]; 
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-muted/30 px-3 py-2">
        {chips.length > 0 ? (
          chips.map((chip) => (
            <span 
              key={chip} 
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {chip}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}

// Section Card component
function ReviewSectionCard({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
}) {
  return (
    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-dashed border-muted-foreground/20">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

// Allergen emoji map
const allergenEmoji: Record<string, string> = {
  dairy: "🥛",
  gluten: "🌾",
  nuts: "🥜",
  eggs: "🥚",
  fish: "🐟",
  shellfish: "🦐",
  soy: "🫘",
  sesame: "🌰",
  mustard: "🟡",
  celery: "🥬",
  lupin: "🌿",
  molluscs: "🐚",
  sulphites: "🧪",
};

export function ItemSaveConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  item,
  isLoading = false,
  isEdit = false,
}: ItemSaveConfirmModalProps) {
  const { t } = useLanguage();

  const ingredientMappings = item.ingredientMappings || [];
  const itemMappings = item.itemMappings || [];
  const ingredientTotalCost = item.ingredientTotalCost ?? 0;
  const itemTotalCost = item.itemTotalCost ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[75vw] p-0 gap-0 rounded-lg overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍕</span>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {isEdit ? "Ready to Update This Item?" : "Ready to Save This Item?"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isEdit ? "Review all details before updating" : "Review all details before saving"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Body - Scrollable */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Hero Overview Panel */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="w-[72px] h-[72px] rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden border">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name_en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              {/* Name + Status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Name in form-control style */}
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-semibold truncate">
                      {item.name_en || "Untitled Item"}
                    </div>
                    {/* Multilingual indicators */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {[
                        { code: "EN", hasContent: !!item.name_en },
                        { code: "AR", hasContent: !!item.name_ar },
                        { code: "UR", hasContent: !!item.name_ur },
                      ].map((lang) => (
                        <span
                          key={lang.code}
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] font-medium rounded",
                            lang.hasContent 
                              ? "bg-accent text-accent-foreground" 
                              : "bg-destructive/20 text-destructive"
                          )}
                        >
                          {lang.code} {lang.hasContent ? "✓" : "○"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      item.is_active 
                        ? "bg-accent text-accent-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                    {item.is_combo && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                        Combo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Cards - 2 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basics */}
            <ReviewSectionCard title="Basics" icon={FileText}>
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyFormField 
                  label="Item Type" 
                  value={item.item_type === "edible" ? "Edible" : "Non-Edible"} 
                />
                <ReadOnlyFormField 
                  label="Base Cost (SAR)" 
                  value={`SAR ${item.base_cost.toFixed(2)}`} 
                />
              </div>
            </ReviewSectionCard>

            {/* Classification */}
            <ReviewSectionCard title="Classification" icon={Tags}>
              <div className="space-y-3">
                <ReadOnlyFormField label="Category" value={item.category} />
                <ReadOnlyChipsField label="Subcategories" chips={item.subcategories} />
                <ReadOnlyChipsField label="Serving Times" chips={item.serving_times} />
              </div>
            </ReviewSectionCard>

            {/* Details */}
            <ReviewSectionCard title="Details" icon={Clock}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <ReadOnlyFormField 
                    label="Prep Time" 
                    value={
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {item.prep_time} min
                      </span>
                    } 
                  />
                  <ReadOnlyFormField 
                    label="Calories" 
                    value={
                      item.calories ? (
                        <span className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-destructive" />
                          {item.calories} kcal
                        </span>
                      ) : null
                    } 
                  />
                </div>
                <ReadOnlyFormField label="Highlights" value={item.highlights} />
                <ReadOnlyChipsField 
                  label="Allergens" 
                  chips={(item.allergens || []).map(a => `${allergenEmoji[a] || ""} ${a.charAt(0).toUpperCase() + a.slice(1)}`)} 
                />
              </div>
            </ReviewSectionCard>

            {/* Inventory */}
            <ReviewSectionCard title="Inventory" icon={BarChart3}>
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyFormField 
                  label="Current Stock" 
                  value={item.current_stock !== undefined ? item.current_stock.toString() : null} 
                />
                <ReadOnlyFormField 
                  label="Low Stock Threshold" 
                  value={item.low_stock_threshold !== undefined ? item.low_stock_threshold.toString() : null} 
                />
              </div>
            </ReviewSectionCard>
          </div>

          {/* Mapping Tables Section */}
          {(ingredientMappings.length > 0 || (item.is_combo && itemMappings.length > 0)) && (
            <>
              <div className="flex items-center gap-4 pt-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recipe Mappings
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className={cn(
                "grid gap-4",
                item.is_combo && itemMappings.length > 0 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              )}>
                {/* Ingredients Table */}
                {ingredientMappings.length > 0 && (
                  <div className="rounded-lg border border-input overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-accent/50 border-b">
                      <span className="text-xs font-semibold text-accent-foreground uppercase flex items-center gap-1.5">
                        <Carrot className="h-3.5 w-3.5" />
                        Ingredients
                      </span>
                      <span className="text-xs text-muted-foreground">({ingredientMappings.length})</span>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="h-8 px-3 text-left text-[11px] font-medium uppercase text-muted-foreground">Name</th>
                          <th className="h-8 px-3 text-center text-[11px] font-medium uppercase text-muted-foreground">Qty</th>
                          <th className="h-8 px-3 text-right text-[11px] font-medium uppercase text-muted-foreground">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ingredientMappings.map((m, i) => (
                          <tr key={m.id} className={cn("h-9", i % 2 === 0 ? "bg-background" : "bg-muted/30")}>
                            <td className="px-3 text-foreground">{m.ingredient_name}</td>
                            <td className="px-3 text-center text-muted-foreground">{m.quantity.toFixed(2)}</td>
                            <td className="px-3 text-right text-muted-foreground">{m.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-primary/5 border-t-2 border-primary/20">
                        <tr>
                          <td colSpan={2} className="h-9 px-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                            Total Cost
                          </td>
                          <td className="h-9 px-3 text-right font-bold text-primary">
                            SAR {ingredientTotalCost.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* Items Table (Combo only) */}
                {item.is_combo && itemMappings.length > 0 && (
                  <div className="rounded-lg border border-input overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 border-b">
                      <span className="text-xs font-semibold text-secondary-foreground uppercase flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        Combo Items
                      </span>
                      <span className="text-xs text-muted-foreground">({itemMappings.length})</span>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="h-8 px-3 text-left text-[11px] font-medium uppercase text-muted-foreground">Item</th>
                          <th className="h-8 px-3 text-center text-[11px] font-medium uppercase text-muted-foreground">Qty</th>
                          <th className="h-8 px-3 text-right text-[11px] font-medium uppercase text-muted-foreground">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemMappings.map((m, i) => (
                          <>
                            <tr key={m.id} className={cn("h-9", i % 2 === 0 ? "bg-background" : "bg-muted/30")}>
                              <td className="px-3 text-foreground">{m.sub_item_name}</td>
                              <td className="px-3 text-center text-muted-foreground">{m.quantity}</td>
                              <td className="px-3 text-right text-muted-foreground">SAR {m.unit_price.toFixed(2)}</td>
                            </tr>
                            {/* Replacements */}
                            {m.replacements?.map((r) => (
                              <tr key={r.id} className="h-8 bg-muted/20">
                                <td className="px-3 ps-6 text-muted-foreground text-xs">
                                  → {r.item_name} {r.is_default && <span className="text-primary">★</span>}
                                </td>
                                <td className="px-3 text-center text-muted-foreground text-xs"></td>
                                <td className="px-3 text-right text-xs">
                                  {r.extra_cost > 0 ? (
                                    <span className="text-primary">+{r.extra_cost.toFixed(2)}</span>
                                  ) : (
                                    <span className="text-muted-foreground">+0.00</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </>
                        ))}
                      </tbody>
                      <tfoot className="bg-primary/5 border-t-2 border-primary/20">
                        <tr>
                          <td colSpan={2} className="h-9 px-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                            Total Cost
                          </td>
                          <td className="h-9 px-3 text-right font-bold text-primary">
                            SAR {itemTotalCost.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/30 flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            No, Go Back
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            <Check className="h-4 w-4 me-1" />
            {isEdit ? "Yes, Update" : "Yes, Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
