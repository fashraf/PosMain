import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";
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

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit' | 'view';
  initialData?: Partial<RoleFormData> & { is_system?: boolean };
  permissions: Permission[];
  onSubmit: (data: RoleFormData) => void;
  isLoading: boolean;
  userCount?: number;
}

export function RoleDialog({ open, onOpenChange, mode, initialData, permissions, onSubmit, isLoading, userCount = 0 }: RoleDialogProps) {
  const { t } = useLanguage();
  const isView = mode === 'view';
  const isSystem = initialData?.is_system ?? false;

  const [form, setForm] = useState<RoleFormData>({
    name: '',
    description: '',
    color: PRESET_COLORS[0],
    is_active: true,
    permission_ids: new Set(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name || '',
        description: initialData?.description || '',
        color: initialData?.color || PRESET_COLORS[0],
        is_active: initialData?.is_active !== false,
        permission_ids: initialData?.permission_ids || new Set(),
      });
      setErrors({});
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Role name is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSubmit(form);
  };

  const getTitle = () => {
    switch (mode) {
      case 'add': return 'Add Role';
      case 'edit': return 'Edit Role';
      case 'view': return 'View Role';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {getTitle()}
            {isSystem && <span className="text-xs bg-muted px-2 py-0.5 rounded">System Role</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-5">
          {mode === 'edit' && userCount > 0 && (
            <Alert variant="destructive" className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                Changing role permissions will immediately affect {userCount} assigned user(s).
              </AlertDescription>
            </Alert>
          )}

          {/* Role Name */}
          <div className="space-y-2">
            <Label>Role Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Floor Manager"
              disabled={isView || isSystem}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this role..."
              disabled={isView}
              className="min-h-[60px]"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => !isView && setForm(f => ({ ...f, color: c }))}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all",
                    form.color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                  disabled={isView}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm", form.is_active ? "text-green-600" : "text-muted-foreground")}>
                {form.is_active ? t("common.active") : t("common.inactive")}
              </span>
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setForm(f => ({ ...f, is_active: checked }))}
                disabled={isView}
              />
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Permissions</Label>
            <PermissionMatrix
              permissions={permissions}
              selectedIds={form.permission_ids}
              onChange={(ids) => setForm(f => ({ ...f, permission_ids: ids }))}
              disabled={isView}
            />
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
