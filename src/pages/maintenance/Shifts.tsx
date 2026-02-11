import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { SimplePagination } from "@/components/maintenance/SimplePagination";
import { MaintenanceTable, MaintenanceColumn, DeleteConfirmModal } from "@/components/maintenance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Shift {
  id: string;
  name: string;
  is_active: boolean;
  effective_from: string;
  effective_to: string;
  days_of_week: string[];
  start_time: string;
  end_time: string;
  allow_overnight: boolean;
  created_at: string;
}

export default function ShiftsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [data, setData] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Shift | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const fetchData = async () => {
    setIsLoading(true);
    const { data: items, error } = await supabase
      .from("shifts")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      setData((items as Shift[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" ||
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

  const handleEdit = (item: Shift) => navigate(`/maintenance/shifts/${item.id}/edit`);

  const handleToggleStatus = async (item: Shift) => {
    const { error } = await supabase.from("shifts").update({ is_active: !item.is_active }).eq("id", item.id);
    if (error) toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    else fetchData();
  };

  const handleDeleteClick = (item: Shift) => { setDeletingItem(item); setDeleteConfirmOpen(true); };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsSaving(true);
    const { error } = await supabase.from("shifts").delete().eq("id", deletingItem.id);
    setIsSaving(false);
    setDeleteConfirmOpen(false);
    if (error) toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    else { toast({ title: t("common.success"), description: "Shift deleted" }); setDeletingItem(null); fetchData(); }
  };

  const formatTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hr = parseInt(h);
    const ampm = hr >= 12 ? "PM" : "AM";
    const h12 = hr % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const columns: MaintenanceColumn<Shift>[] = [
    {
      key: "name",
      header: "Shift Name",
      render: item => (
        <div>
          <span className="font-medium">{item.name}</span>
          {item.allow_overnight && <Badge variant="outline" className="ml-2 text-[10px]">Overnight</Badge>}
        </div>
      ),
    },
    {
      key: "timing",
      header: "Timing",
      render: item => (
        <span className="text-xs">{formatTime(item.start_time)} – {formatTime(item.end_time)}</span>
      ),
    },
    {
      key: "days",
      header: "Days",
      render: item => (
        <div className="flex flex-wrap gap-1">
          {item.days_of_week.map(d => (
            <Badge key={d} variant="secondary" className="text-[10px] px-1.5 py-0">{d}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: "period",
      header: "Effective Period",
      render: item => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(item.effective_from), "dd/MM/yyyy")} – {format(new Date(item.effective_to), "dd/MM/yyyy")}
        </span>
      ),
    },
    {
      key: "is_active",
      header: t("common.status"),
      render: item => <StatusBadge isActive={item.is_active} />,
      className: "w-24",
    },
  ];

  return (
    <div className="space-y-6">
      <LoadingOverlay visible={isSaving} />
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{t("maintenance.title")} - Shift Management</h1>
            <Tooltip>
              <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
              <TooltipContent><p>Define reusable shift templates for scheduling</p></TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Manage shift definitions and schedules</p>
        </div>
        <Button onClick={() => navigate("/maintenance/shifts/add")} className="gap-2">
          <Plus className="h-4 w-4" />Add Shift
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search shifts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
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

      <MaintenanceTable
        data={paginatedData}
        columns={columns}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
        emptyMessage="No shifts found. Add your first shift to get started."
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <SimplePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <DeleteConfirmModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.name || ""}
        entityType="shift"
        isDeleting={isSaving}
      />
    </div>
  );
}
