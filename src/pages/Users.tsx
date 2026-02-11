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
      const [profilesRes, userRolesRes, userBranchesRes, branchesRes, empTypesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role_id, roles(name, color)"),
        supabase.from("user_branches").select("user_id, branch_id"),
        supabase.from("branches").select("id, name"),
        supabase.from("maintenance_emp_types").select("id, name_en"),
      ]);

      if (profilesRes.error) throw profilesRes.error;

      const roleMap = new Map<string, { name: string; color: string | null; role_id: string }>();
      (userRolesRes.data || []).forEach((ur: any) => {
        roleMap.set(ur.user_id, {
          name: ur.roles?.name || "Unknown",
          color: ur.roles?.color || null,
          role_id: ur.role_id,
        });
      });

      const branchNameMap = new Map<string, string>();
      (branchesRes.data || []).forEach((b) => branchNameMap.set(b.id, b.name));

      const empTypeMap = new Map<string, string>();
      (empTypesRes.data || []).forEach((et) => empTypeMap.set(et.id, et.name_en));

      const branchMap = new Map<string, string[]>();
      const branchNamesByUser = new Map<string, string[]>();
      (userBranchesRes.data || []).forEach((ub) => {
        if (!branchMap.has(ub.user_id)) {
          branchMap.set(ub.user_id, []);
          branchNamesByUser.set(ub.user_id, []);
        }
        branchMap.get(ub.user_id)!.push(ub.branch_id);
        const name = branchNameMap.get(ub.branch_id);
        if (name) branchNamesByUser.get(ub.user_id)!.push(name);
      });

      const usersData: UserData[] = (profilesRes.data || []).map((profile) => {
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
          profile_image: profile.profile_image,
          role: roleInfo?.name || "Unknown",
          role_color: roleInfo?.color || null,
          role_id: roleInfo?.role_id || "",
          branch_ids: branchMap.get(profile.user_id) || [],
          branch_names: branchNamesByUser.get(profile.user_id) || [],
          emp_type_id: profile.emp_type_id || null,
          emp_type_name: profile.emp_type_id ? empTypeMap.get(profile.emp_type_id) || null : null,
          nationality: profile.nationality || null,
          age: profile.age || null,
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      const msg = error instanceof Error ? error.message : (error as any)?.message || JSON.stringify(error);
      toast({ title: t("common.error"), description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-2">
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
