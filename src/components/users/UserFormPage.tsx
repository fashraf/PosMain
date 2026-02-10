import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, ArrowLeft, ArrowRight, Camera, Info, Save, Upload, User, X } from "lucide-react";
import { RoleBadge } from "@/components/roles/RoleBadge";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export interface UserFormData {
  full_name: string;
  phone: string;
  email: string;
  age: string;
  nationality: string;
  national_id: string;
  national_id_expiry: string;
  passport_number: string;
  passport_expiry: string;
  emp_type_id: string;
  role_id: string;
  branch_ids: string[];
  password: string;
  force_password_change: boolean;
  default_language: string;
  is_active: boolean;
}

interface RoleOption {
  id: string;
  name: string;
  color: string | null;
}
interface BranchOption {
  id: string;
  name: string;
}
interface EmpTypeOption {
  id: string;
  name_en: string;
}

interface UserFormPageProps {
  mode: "add" | "edit";
  initialData?: Partial<UserFormData>;
  editUserName?: string;
  roles: RoleOption[];
  branches: BranchOption[];
  empTypes: EmpTypeOption[];
  onSubmit: (data: UserFormData) => void;
  isLoading: boolean;
  isSaving: boolean;
  onResetPassword?: () => void;
  onShowRolePreview?: (roleId: string) => void;
  rolePreviewPanel?: React.ReactNode;
}

export function UserFormPage({
  mode,
  initialData,
  editUserName,
  roles,
  branches,
  empTypes,
  onSubmit,
  isLoading,
  isSaving,
  onResetPassword,
  onShowRolePreview,
  rolePreviewPanel,
}: UserFormPageProps) {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState<UserFormData>({
    full_name: "",
    phone: "",
    email: "",
    age: "",
    nationality: "",
    national_id: "",
    national_id_expiry: "",
    passport_number: "",
    passport_expiry: "",
    emp_type_id: "",
    role_id: "",
    branch_ids: [],
    password: "123456abc",
    force_password_change: true,
    default_language: "en",
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm((f) => ({ ...f, ...initialData, password: mode === "add" ? "123456abc" : "" }));
    }
  }, [initialData, mode]);

  const updateField = <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const toggleBranch = (branchId: string) => {
    setForm((f) => ({
      ...f,
      branch_ids: f.branch_ids.includes(branchId)
        ? f.branch_ids.filter((id) => id !== branchId)
        : [...f.branch_ids, branchId],
    }));
    if (errors.branch_ids) setErrors((e) => ({ ...e, branch_ids: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.role_id) newErrors.role_id = "Required";
    if (form.branch_ids.length === 0) newErrors.branch_ids = "Select at least one branch";
    if (mode === "add" && (!form.password || form.password.length < 8))
      newErrors.password = "Min 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const title = mode === "add" ? t("users.addUser") : `Edit User — ${editUserName || ""}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {mode === "add" && (
            <p className="text-sm text-muted-foreground mt-1">
              Create a new system user and assign role & branch access
            </p>
          )}
        </div>
      </div>

      {/* Edit Warning */}
      {mode === "edit" && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            Changes will apply immediately across all assigned branches
          </AlertDescription>
        </Alert>
      )}

      {/* Two Column Layout */}
      <div className="flex gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Placeholder */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" type="button">
                    <Upload className="h-4 w-4 me-2" />
                    {mode === "edit" ? "Replace Photo" : "Upload Photo"}
                  </Button>
                  <Button variant="outline" size="sm" type="button">
                    <Camera className="h-4 w-4 me-2" />
                    Take Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={form.full_name}
                    onChange={(e) => updateField("full_name", e.target.value)}
                    className={cn(errors.full_name && "border-destructive")}
                  />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label>Mobile Number *</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Used as login ID</TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+966 50 123 4567"
                    className={cn(errors.phone && "border-destructive")}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) => updateField("age", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label>Nationality</Label>
                  </div>
                  <Input
                    value={form.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for compliance and document validation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identification (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>National ID / Iqama</Label>
                  <Input
                    value={form.national_id}
                    onChange={(e) => updateField("national_id", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Iqama Expiry</Label>
                  <Input
                    type="date"
                    value={form.national_id_expiry}
                    onChange={(e) => updateField("national_id_expiry", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Passport Number</Label>
                  <Input
                    value={form.passport_number}
                    onChange={(e) => updateField("passport_number", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Passport Expiry</Label>
                  <Input
                    type="date"
                    value={form.passport_expiry}
                    onChange={(e) => updateField("passport_expiry", e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                Expiry reminders will be generated automatically if dates are provided
              </p>
            </CardContent>
          </Card>

          {/* Employment & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employment & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee Type</Label>
                  <Select
                    value={form.emp_type_id}
                    onValueChange={(v) => updateField("emp_type_id", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {empTypes.map((et) => (
                        <SelectItem key={et.id} value={et.id}>
                          {et.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label>Role *</Label>
                    {form.role_id && onShowRolePreview && (
                      <button
                        type="button"
                        onClick={() => onShowRolePreview(form.role_id)}
                        className="text-xs text-primary hover:underline flex items-center gap-0.5"
                      >
                        <Info className="h-3 w-3" />
                        View full permissions
                      </button>
                    )}
                  </div>
                  <Select
                    value={form.role_id}
                    onValueChange={(v) => {
                      updateField("role_id", v);
                      onShowRolePreview?.(v);
                    }}
                  >
                    <SelectTrigger className={cn(errors.role_id && "border-destructive")}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
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
              </div>

              {/* Branches */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label>Branches *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>User can only operate within selected branches</TooltipContent>
                  </Tooltip>
                </div>
                {errors.branch_ids && (
                  <p className="text-xs text-destructive">{errors.branch_ids}</p>
                )}
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {branches.map((b) => (
                    <div key={b.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={form.branch_ids.includes(b.id)}
                        onCheckedChange={() => toggleBranch(b.id)}
                      />
                      <span className="text-sm">{b.name}</span>
                    </div>
                  ))}
                  {branches.length === 0 && (
                    <p className="text-sm text-muted-foreground">No branches available</p>
                  )}
                </div>
              </div>

              {/* Default Language */}
              <div className="space-y-2">
                <Label>Default Language</Label>
                <div className="flex gap-3">
                  {[
                    { value: "en", label: "English" },
                    { value: "ar", label: "العربية" },
                    { value: "ur", label: "اردو" },
                  ].map((lang) => (
                    <label
                      key={lang.value}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                        form.default_language === lang.value
                          ? "border-primary bg-primary/5"
                          : "border-input"
                      )}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={lang.value}
                        checked={form.default_language === lang.value}
                        onChange={() => updateField("default_language", lang.value)}
                        className="sr-only"
                      />
                      <span className="text-sm">{lang.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === "add" ? (
                <div className="space-y-2">
                  <Label>Default Password</Label>
                  <Input value={form.password} readOnly className="max-w-xs bg-muted" />
                  <p className="text-xs text-muted-foreground">Auto-generated default password</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={form.force_password_change}
                      onCheckedChange={(checked) =>
                        updateField("force_password_change", !!checked)
                      }
                    />
                    <Label className="cursor-pointer">
                      Reset password & force change at next login
                    </Label>
                  </div>
                  {onResetPassword && (
                    <Button variant="outline" size="sm" type="button" onClick={onResetPassword}>
                      Reset Password Now
                    </Button>
                  )}
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Resetting password will immediately invalidate the current credentials
                  </p>
                </div>
              )}

              {mode === "add" && (
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={form.force_password_change}
                    onCheckedChange={(checked) =>
                      updateField("force_password_change", !!checked)
                    }
                  />
                  <Label className="cursor-pointer">Force change at first login</Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-4">
                {[
                  { value: true, label: t("common.active") },
                  { value: false, label: t("common.inactive") },
                ].map((opt) => (
                  <label
                    key={String(opt.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                      form.is_active === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-input"
                    )}
                  >
                    <input
                      type="radio"
                      name="status"
                      checked={form.is_active === opt.value}
                      onChange={() => updateField("is_active", opt.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Inactive users cannot log in but historical data remains intact
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Role Preview Panel */}
        {rolePreviewPanel && (
          <div className="w-[340px] shrink-0">{rolePreviewPanel}</div>
        )}
      </div>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 bg-background border-t p-4 z-10",
          "flex items-center gap-3",
          isRTL
            ? "flex-row-reverse pe-[var(--sidebar-width)] ps-4"
            : "ps-[var(--sidebar-width)] pe-4"
        )}
        style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
      >
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/users")} disabled={isSaving}>
            <X className="h-4 w-4 me-2" />
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            <Save className="h-4 w-4 me-2" />
            {isSaving ? t("common.loading") : "Save User"}
          </Button>
        </div>
      </div>
    </div>
  );
}
