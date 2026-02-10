import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoleTable, RoleData } from "@/components/roles/RoleTable";

export default function Roles() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, userRolesRes] = await Promise.all([
        supabase.from("roles").select("*").order("name"),
        supabase.from("user_roles").select("role_id"),
      ]);

      if (rolesRes.error) throw rolesRes.error;

      const userCountMap = new Map<string, number>();
      (userRolesRes.data || []).forEach((ur) => {
        userCountMap.set(ur.role_id!, (userCountMap.get(ur.role_id!) || 0) + 1);
      });

      setRoles(
        (rolesRes.data || []).map((r) => ({
          ...r,
          user_count: userCountMap.get(r.id) || 0,
        }))
      );
    } catch (error) {
      toast({ title: t("common.error"), description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <RoleTable
        roles={roles}
        isLoading={isLoading}
        onAdd={() => navigate("/roles/add")}
        onEdit={(role) => navigate(`/roles/${role.id}/edit`)}
        onView={(role) => navigate(`/roles/${role.id}/edit`)}
      />
    </div>
  );
}
