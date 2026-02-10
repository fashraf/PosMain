import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Info, Eye, EyeOff, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { RoleBadge } from "@/components/roles/RoleBadge";

export interface UserStepperFormData {
  // Step 1 - Basic Info
  full_name: string;
  phone: string;
  email: string;
  age: string;
  nationality: string;
  national_id: string;
  national_id_expiry: string;
  passport_number: string;
  passport_expiry: string;
  // Step 2 - Role & Branch
  emp_type_id: string;
  role_id: string;
  branch_ids: string[];
  // Step 3 - Security
  password: string;
  force_password_change: boolean;
  default_language: string;
  is_active: boolean;
}

interface RoleOption { id: string; name: string; color: string | null; }
interface BranchOption { id: string; name: string; }
interface EmpTypeOption { id: string; name_en: string; }

interface UserStepperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit' | 'view';
  initialData?: Partial<UserStepperFormData>;
  roles: RoleOption[];
  branches: BranchOption[];
  empTypes: EmpTypeOption[];
  onSubmit: (data: UserStepperFormData) => void;
  isLoading: boolean;
}

const STEPS = ['Basic Info', 'Role & Branch', 'Security'];

export function UserStepperDialog({ open, onOpenChange, mode, initialData, roles, branches, empTypes, onSubmit, isLoading }: UserStepperDialogProps) {
  const { t } = useLanguage();
  const isView = mode === 'view';
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<UserStepperFormData>({
    full_name: '', phone: '', email: '', age: '', nationality: '',
    national_id: '', national_id_expiry: '', passport_number: '', passport_expiry: '',
    emp_type_id: '', role_id: '', branch_ids: [],
    password: '123456abc', force_password_change: true, default_language: 'en', is_active: true,
  });

  useEffect(() => {
    if (open) {
      setStep(0);
      setErrors({});
      if (initialData) {
        setForm(f => ({ ...f, ...initialData, password: '' }));
      } else {
        setForm({
          full_name: '', phone: '', email: '', age: '', nationality: '',
          national_id: '', national_id_expiry: '', passport_number: '', passport_expiry: '',
          emp_type_id: '', role_id: '', branch_ids: [],
          password: '123456abc', force_password_change: true, default_language: 'en', is_active: true,
        });
      }
    }
  }, [open, initialData]);

  const updateField = <K extends keyof UserStepperFormData>(key: K, value: UserStepperFormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const toggleBranch = (branchId: string) => {
    setForm(f => ({
      ...f,
      branch_ids: f.branch_ids.includes(branchId)
        ? f.branch_ids.filter(id => id !== branchId)
        : [...f.branch_ids, branchId],
    }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 0) {
      if (!form.full_name.trim()) newErrors.full_name = "Required";
      if (!form.phone.trim()) newErrors.phone = "Required";
    } else if (s === 1) {
      if (!form.role_id) newErrors.role_id = "Required";
      if (form.branch_ids.length === 0) newErrors.branch_ids = "Select at least one branch";
    } else if (s === 2 && mode === 'add') {
      if (!form.password || form.password.length < 8) newErrors.password = "Min 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleSubmit = () => {
    if (validateStep(step)) onSubmit(form);
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

        {/* Step Indicator */}
        <div className="flex items-center gap-1 px-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg flex-1 transition-colors",
                i === step ? "bg-primary/10 text-primary" : i < step ? "text-green-600" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                  i === step ? "border-primary bg-primary text-primary-foreground" : i < step ? "border-green-500 bg-green-500 text-white" : "border-muted-foreground/40"
                )}>
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 shrink-0" />}
            </div>
          ))}
        </div>

        <div className="py-4 space-y-4 min-h-[300px]">
          {/* STEP 1: Basic Info */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.full_name} onChange={(e) => updateField('full_name', e.target.value)} disabled={isView} className={cn(errors.full_name && "border-destructive")} />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label>Mobile Number *</Label>
                  <Tooltip><TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent>Used as login ID</TooltipContent></Tooltip>
                </div>
                <Input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+966 50 123 4567" disabled={isView} className={cn(errors.phone && "border-destructive")} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="name@example.com" disabled={isView} />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={form.age} onChange={(e) => updateField('age', e.target.value)} disabled={isView} />
              </div>
              <div className="space-y-2">
                <Label>Nationality</Label>
                <Input value={form.nationality} onChange={(e) => updateField('nationality', e.target.value)} disabled={isView} />
              </div>
              <div className="space-y-2">
                <Label>National ID / Iqama</Label>
                <Input value={form.national_id} onChange={(e) => updateField('national_id', e.target.value)} disabled={isView} />
              </div>
              <div className="space-y-2">
                <Label>Iqama Expiry</Label>
                <Input type="date" value={form.national_id_expiry} onChange={(e) => updateField('national_id_expiry', e.target.value)} disabled={isView} />
              </div>
              <div className="space-y-2">
                <Label>Passport Number</Label>
                <Input value={form.passport_number} onChange={(e) => updateField('passport_number', e.target.value)} disabled={isView} />
              </div>
              <div className="space-y-2">
                <Label>Passport Expiry</Label>
                <Input type="date" value={form.passport_expiry} onChange={(e) => updateField('passport_expiry', e.target.value)} disabled={isView} />
              </div>
            </div>
          )}

          {/* STEP 2: Role & Branch */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Employee Type</Label>
                <Select value={form.emp_type_id} onValueChange={(v) => updateField('emp_type_id', v)} disabled={isView}>
                  <SelectTrigger><SelectValue placeholder="Select employee type" /></SelectTrigger>
                  <SelectContent>
                    {empTypes.map(et => <SelectItem key={et.id} value={et.id}>{et.name_en}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Associated Role *</Label>
                <Select value={form.role_id} onValueChange={(v) => updateField('role_id', v)} disabled={isView}>
                  <SelectTrigger className={cn(errors.role_id && "border-destructive")}><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        <div className="flex items-center gap-2">
                          <RoleBadge name={r.name} color={r.color} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role_id && <p className="text-xs text-destructive">{errors.role_id}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label>Branches *</Label>
                  <Tooltip><TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent>User can only operate within selected branches</TooltipContent></Tooltip>
                </div>
                {errors.branch_ids && <p className="text-xs text-destructive">{errors.branch_ids}</p>}
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {branches.map(b => (
                    <div key={b.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={form.branch_ids.includes(b.id)}
                        onCheckedChange={() => toggleBranch(b.id)}
                        disabled={isView}
                      />
                      <span className="text-sm">{b.name}</span>
                    </div>
                  ))}
                  {branches.length === 0 && <p className="text-sm text-muted-foreground">No branches available</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Security & Preferences */}
          {step === 2 && (
            <div className="space-y-5">
              {!isView && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label>{mode === 'edit' ? 'New Password' : 'Default Password'}</Label>
                    <Tooltip><TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent>User will be forced to change password on first login</TooltipContent></Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={cn("pr-10", errors.password && "border-destructive")}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Checkbox
                  checked={form.force_password_change}
                  onCheckedChange={(checked) => updateField('force_password_change', !!checked)}
                  disabled={isView}
                />
                <Label>Force Change Password at First Login</Label>
              </div>

              <div className="space-y-2">
                <Label>Default Language</Label>
                <div className="flex gap-3">
                  {[{ value: 'en', label: 'English' }, { value: 'ar', label: 'العربية' }, { value: 'ur', label: 'اردو' }].map(lang => (
                    <label key={lang.value} className={cn(
                      "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                      form.default_language === lang.value ? "border-primary bg-primary/5" : "border-input"
                    )}>
                      <input type="radio" name="language" value={lang.value} checked={form.default_language === lang.value} onChange={() => updateField('default_language', lang.value)} disabled={isView} className="sr-only" />
                      <span className="text-sm">{lang.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label>Status</Label>
                  <Tooltip><TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent>Deactivated users cannot log in but historical data remains intact</TooltipContent></Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm", form.is_active ? "text-green-600" : "text-muted-foreground")}>
                    {form.is_active ? t("common.active") : t("common.inactive")}
                  </span>
                  <Switch checked={form.is_active} onCheckedChange={(checked) => updateField('is_active', checked)} disabled={isView} />
                </div>
              </div>
            </div>
          )}
        </div>

        {!isView && (
          <DialogFooter className="flex justify-between">
            <div>
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={isLoading}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>{t("common.cancel")}</Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={handleNext}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? t("common.loading") : t("common.save")}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
