import { Label } from "@/components/ui/label";
import { TooltipInfo } from "./TooltipInfo";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
 import { useAllergens, useLocalizedLabel } from "@/hooks/useMaintenanceData";
 import { Skeleton } from "@/components/ui/skeleton";
 import { AlertTriangle } from "lucide-react";

 export type AllergenType = string;

interface AllergenPickerProps {
  label?: string;
  value: AllergenType[];
  onChange: (value: AllergenType[]) => void;
  tooltip?: string;
  className?: string;
}

export function AllergenPicker({
  label,
  value,
  onChange,
  tooltip,
  className,
}: AllergenPickerProps) {
  const { t } = useLanguage();
   const { data: allergens, isLoading, error } = useAllergens();
   const getLabel = useLocalizedLabel();

   const handleChange = (allergenId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, allergenId]);
    } else {
      onChange(value.filter((id) => id !== allergenId));
    }
  };

   // Severity colors
   const getSeverityColor = (severity: string, isSelected: boolean) => {
     if (!isSelected) return "";
     switch (severity) {
       case "high":
         return "bg-destructive text-destructive-foreground border-destructive";
       case "medium":
         return "bg-amber-500 text-white border-amber-500";
       case "low":
         return "bg-primary text-primary-foreground border-primary";
       default:
         return "bg-primary text-primary-foreground border-primary";
     }
   };
 
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">{label}</Label>
          {tooltip && <TooltipInfo content={tooltip} />}
        </div>
      )}
       {isLoading ? (
         <div className="flex flex-wrap gap-2">
           {[1, 2, 3, 4].map((i) => (
             <Skeleton key={i} className="h-8 w-20" />
           ))}
         </div>
       ) : error ? (
         <div className="flex items-center gap-2 text-destructive text-sm">
           <AlertTriangle className="h-4 w-4" />
           <span>{t("common.error")}</span>
         </div>
       ) : (
         <div className="flex flex-wrap gap-2">
           {allergens?.map((allergen) => {
             const isSelected = value.includes(allergen.id);
             return (
               <button
                 key={allergen.id}
                 type="button"
                 onClick={() => handleChange(allergen.id, !isSelected)}
                 className={cn(
                   "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-sm transition-colors",
                   isSelected
                     ? getSeverityColor(allergen.severity, true)
                     : "bg-background border-border hover:bg-muted"
                 )}
               >
                 {getLabel(allergen)}
               </button>
             );
           })}
         </div>
       )}
    </div>
  );
}
