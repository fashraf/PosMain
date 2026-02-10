import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, ArrowRight, Save, Shield, X } from "lucide-react";
import { PermissionMatrix, Permission } from "./PermissionMatrix";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6",
  "#A855F7", "#EC4899", "#6366F1", "#14B8A6", "#64748B",
];

export interface RoleFormData {
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  permission_ids: Set<string>;
}

interface RoleFormPageProps {
  mode: "add" | "edit";
  initialData?: Partial<RoleFormData> & { is_system?: boolean };
  permissions: Permission[];
  onSubmit: (data: RoleFormData) => void;
  isLoading: boolean;
  isSaving: boolean;
  userCount?: number;
}

export function RoleFormPage({
  mode,
  initialData,
  permissions,
  onSubmit,
  isLoading,
  isSaving,
  userCount = 0,
}: RoleFormPageProps) {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const isSystem = initialData?.is_system ?? false;

  const [form, setForm] = useState<RoleFormData>({
    name: "",
    description: "",
    color: PRESET_COLORS[0],
    is_active: true,
    permission_ids: new Set(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        color: initialData.color || PRESET_COLORS[0],
        is_active: initialData.is_active !== false,
        permission_ids: initialData.permission_ids || new Set(),
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Role name is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const el = document.querySelector(`[data-field="name"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = el.querySelector("input") as HTMLElement;
        if (focusable) setTimeout(() => focusable.focus(), 350);
      }
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onSubmit(form);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const title = mode === "add" ? "Add Role" : `Edit Role — ${initialData?.name || ""}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-1.5 pb-12">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/roles")}>
          <BackIcon className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {isSystem && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium text-muted-foreground">
              System Role
            </span>
          )}
        </div>
      </div>

      {/* Warning banner */}
      {mode === "edit" && userCount > 0 && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 py-1.5 px-2">
          <AlertTriangle className="h-3 w-3 text-amber-600" />
          <AlertDescription className="text-amber-800 text-xs">
            Permission changes will affect all {userCount} assigned user(s) immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Role Details Section */}
      <DashedSectionCard title="Role Details" icon={Shield} variant="purple">
        <div className="space-y-1.5">
          {/* Inline row: Name (col-3) | Description (col-6) | Status (col-3) */}
          <div className="grid grid-cols-12 gap-1.5 items-end">
            <div className="col-span-3 space-y-0.5" data-field="name">
              <div className="flex items-center gap-1">
                <Label className="text-xs">Role Name *</Label>
                <TooltipInfo content="Used to identify this role across the system" />
              </div>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Floor Manager"
                disabled={isSystem}
                className={cn("h-7 text-xs", errors.name && "border-destructive")}
              />
              {errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}
            </div>

            <div className="col-span-6 space-y-0.5">
              <Label className="text-xs">Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of this role..."
                className="h-7 text-xs"
              />
            </div>

            <div className="col-span-3 space-y-0.5">
              <div className="flex items-center gap-1">
                <Label className="text-xs">Status</Label>
                <TooltipInfo content="Inactive roles cannot be assigned to new users" />
              </div>
              <div className="flex items-center gap-1.5 h-7">
                <span className={cn("text-xs", form.is_active ? "text-green-600" : "text-muted-foreground")}>
                  {form.is_active ? t("common.active") : t("common.inactive")}
                </span>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <Label className="text-xs">Color</Label>
              <TooltipInfo content="Color is used to visually distinguish this role in badges" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-all",
                    form.color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </DashedSectionCard>

      {/* Permission Matrix Section */}
      <DashedSectionCard title="Permission Matrix" icon={Shield} variant="blue"
        rightBadge={
          <span className="text-xs text-muted-foreground">
            Controls what actions users with this role can perform
          </span>
        }
      >
        <PermissionMatrix
          permissions={permissions}
          selectedIds={form.permission_ids}
          onChange={(ids) => setForm((f) => ({ ...f, permission_ids: ids }))}
        />
      </DashedSectionCard>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 bg-background/95 backdrop-blur-sm border-t p-2 z-30",
          isRTL ? "right-0 left-[16rem]" : "left-[16rem] right-0"
        )}
      >
        <div className={cn("flex gap-1.5 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/roles")} disabled={isSaving} className="h-7 text-xs">
            <X className="h-3 w-3 me-1" />
            {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving} className="h-7 text-xs">
            <Save className="h-3 w-3 me-1" />
            {isSaving ? t("common.loading") : "Save Role"}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmActionModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirm}
        title="Save Role"
        message={
          mode === "edit"
            ? "Are you sure you want to save this role? Permission changes will affect all assigned users immediately."
            : "Are you sure you want to create this role?"
        }
        confirmLabel="Save Role"
      />
    </div>
  );
}
