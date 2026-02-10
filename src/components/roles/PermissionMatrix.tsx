import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  group_name: string;
  sort_order: number;
}

interface PermissionMatrixProps {
  permissions: Permission[];
  selectedIds: Set<string>;
  onChange: (ids: Set<string>) => void;
  disabled?: boolean;
}

export function PermissionMatrix({ permissions, selectedIds, onChange, disabled }: PermissionMatrixProps) {
  const groups = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.group_name]) acc[p.group_name] = [];
    acc[p.group_name].push(p);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groups).sort(([, a], [, b]) => (a[0]?.sort_order ?? 0) - (b[0]?.sort_order ?? 0));

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(Object.keys(groups)));

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group); else next.add(group);
      return next;
    });
  };

  const togglePermission = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    onChange(next);
  };

  const toggleAll = (groupPerms: Permission[], checked: boolean) => {
    const next = new Set(selectedIds);
    groupPerms.forEach(p => { if (checked) next.add(p.id); else next.delete(p.id); });
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      {sortedGroups.map(([groupName, groupPerms]) => {
        const allSelected = groupPerms.every(p => selectedIds.has(p.id));
        const someSelected = groupPerms.some(p => selectedIds.has(p.id));
        const isOpen = openGroups.has(groupName);

        return (
          <Collapsible key={groupName} open={isOpen} onOpenChange={() => toggleGroup(groupName)}>
            <div className="border rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-3 py-2 bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                    <span className="text-xs font-semibold">{groupName}</span>
                    <span className="text-[11px] text-muted-foreground">
                      ({groupPerms.filter(p => selectedIds.has(p.id)).length}/{groupPerms.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[11px] text-muted-foreground">All</span>
                    <Checkbox
                      checked={allSelected}
                      // @ts-ignore
                      indeterminate={someSelected && !allSelected}
                      onCheckedChange={(checked) => toggleAll(groupPerms, !!checked)}
                      disabled={disabled}
                      className="h-3.5 w-3.5"
                    />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y">
                  {groupPerms.sort((a, b) => a.sort_order - b.sort_order).map(perm => (
                    <div key={perm.id} className={cn(
                      "flex items-center justify-between hover:bg-muted/20 transition-colors",
                      disabled ? "px-3 py-1" : "px-3 py-1.5"
                    )}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{perm.name}</span>
                        {perm.description && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs"><p className="text-xs">{perm.description}</p></TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <Switch
                        checked={selectedIds.has(perm.id)}
                        onCheckedChange={() => togglePermission(perm.id)}
                        disabled={disabled}
                        className="scale-90"
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
