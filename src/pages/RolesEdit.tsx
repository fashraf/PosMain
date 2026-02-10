import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoleFormPage, RoleFormData } from "@/components/roles/RoleFormPage";
import { Permission } from "@/components/roles/PermissionMatrix";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";

export default function RolesEdit() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [initialData, setInitialData] = useState<(Partial<RoleFormData> & { is_system?: boolean }) | undefined>();
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [roleRes, permsRes, rolePermsRes, userRolesRes] = await Promise.all([
        supabase.from("roles").select("*").eq("id", id).single(),
        supabase.from("permissions").select("*").order("group_name").order("sort_order"),
        supabase.from("role_permissions").select("permission_id").eq("role_id", id),
        supabase.from("user_roles").select("role_id").eq("role_id", id),
      ]);

      if (roleRes.error) {
        toast({ title: t("common.error"), description: "Role not found", variant: "destructive" });
        navigate("/roles");
        return;
      }

      setPermissions(permsRes.data || []);
      setUserCount(userRolesRes.data?.length || 0);
      setInitialData({
        name: roleRes.data.name,
        description: roleRes.data.description || "",
        color: roleRes.data.color || "#EF4444",
        is_active: roleRes.data.is_active,
        is_system: roleRes.data.is_system,
        permission_ids: new Set((rolePermsRes.data || []).map((rp) => rp.permission_id)),
      });
      setIsLoading(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (data: RoleFormData) => {
    if (!id) return;
    setIsSaving(true);
    try {
      const updatePayload: Record<string, unknown> = {
        description: data.description.trim() || null,
        color: data.color,
        is_active: data.is_active,
      };
      if (!initialData?.is_system) {
        updatePayload.name = data.name.trim();
      }

      const { error } = await supabase.from("roles").update(updatePayload).eq("id", id);
      if (error) throw error;

      // Sync permissions
      await supabase.from("role_permissions").delete().eq("role_id", id);
      if (data.permission_ids.size > 0) {
        const permRows = Array.from(data.permission_ids).map((pid) => ({
          role_id: id,
          permission_id: pid,
        }));
        await supabase.from("role_permissions").insert(permRows);
      }

      toast({ title: t("common.success"), description: "Role updated successfully" });
      navigate("/roles");
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <LoadingOverlay visible={isSaving} />
      <RoleFormPage
        mode="edit"
        initialData={initialData}
        permissions={permissions}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSaving={isSaving}
        userCount={userCount}
      />
    </div>
  );
}
