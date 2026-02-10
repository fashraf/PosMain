import { useState, useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { SimplePagination } from "@/components/maintenance/SimplePagination";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface EmpType {
  id: string;
  name_en: string;
  name_ar: string | null;
  name_ur: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  name: { en: "", ar: "", ur: "" },
  description: "",
  is_active: true,
};

export default function EmployeeTypesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [data, setData] = useState<EmpType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmpType | null>(null);
  const [deletingItem, setDeletingItem] = useState<EmpType | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const fetchData = async () => {
    setIsLoading(true);
    const { data: items, error } = await supabase
      .from("maintenance_emp_types")
      .select("*")
      .order("name_en", { ascending: true });

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      setData(items || []);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name_ur?.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleAdd = () => { setEditingItem(null); setForm(emptyForm); setDialogOpen(true); };

  const handleEdit = (item: EmpType) => {
    setEditingItem(item);
    setForm({
      name: { en: item.name_en, ar: item.name_ar || "", ur: item.name_ur || "" },
      description: item.description || "",
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleSaveClick = () => {
    if (!form.name.en.trim()) {
      toast({ title: t("common.error"), description: "English name is required", variant: "destructive" });
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
      description: form.description.trim() || null,
      is_active: form.is_active,
    };

    let error;
    if (editingItem) {
      ({ error } = await supabase.from("maintenance_emp_types").update(payload).eq("id", editingItem.id));
    } else {
      ({ error } = await supabase.from("maintenance_emp_types").insert(payload));
    }
    setIsSaving(false);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.success"), description: editingItem ? "Employee type updated" : "Employee type added" });
      setDialogOpen(false);
      fetchData();
    }
  };

  const handleToggleStatus = async (item: EmpType) => {
    const { error } = await supabase.from("maintenance_emp_types").update({ is_active: !item.is_active }).eq("id", item.id);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); }
    else { fetchData(); }
  };

  const handleDeleteClick = (item: EmpType) => { setDeletingItem(item); setDeleteConfirmOpen(true); };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsSaving(true);
    const { error } = await supabase.from("maintenance_emp_types").delete().eq("id", deletingItem.id);
    setIsSaving(false);
    setDeleteConfirmOpen(false);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); }
    else { toast({ title: t("common.success"), description: "Employee type deleted" }); setDeletingItem(null); fetchData(); }
  };

  const columns: MaintenanceColumn<EmpType>[] = [
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
      key: "description",
      header: t("common.description"),
      render: (item) => <span className="text-muted-foreground">{item.description || "—"}</span>,
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{t("maintenance.title")} - Employee Types</h1>
            <Tooltip>
              <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
              <TooltipContent><p>Employee Type is used for HR classification and access rules</p></TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Manage employee types used for HR classification</p>
        </div>
        <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" />{t("maintenance.addNew")}</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">{t("common.active")}</SelectItem>
            <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MaintenanceTable data={paginatedData} columns={columns} onEdit={handleEdit} onToggleStatus={handleToggleStatus} isLoading={isLoading} emptyMessage="No employee types found" currentPage={currentPage} pageSize={pageSize} />
      <SimplePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <MaintenanceDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? t("maintenance.editEntry") : t("maintenance.addNew")} onSave={handleSaveClick} isSaving={isSaving}>
        <CompactMultiLanguageInput label={t("common.name")} values={form.name} onChange={(lang, val) => setForm((f) => ({ ...f, name: { ...f.name, [lang]: val } }))} required />
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">{t("common.description")}</Label>
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description..." className="min-h-[60px] text-[13px]" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Label className="text-[13px] font-medium">{t("common.status")}</Label>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-muted-foreground">{form.is_active ? t("common.active") : t("common.inactive")}</span>
            <Switch checked={form.is_active} onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))} />
          </div>
        </div>
      </MaintenanceDialog>

      <SaveConfirmModal open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen} onConfirm={handleConfirmSave} itemName={form.name.en} entityType="employee types" isNew={!editingItem} isSaving={isSaving} />
      <DeleteConfirmModal open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} onConfirm={handleConfirmDelete} itemName={deletingItem?.name_en || ""} entityType="employee types" isDeleting={isSaving} />
    </div>
  );
}
