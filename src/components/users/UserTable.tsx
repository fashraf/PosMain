import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Plus, Eye, Pencil, Key, User, Phone, Globe, Briefcase, Shield, GitBranch, Clock, ToggleLeft, X } from "lucide-react";
import { RoleBadge } from "@/components/roles/RoleBadge";
import { GridStatusBadge } from "@/components/shared/GridStatusBadge";
import { SimplePagination } from "@/components/maintenance/SimplePagination";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface UserData {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  employee_code: string | null;
  is_active: boolean;
  last_login_at: string | null;
  avatar_url: string | null;
  profile_image: string | null;
  role: string;
  role_color: string | null;
  role_id: string;
  branch_ids: string[];
  branch_names: string[];
  emp_type_id: string | null;
  emp_type_name: string | null;
  nationality: string | null;
  age: number | null;
}

interface UserTableProps {
  users: UserData[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (user: UserData) => void;
  onView: (user: UserData) => void;
  onResetPassword: (user: UserData) => void;
}

const ROWS_PER_PAGE = 15;

export function UserTable({ users, isLoading, onAdd, onEdit, onView, onResetPassword }: UserTableProps) {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueRoles = [...new Set(users.map(u => u.role))];

  const hasActiveFilters = searchQuery || roleFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery) ||
      user.employee_code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.is_active) ||
      (statusFilter === "inactive" && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const userImage = (user: UserData) => user.profile_image || user.avatar_url;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">{t("users.title")}</h1>
          <Button onClick={onAdd} className="gap-2"><Plus className="h-4 w-4" />{t("users.addUser")}</Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-[300px]">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
            <Input
              placeholder="Search by name, phone, or code..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className={cn("h-9", isRTL ? "pr-9" : "pl-9")}
            />
          </div>

          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Filter by role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.status")}: All</SelectItem>
              <SelectItem value="active">{t("common.active")}</SelectItem>
              <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1">
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80 h-[42px]">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />{t("users.fullName")}</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" />Mobile</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-muted-foreground" />Nationality</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-muted-foreground" />Emp Type</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-muted-foreground" />{t("users.role")}</span>
                </TableHead>
                <TableHead className="w-[80px] text-center">
                  <span className="flex items-center justify-center gap-1.5"><GitBranch className="h-3.5 w-3.5 text-muted-foreground" />Branches</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5"><ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />{t("common.status")}</span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{t("users.lastLogin")}</span>
                </TableHead>
                <TableHead className="text-center w-[120px]">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={10} className="text-center py-10 text-muted-foreground">{t("common.loading")}</TableCell></TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow><TableCell colSpan={10} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <User className="h-10 w-10 opacity-40" />
                    <p>{t("users.noUsers")}</p>
                    <p className="text-sm">{t("users.addFirstUser")}</p>
                  </div>
                </TableCell></TableRow>
              ) : paginatedUsers.map((user, index) => (
                <TableRow key={user.id} className={cn("h-[42px] hover:bg-[hsl(var(--accent)/0.3)] transition-colors", index % 2 === 0 ? "bg-background" : "bg-muted/30")}>
                  <TableCell className="text-center text-sm text-muted-foreground">{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {userImage(user) ? (
                          <img src={userImage(user)!} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{user.full_name || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.phone || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.nationality || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.emp_type_name || "-"}</TableCell>
                  <TableCell><RoleBadge name={user.role} color={user.role_color} /></TableCell>
                  <TableCell className="text-center">
                    {user.branch_names.length > 0 ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1 cursor-default">
                            <GitBranch className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium text-primary">{user.branch_names.length}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px]">
                          <div className="space-y-0.5">
                            <p className="font-medium text-xs mb-1">Assigned Branches</p>
                            {user.branch_names.map((name, i) => (
                              <p key={i} className="text-xs">• {name}</p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell><GridStatusBadge isActive={user.is_active} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.last_login_at ? format(new Date(user.last_login_at), "MMM d, yyyy HH:mm") : t("users.neverLoggedIn")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(user)} title={t("common.view")}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)} title={t("common.edit")}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onResetPassword(user)} title={t("users.resetPassword")}><Key className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && <SimplePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      </div>
    </TooltipProvider>
  );
}
