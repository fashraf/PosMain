 import { useState } from "react";
 import { useLanguage } from "@/hooks/useLanguage";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Eye, EyeOff, Key } from "lucide-react";
 
 interface PasswordResetModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   userName: string;
   onConfirm: (newPassword: string) => void;
   isLoading: boolean;
 }
 
 export function PasswordResetModal({ open, onOpenChange, userName, onConfirm, isLoading }: PasswordResetModalProps) {
   const { t } = useLanguage();
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
 
   const passwordsMatch = newPassword === confirmPassword;
   const isValidPassword = newPassword.length >= 8;
 
   const handleSubmit = () => {
     if (isValidPassword && passwordsMatch) {
       onConfirm(newPassword);
     }
   };
 
   const handleClose = () => {
     setNewPassword("");
     setConfirmPassword("");
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={handleClose}>
       <DialogContent className="sm:max-w-[425px]">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Key className="h-5 w-5 text-primary" />
             {t("users.resetPassword")}
           </DialogTitle>
         </DialogHeader>
 
         <div className="py-4 space-y-4">
           <p className="text-sm text-muted-foreground">
             {t("users.resetPasswordFor")} <span className="font-semibold">{userName}</span>
           </p>
 
           <div className="space-y-2">
             <Label htmlFor="new-password">{t("users.newPassword")}</Label>
             <div className="relative">
               <Input
                 id="new-password"
                 type={showPassword ? "text" : "password"}
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 placeholder="••••••••"
                 className="pr-10"
               />
               <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 className="absolute right-0 top-0 h-full px-3"
                 onClick={() => setShowPassword(!showPassword)}
               >
                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
               </Button>
             </div>
             {newPassword && !isValidPassword && (
               <p className="text-xs text-destructive">{t("users.passwordRequirements")}</p>
             )}
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="confirm-password">{t("users.confirmPassword")}</Label>
             <div className="relative">
               <Input
                 id="confirm-password"
                 type={showConfirm ? "text" : "password"}
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder="••••••••"
                 className="pr-10"
               />
               <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 className="absolute right-0 top-0 h-full px-3"
                 onClick={() => setShowConfirm(!showConfirm)}
               >
                 {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
               </Button>
             </div>
             {confirmPassword && !passwordsMatch && (
               <p className="text-xs text-destructive">{t("users.passwordMismatch")}</p>
             )}
           </div>
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={handleClose} disabled={isLoading}>
             {t("common.cancel")}
           </Button>
           <Button
             onClick={handleSubmit}
             disabled={!isValidPassword || !passwordsMatch || isLoading}
           >
             {isLoading ? t("common.loading") : t("users.resetPassword")}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }