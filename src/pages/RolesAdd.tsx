import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoleFormPage, RoleFormData } from "@/components/roles/RoleFormPage";
import { Permission } from "@/components/roles/PermissionMatrix";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";

export default function RolesAdd() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("permissions")
      .select("*")
      .order("group_name")
      .order("sort_order")
      .then(({ data, error }) => {
        if (!error) setPermissions(data || []);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (data: RoleFormData) => {
    setIsSaving(true);
    try {
      const { data: newRole, error } = await supabase
        .from("roles")
        .insert({
          name: data.name.trim(),
          description: data.description.trim() || null,
          color: data.color,
          is_active: data.is_active,
        })
        .select()
        .single();
      if (error) throw error;

      if (data.permission_ids.size > 0) {
        const permRows = Array.from(data.permission_ids).map((pid) => ({
          role_id: newRole.id,
          permission_id: pid,
        }));
        const { error: rpError } = await supabase.from("role_permissions").insert(permRows);
        if (rpError) throw rpError;
      }

      toast({ title: t("common.success"), description: "Role created successfully" });
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
    <div className="p-1">
      <LoadingOverlay visible={isSaving} />
      <RoleFormPage
        mode="add"
        permissions={permissions}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSaving={isSaving}
      />
    </div>
  );
}
