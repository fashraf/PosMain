 import { cn } from "@/lib/utils";
 import { useLanguage } from "@/hooks/useLanguage";
 
 type AppRole = 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'kiosk';
 
 interface UserRoleBadgeProps {
   role: AppRole;
   className?: string;
 }
 
 const roleConfig: Record<AppRole, { bg: string; text: string; border: string }> = {
   admin: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
   manager: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
   cashier: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
   waiter: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
   kitchen: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
   kiosk: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
 };
 
 export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
   const { t } = useLanguage();
   
   const config = roleConfig[role] || roleConfig.kiosk;
   
   const roleLabels: Record<AppRole, string> = {
     admin: t("users.roleAdmin"),
     manager: t("users.roleManager"),
     cashier: t("users.roleCashier"),
     waiter: t("users.roleWaiter"),
     kitchen: t("users.roleKitchen"),
     kiosk: t("users.roleKiosk"),
   };
 
   return (
     <span
       className={cn(
         "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
         config.bg,
         config.text,
         config.border,
         className
       )}
     >
       {roleLabels[role]}
     </span>
   );
 }