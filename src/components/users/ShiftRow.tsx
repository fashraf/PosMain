 import { useState } from "react";
 import { useLanguage } from "@/hooks/useLanguage";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Checkbox } from "@/components/ui/checkbox";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Trash2, Moon } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 export interface ShiftData {
   id: string;
   isRecurring: boolean;
   recurringDays: string[];
   specificDate: string;
   startTime: string;
   endTime: string;
   branchId: string;
 }
 
 interface ShiftRowProps {
   shift: ShiftData;
   branches: Array<{ id: string; name: string }>;
   onChange: (shift: ShiftData) => void;
   onRemove: () => void;
 }
 
 const WEEKDAYS = [
   { key: 'monday', label: 'Mon' },
   { key: 'tuesday', label: 'Tue' },
   { key: 'wednesday', label: 'Wed' },
   { key: 'thursday', label: 'Thu' },
   { key: 'friday', label: 'Fri' },
   { key: 'saturday', label: 'Sat' },
   { key: 'sunday', label: 'Sun' },
 ];
 
 function parseTimeToMinutes(time: string): number {
   const [hours, minutes] = time.split(':').map(Number);
   return hours * 60 + minutes;
 }
 
 function formatDuration(minutes: number): string {
   const hours = Math.floor(minutes / 60);
   const mins = minutes % 60;
   return `${hours}h ${mins}m`;
 }
 
 export function ShiftRow({ shift, branches, onChange, onRemove }: ShiftRowProps) {
   const { t, isRTL } = useLanguage();
 
   const startMinutes = parseTimeToMinutes(shift.startTime || '09:00');
   const endMinutes = parseTimeToMinutes(shift.endTime || '17:00');
   const crossesMidnight = endMinutes < startMinutes;
   const duration = crossesMidnight ? (endMinutes + 1440) - startMinutes : endMinutes - startMinutes;
 
   const handleDayToggle = (day: string) => {
     const newDays = shift.recurringDays.includes(day)
       ? shift.recurringDays.filter(d => d !== day)
       : [...shift.recurringDays, day];
     onChange({ ...shift, recurringDays: newDays });
   };
 
   return (
     <div className="border-2 border-dotted border-muted-foreground/30 rounded-lg p-4 space-y-3 bg-card">
       {/* Recurring Toggle */}
       <div className="flex items-center gap-2">
         <Checkbox
           id={`recurring-${shift.id}`}
           checked={shift.isRecurring}
           onCheckedChange={(checked) => onChange({ ...shift, isRecurring: !!checked })}
         />
         <label htmlFor={`recurring-${shift.id}`} className="text-sm font-medium cursor-pointer">
           {t("users.recurringWeekly")}
         </label>
       </div>
 
       {/* Day Selection or Specific Date */}
       {shift.isRecurring ? (
         <div className="flex flex-wrap gap-2">
           {WEEKDAYS.map((day) => (
             <button
               key={day.key}
               type="button"
               onClick={() => handleDayToggle(day.key)}
               className={cn(
                 "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                 shift.recurringDays.includes(day.key)
                   ? "bg-primary text-primary-foreground border-primary"
                   : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
               )}
             >
               {day.label}
             </button>
           ))}
         </div>
       ) : (
         <div>
           <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("users.shiftDate")}</label>
           <Input
             type="date"
             value={shift.specificDate}
             onChange={(e) => onChange({ ...shift, specificDate: e.target.value })}
             className="w-[180px]"
           />
         </div>
       )}
 
       {/* Time Selection */}
       <div className="flex flex-wrap gap-4 items-end">
         <div>
           <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("users.shiftStartTime")}</label>
           <Input
             type="time"
             value={shift.startTime}
             onChange={(e) => onChange({ ...shift, startTime: e.target.value })}
             className="w-[130px]"
           />
         </div>
         <div>
           <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("users.shiftEndTime")}</label>
           <Input
             type="time"
             value={shift.endTime}
             onChange={(e) => onChange({ ...shift, endTime: e.target.value })}
             className="w-[130px]"
           />
         </div>
         <div className="flex items-center gap-2">
           <div className={cn(
             "px-3 py-1.5 rounded-md text-xs font-medium",
             crossesMidnight ? "bg-purple-100 text-purple-800" : "bg-muted text-muted-foreground"
           )}>
             {formatDuration(duration)}
             {crossesMidnight && (
               <span className="inline-flex items-center gap-1 ms-1">
                 <Moon className="h-3 w-3" />
                 {t("users.crossMidnight")}
               </span>
             )}
           </div>
         </div>
       </div>
 
       {/* Branch and Remove */}
       <div className="flex items-end justify-between gap-4">
         <div className="flex-1 max-w-[200px]">
           <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("users.branch")}</label>
           <Select value={shift.branchId} onValueChange={(v) => onChange({ ...shift, branchId: v })}>
             <SelectTrigger>
               <SelectValue placeholder={t("common.selectBranch")} />
             </SelectTrigger>
             <SelectContent>
               {branches.map((branch) => (
                 <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
         <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="text-destructive hover:text-destructive hover:bg-destructive/10">
           <Trash2 className="h-4 w-4" />
         </Button>
       </div>
     </div>
   );
 }