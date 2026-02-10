import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    <div className="border-2 border-dashed border-blue-300/40 rounded-xl overflow-hidden sticky top-4">
      <div className="px-3 py-2 bg-blue-50 border-b border-dashed border-blue-200/50 flex items-center justify-between">
        <span className="text-xs font-semibold text-blue-700">Role Preview</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="p-3 space-y-3 bg-white">
        <div className="flex items-center gap-2">
          <RoleBadge name={role.name} color={role.color} />
        </div>
        <p className="text-[11px] text-muted-foreground">Assigned to {userCount} user(s)</p>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs"
          onClick={() => navigate(`/roles/${roleId}/edit`)}
        >
          <ExternalLink className="h-3 w-3 me-1.5" />
          Edit Role
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="max-h-[45vh] overflow-y-auto">
            <PermissionMatrix
              permissions={permissions}
              selectedIds={selectedIds}
              onChange={() => {}}
              disabled
            />
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {onAssign && (
            <Button size="sm" className="flex-1 h-7 text-xs" onClick={() => onAssign(roleId)}>
              <Check className="h-3 w-3 me-1" />
              Assign
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
