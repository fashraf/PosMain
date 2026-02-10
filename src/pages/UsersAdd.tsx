import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserFormPage, UserFormData } from "@/components/users/UserFormPage";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";

export default function UsersAdd() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [roles, setRoles] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
  const [empTypes, setEmpTypes] = useState<Array<{ id: string; name_en: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("branches").select("id, name").eq("is_active", true).order("name"),
      supabase.from("roles").select("id, name, color").eq("is_active", true).order("name"),
      supabase.from("maintenance_emp_types").select("id, name_en").eq("is_active", true).order("name_en"),
    ]).then(([b, r, e]) => {
      setBranches(b.data || []);
      setRoles(r.data || []);
      setEmpTypes(e.data || []);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (data: UserFormData) => {
    setIsSaving(true);
    try {
      const email = data.email?.trim() || `${data.phone.replace(/[^0-9]/g, "")}@pos-user.local`;

      const { data: result, error } = await supabase.functions.invoke("create-user", {
        body: {
          email,
          password: data.password,
          full_name: data.full_name,
          role_id: data.role_id,
          phone: data.phone || null,
          employee_code: null,
          branch_ids: data.branch_ids,
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
          profile_image: data.profile_image || null,
        },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      toast({ title: t("common.success"), description: t("users.userCreated") });
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

  return (
    <div className="p-4">
      <LoadingOverlay visible={isSaving} />
      <UserFormPage
        mode="add"
        roles={roles}
        branches={branches}
        empTypes={empTypes}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSaving={isSaving}
      />
    </div>
  );
}
