 import { useLanguage } from "@/hooks/useLanguage";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { AlertTriangle } from "lucide-react";
 
 interface UserDeleteModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   userName: string;
   onConfirm: () => void;
   isLoading: boolean;
 }
 
 export function UserDeleteModal({ open, onOpenChange, userName, onConfirm, isLoading }: UserDeleteModalProps) {
   const { t } = useLanguage();
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-[400px]">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2 text-destructive">
             <AlertTriangle className="h-5 w-5" />
             {t("users.deleteUser")}
           </DialogTitle>
         </DialogHeader>
 
         <div className="py-4">
           <p className="text-sm text-muted-foreground">
             {t("users.deleteUserConfirm").replace("{{name}}", userName)}
           </p>
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
             {t("common.cancel")}
           </Button>
           <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
             {isLoading ? t("common.loading") : t("common.delete")}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }