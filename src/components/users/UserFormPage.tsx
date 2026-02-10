import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, ArrowRight, Info, Save, User, X, Shield, Briefcase, FileText, Lock, CheckCircle } from "lucide-react";
import { RoleBadge } from "@/components/roles/RoleBadge";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
import { ImageUploadHero } from "@/components/shared/ImageUploadHero";
import { RolePreviewPanel } from "@/components/users/RolePreviewPanel";
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
  profile_image: string | null;
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
    profile_image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRolePreview, setShowRolePreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm((f) => ({ ...f, ...initialData, password: mode === "add" ? "123456abc" : "" }));
      if (initialData.role_id) setShowRolePreview(true);
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
    if (validate()) setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onSubmit(form);
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
    <div className="space-y-3 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/users")}>
          <BackIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {mode === "add" && (
            <p className="text-xs text-muted-foreground">
              Create a new system user and assign role & branch access
            </p>
          )}
        </div>
      </div>

      {/* Edit Warning */}
      {mode === "edit" && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 py-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          <AlertDescription className="text-amber-800 text-xs">
            Changes will apply immediately across all assigned branches
          </AlertDescription>
        </Alert>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Left Column - col-span-8 */}
        <div className="col-span-8 space-y-3">
          {/* Profile Information */}
          <DashedSectionCard title="Profile Information" icon={User} variant="purple">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <ImageUploadHero
                  value={form.profile_image}
                  onChange={(url) => updateField("profile_image", url)}
                  size={80}
                />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name *</Label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      className={cn("h-8 text-sm", errors.full_name && "border-destructive")}
                    />
                    {errors.full_name && <p className="text-[11px] text-destructive">{errors.full_name}</p>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label className="text-xs">Mobile Number *</Label>
                      <TooltipInfo content="Used as login ID" />
                    </div>
                    <Input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+966 50 123 4567"
                      className={cn("h-8 text-sm", errors.phone && "border-destructive")}
                    />
                    {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label className="text-xs">Age</Label>
                      <TooltipInfo content="Used for compliance reporting" />
                    </div>
                    <Input
                      type="number"
                      value={form.age}
                      onChange={(e) => updateField("age", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nationality</Label>
                    <Input
                      value={form.nationality}
                      onChange={(e) => updateField("nationality", e.target.value)}
                      className="h-8 text-sm"
                    />
                    <p className="text-[10px] text-muted-foreground">Used for compliance and document validation</p>
                  </div>
                </div>
              </div>
            </div>
          </DashedSectionCard>

          {/* Identification */}
          <DashedSectionCard title="Identification (Optional)" icon={FileText} variant="amber">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">National ID / Iqama</Label>
                    <TooltipInfo content="Iqama number for Saudi-based employees" />
                  </div>
                  <Input
                    value={form.national_id}
                    onChange={(e) => updateField("national_id", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Iqama Expiry</Label>
                  <Input
                    type="date"
                    value={form.national_id_expiry}
                    onChange={(e) => updateField("national_id_expiry", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">Passport Number</Label>
                    <TooltipInfo content="Required for non-Saudi employees" />
                  </div>
                  <Input
                    value={form.passport_number}
                    onChange={(e) => updateField("passport_number", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Passport Expiry</Label>
                  <Input
                    type="date"
                    value={form.passport_expiry}
                    onChange={(e) => updateField("passport_expiry", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <p className="text-[11px] text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Expiry reminders will be generated automatically if dates are provided
              </p>
            </div>
          </DashedSectionCard>

          {/* Employment & Access */}
          <DashedSectionCard title="Employment & Access" icon={Briefcase} variant="blue">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Employee Type</Label>
                  <Select
                    value={form.emp_type_id}
                    onValueChange={(v) => updateField("emp_type_id", v)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {empTypes.map((et) => (
                        <SelectItem key={et.id} value={et.id}>{et.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">Default Language</Label>
                    <TooltipInfo content="Sets the default UI language for this user" />
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { value: "en", label: "English" },
                      { value: "ar", label: "العربية" },
                      { value: "ur", label: "اردو" },
                    ].map((lang) => (
                      <label
                        key={lang.value}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md cursor-pointer transition-colors text-xs",
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
                        {lang.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DashedSectionCard>

          {/* Security */}
          <DashedSectionCard title="Security" icon={Lock} variant="muted">
            <div className="space-y-2">
              {mode === "add" ? (
                <div className="space-y-1">
                  <Label className="text-xs">Default Password</Label>
                  <Input value={form.password} readOnly className="max-w-xs bg-muted h-8 text-sm" />
                  <p className="text-[10px] text-muted-foreground">Auto-generated default password</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.force_password_change}
                      onCheckedChange={(checked) => updateField("force_password_change", !!checked)}
                      className="h-3.5 w-3.5"
                    />
                    <Label className="cursor-pointer text-xs">
                      Reset password & force change at next login
                    </Label>
                  </div>
                  {onResetPassword && (
                    <Button variant="outline" size="sm" type="button" onClick={onResetPassword} className="h-7 text-xs">
                      Reset Password Now
                    </Button>
                  )}
                  <p className="text-[11px] text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Resetting password will immediately invalidate the current credentials
                  </p>
                </div>
              )}

              {mode === "add" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={form.force_password_change}
                    onCheckedChange={(checked) => updateField("force_password_change", !!checked)}
                    className="h-3.5 w-3.5"
                  />
                  <div className="flex items-center gap-1">
                    <Label className="cursor-pointer text-xs">Force change at first login</Label>
                    <TooltipInfo content="User will be required to set a new password on their next login" />
                  </div>
                </div>
              )}
            </div>
          </DashedSectionCard>

          {/* Status */}
          <DashedSectionCard title="Status" icon={CheckCircle} variant="green">
            <div className="space-y-2">
              <div className="flex gap-3">
                {[
                  { value: true, label: t("common.active") },
                  { value: false, label: t("common.inactive") },
                ].map((opt) => (
                  <label
                    key={String(opt.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 border rounded-md cursor-pointer transition-colors text-xs",
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
                    {opt.label}
                  </label>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <TooltipInfo content="Inactive users cannot log in but historical data remains intact" />
                Inactive users cannot log in but historical data remains intact
              </p>
            </div>
          </DashedSectionCard>
        </div>

        {/* Right Column - col-span-4 */}
        <div className="col-span-4 space-y-3">
          {/* Role & Branches */}
          <DashedSectionCard title="Role & Branches" icon={Shield} variant="blue">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Role *</Label>
                  {form.role_id && (
                    <button
                      type="button"
                      onClick={() => setShowRolePreview(true)}
                      className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                    >
                      <Info className="h-3 w-3" />
                      View permissions
                    </button>
                  )}
                </div>
                <Select
                  value={form.role_id}
                  onValueChange={(v) => {
                    updateField("role_id", v);
                    setShowRolePreview(true);
                  }}
                >
                  <SelectTrigger className={cn("h-8 text-sm", errors.role_id && "border-destructive")}>
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
                {errors.role_id && <p className="text-[11px] text-destructive">{errors.role_id}</p>}
              </div>

              {/* Branches */}
              <div className="space-y-1">
                <Label className="text-xs">Branches *</Label>
                {errors.branch_ids && (
                  <p className="text-[11px] text-destructive">{errors.branch_ids}</p>
                )}
                <div className="border rounded-lg p-2 space-y-1 max-h-32 overflow-y-auto">
                  {branches.map((b) => (
                    <div key={b.id} className="flex items-center gap-1.5">
                      <Checkbox
                        checked={form.branch_ids.includes(b.id)}
                        onCheckedChange={() => toggleBranch(b.id)}
                        className="h-3.5 w-3.5"
                      />
                      <span className="text-xs">{b.name}</span>
                    </div>
                  ))}
                  {branches.length === 0 && (
                    <p className="text-xs text-muted-foreground">No branches available</p>
                  )}
                </div>
              </div>
            </div>
          </DashedSectionCard>

          {/* Role Preview Panel - inline */}
          {showRolePreview && form.role_id && (
            <RolePreviewPanel
              roleId={form.role_id}
              roles={roles}
              onClose={() => setShowRolePreview(false)}
            />
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 bg-background/95 backdrop-blur-sm border-t p-3 z-30",
          isRTL ? "right-0 left-[16rem]" : "left-[16rem] right-0"
        )}
      >
        <div className={cn("flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/users")} disabled={isSaving}>
            <X className="h-3.5 w-3.5 me-1.5" />
            {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving}>
            <Save className="h-3.5 w-3.5 me-1.5" />
            {isSaving ? t("common.loading") : "Save User"}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmActionModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirm}
        title="Save User"
        message={
          mode === "add"
            ? "Are you sure you want to create this user? They will be able to log in with the provided credentials."
            : "Are you sure you want to save changes? Updates will apply immediately across all assigned branches."
        }
        confirmLabel="Save User"
      />
    </div>
  );
}
