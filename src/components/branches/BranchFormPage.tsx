import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { SearchableMultiSelect } from "@/components/shared/SearchableMultiSelect";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { BranchTaxRow, type BranchTax } from "./BranchTaxRow";
import { BranchSaveConfirmModal } from "./BranchSaveConfirmModal";
import { ArrowLeft, ArrowRight, Save, X, Building2, Store, Receipt, Coins, Calculator, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCY_OPTIONS = [
  { id: "SAR", label: "ر.س SAR - Saudi Riyal" },
  { id: "USD", label: "$ USD - US Dollar" },
  { id: "AED", label: "د.إ AED - UAE Dirham" },
  { id: "EGP", label: "ج.م EGP - Egyptian Pound" },
  { id: "BDT", label: "৳ BDT - Bangladeshi Taka" },
  { id: "PKR", label: "₨ PKR - Pakistani Rupee" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  SAR: "ر.س", USD: "$", AED: "د.إ", EGP: "ج.م", BDT: "৳", PKR: "₨",
};

const PRICING_MODES = [
  { value: "inclusive", label: "Tax Inclusive", desc: "Prices already include tax" },
  { value: "exclusive", label: "Tax Exclusive", desc: "Tax added on top of prices" },
];

const ROUNDING_OPTIONS = [
  { value: "none", label: "No rounding" },
  { value: "0.05", label: "0.05" },
  { value: "0.10", label: "0.10" },
  { value: "whole", label: "Whole number" },
];

export interface BranchFormData {
  name: string;
  name_ar: string;
  name_ur: string;
  branch_code: string;
  is_active: boolean;
  sales_channel_ids: string[];
  currency: string;
  pricing_mode: string;
  rounding_rule: string;
  taxes: BranchTax[];
}

interface BranchFormPageProps {
  title: string;
  initialData?: BranchFormData;
  branchId?: string;
}

const defaultData: BranchFormData = {
  name: "", name_ar: "", name_ur: "", branch_code: "",
  is_active: true, sales_channel_ids: [], currency: "SAR",
  pricing_mode: "exclusive", rounding_rule: "none", taxes: [],
};

export default function BranchFormPage({ title, initialData, branchId }: BranchFormPageProps) {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<BranchFormData>(initialData || defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  // Sales channels from DB
  const [channelOptions, setChannelOptions] = useState<{ id: string; label: string }[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("sales_channels")
      .select("id, name_en, icon, is_active")
      .eq("is_active", true)
      .order("name_en")
      .then(({ data }) => {
        setChannelOptions(
          (data || []).map((c: any) => ({ id: c.id, label: `${c.icon || ""} ${c.name_en}`.trim() }))
        );
        setChannelsLoading(false);
      });
  }, []);

  const set = <K extends keyof BranchFormData>(key: K, value: BranchFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const addTax = () => {
    const newTax: BranchTax = {
      id: crypto.randomUUID(),
      tax_name: "",
      tax_type: "percentage",
      value: 0,
      apply_on: "before_discount",
      is_active: true,
      sort_order: form.taxes.length,
    };
    set("taxes", [...form.taxes, newTax]);
  };

  const updateTax = (index: number, updated: BranchTax) => {
    const taxes = [...form.taxes];
    taxes[index] = updated;
    set("taxes", taxes);
  };

  const deleteTax = (index: number) => {
    set("taxes", form.taxes.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Branch name is required";
    // Validate taxes
    form.taxes.forEach((tax, i) => {
      if (!tax.tax_name.trim()) newErrors[`tax_${i}_name`] = "Tax name required";
      if (tax.value <= 0) newErrors[`tax_${i}_value`] = "Value must be positive";
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const el = document.querySelector('[data-field="name"]');
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el?.querySelector("input") as HTMLInputElement)?.focus();
      return false;
    }
    return true;
  };

  const handleSaveClick = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        name_ar: form.name_ar.trim() || null,
        name_ur: form.name_ur.trim() || null,
        branch_code: form.branch_code.trim() || null,
        is_active: form.is_active,
        sales_channel_ids: form.sales_channel_ids,
        currency: form.currency,
        currency_symbol: CURRENCY_SYMBOLS[form.currency] || form.currency,
        pricing_mode: form.pricing_mode,
        rounding_rule: form.rounding_rule,
        // Keep legacy fields in sync
        vat_enabled: form.taxes.some((t) => t.is_active),
        vat_rate: form.taxes.find((t) => t.is_active && t.tax_type === "percentage")?.value || 0,
        order_types: [] as string[],
      };

      let savedBranchId = branchId;

      if (branchId) {
        const { error } = await supabase.from("branches").update(payload as any).eq("id", branchId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("branches").insert(payload as any).select("id").single();
        if (error) throw error;
        savedBranchId = data.id;
      }

      // Save taxes: delete existing, then insert new
      if (savedBranchId) {
        await supabase.from("branch_taxes").delete().eq("branch_id", savedBranchId);
        if (form.taxes.length > 0) {
          const taxRows = form.taxes.map((tax, i) => ({
            branch_id: savedBranchId!,
            tax_name: tax.tax_name,
            tax_type: tax.tax_type,
            value: tax.value,
            apply_on: tax.apply_on,
            is_active: tax.is_active,
            sort_order: i,
          }));
          const { error: taxError } = await supabase.from("branch_taxes").insert(taxRows as any);
          if (taxError) throw taxError;
        }
      }

      toast({ title: t("common.success"), description: branchId ? "Branch updated successfully" : "Branch created successfully" });
      navigate("/branches");
    } catch (error) {
      toast({ title: t("common.error"), description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="p-3 space-y-3 pb-16">
      <LoadingOverlay visible={isSaving} />

      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/branches")}>
          <BackIcon className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>
      </div>

      <div className="space-y-3">
        {/* Section 1: Basic Information */}
        <DashedSectionCard title="Basic Information" icon={Building2} variant="purple" id="section-basic">
          <div className="space-y-3">
            <div data-field="name">
              <CompactMultiLanguageInput
                label="Branch Name"
                required
                values={{ en: form.name, ar: form.name_ar, ur: form.name_ur }}
                onChange={(lang, val) => {
                  if (lang === "en") set("name", val);
                  else if (lang === "ar") set("name_ar", val);
                  else set("name_ur", val);
                }}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-lg font-medium">Branch Code</Label>
                <Input
                  value={form.branch_code}
                  onChange={(e) => set("branch_code", e.target.value.toUpperCase())}
                  placeholder="e.g., MAIN"
                  className="h-9 text-sm font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-lg font-medium">Currency</Label>
                <SearchableSelect
                  value={form.currency}
                  onChange={(v) => set("currency", v)}
                  options={CURRENCY_OPTIONS}
                  placeholder="Select currency..."
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Label className="text-lg font-medium">Pricing Mode</Label>
                  <TooltipInfo content="Determines how tax is applied to item prices in POS." />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {PRICING_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => set("pricing_mode", mode.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-md border text-sm transition-all",
                        form.pricing_mode === mode.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-input hover:bg-accent"
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-end gap-2 pb-1">
                <Label className="text-lg font-medium">Status</Label>
                <span className="text-sm text-muted-foreground">{form.is_active ? "Active" : "Inactive"}</span>
                <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
              </div>
            </div>
          </div>
        </DashedSectionCard>

        {/* Section 2: Sales Channels */}
        <DashedSectionCard title="Sales Channels" icon={Store} variant="green" id="section-channels">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Label className="text-lg font-medium">Active Channels</Label>
              <TooltipInfo content="Select which sales channels this branch supports. Only active channels are shown." />
            </div>
            <SearchableMultiSelect
              value={form.sales_channel_ids}
              onChange={(v) => set("sales_channel_ids", v)}
              options={channelOptions}
              placeholder="Select sales channels..."
              searchPlaceholder="Search channels..."
              isLoading={channelsLoading}
            />
          </div>
        </DashedSectionCard>

        {/* Section 3: Tax Configuration */}
        <DashedSectionCard title="Tax Configuration" icon={Receipt} variant="amber" id="section-tax">
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <TooltipInfo content="Configure multiple tax rules. Each can be percentage-based or fixed, applied before or after discounts." />
              <span className="text-xs text-muted-foreground">
                {form.taxes.length === 0 ? "No taxes configured" : `${form.taxes.length} tax rule(s)`}
              </span>
            </div>

            {form.taxes.map((tax, index) => (
              <BranchTaxRow
                key={tax.id}
                tax={tax}
                onChange={(updated) => updateTax(index, updated)}
                onDelete={() => deleteTax(index)}
              />
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addTax}
              type="button"
              className="text-base"
            >
              <Plus className="h-4 w-4 me-1.5" />
              Add Tax
            </Button>
          </div>
        </DashedSectionCard>

        {/* Section 4: Rounding Rules */}
        <DashedSectionCard title="Rounding Rules" icon={Calculator} variant="muted" id="section-rounding">
          <div className="flex gap-2 flex-wrap">
            {ROUNDING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("rounding_rule", opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md border text-sm transition-all",
                  form.rounding_rule === opt.value
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-input hover:bg-accent"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </DashedSectionCard>
      </div>

      {/* Sticky Footer */}
      <div className={cn(
        "fixed bottom-0 bg-background/95 backdrop-blur-sm border-t p-3 z-30",
        isRTL ? "right-0 left-[16rem]" : "left-[16rem] right-0"
      )}>
        <div className={cn("flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/branches")} disabled={isSaving} className="text-sm">
            <X className="h-4 w-4 me-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSaveClick} disabled={isSaving} className="text-sm">
            <Save className="h-4 w-4 me-1" /> {isSaving ? "Saving..." : "Save Branch"}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <BranchSaveConfirmModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirmSave}
        formData={form}
        channelOptions={channelOptions}
      />
    </div>
  );
}
