import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserStepperDialog, UserStepperFormData } from "@/components/users/UserStepperDialog";
import { PasswordResetModal } from "@/components/users/PasswordResetModal";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { UserTable, UserData } from "@/components/users/UserTable";

export default function Users() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserData[]>([]);
  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [roles, setRoles] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
  const [empTypes, setEmpTypes] = useState<Array<{ id: string; name_en: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editInitialData, setEditInitialData] = useState<Partial<UserStepperFormData> | undefined>(undefined);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState<UserData | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (profilesError) throw profilesError;

      // Fetch roles for each user with role name
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role_id, roles(name, color)');
      if (rolesError) throw rolesError;

      const roleMap = new Map<string, { name: string; color: string | null; role_id: string }>();
      (userRoles || []).forEach((ur: any) => {
        roleMap.set(ur.user_id, {
          name: ur.roles?.name || 'Unknown',
          color: ur.roles?.color || null,
          role_id: ur.role_id,
        });
      });

      // Fetch user branches
      const { data: userBranches } = await supabase.from('user_branches').select('user_id, branch_id');
      const branchMap = new Map<string, string[]>();
      (userBranches || []).forEach(ub => {
        if (!branchMap.has(ub.user_id)) branchMap.set(ub.user_id, []);
        branchMap.get(ub.user_id)!.push(ub.branch_id);
      });

      const usersData: UserData[] = (profiles || []).map(profile => {
        const roleInfo = roleMap.get(profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name,
          email: profile.user_id, // placeholder
          phone: profile.phone,
          employee_code: profile.employee_code,
          is_active: profile.is_active,
          last_login_at: profile.last_login_at,
          avatar_url: profile.avatar_url,
          role: roleInfo?.name || 'Unknown',
          role_color: roleInfo?.color || null,
          role_id: roleInfo?.role_id || '',
          branch_ids: branchMap.get(profile.user_id) || [],
          emp_type_id: (profile as any).emp_type_id || null,
          nationality: (profile as any).nationality || null,
          age: (profile as any).age || null,
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: t("common.error"), description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMeta = async () => {
    const [branchesRes, rolesRes, empTypesRes] = await Promise.all([
      supabase.from('branches').select('id, name').eq('is_active', true).order('name'),
      supabase.from('roles').select('id, name, color').eq('is_active', true).order('name'),
      supabase.from('maintenance_emp_types').select('id, name_en').eq('is_active', true).order('name_en'),
    ]);
    setBranches(branchesRes.data || []);
    setRoles(rolesRes.data || []);
    setEmpTypes(empTypesRes.data || []);
  };

  useEffect(() => { fetchUsers(); fetchMeta(); }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    setEditInitialData(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setEditInitialData({
      full_name: user.full_name || '',
      phone: user.phone || '',
      email: '',
      age: user.age?.toString() || '',
      nationality: user.nationality || '',
      role_id: user.role_id,
      branch_ids: user.branch_ids,
      emp_type_id: user.emp_type_id || '',
      is_active: user.is_active,
      default_language: 'en',
      force_password_change: false,
    });
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (user: UserData) => {
    setSelectedUser(user);
    setEditInitialData({
      full_name: user.full_name || '',
      phone: user.phone || '',
      email: '',
      age: user.age?.toString() || '',
      nationality: user.nationality || '',
      role_id: user.role_id,
      branch_ids: user.branch_ids,
      emp_type_id: user.emp_type_id || '',
      is_active: user.is_active,
      default_language: 'en',
      force_password_change: false,
    });
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleResetPassword = (user: UserData) => {
    setPasswordResetUser(user);
    setPasswordModalOpen(true);
  };

  const handleSubmit = async (data: UserStepperFormData) => {
    setIsSubmitting(true);
    try {
      if (dialogMode === 'add') {
        // Need an email for auth - use phone-based email if no email provided
        const email = data.email.trim() || `${data.phone.replace(/[^0-9]/g, '')}@pos-user.local`;

        const { data: result, error } = await supabase.functions.invoke('create-user', {
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
          },
        });
        if (error) throw error;
        if (result?.error) throw new Error(result.error);
        toast({ title: t("common.success"), description: t("users.userCreated") });
      } else if (dialogMode === 'edit' && selectedUser) {
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
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
          })
          .eq('user_id', selectedUser.user_id);
        if (profileError) throw profileError;

        // Update role if changed
        if (data.role_id && data.role_id !== selectedUser.role_id) {
          await supabase.from('user_roles').delete().eq('user_id', selectedUser.user_id);
          await supabase.from('user_roles').insert({ user_id: selectedUser.user_id, role_id: data.role_id });
        }

        // Sync branches
        await supabase.from('user_branches').delete().eq('user_id', selectedUser.user_id);
        if (data.branch_ids.length > 0) {
          await supabase.from('user_branches').insert(
            data.branch_ids.map(bid => ({ user_id: selectedUser.user_id, branch_id: bid }))
          );
        }

        // Update password if provided
        if (data.password) {
          await supabase.functions.invoke('reset-password', {
            body: { user_id: selectedUser.user_id, new_password: data.password },
          });
        }

        toast({ title: t("common.success"), description: t("users.userUpdated") });
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast({ title: t("common.error"), description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    if (!passwordResetUser) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('reset-password', {
        body: { user_id: passwordResetUser.user_id, new_password: newPassword },
      });
      if (error) throw error;
      toast({ title: t("common.success"), description: t("users.passwordResetSuccess") });
      setPasswordModalOpen(false);
    } catch (error) {
      toast({ title: t("common.error"), description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <LoadingOverlay visible={isSubmitting} />

      <UserTable
        users={users}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onResetPassword={handleResetPassword}
      />

      <UserStepperDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={editInitialData}
        roles={roles}
        branches={branches}
        empTypes={empTypes}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      <PasswordResetModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        userName={passwordResetUser?.full_name || passwordResetUser?.email || ''}
        onConfirm={handlePasswordReset}
        isLoading={isSubmitting}
      />
    </div>
  );
}
