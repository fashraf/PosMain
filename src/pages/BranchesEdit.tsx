import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BranchFormPage, { BranchFormData } from "@/components/branches/BranchFormPage";
import type { BranchTax } from "@/components/branches/BranchTaxRow";

export default function BranchesEdit() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState<BranchFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("branches").select("*").eq("id", id).single(),
      supabase.from("branch_taxes").select("*").eq("branch_id", id).order("sort_order"),
    ]).then(([branchRes, taxRes]) => {
      if (branchRes.error || !branchRes.data) {
        toast({ title: t("common.error"), description: "Branch not found", variant: "destructive" });
        navigate("/branches");
        return;
      }
      const d = branchRes.data as any;
      const taxes: BranchTax[] = (taxRes.data || []).map((t: any) => ({
        id: t.id,
        tax_name: t.tax_name,
        tax_type: t.tax_type,
        value: t.value,
        apply_on: t.apply_on,
        is_active: t.is_active,
        sort_order: t.sort_order,
      }));

      setInitialData({
        name: d.name || "",
        name_ar: d.name_ar || "",
        name_ur: d.name_ur || "",
        branch_code: d.branch_code || "",
        is_active: d.is_active,
        sales_channel_ids: d.sales_channel_ids || [],
        currency: d.currency || "SAR",
        pricing_mode: d.pricing_mode || "exclusive",
        rounding_rule: d.rounding_rule || "none",
        taxes,
      });
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <BranchFormPage title={t("branches.editBranch")} initialData={initialData!} branchId={id} />;
}
