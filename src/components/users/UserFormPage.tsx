import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, ArrowRight, Info, Save, User, X, Shield, Briefcase, FileText, Lock, CheckCircle, Check, Circle, Mail } from "lucide-react";
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

const NATIONALITY_OPTIONS = [
  "Saudi", "Indian", "Egyptian", "Bangladeshi", "Pakistani", "Yemeni", "Sudanese", "Other",
];

interface SectionNav {
  id: string;
  label: string;
  icon: React.ElementType;
  isComplete: boolean;
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
    if (form.branch_ids.length === 0 && branches.length > 0) newErrors.branch_ids = "Select at least one branch";
    if (mode === "add" && (!form.password || form.password.length < 8))
      newErrors.password = "Min 8 characters";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = el.querySelector("input, select, button") as HTMLElement;
        if (focusable) setTimeout(() => focusable.focus(), 350);
      }
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onSubmit(form);
  };

  // Section completion
  const sections: SectionNav[] = [
    { id: "profile", label: "Profile", icon: User, isComplete: !!form.full_name.trim() && !!form.phone.trim() },
    { id: "identification", label: "Identification", icon: FileText, isComplete: true },
    { id: "employment", label: "Employment", icon: Briefcase, isComplete: !!form.emp_type_id || !!form.default_language },
    { id: "role-branches", label: "Role & Branches", icon: Shield, isComplete: !!form.role_id && form.branch_ids.length > 0 },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="space-y-3 pb-14">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/users")}>
          <BackIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {mode === "add" && (
            <p className="text-[11px] text-muted-foreground">
              Create a new system user and assign role & branch access
            </p>
          )}
        </div>
      </div>

      {/* Edit Warning */}
      {mode === "edit" && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 py-1.5 px-2">
          <AlertTriangle className="h-3 w-3 text-amber-600" />
          <AlertDescription className="text-amber-800 text-[11px]">
            Changes will apply immediately across all assigned branches
          </AlertDescription>
        </Alert>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Left Column */}
        <div className="col-span-8 space-y-3">
          {/* Profile Information + Status */}
          <div id="section-profile">
            <DashedSectionCard title="Profile Information" icon={User} variant="purple" isComplete={sections[0].isComplete}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ImageUploadHero
                    value={form.profile_image}
                    onChange={(url) => updateField("profile_image", url)}
                    size={72}
                  />
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-1" data-field="full_name">
                      <Label className="text-lg font-medium">Full Name *</Label>
                      <Input
                        value={form.full_name}
                        onChange={(e) => updateField("full_name", e.target.value)}
                        className={cn("h-9 text-sm", errors.full_name && "border-destructive")}
                      />
                      {errors.full_name && <p className="text-[10px] text-destructive">{errors.full_name}</p>}
                    </div>
                    <div className="space-y-1" data-field="phone">
                      <div className="flex items-center gap-1">
                        <Label className="text-lg font-medium">Mobile *</Label>
                        <TooltipInfo content="Used as login ID" />
                      </div>
                      <Input
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+966 50 123 4567"
                        className={cn("h-9 text-sm", errors.phone && "border-destructive")}
                      />
                      {errors.phone && <p className="text-[10px] text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Label className="text-lg font-medium">Email</Label>
                        <Mail className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="Optional"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Label className="text-lg font-medium">Age</Label>
                        <TooltipInfo content="Used for compliance reporting" />
                      </div>
                      <Input
                        type="number"
                        value={form.age}
                        onChange={(e) => updateField("age", e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-lg font-medium">Nationality</Label>
                      <Select value={form.nationality} onValueChange={(v) => updateField("nationality", v)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {NATIONALITY_OPTIONS.map((n) => (
                            <SelectItem key={n} value={n}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Label className="text-lg font-medium">Status</Label>
                        <TooltipInfo content="Inactive users cannot log in but historical data remains intact" />
                      </div>
                      <div className="flex gap-2">
                        {[
                          { value: true, label: t("common.active") },
                          { value: false, label: t("common.inactive") },
                        ].map((opt) => (
                          <label
                            key={String(opt.value)}
                            className={cn(
                              "flex items-center gap-1 px-3 py-1.5 border rounded cursor-pointer transition-colors text-sm",
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
                    </div>
                  </div>
                </div>
              </div>
            </DashedSectionCard>
          </div>

          {/* Identification */}
          <div id="section-identification">
            <DashedSectionCard title="Identification (Optional)" icon={FileText} variant="amber" isComplete={true}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label className="text-lg font-medium">National ID / Iqama</Label>
                      <TooltipInfo content="Iqama number for Saudi-based employees" />
                    </div>
                    <Input
                      value={form.national_id}
                      onChange={(e) => updateField("national_id", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-lg font-medium">Iqama Expiry</Label>
                    <Input
                      type="date"
                      value={form.national_id_expiry}
                      onChange={(e) => updateField("national_id_expiry", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label className="text-lg font-medium">Passport Number</Label>
                      <TooltipInfo content="Required for non-Saudi employees" />
                    </div>
                    <Input
                      value={form.passport_number}
                      onChange={(e) => updateField("passport_number", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-lg font-medium">Passport Expiry</Label>
                    <Input
                      type="date"
                      value={form.passport_expiry}
                      onChange={(e) => updateField("passport_expiry", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Expiry reminders will be generated automatically if dates are provided
                </p>
              </div>
            </DashedSectionCard>
          </div>

          {/* Employment & Access + Security merged */}
          <div id="section-employment">
            <DashedSectionCard title="Employment & Access" icon={Briefcase} variant="blue" isComplete={sections[2].isComplete}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium">Employee Type</Label>
                    <Select value={form.emp_type_id} onValueChange={(v) => updateField("emp_type_id", v)}>
                      <SelectTrigger className="h-9 text-sm">
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
                      <Label className="text-lg font-medium">Default Language</Label>
                      <TooltipInfo content="Sets the default UI language for this user" />
                    </div>
                    <div className="flex gap-2">
                      {[
                        { value: "en", label: "EN" },
                        { value: "ar", label: "AR" },
                        { value: "ur", label: "UR" },
                      ].map((lang) => (
                        <label
                          key={lang.value}
                          className={cn(
                            "flex items-center px-3 py-1.5 border rounded cursor-pointer transition-colors text-sm",
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

                {/* Security sub-section */}
                <div className="border-t border-dashed pt-3 mt-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">Security</span>
                  </div>
                  {mode === "add" ? (
                    <div className="space-y-1" data-field="password">
                      <Label className="text-lg font-medium">Default Password</Label>
                      <Input value={form.password} readOnly className="max-w-xs bg-muted h-9 text-sm" />
                      <p className="text-[10px] text-muted-foreground">Auto-generated default password</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={form.force_password_change}
                          onCheckedChange={(checked) => updateField("force_password_change", !!checked)}
                          className="h-3.5 w-3.5"
                        />
                        <Label className="cursor-pointer text-sm">
                          Reset password & force change at next login
                        </Label>
                      </div>
                      {onResetPassword && (
                        <Button variant="outline" size="sm" type="button" onClick={onResetPassword} className="h-6 text-[11px] px-2">
                          Reset Password Now
                        </Button>
                      )}
                      <p className="text-[10px] text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Resetting will immediately invalidate current credentials
                      </p>
                    </div>
                  )}

                  {mode === "add" && (
                    <div className="flex items-center gap-2 mt-1">
                      <Checkbox
                        checked={form.force_password_change}
                        onCheckedChange={(checked) => updateField("force_password_change", !!checked)}
                        className="h-3.5 w-3.5"
                      />
                      <div className="flex items-center gap-1">
                        <Label className="cursor-pointer text-sm">Force change at first login</Label>
                        <TooltipInfo content="User will be required to set a new password on their next login" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashedSectionCard>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-3">
          {/* Section Navigation Tabs */}
          <div className="sticky top-0 z-10 bg-background rounded-lg border p-1.5 space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase px-1">Sections</span>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-muted/60 transition-colors text-left"
              >
                <s.icon className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="flex-1 truncate">{s.label}</span>
                {s.isComplete ? (
                  <Check className="h-3 w-3 text-green-600 shrink-0" strokeWidth={2.5} />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground/40 shrink-0" strokeWidth={1.5} />
                )}
              </button>
            ))}
          </div>

          {/* Role & Branches */}
          <div id="section-role-branches">
            <DashedSectionCard title="Role & Branches" icon={Shield} variant="blue" isComplete={sections[3].isComplete}>
              <div className="space-y-3">
                <div className="space-y-1" data-field="role_id">
                  <div className="flex items-center gap-1">
                    <Label className="text-lg font-medium">Role *</Label>
                    {form.role_id && (
                      <button
                        type="button"
                        onClick={() => setShowRolePreview(true)}
                        className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                      >
                        <Info className="h-3 w-3" />
                        View
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
                    <SelectTrigger className={cn("h-9 text-sm", errors.role_id && "border-destructive")}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          <div className="flex items-center gap-1.5">
                            <RoleBadge name={r.name} color={r.color} />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role_id && <p className="text-[10px] text-destructive">{errors.role_id}</p>}
                </div>

                {/* Branches */}
                <div className="space-y-1" data-field="branch_ids">
                  <Label className="text-lg font-medium">Branches *</Label>
                  {errors.branch_ids && (
                    <p className="text-[10px] text-destructive">{errors.branch_ids}</p>
                  )}
                  <div className="border rounded p-2 space-y-1 max-h-28 overflow-y-auto">
                    {branches.map((b) => (
                      <div key={b.id} className="flex items-center gap-1.5">
                        <Checkbox
                          checked={form.branch_ids.includes(b.id)}
                          onCheckedChange={() => toggleBranch(b.id)}
                          className="h-3.5 w-3.5"
                        />
                        <span className="text-sm">{b.name}</span>
                      </div>
                    ))}
                    {branches.length === 0 && (
                      <div className="text-center py-2 space-y-1">
                        <p className="text-xs text-amber-600 flex items-center justify-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          No branches found
                        </p>
                        <Link to="/branches/add" className="text-[11px] text-primary hover:underline">
                          + Add branches first
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DashedSectionCard>
          </div>

          {/* Role Preview Panel */}
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
          "fixed bottom-0 bg-background/95 backdrop-blur-sm border-t p-2 z-30",
          isRTL ? "right-0 left-[16rem]" : "left-[16rem] right-0"
        )}
      >
        <div className={cn("flex gap-1.5 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/users")} disabled={isSaving} className="h-7 text-xs">
            <X className="h-3 w-3 me-1" />
            {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving} className="h-7 text-xs">
            <Save className="h-3 w-3 me-1" />
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
