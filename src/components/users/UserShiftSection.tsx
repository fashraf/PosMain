 import { useLanguage } from "@/hooks/useLanguage";
 import { Button } from "@/components/ui/button";
 import { Plus, Info } from "lucide-react";
 import { ShiftRow, ShiftData } from "./ShiftRow";
 import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface UserShiftSectionProps {
   shifts: ShiftData[];
   branches: Array<{ id: string; name: string }>;
   onChange: (shifts: ShiftData[]) => void;
 }
 
 export function UserShiftSection({ shifts, branches, onChange }: UserShiftSectionProps) {
   const { t } = useLanguage();
 
   const addShift = () => {
     const newShift: ShiftData = {
       id: crypto.randomUUID(),
       isRecurring: false,
       recurringDays: [],
       specificDate: new Date().toISOString().split('T')[0],
       startTime: '09:00',
       endTime: '17:00',
       branchId: branches[0]?.id || '',
     };
     onChange([...shifts, newShift]);
   };
 
   const updateShift = (index: number, updatedShift: ShiftData) => {
     const newShifts = [...shifts];
     newShifts[index] = updatedShift;
     onChange(newShifts);
   };
 
   const removeShift = (index: number) => {
     onChange(shifts.filter((_, i) => i !== index));
   };
 
   return (
     <div className="space-y-4">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
           <h3 className="text-sm font-semibold">{t("users.shifts")}</h3>
           <Tooltip>
             <TooltipTrigger asChild>
               <Info className="h-4 w-4 text-muted-foreground cursor-help" />
             </TooltipTrigger>
             <TooltipContent>
               <p>{t("users.crossMidnightTooltip")}</p>
             </TooltipContent>
           </Tooltip>
         </div>
         <Button type="button" variant="outline" size="sm" onClick={addShift} className="gap-1">
           <Plus className="h-4 w-4" />
           {t("users.addShift")}
         </Button>
       </div>
 
       {shifts.length === 0 ? (
         <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg py-8 text-center text-muted-foreground">
           <p className="text-sm">{t("users.noShifts")}</p>
         </div>
       ) : (
         <div className="space-y-3">
           {shifts.map((shift, index) => (
             <ShiftRow
               key={shift.id}
               shift={shift}
               branches={branches}
               onChange={(updated) => updateShift(index, updated)}
               onRemove={() => removeShift(index)}
             />
           ))}
         </div>
       )}
     </div>
   );
 }