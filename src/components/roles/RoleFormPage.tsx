import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    if (Object.keys(newErrors).length > 0) return;
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
    <div className="space-y-3 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/roles")}>
          <BackIcon className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {isSystem && (
            <span className="text-[11px] bg-muted px-2 py-0.5 rounded-full font-medium text-muted-foreground">
              System Role
            </span>
          )}
        </div>
      </div>

      {/* Warning banner */}
      {mode === "edit" && userCount > 0 && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 py-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          <AlertDescription className="text-amber-800 text-xs">
            Permission changes will affect all {userCount} assigned user(s) immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Role Details Section */}
      <DashedSectionCard title="Role Details" icon={Shield} variant="purple">
        <div className="space-y-3">
          {/* Role Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Label className="text-xs">Role Name *</Label>
              <TooltipInfo content="Used to identify this role across the system" />
            </div>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Floor Manager"
              disabled={isSystem}
              className={cn("max-w-md h-8 text-sm", errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this role..."
              className="min-h-[60px] max-w-lg text-sm"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-1">
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
                    "h-6 w-6 rounded-full border-2 transition-all",
                    form.color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between max-w-md">
            <div className="flex items-center gap-1">
              <Label className="text-xs">Status</Label>
              <TooltipInfo content="Inactive roles cannot be assigned to new users" />
            </div>
            <div className="flex items-center gap-2">
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
      </DashedSectionCard>

      {/* Permission Matrix Section */}
      <DashedSectionCard title="Permission Matrix" icon={Shield} variant="blue"
        rightBadge={
          <span className="text-[11px] text-muted-foreground">
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
          "fixed bottom-0 bg-background/95 backdrop-blur-sm border-t p-3 z-30",
          isRTL ? "right-0 left-[16rem]" : "left-[16rem] right-0"
        )}
      >
        <div className={cn("flex gap-2 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/roles")} disabled={isSaving}>
            <X className="h-3.5 w-3.5 me-1.5" />
            {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving}>
            <Save className="h-3.5 w-3.5 me-1.5" />
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
