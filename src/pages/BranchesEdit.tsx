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
import { MultiLanguageInput } from "@/components/shared/MultiLanguageInput";
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
  { id: "1", name_en: "Main Branch", name_ar: "الفرع الرئيسي", name_ur: "مین برانچ", code: "MAIN", currency_code: "SAR", vat_enabled: true, vat_percentage: 15, additional_taxes: [] as AdditionalTax[], is_active: true },
  { id: "2", name_en: "Downtown", name_ar: "وسط المدينة", name_ur: "ڈاؤن ٹاؤن", code: "DOWNTOWN", currency_code: "SAR", vat_enabled: true, vat_percentage: 15, additional_taxes: [], is_active: true },
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
    currency_code: "SAR",
    vat_enabled: false,
    vat_percentage: 15,
    additional_taxes: [] as AdditionalTax[],
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
        currency_code: branch.currency_code,
        vat_enabled: branch.vat_enabled,
        vat_percentage: branch.vat_percentage,
        additional_taxes: branch.additional_taxes,
        is_active: branch.is_active,
      };
      setInitialData(data);
      setFormData(data);
    }
  }, [id]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
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
    if (formData.currency_code !== initialData.currency_code) {
      const oldCur = getCurrency(initialData.currency_code);
      const newCur = getCurrency(formData.currency_code);
      changes.push({ field: t("branches.currency"), oldValue: `${oldCur?.symbol} ${oldCur?.name}`, newValue: `${newCur?.symbol} ${newCur?.name}` });
    }
    if (formData.vat_enabled !== initialData.vat_enabled) {
      changes.push({ field: t("branches.vatEnabled"), oldValue: initialData.vat_enabled ? t("common.yes") : t("common.no"), newValue: formData.vat_enabled ? t("common.yes") : t("common.no") });
    }
    if (formData.vat_percentage !== initialData.vat_percentage) {
      changes.push({ field: t("branches.vatPercentage"), oldValue: `${initialData.vat_percentage}%`, newValue: `${formData.vat_percentage}%` });
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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/branches")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{t("branches.editBranch")}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader><CardTitle className="text-lg">{t("branches.basicInfo")}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <MultiLanguageInput label={t("branches.branchName")} values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }} onChange={handleNameChange} required />

          <div className="space-y-2">
            <Label htmlFor="code">{t("branches.branchCode")}</Label>
            <Input id="code" value={formData.code} onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s+/g, "_") }))} required />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="status">{t("common.status")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{formData.is_active ? t("common.active") : t("common.inactive")}</span>
              <Switch id="status" checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2">{t("branches.currencySettings")}<TooltipInfo content={t("tooltips.currency")} /></CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>{t("branches.currency")}</Label>
            <Select value={formData.currency_code} onValueChange={(value) => setFormData((prev) => ({ ...prev, currency_code: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
        </CardContent>
      </Card>

      {/* Tax & VAT Settings */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2">{t("branches.taxSettings")}<TooltipInfo content={t("tooltips.vatField")} /></CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="vatEnabled">{t("branches.vatEnabled")}</Label>
            <Switch id="vatEnabled" checked={formData.vat_enabled} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, vat_enabled: checked }))} />
          </div>

          {formData.vat_enabled && (
            <div className="space-y-2">
              <Label htmlFor="vatPercentage">{t("branches.vatPercentage")}</Label>
              <div className="relative max-w-[200px]">
                <Input id="vatPercentage" type="number" min="0" max="100" step="0.01" value={formData.vat_percentage} onChange={(e) => setFormData((prev) => ({ ...prev, vat_percentage: parseFloat(e.target.value) || 0 }))} className="pe-8" />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <Label>{t("branches.additionalTaxes")}</Label>
              <Button variant="outline" size="sm" onClick={addTax}><Plus className="h-4 w-4 me-2" />{t("branches.addTax")}</Button>
            </div>

            {formData.additional_taxes.length > 0 && (
              <div className="space-y-3">
                {formData.additional_taxes.map((tax) => (
                  <div key={tax.id} className="flex items-center gap-3">
                    <Input placeholder={t("branches.taxName")} value={tax.name} onChange={(e) => updateTax(tax.id, "name", e.target.value)} className="flex-1" />
                    <div className="relative w-[120px]">
                      <Input type="number" min="0" max="100" step="0.01" value={tax.percentage} onChange={(e) => updateTax(tax.id, "percentage", parseFloat(e.target.value) || 0)} className="pe-8" />
                      <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeTax(tax.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div className={cn("fixed bottom-0 inset-x-0 bg-background border-t p-4 z-10", "flex items-center gap-3", isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4")}>
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/branches")} disabled={isSaving}><X className="h-4 w-4 me-2" />{t("common.cancel")}</Button>
          <Button onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 me-2" />{t("common.save")}</Button>
        </div>
      </div>

      <ConfirmChangesModal open={showConfirmModal} onOpenChange={setShowConfirmModal} onConfirm={handleConfirmSave} changes={getChanges} isLoading={isSaving} />
    </div>
  );
}
