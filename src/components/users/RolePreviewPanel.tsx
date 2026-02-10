import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/roles/RoleBadge";
import { PermissionMatrix, Permission } from "@/components/roles/PermissionMatrix";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, X, Check } from "lucide-react";

interface RolePreviewPanelProps {
  roleId: string | null;
  roles: Array<{ id: string; name: string; color: string | null }>;
  onClose: () => void;
  onAssign?: (roleId: string) => void;
}

export function RolePreviewPanel({ roleId, roles, onClose, onAssign }: RolePreviewPanelProps) {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const role = roles.find((r) => r.id === roleId);

  useEffect(() => {
    if (!roleId) return;
    setIsLoading(true);
    Promise.all([
      supabase.from("permissions").select("*").order("group_name").order("sort_order"),
      supabase.from("role_permissions").select("permission_id").eq("role_id", roleId),
      supabase.from("user_roles").select("role_id").eq("role_id", roleId),
    ]).then(([permsRes, rolePermsRes, usersRes]) => {
      setPermissions(permsRes.data || []);
      setSelectedIds(new Set((rolePermsRes.data || []).map((rp) => rp.permission_id)));
      setUserCount(usersRes.data?.length || 0);
      setIsLoading(false);
    });
  }, [roleId]);

  if (!roleId || !role) return null;

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Role Preview</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <RoleBadge name={role.name} color={role.color} />
        </div>
        <p className="text-sm text-muted-foreground">Assigned to {userCount} user(s)</p>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/roles/${roleId}/edit`)}
        >
          <ExternalLink className="h-3.5 w-3.5 me-2" />
          Edit Role
        </Button>

        {/* Permissions - read only */}
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto">
            <PermissionMatrix
              permissions={permissions}
              selectedIds={selectedIds}
              onChange={() => {}}
              disabled
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onAssign && (
            <Button size="sm" className="flex-1" onClick={() => onAssign(roleId)}>
              <Check className="h-4 w-4 me-1" />
              Assign this role
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
