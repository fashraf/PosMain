import { useState, useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { SimplePagination } from "@/components/maintenance/SimplePagination";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import {
  MaintenanceDialog,
  MaintenanceTable,
  MaintenanceColumn,
  DeleteConfirmModal,
  SaveConfirmModal,
} from "@/components/maintenance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Unit {
  id: string;
  name_en: string;
  name_ar: string | null;
  name_ur: string | null;
  symbol: string;
  base_unit_id: string | null;
  conversion_factor: number;
  is_active: boolean;
  created_at: string;
  base_unit?: { id: string; name_en: string; symbol: string };
}

const emptyForm = {
  name: { en: "", ar: "", ur: "" },
  symbol: "",
  base_unit_id: "",
  conversion_factor: 1,
  is_active: true,
};

export default function UnitsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [data, setData] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Unit | null>(null);
  const [deletingItem, setDeletingItem] = useState<Unit | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const fetchData = async () => {
    setIsLoading(true);
    const { data: items, error } = await supabase
      .from("units")
      .select("*, base_unit:base_unit_id(id, name_en, symbol)")
      .order("name_en");

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      setData(items || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.is_active) ||
        (statusFilter === "inactive" && !item.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const baseUnitOptions = useMemo(() => {
    return data
      .filter((u) => !u.base_unit_id && u.is_active)
      .map((u) => ({ id: u.id, label: `${u.name_en} (${u.symbol})` }));
  }, [data]);

  const handleAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (item: Unit) => {
    setEditingItem(item);
    setForm({
      name: { en: item.name_en, ar: item.name_ar || "", ur: item.name_ur || "" },
      symbol: item.symbol,
      base_unit_id: item.base_unit_id || "",
      conversion_factor: item.conversion_factor,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleSaveClick = () => {
    if (!form.name.en.trim()) {
      toast({ title: t("common.error"), description: "English name is required", variant: "destructive" });
      return;
    }
    if (!form.symbol.trim()) {
      toast({ title: t("common.error"), description: "Symbol is required", variant: "destructive" });
      return;
    }
    setSaveConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setSaveConfirmOpen(false);

    const payload = {
      name_en: form.name.en.trim(),
      name_ar: form.name.ar.trim() || null,
      name_ur: form.name.ur.trim() || null,
      symbol: form.symbol.trim(),
      base_unit_id: form.base_unit_id || null,
      conversion_factor: form.conversion_factor,
      is_active: form.is_active,
    };

    let error;
    if (editingItem) {
      ({ error } = await supabase
        .from("units")
        .update(payload)
        .eq("id", editingItem.id));
    } else {
      ({ error } = await supabase.from("units").insert(payload));
    }

    setIsSaving(false);

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success"), description: editingItem ? "Unit updated" : "Unit added" });
      setDialogOpen(false);
      fetchData();
    }
  };

  const handleToggleStatus = async (item: Unit) => {
    const { error } = await supabase
      .from("units")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      fetchData();
    }
  };

  const handleDeleteClick = (item: Unit) => {
    setDeletingItem(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("units")
      .delete()
      .eq("id", deletingItem.id);

    setIsSaving(false);
    setDeleteConfirmOpen(false);

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success"), description: "Unit deleted" });
      setDeletingItem(null);
      fetchData();
    }
  };

  const columns: MaintenanceColumn<Unit>[] = [
    {
      key: "name_en",
      header: t("common.name"),
      render: (item) => (
        <div>
          <span className="font-medium">{item.name_en}</span>
          {item.name_ar && <span className="text-muted-foreground text-[11px] ms-2">({item.name_ar})</span>}
        </div>
      ),
    },
    {
      key: "symbol",
      header: t("maintenance.symbol"),
      render: (item) => (
        <Badge variant="outline" className="text-[11px] font-mono">
          {item.symbol}
        </Badge>
      ),
      className: "w-24",
    },
    {
      key: "conversion_factor",
      header: t("maintenance.conversionFactor"),
      render: (item) => (
        <span className="text-muted-foreground">
          {item.base_unit
            ? `${item.conversion_factor} ${item.base_unit.symbol}`
            : "Base Unit"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: t("common.status"),
      render: (item) => <StatusBadge isActive={item.is_active} />,
      className: "w-24",
    },
  ];

  return (
    <div className="space-y-6">
      <LoadingOverlay visible={isSaving} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("maintenance.title")} - {t("maintenance.units")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage measurement units and conversions
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("maintenance.addNew")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">{t("common.active")}</SelectItem>
            <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <MaintenanceTable
        data={paginatedData}
        columns={columns}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
        emptyMessage="No units found"
        currentPage={currentPage}
        pageSize={pageSize}
      />

      {/* Pagination */}
      <SimplePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Dialog */}
      <MaintenanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingItem ? t("maintenance.editEntry") : t("maintenance.addNew")}
        onSave={handleSaveClick}
        isSaving={isSaving}
      >
        <CompactMultiLanguageInput
          label={t("common.name")}
          values={form.name}
          onChange={(lang, val) => setForm((f) => ({ ...f, name: { ...f.name, [lang]: val } }))}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">
              {t("maintenance.symbol")} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={form.symbol}
              onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
              placeholder="e.g., kg, g, L"
              className="text-[13px] font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Base Unit</Label>
            <SearchableSelect
              options={[{ id: "", label: "None (This is a base unit)" }, ...baseUnitOptions]}
              value={form.base_unit_id}
              onChange={(val) => setForm((f) => ({ ...f, base_unit_id: val }))}
              placeholder="Select base unit"
            />
          </div>
        </div>
        {form.base_unit_id && (
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">{t("maintenance.conversionFactor")}</Label>
            <Input
              type="number"
              step="0.000001"
              value={form.conversion_factor}
              onChange={(e) => setForm((f) => ({ ...f, conversion_factor: parseFloat(e.target.value) || 1 }))}
              className="text-[13px] w-40"
            />
            <p className="text-[11px] text-muted-foreground">
              1 {form.symbol || "unit"} = {form.conversion_factor} of base unit
            </p>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <Label className="text-[13px] font-medium">{t("common.status")}</Label>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-muted-foreground">
              {form.is_active ? t("common.active") : t("common.inactive")}
            </span>
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))}
            />
          </div>
        </div>
      </MaintenanceDialog>

      {/* Save Confirmation */}
      <SaveConfirmModal
        open={saveConfirmOpen}
        onOpenChange={setSaveConfirmOpen}
        onConfirm={handleConfirmSave}
        itemName={form.name.en}
        entityType="units"
        isNew={!editingItem}
        isSaving={isSaving}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.name_en || ""}
        entityType="units"
        isDeleting={isSaving}
      />
    </div>
  );
}
