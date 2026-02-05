 import { useState } from "react";
 import { useLanguage } from "@/hooks/useLanguage";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Search, Plus, Eye, Pencil, Key, User } from "lucide-react";
 import { UserRoleBadge } from "./UserRoleBadge";
 import { GridStatusBadge } from "@/components/shared/GridStatusBadge";
 import { SimplePagination } from "@/components/maintenance/SimplePagination";
 import { cn } from "@/lib/utils";
 import { format } from "date-fns";
 
 type AppRole = 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'kiosk';
 
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
   role: AppRole;
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
 
   // Filter users
   const filteredUsers = users.filter((user) => {
     const matchesSearch =
       !searchQuery ||
       user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.employee_code?.toLowerCase().includes(searchQuery.toLowerCase());
 
     const matchesRole = roleFilter === "all" || user.role === roleFilter;
     const matchesStatus =
       statusFilter === "all" ||
       (statusFilter === "active" && user.is_active) ||
       (statusFilter === "inactive" && !user.is_active);
 
     return matchesSearch && matchesRole && matchesStatus;
   });
 
   // Pagination
   const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
   const paginatedUsers = filteredUsers.slice(
     (currentPage - 1) * ROWS_PER_PAGE,
     currentPage * ROWS_PER_PAGE
   );
 
   return (
     <div className="space-y-4">
       {/* Header with Add Button */}
       <div className="flex items-center justify-between">
         <h1 className="text-2xl font-semibold text-foreground">{t("users.title")}</h1>
         <Button onClick={onAdd} className="gap-2">
           <Plus className="h-4 w-4" />
           {t("users.addUser")}
         </Button>
       </div>
 
       {/* Filters */}
       <div className="flex flex-wrap gap-3 items-center">
         <div className="relative w-[300px]">
           <Search className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
           <Input
             placeholder={t("users.searchPlaceholder")}
             value={searchQuery}
             onChange={(e) => {
               setSearchQuery(e.target.value);
               setCurrentPage(1);
             }}
             className={cn("h-9", isRTL ? "pr-9" : "pl-9")}
           />
         </div>
 
         <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
           <SelectTrigger className="w-[150px] h-9">
             <SelectValue placeholder={t("users.filterByRole")} />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">{t("common.filter")}: {t("users.allRoles")}</SelectItem>
             <SelectItem value="admin">{t("users.roleAdmin")}</SelectItem>
             <SelectItem value="manager">{t("users.roleManager")}</SelectItem>
             <SelectItem value="cashier">{t("users.roleCashier")}</SelectItem>
             <SelectItem value="waiter">{t("users.roleWaiter")}</SelectItem>
             <SelectItem value="kitchen">{t("users.roleKitchen")}</SelectItem>
             <SelectItem value="kiosk">{t("users.roleKiosk")}</SelectItem>
           </SelectContent>
         </Select>
 
         <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
           <SelectTrigger className="w-[150px] h-9">
             <SelectValue placeholder={t("users.filterByStatus")} />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">{t("common.status")}: {t("users.allStatuses")}</SelectItem>
             <SelectItem value="active">{t("common.active")}</SelectItem>
             <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
           </SelectContent>
         </Select>
       </div>
 
       {/* Table */}
       <div className="border rounded-lg overflow-hidden">
         <Table>
           <TableHeader>
             <TableRow className="bg-muted/50 h-[42px]">
               <TableHead className="w-12 text-center">#</TableHead>
               <TableHead>{t("users.fullName")}</TableHead>
               <TableHead>{t("users.email")}</TableHead>
               <TableHead>{t("users.employeeCode")}</TableHead>
               <TableHead>{t("users.role")}</TableHead>
               <TableHead>{t("common.status")}</TableHead>
               <TableHead>{t("users.lastLogin")}</TableHead>
               <TableHead className="text-center w-[120px]">{t("common.actions")}</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {isLoading ? (
               <TableRow>
                 <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                   {t("common.loading")}
                 </TableCell>
               </TableRow>
             ) : paginatedUsers.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={8} className="text-center py-10">
                   <div className="flex flex-col items-center gap-2 text-muted-foreground">
                     <User className="h-10 w-10 opacity-40" />
                     <p>{t("users.noUsers")}</p>
                     <p className="text-sm">{t("users.addFirstUser")}</p>
                   </div>
                 </TableCell>
               </TableRow>
             ) : (
               paginatedUsers.map((user, index) => (
                 <TableRow
                   key={user.id}
                   className={cn(
                     "h-[42px] hover:bg-[#F3F0FF] transition-colors",
                     index % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"
                   )}
                 >
                   <TableCell className="text-center text-sm text-muted-foreground">
                     {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                         {user.avatar_url ? (
                           <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                         ) : (
                           <User className="h-4 w-4 text-muted-foreground" />
                         )}
                       </div>
                       <span className="font-medium">{user.full_name || "-"}</span>
                     </div>
                   </TableCell>
                   <TableCell className="text-sm">{user.email}</TableCell>
                   <TableCell className="text-sm text-muted-foreground">{user.employee_code || "-"}</TableCell>
                   <TableCell><UserRoleBadge role={user.role} /></TableCell>
                   <TableCell><GridStatusBadge isActive={user.is_active} /></TableCell>
                   <TableCell className="text-sm text-muted-foreground">
                     {user.last_login_at
                       ? format(new Date(user.last_login_at), "MMM d, yyyy HH:mm")
                       : t("users.neverLoggedIn")}
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center justify-center gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(user)} title={t("common.view")}>
                         <Eye className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)} title={t("common.edit")}>
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onResetPassword(user)} title={t("users.resetPassword")}>
                         <Key className="h-4 w-4" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ))
             )}
           </TableBody>
         </Table>
       </div>
 
       {/* Pagination */}
       {totalPages > 1 && (
         <SimplePagination
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={setCurrentPage}
         />
       )}
     </div>
   );
 }