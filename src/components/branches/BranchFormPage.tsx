import { useState } from "react";
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
import { CheckboxGroup } from "@/components/shared/CheckboxGroup";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { CompactRadioGroup } from "@/components/shared/CompactRadioGroup";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { ArrowLeft, ArrowRight, Save, X, Building2, ShoppingBag, Coins, Receipt, Calculator } from "lucide-react";
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

const ORDER_TYPE_OPTIONS = [
  { id: "dine_in", label: "Dine-In" },
  { id: "takeaway", label: "Takeaway" },
  { id: "delivery", label: "Delivery" },
];

const PRICING_MODE_OPTIONS = [
  { value: "inclusive", label: "Inclusive", description: "Prices already include tax" },
  { value: "exclusive", label: "Exclusive", description: "Tax added on top of prices" },
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
  order_types: string[];
  currency: string;
  pricing_mode: string;
  vat_enabled: boolean;
  vat_rate: string;
  rounding_rule: string;
}

interface BranchFormPageProps {
  title: string;
  initialData?: BranchFormData;
  branchId?: string;
}

const defaultData: BranchFormData = {
  name: "", name_ar: "", name_ur: "", branch_code: "",
  is_active: true, order_types: [], currency: "SAR",
  pricing_mode: "exclusive", vat_enabled: false, vat_rate: "15",
  rounding_rule: "none",
};

export default function BranchFormPage({ title, initialData, branchId }: BranchFormPageProps) {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<BranchFormData>(initialData || defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof BranchFormData>(key: K, value: BranchFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Branch name is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const el = document.querySelector('[data-field="name"]');
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el?.querySelector("input") as HTMLInputElement)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        name_ar: form.name_ar.trim() || null,
        name_ur: form.name_ur.trim() || null,
        branch_code: form.branch_code.trim() || null,
        is_active: form.is_active,
        order_types: form.order_types,
        currency: form.currency,
        currency_symbol: CURRENCY_SYMBOLS[form.currency] || form.currency,
        pricing_mode: form.pricing_mode,
        vat_enabled: form.vat_enabled,
        vat_rate: form.vat_enabled ? parseFloat(form.vat_rate) || 0 : 0,
        rounding_rule: form.rounding_rule,
      };

      if (branchId) {
        const { error } = await supabase.from("branches").update(payload as any).eq("id", branchId);
        if (error) throw error;
        toast({ title: t("common.success"), description: "Branch updated successfully" });
      } else {
        const { error } = await supabase.from("branches").insert(payload as any);
        if (error) throw error;
        toast({ title: t("common.success"), description: "Branch created successfully" });
      }
      navigate("/branches");
    } catch (error) {
      toast({ title: t("common.error"), description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="p-1 space-y-1.5 pb-14">
      <LoadingOverlay visible={isSaving} />

      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/branches")}>
          <BackIcon className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>
      </div>

      <div className="max-w-2xl space-y-1.5">
        {/* Section 1: Basic Information */}
        <DashedSectionCard title="Basic Information" icon={Building2} variant="purple" id="section-basic">
          <div className="space-y-1.5">
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
              {errors.name && <p className="text-[10px] text-destructive mt-0.5">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-1.5 items-end">
              <div className="space-y-0.5">
                <Label className="text-xs">Branch Code</Label>
                <Input
                  value={form.branch_code}
                  onChange={(e) => set("branch_code", e.target.value.toUpperCase())}
                  placeholder="e.g., MAIN"
                  className="h-7 text-xs font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-1.5 pb-0.5">
                <Label className="text-xs">Status</Label>
                <span className="text-xs text-muted-foreground">{form.is_active ? t("common.active") : t("common.inactive")}</span>
                <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
              </div>
            </div>
          </div>
        </DashedSectionCard>

        {/* Section 2: Order Types */}
        <DashedSectionCard title="Order Types" icon={ShoppingBag} variant="green" id="section-orders">
          <CheckboxGroup
            options={ORDER_TYPE_OPTIONS}
            value={form.order_types}
            onChange={(v) => set("order_types", v)}
            columns={3}
          />
        </DashedSectionCard>

        {/* Section 3: Currency & Pricing */}
        <DashedSectionCard title="Currency & Pricing" icon={Coins} variant="blue" id="section-currency">
          <div className="space-y-1.5">
            <div className="space-y-0.5">
              <Label className="text-xs">Currency</Label>
              <SearchableSelect
                value={form.currency}
                onChange={(v) => set("currency", v)}
                options={CURRENCY_OPTIONS}
                placeholder="Select currency..."
                className="h-7 text-xs"
              />
            </div>
            <CompactRadioGroup
              label="Pricing Mode"
              options={PRICING_MODE_OPTIONS}
              value={form.pricing_mode}
              onChange={(v) => set("pricing_mode", v)}
            />
          </div>
        </DashedSectionCard>

        {/* Section 4: Tax & VAT Settings */}
        <DashedSectionCard title="Tax & VAT Settings" icon={Receipt} variant="amber" id="section-vat">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">VAT Enabled</Label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{form.vat_enabled ? "Yes" : "No"}</span>
                <Switch checked={form.vat_enabled} onCheckedChange={(v) => set("vat_enabled", v)} />
              </div>
            </div>
            {form.vat_enabled && (
              <div className="space-y-0.5">
                <Label className="text-xs">VAT Rate (%)</Label>
                <Input
                  type="number"
                  value={form.vat_rate}
                  onChange={(e) => set("vat_rate", e.target.value)}
                  placeholder="15"
                  className="h-7 text-xs max-w-[120px]"
                  min="0"
                  max="100"
                />
              </div>
            )}
          </div>
        </DashedSectionCard>

        {/* Section 5: Rounding Rules */}
        <DashedSectionCard title="Rounding Rules" icon={Calculator} variant="muted" id="section-rounding">
          <CompactRadioGroup
            options={ROUNDING_OPTIONS}
            value={form.rounding_rule}
            onChange={(v) => set("rounding_rule", v)}
            orientation="horizontal"
          />
        </DashedSectionCard>
      </div>

      {/* Sticky Footer */}
      <div className={cn(
        "fixed bottom-0 bg-background/95 backdrop-blur-sm border-t p-2 z-30",
        isRTL ? "right-0 left-[16rem]" : "left-[16rem] right-0"
      )}>
        <div className={cn("flex gap-1.5 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/branches")} disabled={isSaving} className="h-7 text-xs">
            <X className="h-3 w-3 me-1" /> {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-7 text-xs">
            <Save className="h-3 w-3 me-1" /> {isSaving ? t("common.loading") : "Save Branch"}
          </Button>
        </div>
      </div>
    </div>
  );
}
