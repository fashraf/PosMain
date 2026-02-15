import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface FinanceBranchFilterProps {
  value: string | null;
  onChange: (branchId: string | null) => void;
}

export function FinanceBranchFilter({ value, onChange }: FinanceBranchFilterProps) {
  const { t } = useLanguage();
  const { data: branches = [] } = useQuery({
    queryKey: ["branches-finance"],
    queryFn: async () => {
      const { data } = await supabase.from("branches").select("id, name").eq("is_active", true).order("name");
      return data || [];
    },
  });

  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? null : v)}>
      <SelectTrigger className="w-[200px] h-8 text-xs">
        <SelectValue placeholder={t("common.allBranches")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("common.allBranches")}</SelectItem>
        {branches.map((b) => (
          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
