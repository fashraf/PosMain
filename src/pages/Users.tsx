import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserTable, UserData } from "@/components/users/UserTable";

export default function Users() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role_id, roles(name, color)");
      if (rolesError) throw rolesError;

      const roleMap = new Map<string, { name: string; color: string | null; role_id: string }>();
      (userRoles || []).forEach((ur: any) => {
        roleMap.set(ur.user_id, {
          name: ur.roles?.name || "Unknown",
          color: ur.roles?.color || null,
          role_id: ur.role_id,
        });
      });

      const { data: userBranches } = await supabase.from("user_branches").select("user_id, branch_id");
      const branchMap = new Map<string, string[]>();
      (userBranches || []).forEach((ub) => {
        if (!branchMap.has(ub.user_id)) branchMap.set(ub.user_id, []);
        branchMap.get(ub.user_id)!.push(ub.branch_id);
      });

      const usersData: UserData[] = (profiles || []).map((profile) => {
        const roleInfo = roleMap.get(profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name,
          email: profile.user_id,
          phone: profile.phone,
          employee_code: profile.employee_code,
          is_active: profile.is_active,
          last_login_at: profile.last_login_at,
          avatar_url: profile.avatar_url,
          role: roleInfo?.name || "Unknown",
          role_color: roleInfo?.color || null,
          role_id: roleInfo?.role_id || "",
          branch_ids: branchMap.get(profile.user_id) || [],
          emp_type_id: (profile as any).emp_type_id || null,
          nationality: (profile as any).nationality || null,
          age: (profile as any).age || null,
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({ title: t("common.error"), description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <UserTable
        users={users}
        isLoading={isLoading}
        onAdd={() => navigate("/users/add")}
        onEdit={(user) => navigate(`/users/${user.id}/edit`)}
        onView={(user) => navigate(`/users/${user.id}/edit`)}
        onResetPassword={() => {}}
      />
    </div>
  );
}
