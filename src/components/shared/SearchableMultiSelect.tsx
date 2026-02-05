 import { useState } from "react";
 import { Check, ChevronsUpDown, X } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { Button } from "@/components/ui/button";
 import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
 } from "@/components/ui/command";
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from "@/components/ui/popover";
 import { Badge } from "@/components/ui/badge";
 import { Skeleton } from "@/components/ui/skeleton";
 
 export interface SearchableMultiSelectOption {
   id: string;
   label: string;
 }
 
 interface SearchableMultiSelectProps {
   value: string[];
   onChange: (value: string[]) => void;
   options: SearchableMultiSelectOption[];
   placeholder?: string;
   searchPlaceholder?: string;
   emptyText?: string;
   className?: string;
   disabled?: boolean;
   isLoading?: boolean;
   maxDisplayBadges?: number;
 }
 
 export function SearchableMultiSelect({
   value,
   onChange,
   options,
   placeholder = "Select...",
   searchPlaceholder = "Search...",
   emptyText = "No results found.",
   className,
   disabled = false,
   isLoading = false,
   maxDisplayBadges = 3,
 }: SearchableMultiSelectProps) {
   const [open, setOpen] = useState(false);
 
   const selectedOptions = options.filter((opt) => value.includes(opt.id));
 
   const handleSelect = (optionId: string) => {
     if (value.includes(optionId)) {
       onChange(value.filter((id) => id !== optionId));
     } else {
       onChange([...value, optionId]);
     }
   };
 
   const handleRemove = (optionId: string, e: React.MouseEvent) => {
     e.stopPropagation();
     onChange(value.filter((id) => id !== optionId));
   };
 
   if (isLoading) {
     return <Skeleton className="h-10 w-full" />;
   }
 
   return (
     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         <Button
           variant="outline"
           role="combobox"
           aria-expanded={open}
           disabled={disabled}
           className={cn(
             "w-full justify-between h-auto min-h-10 font-normal",
             selectedOptions.length > 0 && "py-1.5",
             className
           )}
         >
           <div className="flex flex-wrap gap-1 flex-1">
             {selectedOptions.length === 0 ? (
               <span className="text-muted-foreground">{placeholder}</span>
             ) : selectedOptions.length <= maxDisplayBadges ? (
               selectedOptions.map((option) => (
                 <Badge
                   key={option.id}
                   variant="secondary"
                   className="text-xs px-1.5 py-0.5"
                 >
                   {option.label}
                   <button
                     type="button"
                     onClick={(e) => handleRemove(option.id, e)}
                     className="ms-1 hover:bg-muted rounded-sm"
                   >
                     <X className="h-3 w-3" />
                   </button>
                 </Badge>
               ))
             ) : (
               <>
                 {selectedOptions.slice(0, maxDisplayBadges).map((option) => (
                   <Badge
                     key={option.id}
                     variant="secondary"
                     className="text-xs px-1.5 py-0.5"
                   >
                     {option.label}
                     <button
                       type="button"
                       onClick={(e) => handleRemove(option.id, e)}
                       className="ms-1 hover:bg-muted rounded-sm"
                     >
                       <X className="h-3 w-3" />
                     </button>
                   </Badge>
                 ))}
                 <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                   +{selectedOptions.length - maxDisplayBadges} more
                 </Badge>
               </>
             )}
           </div>
           <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
         </Button>
       </PopoverTrigger>
       <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
         <Command>
           <CommandInput placeholder={searchPlaceholder} />
           <CommandList>
             <CommandEmpty>{emptyText}</CommandEmpty>
             <CommandGroup>
               {options.map((option) => (
                 <CommandItem
                   key={option.id}
                   value={option.label}
                   onSelect={() => handleSelect(option.id)}
                 >
                   <div
                     className={cn(
                       "me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                       value.includes(option.id)
                         ? "bg-primary text-primary-foreground"
                         : "opacity-50 [&_svg]:invisible"
                     )}
                   >
                     <Check className="h-3 w-3" />
                   </div>
                   {option.label}
                 </CommandItem>
               ))}
             </CommandGroup>
           </CommandList>
         </Command>
       </PopoverContent>
     </Popover>
   );
 }