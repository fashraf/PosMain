import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, ArrowLeft, ArrowRight, Info, Save, Shield, X } from "lucide-react";
import { PermissionMatrix, Permission } from "./PermissionMatrix";
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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/roles")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {isSystem && (
            <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium text-muted-foreground">
              System Role
            </span>
          )}
        </div>
      </div>

      {/* Warning banner */}
      {mode === "edit" && userCount > 0 && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            Permission changes will affect all {userCount} assigned user(s) immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Role Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Role Name */}
          <div className="space-y-2">
            <Label>Role Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Floor Manager"
              disabled={isSystem}
              className={cn("max-w-md", errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this role..."
              className="min-h-[80px] max-w-lg"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all",
                    form.color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between max-w-md">
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm", form.is_active ? "text-green-600" : "text-muted-foreground")}>
                {form.is_active ? t("common.active") : t("common.inactive")}
              </span>
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Permission Matrix</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Controls what actions users with this role can perform across all branches</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <PermissionMatrix
            permissions={permissions}
            selectedIds={form.permission_ids}
            onChange={(ids) => setForm((f) => ({ ...f, permission_ids: ids }))}
          />
        </CardContent>
      </Card>

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
          <Button variant="outline" onClick={() => navigate("/roles")} disabled={isSaving}>
            <X className="h-4 w-4 me-2" />
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            <Save className="h-4 w-4 me-2" />
            {isSaving ? t("common.loading") : "Save Role"}
          </Button>
        </div>
      </div>
    </div>
  );
}
