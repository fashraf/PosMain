import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { StatusBadge, YesNoBadge } from "@/components/shared/StatusBadge";
import { ViewDetailsModal } from "@/components/shared/ViewDetailsModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Building2, Eye, Edit, DollarSign, Receipt } from "lucide-react";

interface Branch {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  code: string;
  currency_code: string;
  vat_enabled: boolean;
  vat_percentage: number;
  is_active: boolean;
}

const currencies: Record<string, { symbol: string; name: string }> = {
  SAR: { symbol: "﷼", name: "Saudi Riyal" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  USD: { symbol: "$", name: "US Dollar" },
};

// Mock data
const initialBranches: Branch[] = [
  { id: "1", name_en: "Main Branch", name_ar: "الفرع الرئيسي", name_ur: "مین برانچ", code: "MAIN", currency_code: "SAR", vat_enabled: true, vat_percentage: 15, is_active: true },
  { id: "2", name_en: "Downtown", name_ar: "وسط المدينة", name_ur: "ڈاؤن ٹاؤن", code: "DOWNTOWN", currency_code: "SAR", vat_enabled: true, vat_percentage: 15, is_active: true },
  { id: "3", name_en: "Mall Outlet", name_ar: "منفذ المول", name_ur: "مال آؤٹ لیٹ", code: "MALL", currency_code: "USD", vat_enabled: false, vat_percentage: 0, is_active: false },
];

export default function Branches() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);

  const getLocalizedName = (branch: Branch) => {
    const nameKey = `name_${currentLanguage}` as keyof Branch;
    return (branch[nameKey] as string) || branch.name_en;
  };

  const filteredBranches = branches.filter((branch) => {
    const name = getLocalizedName(branch);
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           branch.code.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleToggleStatus = (branch: Branch) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === branch.id ? { ...b, is_active: !b.is_active } : b))
    );
    toast({
      title: branch.is_active ? t("common.deactivate") : t("common.activate"),
      description: `${branch.name_en} has been ${branch.is_active ? "deactivated" : "activated"}.`,
    });
  };

  const getViewSections = (branch: Branch) => [
    {
      title: t("branches.basicInfo"),
      fields: [
        { label: t("common.name") + " (EN)", value: branch.name_en, icon: Building2 },
        { label: t("common.name") + " (AR)", value: branch.name_ar },
        { label: t("common.name") + " (UR)", value: branch.name_ur },
        { label: t("branches.branchCode"), value: branch.code },
        { label: t("common.status"), value: <StatusBadge isActive={branch.is_active} /> },
      ],
    },
    {
      title: t("branches.currencySettings"),
      fields: [
        { label: t("branches.currency"), value: `${currencies[branch.currency_code]?.symbol} ${branch.currency_code} - ${currencies[branch.currency_code]?.name}`, icon: DollarSign },
      ],
    },
    {
      title: t("branches.taxSettings"),
      fields: [
        { label: t("branches.vatEnabled"), value: <YesNoBadge value={branch.vat_enabled} />, icon: Receipt },
        { label: t("branches.vatPercentage"), value: branch.vat_enabled ? `${branch.vat_percentage}%` : "-" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("branches.title")}</h1>
        <Button onClick={() => navigate("/branches/add")}>
          <Plus className="h-4 w-4 me-2" />
          {t("branches.addBranch")}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredBranches.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={t("common.noData")}
              description={searchQuery ? "No branches match your search." : t("branches.noBranches")}
              action={
                !searchQuery && (
                  <Button onClick={() => navigate("/branches/add")}>
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
                    <TableHead className="font-semibold">{t("common.name")}</TableHead>
                    <TableHead className="font-semibold">{t("branches.branchCode")}</TableHead>
                    <TableHead className="font-semibold">{t("branches.currency")}</TableHead>
                    <TableHead className="font-semibold">{t("branches.vatEnabled")}</TableHead>
                    <TableHead className="font-semibold">{t("common.status")}</TableHead>
                    <TableHead className="font-semibold text-end">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{getLocalizedName(branch)}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-sm">{branch.code}</code>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{currencies[branch.currency_code]?.symbol}</span>
                          <span className="text-muted-foreground">{branch.currency_code}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <YesNoBadge value={branch.vat_enabled} />
                        {branch.vat_enabled && (
                          <span className="ms-2 text-sm text-muted-foreground">({branch.vat_percentage}%)</span>
                        )}
                      </TableCell>
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
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setViewingBranch(branch)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/branches/${branch.id}/edit`)}>
                            <Edit className="h-4 w-4" />
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
          title={getLocalizedName(viewingBranch)}
          sections={getViewSections(viewingBranch)}
        />
      )}
    </div>
  );
}
