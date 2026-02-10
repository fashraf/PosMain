import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BranchFormPage, { BranchFormData } from "@/components/branches/BranchFormPage";

export default function BranchesEdit() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState<BranchFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("branches")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: t("common.error"), description: "Branch not found", variant: "destructive" });
          navigate("/branches");
          return;
        }
        const d = data as any;
        setInitialData({
          name: d.name || "",
          name_ar: d.name_ar || "",
          name_ur: d.name_ur || "",
          branch_code: d.branch_code || "",
          is_active: d.is_active,
          order_types: d.order_types || [],
          currency: d.currency || "SAR",
          pricing_mode: d.pricing_mode || "exclusive",
          vat_enabled: d.vat_enabled || false,
          vat_rate: String(d.vat_rate ?? 15),
          rounding_rule: d.rounding_rule || "none",
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
