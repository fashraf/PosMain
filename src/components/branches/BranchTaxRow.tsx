import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BranchTax {
  id: string;
  tax_name: string;
  tax_type: "percentage" | "fixed";
  value: number;
  apply_on: "before_discount" | "after_discount";
  is_active: boolean;
  sort_order: number;
}

interface BranchTaxRowProps {
  tax: BranchTax;
  onChange: (tax: BranchTax) => void;
  onDelete: () => void;
}

export function BranchTaxRow({ tax, onChange, onDelete }: BranchTaxRowProps) {
  const set = <K extends keyof BranchTax>(key: K, value: BranchTax[K]) =>
    onChange({ ...tax, [key]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-end p-3 rounded-lg border bg-card animate-in fade-in-0 slide-in-from-top-2 duration-200">
      {/* Tax Name - col-3 */}
      <div className="lg:col-span-3 space-y-1">
        <label className="text-sm font-medium">Tax Name <span className="text-destructive">*</span></label>
        <Input
          value={tax.tax_name}
          onChange={(e) => set("tax_name", e.target.value)}
          placeholder="e.g., VAT, Service Tax"
          className="h-9 text-sm"
        />
      </div>

      {/* Tax Type - col-3 */}
      <div className="lg:col-span-3 space-y-1">
        <label className="text-sm font-medium">Tax Type</label>
        <Select value={tax.tax_type} onValueChange={(v) => set("tax_type", v as BranchTax["tax_type"])}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage (%)</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Value - col-2 */}
      <div className="lg:col-span-2 space-y-1">
        <label className="text-sm font-medium">Value <span className="text-destructive">*</span></label>
        <Input
          type="number"
          value={tax.value || ""}
          onChange={(e) => set("value", parseFloat(e.target.value) || 0)}
          placeholder={tax.tax_type === "percentage" ? "15" : "5.00"}
          className="h-9 text-sm"
          min="0"
        />
      </div>

      {/* Apply On - col-2 */}
      <div className="lg:col-span-2 space-y-1">
        <label className="text-sm font-medium">Apply On</label>
        <Select value={tax.apply_on} onValueChange={(v) => set("apply_on", v as BranchTax["apply_on"])}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="before_discount">Before Discount</SelectItem>
            <SelectItem value="after_discount">After Discount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active + Delete - col-2 */}
      <div className="lg:col-span-2 flex items-center gap-2 pb-0.5">
        <div className="flex items-center gap-1.5">
          <Switch
            checked={tax.is_active}
            onCheckedChange={(v) => set("is_active", v)}
          />
          <span className="text-xs text-muted-foreground">{tax.is_active ? "Active" : "Off"}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
