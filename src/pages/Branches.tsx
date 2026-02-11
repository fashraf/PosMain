import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { StatusBadge, YesNoBadge } from "@/components/shared/StatusBadge";
import { ViewDetailsModal } from "@/components/shared/ViewDetailsModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Building2, Eye, Edit } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  name_ar: string | null;
  name_ur: string | null;
  branch_code: string | null;
  address: string | null;
  is_active: boolean;
  currency: string;
  currency_symbol: string;
  vat_enabled: boolean;
  vat_rate: number;
  pricing_mode: string;
  rounding_rule: string;
  order_types: string[];
  sales_channel_ids: string[];
  created_at: string;
}

export default function Branches() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("name");
    if (!error) setBranches((data as any) || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchBranches(); }, []);

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.branch_code || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (branch: Branch) => {
    const newStatus = !branch.is_active;
    const { error } = await supabase
      .from("branches")
      .update({ is_active: newStatus })
      .eq("id", branch.id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
      return;
    }
    setBranches((prev) => prev.map((b) => b.id === branch.id ? { ...b, is_active: newStatus } : b));
  };

  const getViewSections = (branch: Branch) => [
    {
      title: "Basic Information",
      fields: [
        { label: t("common.name"), value: branch.name, icon: Building2 },
        { label: "Branch Code", value: branch.branch_code || "—" },
        { label: "Currency", value: `${branch.currency_symbol} ${branch.currency}` },
        { label: "VAT", value: branch.vat_enabled ? `Yes (${branch.vat_rate}%)` : "No" },
        { label: "Pricing Mode", value: branch.pricing_mode },
        { label: "Rounding", value: branch.rounding_rule === "none" ? "None" : branch.rounding_rule },
        { label: "Sales Channels", value: `${(branch.sales_channel_ids || []).length} channel(s)` },
        { label: t("common.status"), value: <StatusBadge isActive={branch.is_active} /> },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-2 p-1">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">{t("branches.title")}</h1>
        <Button onClick={() => navigate("/branches/add")} size="sm" className="h-7 text-xs">
          <Plus className="h-3.5 w-3.5 me-1" />
          {t("branches.addBranch")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-3 pb-2">
          <div className="relative max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-7 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-2 pb-2">
          {filteredBranches.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={t("common.noData")}
              description={searchQuery ? "No branches match your search." : t("branches.noBranches")}
              action={!searchQuery && (
                <Button onClick={() => navigate("/branches/add")} size="sm" className="h-7 text-xs">
                  <Plus className="h-3.5 w-3.5 me-1" /> {t("branches.addBranch")}
                </Button>
              )}
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-xs">{t("common.name")}</TableHead>
                    <TableHead className="font-semibold text-xs">Branch Code</TableHead>
                    <TableHead className="font-semibold text-xs">Currency</TableHead>
                    <TableHead className="font-semibold text-xs">VAT Enabled</TableHead>
                    <TableHead className="font-semibold text-xs">{t("common.status")}</TableHead>
                    <TableHead className="font-semibold text-xs text-end">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium text-xs py-1.5">{branch.name}</TableCell>
                      <TableCell className="py-1.5">
                        {branch.branch_code ? (
                          <Badge variant="outline" className="font-mono text-[11px]">{branch.branch_code}</Badge>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-xs py-1.5">
                        <span className="text-muted-foreground">{branch.currency_symbol}</span>{" "}
                        <span>{branch.currency}</span>
                      </TableCell>
                      <TableCell className="py-1.5">
                        <div className="flex items-center gap-1">
                          <YesNoBadge value={branch.vat_enabled} />
                          {branch.vat_enabled && (
                            <span className="text-[11px] text-muted-foreground">({branch.vat_rate}%)</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5">
                        <div className="flex items-center gap-1.5">
                          <Switch
                            checked={branch.is_active}
                            onCheckedChange={() => handleToggleStatus(branch)}
                          />
                          <StatusBadge isActive={branch.is_active} />
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewingBranch(branch)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/branches/${branch.id}/edit`)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {viewingBranch && (
        <ViewDetailsModal
          open={!!viewingBranch}
          onOpenChange={() => setViewingBranch(null)}
          title={viewingBranch.name}
          sections={getViewSections(viewingBranch)}
        />
      )}
    </div>
  );
}
