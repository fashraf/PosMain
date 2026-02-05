 import { useState, useEffect } from "react";
 import { useLanguage } from "@/hooks/useLanguage";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Switch } from "@/components/ui/switch";
 import { Separator } from "@/components/ui/separator";
 import { Eye, EyeOff, User, Info, Fingerprint, FileText } from "lucide-react";
 import { UserShiftSection } from "./UserShiftSection";
 import { ShiftData } from "./ShiftRow";
 import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 import { cn } from "@/lib/utils";
 
 type AppRole = 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'kiosk';
 
 export interface UserFormData {
   full_name: string;
   email: string;
   password: string;
   confirmPassword: string;
   phone: string;
   employee_code: string;
   role: AppRole;
   branch_id: string;
   is_active: boolean;
   shifts: ShiftData[];
 }
 
 interface UserDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   mode: 'add' | 'edit' | 'view';
   initialData?: Partial<UserFormData>;
   branches: Array<{ id: string; name: string }>;
   onSubmit: (data: UserFormData) => void;
   isLoading: boolean;
 }
 
 const ROLES: AppRole[] = ['admin', 'manager', 'cashier', 'waiter', 'kitchen', 'kiosk'];
 
 const roleColors: Record<AppRole, string> = {
   admin: 'text-purple-700',
   manager: 'text-blue-700',
   cashier: 'text-green-700',
   waiter: 'text-orange-700',
   kitchen: 'text-yellow-700',
   kiosk: 'text-gray-700',
 };
 
 export function UserDialog({ open, onOpenChange, mode, initialData, branches, onSubmit, isLoading }: UserDialogProps) {
   const { t } = useLanguage();
   const isView = mode === 'view';
   const isEdit = mode === 'edit';
 
   const [formData, setFormData] = useState<UserFormData>({
     full_name: '',
     email: '',
     password: '',
     confirmPassword: '',
     phone: '',
     employee_code: '',
     role: 'cashier',
     branch_id: branches[0]?.id || '',
     is_active: true,
     shifts: [],
   });
 
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   useEffect(() => {
     if (open && initialData) {
       setFormData({
         full_name: initialData.full_name || '',
         email: initialData.email || '',
         password: '',
         confirmPassword: '',
         phone: initialData.phone || '',
         employee_code: initialData.employee_code || '',
         role: initialData.role || 'cashier',
         branch_id: initialData.branch_id || branches[0]?.id || '',
         is_active: initialData.is_active !== false,
         shifts: initialData.shifts || [],
       });
       setErrors({});
     } else if (open && !initialData) {
       setFormData({
         full_name: '',
         email: '',
         password: '',
         confirmPassword: '',
         phone: '',
         employee_code: '',
         role: 'cashier',
         branch_id: branches[0]?.id || '',
         is_active: true,
         shifts: [],
       });
       setErrors({});
     }
   }, [open, initialData, branches]);
 
   const validate = (): boolean => {
     const newErrors: Record<string, string> = {};
 
     if (!formData.full_name.trim()) {
       newErrors.full_name = t("common.required");
     }
     if (!formData.email.trim()) {
       newErrors.email = t("common.required");
     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
       newErrors.email = t("users.invalidEmail");
     }
     if (!isEdit && !formData.password) {
       newErrors.password = t("common.required");
     } else if (formData.password && formData.password.length < 8) {
       newErrors.password = t("users.passwordRequirements");
     }
     if (formData.password && formData.password !== formData.confirmPassword) {
       newErrors.confirmPassword = t("users.passwordMismatch");
     }
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleSubmit = () => {
     if (!validate()) return;
     onSubmit(formData);
   };
 
   const updateField = <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => {
     setFormData(prev => ({ ...prev, [key]: value }));
     if (errors[key]) {
       setErrors(prev => ({ ...prev, [key]: '' }));
     }
   };
 
   const getTitle = () => {
     switch (mode) {
       case 'add': return t("users.addUser");
       case 'edit': return t("users.editUser");
       case 'view': return t("users.viewUser");
     }
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <User className="h-5 w-5" />
             {getTitle()}
           </DialogTitle>
         </DialogHeader>
 
         <div className="py-4 space-y-6">
           {/* Avatar Placeholder */}
           <div className="flex justify-center">
             <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
               <User className="h-10 w-10 text-muted-foreground" />
             </div>
           </div>
 
           {/* Basic Info Grid */}
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="full_name">{t("users.fullName")} *</Label>
               <Input
                 id="full_name"
                 value={formData.full_name}
                 onChange={(e) => updateField('full_name', e.target.value)}
                 placeholder={t("users.fullName")}
                 disabled={isView}
                 className={cn(errors.full_name && "border-destructive")}
               />
               {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="employee_code">{t("users.employeeCode")}</Label>
               <Input
                 id="employee_code"
                 value={formData.employee_code}
                 onChange={(e) => updateField('employee_code', e.target.value)}
                 placeholder="EMP-001"
                 disabled={isView}
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="email">{t("users.email")} *</Label>
               <Input
                 id="email"
                 type="email"
                 value={formData.email}
                 onChange={(e) => updateField('email', e.target.value)}
                 placeholder="name@example.com"
                 disabled={isView || isEdit}
                 className={cn(errors.email && "border-destructive")}
               />
               {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="phone">{t("users.phone")}</Label>
               <Input
                 id="phone"
                 value={formData.phone}
                 onChange={(e) => updateField('phone', e.target.value)}
                 placeholder="+966 50 123 4567"
                 disabled={isView}
               />
             </div>
 
             {/* Password Fields - Only for Add mode or if editing password */}
             {!isView && (
               <>
                 <div className="space-y-2">
                   <Label htmlFor="password">{isEdit ? t("users.newPassword") : t("users.password")} {!isEdit && '*'}</Label>
                   <div className="relative">
                     <Input
                       id="password"
                       type={showPassword ? "text" : "password"}
                       value={formData.password}
                       onChange={(e) => updateField('password', e.target.value)}
                       placeholder="••••••••"
                       className={cn("pr-10", errors.password && "border-destructive")}
                     />
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       className="absolute right-0 top-0 h-full px-3"
                       onClick={() => setShowPassword(!showPassword)}
                     >
                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                   </div>
                   {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="confirmPassword">{t("users.confirmPassword")} {!isEdit && '*'}</Label>
                   <div className="relative">
                     <Input
                       id="confirmPassword"
                       type={showConfirm ? "text" : "password"}
                       value={formData.confirmPassword}
                       onChange={(e) => updateField('confirmPassword', e.target.value)}
                       placeholder="••••••••"
                       className={cn("pr-10", errors.confirmPassword && "border-destructive")}
                     />
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       className="absolute right-0 top-0 h-full px-3"
                       onClick={() => setShowConfirm(!showConfirm)}
                     >
                       {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                   </div>
                   {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                 </div>
               </>
             )}
 
             <div className="space-y-2">
               <div className="flex items-center gap-2">
                 <Label htmlFor="role">{t("users.role")} *</Label>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                   </TooltipTrigger>
                   <TooltipContent className="max-w-xs">
                     <p>{t("users.roleDescription")}</p>
                   </TooltipContent>
                 </Tooltip>
               </div>
               <Select value={formData.role} onValueChange={(v) => updateField('role', v as AppRole)} disabled={isView}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {ROLES.map((role) => (
                     <SelectItem key={role} value={role}>
                       <span className={roleColors[role]}>{t(`users.role${role.charAt(0).toUpperCase() + role.slice(1)}`)}</span>
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="branch">{t("users.branch")}</Label>
               <Select value={formData.branch_id} onValueChange={(v) => updateField('branch_id', v)} disabled={isView}>
                 <SelectTrigger>
                   <SelectValue placeholder={t("common.selectBranch")} />
                 </SelectTrigger>
                 <SelectContent>
                   {branches.map((branch) => (
                     <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           {/* Password hint */}
           {!isView && !isEdit && (
             <p className="text-xs text-muted-foreground flex items-center gap-1">
               <Info className="h-3 w-3" />
               {t("users.passwordRequirements")}
             </p>
           )}
 
           <Separator />
 
           {/* Shift Section */}
           <UserShiftSection
             shifts={formData.shifts}
             branches={branches}
             onChange={(shifts) => updateField('shifts', shifts)}
           />
 
           <Separator />
 
           {/* Future Features */}
           <div className="space-y-3">
             <h3 className="text-sm font-semibold text-muted-foreground">{t("users.futureFeatures")}</h3>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Fingerprint className="h-4 w-4 text-muted-foreground" />
                 <span className="text-sm">{t("users.enableFingerprint")}</span>
               </div>
               <Switch disabled />
             </div>
             <Button variant="ghost" size="sm" className="text-muted-foreground gap-2" disabled>
               <FileText className="h-4 w-4" />
               {t("users.viewAttendanceLogs")}
             </Button>
           </div>
 
           <Separator />
 
           {/* Status Toggle */}
           <div className="flex items-center justify-between">
             <Label htmlFor="status">{t("common.status")}</Label>
             <div className="flex items-center gap-2">
               <span className={cn("text-sm", formData.is_active ? "text-green-600" : "text-muted-foreground")}>
                 {formData.is_active ? t("common.active") : t("common.inactive")}
               </span>
               <Switch
                 id="status"
                 checked={formData.is_active}
                 onCheckedChange={(checked) => updateField('is_active', checked)}
                 disabled={isView}
               />
             </div>
           </div>
         </div>
 
         {!isView && (
           <DialogFooter>
             <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
               {t("common.cancel")}
             </Button>
             <Button onClick={handleSubmit} disabled={isLoading}>
               {isLoading ? t("common.loading") : t("common.save")}
             </Button>
           </DialogFooter>
         )}
       </DialogContent>
     </Dialog>
   );
 }