import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoleTable, RoleData } from "@/components/roles/RoleTable";
import { RoleDialog, RoleFormData } from "@/components/roles/RoleDialog";
import { Permission } from "@/components/roles/PermissionMatrix";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";

export default function Roles() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [roles, setRoles] = useState<RoleData[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, permsRes, rolePermsRes, userRolesRes] = await Promise.all([
        supabase.from('roles').select('*').order('name'),
        supabase.from('permissions').select('*').order('group_name').order('sort_order'),
        supabase.from('role_permissions').select('*'),
        supabase.from('user_roles').select('role_id'),
      ]);

      if (rolesRes.error) throw rolesRes.error;
      if (permsRes.error) throw permsRes.error;

      // Count users per role
      const userCountMap = new Map<string, number>();
      (userRolesRes.data || []).forEach(ur => {
        userCountMap.set(ur.role_id, (userCountMap.get(ur.role_id) || 0) + 1);
      });

      setRoles((rolesRes.data || []).map(r => ({
        ...r,
        user_count: userCountMap.get(r.id) || 0,
      })));
      setPermissions(permsRes.data || []);
    } catch (error) {
      toast({ title: t("common.error"), description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const loadRolePermissions = async (roleId: string) => {
    const { data } = await supabase.from('role_permissions').select('permission_id').eq('role_id', roleId);
    return new Set((data || []).map(rp => rp.permission_id));
  };

  const handleAdd = () => {
    setSelectedRole(null);
    setSelectedPermissionIds(new Set());
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEdit = async (role: RoleData) => {
    const permIds = await loadRolePermissions(role.id);
    setSelectedRole(role);
    setSelectedPermissionIds(permIds);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = async (role: RoleData) => {
    const permIds = await loadRolePermissions(role.id);
    setSelectedRole(role);
    setSelectedPermissionIds(permIds);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleSubmit = async (data: RoleFormData) => {
    setIsSubmitting(true);
    try {
      if (dialogMode === 'add') {
        const { data: newRole, error } = await supabase.from('roles').insert({
          name: data.name.trim(),
          description: data.description.trim() || null,
          color: data.color,
          is_active: data.is_active,
        }).select().single();

        if (error) throw error;

        // Insert permissions
        if (data.permission_ids.size > 0) {
          const permRows = Array.from(data.permission_ids).map(pid => ({
            role_id: newRole.id,
            permission_id: pid,
          }));
          const { error: rpError } = await supabase.from('role_permissions').insert(permRows);
          if (rpError) throw rpError;
        }

        toast({ title: t("common.success"), description: "Role created successfully" });
      } else if (dialogMode === 'edit' && selectedRole) {
        const updatePayload: Record<string, unknown> = {
          description: data.description.trim() || null,
          color: data.color,
          is_active: data.is_active,
        };
        if (!selectedRole.is_system) {
          updatePayload.name = data.name.trim();
        }

        const { error } = await supabase.from('roles').update(updatePayload).eq('id', selectedRole.id);
        if (error) throw error;

        // Sync permissions: delete all then re-insert
        await supabase.from('role_permissions').delete().eq('role_id', selectedRole.id);
        if (data.permission_ids.size > 0) {
          const permRows = Array.from(data.permission_ids).map(pid => ({
            role_id: selectedRole.id,
            permission_id: pid,
          }));
          await supabase.from('role_permissions').insert(permRows);
        }

        toast({ title: t("common.success"), description: "Role updated successfully" });
      }

      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: t("common.error"), description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <LoadingOverlay visible={isSubmitting} />
      <RoleTable roles={roles} isLoading={isLoading} onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />
      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedRole ? {
          name: selectedRole.name,
          description: selectedRole.description || '',
          color: selectedRole.color || '#EF4444',
          is_active: selectedRole.is_active,
          is_system: selectedRole.is_system,
          permission_ids: selectedPermissionIds,
        } : undefined}
        permissions={permissions}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        userCount={selectedRole?.user_count}
      />
    </div>
  );
}
