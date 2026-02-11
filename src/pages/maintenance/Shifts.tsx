import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Calendar, ToggleLeft, Pencil, Hash, ListChecks, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { SimplePagination } from "@/components/maintenance/SimplePagination";
import { DeleteConfirmModal } from "@/components/maintenance";
import { GridFilters } from "@/components/shared/GridFilters";
import { GridStatusBadge } from "@/components/shared/GridStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  const statusFilterOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: t("common.active") },
    { value: "inactive", label: t("common.inactive") },
  ];

  return (
    <div className="space-y-4">
      <LoadingOverlay visible={isSaving} />

      <GridFilters
        title="Shift Management"
        filters={[{ key: "status", label: "Status", options: statusFilterOptions, defaultValue: "all" }]}
        filterValues={{ status: statusFilter }}
        onFilterChange={(key, value) => { if (key === "status") setStatusFilter(value); }}
        searchPlaceholder="Search shifts..."
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        actionButton={
          <Button onClick={() => navigate("/maintenance/shifts/add")} size="sm" className="gap-2 h-9">
            <Plus className="h-4 w-4" />Add Shift
          </Button>
        }
      />

      <div className="rounded-lg border border-input overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-[13px]">No shifts found. Add your first shift to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80 h-[42px] hover:bg-transparent">
                <TableHead className="w-[50px] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-foreground/70 font-semibold text-[13px]">
                    <Hash className="w-3.5 h-3.5" />#
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5 text-foreground/70 font-semibold text-[13px]">
                    <ListChecks className="w-3.5 h-3.5" />Shift Name
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5 text-foreground/70 font-semibold text-[13px]">
                    <Clock className="w-3.5 h-3.5" />Timing
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5 text-foreground/70 font-semibold text-[13px]">
                    <Calendar className="w-3.5 h-3.5" />Days
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5 text-foreground/70 font-semibold text-[13px]">
                    <Calendar className="w-3.5 h-3.5" />Effective Period
                  </div>
                </TableHead>
                <TableHead className="w-24">
                  <div className="flex items-center gap-1.5 text-foreground/70 font-semibold text-[13px]">
                    <ToggleLeft className="w-3.5 h-3.5" />{t("common.status")}
                  </div>
                </TableHead>
                <TableHead className="w-28 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-foreground/70 font-semibold text-[13px]">
                    <Settings className="w-3.5 h-3.5" />{t("common.actions")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => {
                const serial = (currentPage - 1) * pageSize + index + 1;
                return (
                  <TableRow
                    key={item.id}
                    className={cn(
                      "h-[42px]",
                      index % 2 === 0 ? "bg-background" : "bg-muted/30",
                      "hover:bg-[#F3F0FF] transition-colors"
                    )}
                  >
                    <TableCell className="text-center text-[13px] text-muted-foreground">{serial}</TableCell>
                    <TableCell className="text-[13px]">
                      <span className="font-medium">{item.name}</span>
                      {item.allow_overnight && <Badge variant="outline" className="ml-2 text-[10px]">Overnight</Badge>}
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {formatTime(item.start_time)} – {formatTime(item.end_time)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.days_of_week.map(d => (
                          <Badge key={d} variant="secondary" className="text-[10px] px-1.5 py-0">{d}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {format(new Date(item.effective_from), "dd/MM/yyyy")} – {format(new Date(item.effective_to), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <GridStatusBadge isActive={item.is_active} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={() => handleToggleStatus(item)}
                          className="scale-75"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

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
