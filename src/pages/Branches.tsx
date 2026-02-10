import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ViewDetailsModal } from "@/components/shared/ViewDetailsModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Building2, Eye, Edit } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string | null;
  is_active: boolean;
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
    if (!error) setBranches(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchBranches(); }, []);

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.address || "").toLowerCase().includes(searchQuery.toLowerCase())
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
    toast({
      title: newStatus ? t("common.activate") : t("common.deactivate"),
      description: `${branch.name} has been ${newStatus ? "activated" : "deactivated"}.`,
    });
  };

  const getViewSections = (branch: Branch) => [
    {
      title: t("branches.basicInfo"),
      fields: [
        { label: t("common.name"), value: branch.name, icon: Building2 },
        { label: "Address", value: branch.address || "—" },
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("branches.title")}</h1>
        <Button onClick={() => navigate("/branches/add")} size="sm">
          <Plus className="h-4 w-4 me-2" />
          {t("branches.addBranch")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="relative max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 h-8 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          {filteredBranches.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={t("common.noData")}
              description={searchQuery ? "No branches match your search." : t("branches.noBranches")}
              action={
                !searchQuery && (
                  <Button onClick={() => navigate("/branches/add")} size="sm">
                    <Plus className="h-4 w-4 me-2" />
                    {t("branches.addBranch")}
                  </Button>
                )
              }
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-xs">{t("common.name")}</TableHead>
                    <TableHead className="font-semibold text-xs">Address</TableHead>
                    <TableHead className="font-semibold text-xs">{t("common.status")}</TableHead>
                    <TableHead className="font-semibold text-xs text-end">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium text-xs">{branch.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{branch.address || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={branch.is_active}
                            onCheckedChange={() => handleToggleStatus(branch)}
                          />
                          <StatusBadge isActive={branch.is_active} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
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
