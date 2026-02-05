 import { useState, useEffect } from "react";
 import { useLanguage } from "@/hooks/useLanguage";
 import { useToast } from "@/hooks/use-toast";
 import { supabase } from "@/integrations/supabase/client";
 import { UserTable, UserData } from "@/components/users/UserTable";
 import { UserDialog, UserFormData } from "@/components/users/UserDialog";
 import { PasswordResetModal } from "@/components/users/PasswordResetModal";
 import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
 
 type AppRole = 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'kiosk';
 
 export default function Users() {
   const { t } = useLanguage();
   const { toast } = useToast();
   
   const [users, setUsers] = useState<UserData[]>([]);
   const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   
   const [dialogOpen, setDialogOpen] = useState(false);
   const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
   const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
   
   const [passwordModalOpen, setPasswordModalOpen] = useState(false);
   const [passwordResetUser, setPasswordResetUser] = useState<UserData | null>(null);
 
   const fetchUsers = async () => {
     setIsLoading(true);
     try {
       // Fetch profiles with roles
       const { data: profiles, error: profilesError } = await supabase
         .from('profiles')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (profilesError) throw profilesError;
 
       // Fetch roles for each user
       const { data: roles, error: rolesError } = await supabase
         .from('user_roles')
         .select('user_id, role');
 
       if (rolesError) throw rolesError;
 
       // Create role lookup
       const roleMap = new Map<string, AppRole>();
       roles?.forEach(r => roleMap.set(r.user_id, r.role as AppRole));
 
       // Get user emails from auth (we need edge function for this, using profile user_id for now)
       const usersData: UserData[] = (profiles || []).map(profile => ({
         id: profile.id,
         user_id: profile.user_id,
         full_name: profile.full_name,
         email: profile.user_id, // Will show user_id until we have email
         phone: profile.phone,
         employee_code: profile.employee_code,
         is_active: profile.is_active,
         last_login_at: profile.last_login_at,
         avatar_url: profile.avatar_url,
         role: roleMap.get(profile.user_id) || 'cashier',
       }));
 
       setUsers(usersData);
     } catch (error) {
       console.error('Error fetching users:', error);
       toast({
         title: t("common.error"),
         description: String(error),
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const fetchBranches = async () => {
     try {
       const { data, error } = await supabase
         .from('branches')
         .select('id, name')
         .eq('is_active', true)
         .order('name');
 
       if (error) throw error;
       setBranches(data || []);
     } catch (error) {
       console.error('Error fetching branches:', error);
     }
   };
 
   useEffect(() => {
     fetchUsers();
     fetchBranches();
   }, []);
 
   const handleAdd = () => {
     setSelectedUser(null);
     setDialogMode('add');
     setDialogOpen(true);
   };
 
   const handleEdit = (user: UserData) => {
     setSelectedUser(user);
     setDialogMode('edit');
     setDialogOpen(true);
   };
 
   const handleView = (user: UserData) => {
     setSelectedUser(user);
     setDialogMode('view');
     setDialogOpen(true);
   };
 
   const handleResetPassword = (user: UserData) => {
     setPasswordResetUser(user);
     setPasswordModalOpen(true);
   };
 
   const handleSubmit = async (data: UserFormData) => {
     setIsSubmitting(true);
     try {
       if (dialogMode === 'add') {
         // Call edge function to create user
         const { data: result, error } = await supabase.functions.invoke('create-user', {
           body: {
             email: data.email,
             password: data.password,
             full_name: data.full_name,
             role: data.role,
             phone: data.phone || null,
             employee_code: data.employee_code || null,
             branch_id: data.branch_id || null,
             is_active: data.is_active,
           },
         });
 
         if (error) throw error;
         if (result?.error) throw new Error(result.error);
 
         toast({
           title: t("common.success"),
           description: t("users.userCreated"),
         });
       } else if (dialogMode === 'edit' && selectedUser) {
         // Update profile
         const { error: profileError } = await supabase
           .from('profiles')
           .update({
             full_name: data.full_name,
             phone: data.phone || null,
             employee_code: data.employee_code || null,
             is_active: data.is_active,
           })
           .eq('user_id', selectedUser.user_id);
 
         if (profileError) throw profileError;
 
         // Update role if changed
         if (data.role !== selectedUser.role) {
           // Delete old role
           await supabase
             .from('user_roles')
             .delete()
             .eq('user_id', selectedUser.user_id);
 
           // Insert new role
           const { error: roleError } = await supabase
             .from('user_roles')
             .insert({
               user_id: selectedUser.user_id,
               role: data.role,
             });
 
           if (roleError) throw roleError;
         }
 
         // Update password if provided
         if (data.password) {
           const { error: pwError } = await supabase.functions.invoke('reset-password', {
             body: {
               user_id: selectedUser.user_id,
               new_password: data.password,
             },
           });
           if (pwError) throw pwError;
         }
 
         toast({
           title: t("common.success"),
           description: t("users.userUpdated"),
         });
       }
 
       setDialogOpen(false);
       fetchUsers();
     } catch (error) {
       console.error('Error saving user:', error);
       toast({
         title: t("common.error"),
         description: error instanceof Error ? error.message : String(error),
         variant: "destructive",
       });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const handlePasswordReset = async (newPassword: string) => {
     if (!passwordResetUser) return;
 
     setIsSubmitting(true);
     try {
       const { error } = await supabase.functions.invoke('reset-password', {
         body: {
           user_id: passwordResetUser.user_id,
           new_password: newPassword,
         },
       });
 
       if (error) throw error;
 
       toast({
         title: t("common.success"),
         description: t("users.passwordResetSuccess"),
       });
       setPasswordModalOpen(false);
     } catch (error) {
       console.error('Error resetting password:', error);
       toast({
         title: t("common.error"),
         description: error instanceof Error ? error.message : String(error),
         variant: "destructive",
       });
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
 
       <UserDialog
         open={dialogOpen}
         onOpenChange={setDialogOpen}
         mode={dialogMode}
         initialData={selectedUser ? {
           full_name: selectedUser.full_name || '',
           email: selectedUser.email,
           phone: selectedUser.phone || '',
           employee_code: selectedUser.employee_code || '',
           role: selectedUser.role,
           is_active: selectedUser.is_active,
           shifts: [],
         } : undefined}
         branches={branches}
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