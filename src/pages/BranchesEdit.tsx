import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { CheckboxGroup } from "@/components/shared/CheckboxGroup";
import { CompactRadioGroup } from "@/components/shared/CompactRadioGroup";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

interface AdditionalTax {
  id: string;
  name: string;
  percentage: number;
}

// Mock data
const mockBranches = [
  { 
    id: "1", 
    name_en: "Main Branch", 
    name_ar: "الفرع الرئيسي", 
    name_ur: "مین برانچ", 
    code: "MAIN", 
    order_types: ["dine_in", "takeaway", "delivery"],
    delivery_internal: true,
    delivery_aggregator: true,
    aggregators: ["uber_eats", "talabat"],
    currency_code: "SAR", 
    pricing_mode: "exclusive" as const,
    vat_enabled: true, 
    vat_percentage: 15, 
    additional_taxes: [] as AdditionalTax[], 
    rounding_rule: "0.05" as const,
    is_active: true 
  },
  { 
    id: "2", 
    name_en: "Downtown", 
    name_ar: "وسط المدينة", 
    name_ur: "ڈاؤن ٹاؤن", 
    code: "DOWNTOWN", 
    order_types: ["dine_in", "takeaway"],
    delivery_internal: false,
    delivery_aggregator: false,
    aggregators: [],
    currency_code: "SAR", 
    pricing_mode: "inclusive" as const,
    vat_enabled: true, 
    vat_percentage: 15, 
    additional_taxes: [],
    rounding_rule: "none" as const,
    is_active: true 
  },
];

export default function BranchesEdit() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    code: "",
    order_types: [] as string[],
    delivery_internal: false,
    delivery_aggregator: false,
    aggregators: [] as string[],
    currency_code: "SAR",
    pricing_mode: "exclusive" as "inclusive" | "exclusive",
    vat_enabled: false,
    vat_percentage: 15,
    additional_taxes: [] as AdditionalTax[],
    rounding_rule: "none" as "none" | "0.05" | "0.10" | "1.00",
    is_active: true,
  });

  const [formData, setFormData] = useState({ ...initialData });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const branch = mockBranches.find((b) => b.id === id);
    if (branch) {
      const data = {
        name_en: branch.name_en,
        name_ar: branch.name_ar,
        name_ur: branch.name_ur,
        code: branch.code,
        order_types: branch.order_types,
        delivery_internal: branch.delivery_internal,
        delivery_aggregator: branch.delivery_aggregator,
        aggregators: branch.aggregators,
        currency_code: branch.currency_code,
        pricing_mode: branch.pricing_mode,
        vat_enabled: branch.vat_enabled,
        vat_percentage: branch.vat_percentage,
        additional_taxes: branch.additional_taxes,
        rounding_rule: branch.rounding_rule,
        is_active: branch.is_active,
      };
      setInitialData(data);
      setFormData(data);
    }
  }, [id]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleOrderTypesChange = (types: string[]) => {
    setFormData((prev) => {
      const hasDelivery = types.includes("delivery");
      return {
        ...prev,
        order_types: types,
        delivery_internal: hasDelivery ? prev.delivery_internal : false,
        delivery_aggregator: hasDelivery ? prev.delivery_aggregator : false,
        aggregators: hasDelivery ? prev.aggregators : [],
      };
    });
  };

  const addTax = () => {
    setFormData((prev) => ({
      ...prev,
      additional_taxes: [...prev.additional_taxes, { id: Date.now().toString(), name: "", percentage: 0 }],
    }));
  };

  const removeTax = (taxId: string) => {
    setFormData((prev) => ({
      ...prev,
      additional_taxes: prev.additional_taxes.filter((tax) => tax.id !== taxId),
    }));
  };

  const updateTax = (taxId: string, field: "name" | "percentage", value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      additional_taxes: prev.additional_taxes.map((tax) =>
        tax.id === taxId ? { ...tax, [field]: value } : tax
      ),
    }));
  };

  const getChanges = useMemo((): Change[] => {
    const changes: Change[] = [];
    const getCurrency = (code: string) => currencies.find((c) => c.code === code);

    if (formData.name_en !== initialData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: initialData.name_en, newValue: formData.name_en });
    if (formData.name_ar !== initialData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: initialData.name_ar, newValue: formData.name_ar });
    if (formData.name_ur !== initialData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: initialData.name_ur, newValue: formData.name_ur });
    if (formData.code !== initialData.code) changes.push({ field: t("branches.branchCode"), oldValue: initialData.code, newValue: formData.code });
    
    if (JSON.stringify(formData.order_types) !== JSON.stringify(initialData.order_types)) {
      const oldTypes = initialData.order_types.map(type => t(`branches.${type === "dine_in" ? "dineIn" : type}` as any)).join(", ");
      const newTypes = formData.order_types.map(type => t(`branches.${type === "dine_in" ? "dineIn" : type}` as any)).join(", ");
      changes.push({ field: t("branches.orderTypes"), oldValue: oldTypes, newValue: newTypes });
    }
    
    if (formData.currency_code !== initialData.currency_code) {
      const oldCur = getCurrency(initialData.currency_code);
      const newCur = getCurrency(formData.currency_code);
      changes.push({ field: t("branches.currency"), oldValue: `${oldCur?.symbol} ${oldCur?.name}`, newValue: `${newCur?.symbol} ${newCur?.name}` });
    }
    
    if (formData.pricing_mode !== initialData.pricing_mode) {
      changes.push({ 
        field: t("branches.pricingMode"), 
        oldValue: initialData.pricing_mode === "inclusive" ? t("branches.inclusivePricing") : t("branches.exclusivePricing"),
        newValue: formData.pricing_mode === "inclusive" ? t("branches.inclusivePricing") : t("branches.exclusivePricing")
      });
    }
    
    if (formData.vat_enabled !== initialData.vat_enabled) {
      changes.push({ field: t("branches.vatEnabled"), oldValue: initialData.vat_enabled ? t("common.yes") : t("common.no"), newValue: formData.vat_enabled ? t("common.yes") : t("common.no") });
    }
    if (formData.vat_percentage !== initialData.vat_percentage) {
      changes.push({ field: t("branches.vatPercentage"), oldValue: `${initialData.vat_percentage}%`, newValue: `${formData.vat_percentage}%` });
    }
    
    if (formData.rounding_rule !== initialData.rounding_rule) {
      const roundingLabels: Record<string, string> = {
        none: t("branches.noRounding"),
        "0.05": t("branches.roundTo005"),
        "0.10": t("branches.roundTo010"),
        "1.00": t("branches.roundToWhole"),
      };
      changes.push({ field: t("branches.roundingRules"), oldValue: roundingLabels[initialData.rounding_rule], newValue: roundingLabels[formData.rounding_rule] });
    }
    
    if (formData.is_active !== initialData.is_active) {
      changes.push({ field: t("common.status"), oldValue: initialData.is_active ? t("common.active") : t("common.inactive"), newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    }
    return changes;
  }, [formData, initialData, t]);

  const handleSave = () => {
    if (!formData.name_en || !formData.code) {
      toast({ title: "Validation Error", description: "Please fill in required fields.", variant: "destructive" });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast({ title: t("branches.editBranch"), description: `${formData.name_en} has been updated.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/branches");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const orderTypeOptions = [
    { id: "dine_in", label: t("branches.dineIn") },
    { id: "takeaway", label: t("branches.takeaway") },
    { id: "delivery", label: t("branches.delivery") },
  ];

  const aggregatorOptions = [
    { id: "uber_eats", label: t("branches.uberEats") },
    { id: "talabat", label: t("branches.talabat") },
    { id: "jahez", label: t("branches.jahez") },
    { id: "zomato", label: t("branches.zomato") },
    { id: "swiggy", label: t("branches.swiggy") },
  ];

  const pricingModeOptions = [
    { value: "inclusive", label: t("branches.inclusivePricing"), description: t("branches.inclusiveDescription") },
    { value: "exclusive", label: t("branches.exclusivePricing"), description: t("branches.exclusiveDescription") },
  ];

  const roundingOptions = [
    { value: "none", label: t("branches.noRounding") },
    { value: "0.05", label: t("branches.roundTo005") },
    { value: "0.10", label: t("branches.roundTo010") },
    { value: "1.00", label: t("branches.roundToWhole") },
  ];

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/branches")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{t("branches.editBranch")}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("branches.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CompactMultiLanguageInput
              label={t("branches.branchName")}
              values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
              onChange={handleNameChange}
              required
            />
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-sm">{t("branches.branchCode")}</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s+/g, "_") }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="status" className="text-sm">{t("common.status")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{formData.is_active ? t("common.active") : t("common.inactive")}</span>
              <Switch id="status" checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{t("branches.orderTypes")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CheckboxGroup
            options={orderTypeOptions}
            value={formData.order_types}
            onChange={handleOrderTypesChange}
          />

          {formData.order_types.includes("delivery") && (
            <CollapsibleSection title={t("branches.deliveryOptions")} defaultOpen={true}>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="internal_delivery"
                    checked={formData.delivery_internal}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, delivery_internal: checked }))}
                  />
                  <Label htmlFor="internal_delivery" className="text-sm font-normal">{t("branches.internalDelivery")}</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="aggregator_delivery"
                    checked={formData.delivery_aggregator}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, delivery_aggregator: checked, aggregators: checked ? prev.aggregators : [] }))}
                  />
                  <Label htmlFor="aggregator_delivery" className="text-sm font-normal">{t("branches.aggregatorDelivery")}</Label>
                </div>

                {formData.delivery_aggregator && (
                  <div className="ps-6">
                    <CheckboxGroup
                      options={aggregatorOptions}
                      value={formData.aggregators}
                      onChange={(aggs) => setFormData((prev) => ({ ...prev, aggregators: aggs }))}
                      columns={3}
                    />
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}
        </CardContent>
      </Card>

      {/* Currency & Pricing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {t("branches.currencyAndPricing")}
            <TooltipInfo content={t("branches.pricingModeTooltip")} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">{t("branches.currency")}</Label>
              <Select value={formData.currency_code} onValueChange={(value) => setFormData((prev) => ({ ...prev, currency_code: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{currency.symbol}</span>
                        <span>{currency.name}</span>
                        <span className="text-muted-foreground">({currency.code})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CompactRadioGroup
              label={t("branches.pricingMode")}
              options={pricingModeOptions}
              value={formData.pricing_mode}
              onChange={(value) => setFormData((prev) => ({ ...prev, pricing_mode: value as "inclusive" | "exclusive" }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax & VAT Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {t("branches.taxSettings")}
            <TooltipInfo content={t("tooltips.vatField")} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="vatEnabled" checked={formData.vat_enabled} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, vat_enabled: checked }))} />
              <Label htmlFor="vatEnabled" className="text-sm font-normal">{t("branches.vatEnabled")}</Label>
            </div>

            {formData.vat_enabled && (
              <div className="flex items-center gap-2">
                <Label htmlFor="vatPercentage" className="text-sm text-muted-foreground">{t("branches.vatPercentage")}:</Label>
                <div className="relative w-24">
                  <Input
                    id="vatPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.vat_percentage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vat_percentage: parseFloat(e.target.value) || 0 }))}
                    className="pe-7 h-8"
                  />
                  <span className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Taxes */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm">{t("branches.additionalTaxes")}</Label>
              <Button variant="outline" size="sm" onClick={addTax} className="h-7 text-xs">
                <Plus className="h-3 w-3 me-1" />
                {t("branches.addTax")}
              </Button>
            </div>

            {formData.additional_taxes.length > 0 && (
              <div className="space-y-2">
                {formData.additional_taxes.map((tax) => (
                  <div key={tax.id} className="flex items-center gap-2">
                    <Input
                      placeholder={t("branches.taxName")}
                      value={tax.name}
                      onChange={(e) => updateTax(tax.id, "name", e.target.value)}
                      className="flex-1 h-8"
                    />
                    <div className="relative w-20">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={tax.percentage}
                        onChange={(e) => updateTax(tax.id, "percentage", parseFloat(e.target.value) || 0)}
                        className="pe-6 h-8"
                      />
                      <span className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeTax(tax.id)} className="h-8 w-8">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rounding Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {t("branches.roundingRules")}
            <TooltipInfo content={t("branches.roundingTooltip")} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompactRadioGroup
            options={roundingOptions}
            value={formData.rounding_rule}
            onChange={(value) => setFormData((prev) => ({ ...prev, rounding_rule: value as any }))}
            orientation="horizontal"
          />
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-3 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/branches")} disabled={isSaving}><X className="h-4 w-4 me-1" />{t("common.cancel")}</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 me-1" />{t("common.save")}</Button>
        </div>
      </div>

      <ConfirmChangesModal open={showConfirmModal} onOpenChange={setShowConfirmModal} onConfirm={handleConfirmSave} changes={getChanges} isLoading={isSaving} />
    </div>
  );
}
