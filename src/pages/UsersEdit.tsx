import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserFormPage, UserFormData } from "@/components/users/UserFormPage";
import { PasswordResetModal } from "@/components/users/PasswordResetModal";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";

export default function UsersEdit() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [roles, setRoles] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
  const [empTypes, setEmpTypes] = useState<Array<{ id: string; name_en: string }>>([]);
  const [initialData, setInitialData] = useState<Partial<UserFormData> | undefined>();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [branchesRes, rolesRes, empTypesRes, profileRes, userRolesRes, userBranchesRes] =
        await Promise.all([
          supabase.from("branches").select("id, name").eq("is_active", true).order("name"),
          supabase.from("roles").select("id, name, color").eq("is_active", true).order("name"),
          supabase.from("maintenance_emp_types").select("id, name_en").eq("is_active", true).order("name_en"),
          supabase.from("profiles").select("*").eq("id", id).single(),
          supabase.from("user_roles").select("role_id"),
          supabase.from("user_branches").select("user_id, branch_id"),
        ]);

      if (profileRes.error) {
        toast({ title: t("common.error"), description: "User not found", variant: "destructive" });
        navigate("/users");
        return;
      }

      const profile = profileRes.data;
      setBranches(branchesRes.data || []);
      setRoles(rolesRes.data || []);
      setEmpTypes(empTypesRes.data || []);
      setUserName(profile.full_name || "");
      setUserId(profile.user_id);

      const userRole = (userRolesRes.data || []).find(
        (ur: any) => ur.user_id === profile.user_id
      );

      const userBranches = (userBranchesRes.data || [])
        .filter((ub) => ub.user_id === profile.user_id)
        .map((ub) => ub.branch_id);

      setInitialData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        email: "",
        age: profile.age?.toString() || "",
        nationality: profile.nationality || "",
        national_id: profile.national_id || "",
        national_id_expiry: profile.national_id_expiry || "",
        passport_number: profile.passport_number || "",
        passport_expiry: profile.passport_expiry || "",
        role_id: userRole?.role_id || "",
        branch_ids: userBranches,
        emp_type_id: profile.emp_type_id || "",
        is_active: profile.is_active,
        default_language: profile.default_language || "en",
        force_password_change: profile.force_password_change || false,
        profile_image: (profile as any).profile_image || null,
      });

      setIsLoading(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (data: UserFormData) => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone || null,
          is_active: data.is_active,
          age: data.age ? parseInt(data.age) : null,
          nationality: data.nationality || null,
          national_id: data.national_id || null,
          national_id_expiry: data.national_id_expiry || null,
          passport_number: data.passport_number || null,
          passport_expiry: data.passport_expiry || null,
          emp_type_id: data.emp_type_id || null,
          default_language: data.default_language,
          force_password_change: data.force_password_change,
        } as any)
        .eq("user_id", userId);
      if (profileError) throw profileError;

      // Sync role
      await supabase.from("user_roles").delete().eq("user_id", userId);
      if (data.role_id) {
        await supabase.from("user_roles").insert({ user_id: userId, role_id: data.role_id });
      }

      // Sync branches
      await supabase.from("user_branches").delete().eq("user_id", userId);
      if (data.branch_ids.length > 0) {
        await supabase
          .from("user_branches")
          .insert(data.branch_ids.map((bid) => ({ user_id: userId, branch_id: bid })));
      }

      toast({ title: t("common.success"), description: t("users.userUpdated") });
      navigate("/users");
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

  const handlePasswordReset = async (newPassword: string) => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke("reset-password", {
        body: { user_id: userId, new_password: newPassword },
      });
      if (error) throw error;
      toast({ title: t("common.success"), description: t("users.passwordResetSuccess") });
      setPasswordModalOpen(false);
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
    <div className="p-4">
      <LoadingOverlay visible={isSaving} />
      <UserFormPage
        mode="edit"
        initialData={initialData}
        editUserName={userName}
        roles={roles}
        branches={branches}
        empTypes={empTypes}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSaving={isSaving}
        onResetPassword={() => setPasswordModalOpen(true)}
      />
      <PasswordResetModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        userName={userName}
        onConfirm={handlePasswordReset}
        isLoading={isSaving}
      />
    </div>
  );
}
