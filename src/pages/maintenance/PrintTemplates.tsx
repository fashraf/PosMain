import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Printer, Hash, ToggleLeft, Settings2, FileText, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { GridFilters, FilterConfig } from "@/components/shared/GridFilters";
import { GridStatusBadge } from "@/components/shared/GridStatusBadge";
import { SimplePagination } from "@/components/maintenance/SimplePagination";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  is_active: boolean;
  show_logo: boolean;
  show_qr: boolean;
  show_footer: boolean;
  restaurant_name_en: string | null;
  restaurant_name_ar: string | null;
  restaurant_name_ur: string | null;
}

const PAGE_SIZE = 15;

function getRestaurantName(t: Template): string {
  return t.restaurant_name_en?.trim() || t.restaurant_name_ar?.trim() || t.restaurant_name_ur?.trim() || "—";
}

export default function PrintTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("print_templates").select("id, name, is_active, show_logo, show_qr, show_footer, restaurant_name_en, restaurant_name_ar, restaurant_name_ur") as any;
    if (statusFilter === "active") query = query.eq("is_active", true);
    if (statusFilter === "inactive") query = query.eq("is_active", false);
    if (search) query = query.ilike("name", `%${search}%`);
    query = query.order("created_at", { ascending: false });
    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setTemplates(data || []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const toggleStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from("print_templates").update({ is_active: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else { setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, is_active: !current } : t))); toast.success("Status updated"); }
  };

  const filters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      defaultValue: "all",
    },
  ];

  const total = templates.length;
  const paginated = templates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <LoadingOverlay visible={loading} message="Loading templates..." />
      <GridFilters
        title="Print Templates"
        filters={filters}
        filterValues={{ status: statusFilter }}
        onFilterChange={(key, val) => { setStatusFilter(val); setPage(1); }}
        searchPlaceholder="Search templates..."
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        actionButton={
          <Button size="sm" className="h-9 gap-1.5 text-[13px]" onClick={() => navigate("/maintenance/print-templates/add")}>
            <Plus className="w-4 h-4" /> Add Template
          </Button>
        }
      />

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80 h-[42px] hover:bg-transparent">
              <TableHead className="w-[50px] text-center"><div className="flex items-center justify-center gap-1 text-foreground/70 font-semibold text-[13px]"><Hash className="w-3.5 h-3.5" />#</div></TableHead>
              <TableHead><div className="flex items-center gap-1.5 text-foreground/70 font-semibold text-[13px]"><FileText className="w-3.5 h-3.5" />Template Name</div></TableHead>
              <TableHead><div className="flex items-center gap-1.5 text-foreground/70 font-semibold text-[13px]"><Store className="w-3.5 h-3.5" />Restaurant</div></TableHead>
              <TableHead className="text-center"><div className="flex items-center justify-center gap-1.5 text-foreground/70 font-semibold text-[13px]"><Printer className="w-3.5 h-3.5" />Logo</div></TableHead>
              <TableHead className="text-center"><div className="flex items-center justify-center gap-1.5 text-foreground/70 font-semibold text-[13px]">QR</div></TableHead>
              <TableHead className="text-center"><div className="flex items-center justify-center gap-1.5 text-foreground/70 font-semibold text-[13px]">Footer</div></TableHead>
              <TableHead className="text-center"><div className="flex items-center justify-center gap-1.5 text-foreground/70 font-semibold text-[13px]"><ToggleLeft className="w-3.5 h-3.5" />Status</div></TableHead>
              <TableHead className="text-center"><div className="flex items-center justify-center gap-1.5 text-foreground/70 font-semibold text-[13px]"><Settings2 className="w-3.5 h-3.5" />Actions</div></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No templates found</TableCell></TableRow>
            ) : (
              paginated.map((t, i) => (
                <TableRow key={t.id} className={`h-[42px] ${i % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"} hover:bg-[#F3F0FF] transition-colors`}>
                  <TableCell className="text-center text-[12px] text-muted-foreground">{(page - 1) * PAGE_SIZE + i + 1}</TableCell>
                  <TableCell className="text-[13px] font-medium">{t.name}</TableCell>
                  <TableCell className="text-[13px]">{getRestaurantName(t)}</TableCell>
                  <TableCell className="text-center text-[12px]">{t.show_logo ? "✓" : "—"}</TableCell>
                  <TableCell className="text-center text-[12px]">{t.show_qr ? "✓" : "—"}</TableCell>
                  <TableCell className="text-center text-[12px]">{t.show_footer ? "✓" : "—"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch checked={t.is_active} onCheckedChange={() => toggleStatus(t.id, t.is_active)} className="scale-75" />
                      <GridStatusBadge isActive={t.is_active} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="h-7 text-[12px]" onClick={() => navigate(`/maintenance/print-templates/${t.id}/edit`)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <SimplePagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
