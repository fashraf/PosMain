import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Pencil, Lock, Shield } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { GridStatusBadge } from "@/components/shared/GridStatusBadge";
import { SimplePagination } from "@/components/maintenance/SimplePagination";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export interface RoleData {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  is_system: boolean;
  is_active: boolean;
  user_count: number;
}

interface RoleTableProps {
  roles: RoleData[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (role: RoleData) => void;
  onView: (role: RoleData) => void;
}

const ROWS_PER_PAGE = 15;

export function RoleTable({ roles, isLoading, onAdd, onEdit, onView }: RoleTableProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return roles.filter(r => {
      const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" && r.is_active) || (statusFilter === "inactive" && !r.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [roles, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Role Master</h1>
        <Button onClick={onAdd} className="gap-2"><Plus className="h-4 w-4" />Add Role</Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search roles..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">{t("common.active")}</SelectItem>
            <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 h-[42px]">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24 text-center">Users</TableHead>
              <TableHead className="w-24">{t("common.status")}</TableHead>
              <TableHead className="text-center w-[100px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">{t("common.loading")}</TableCell></TableRow>
            ) : paginated.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Shield className="h-10 w-10 opacity-40" />
                  <p>No roles found</p>
                </div>
              </TableCell></TableRow>
            ) : paginated.map((role, index) => (
              <TableRow key={role.id} className={cn("h-[42px] hover:bg-[#F3F0FF] transition-colors", index % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]")}>
                <TableCell className="text-center text-sm text-muted-foreground">{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <RoleBadge name={role.name} color={role.color} />
                    {role.is_system && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{role.description || "—"}</TableCell>
                <TableCell className="text-center text-sm">{role.user_count}</TableCell>
                <TableCell><GridStatusBadge isActive={role.is_active} /></TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(role)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(role)}><Pencil className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && <SimplePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
}
