import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User, LogOut, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock branches for now - will come from database later
const mockBranches = [
  { id: "all", name: "All Branches" },
  { id: "branch-1", name: "Downtown Main" },
  { id: "branch-2", name: "Airport Mall" },
  { id: "branch-3", name: "City Center" },
];

interface TopBarProps {
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
}

export function TopBar({ selectedBranch, onBranchChange }: TopBarProps) {
  const { t, isRTL } = useLanguage();

  return (
    <header className={cn(
      "h-16 border-b border-border bg-card px-4 flex items-center justify-between gap-4",
      isRTL && "flex-row-reverse"
    )}>
      <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        
        {/* Branch Selector */}
        <Select value={selectedBranch} onValueChange={onBranchChange}>
          <SelectTrigger className="w-[180px] bg-background">
            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder={t("common.selectBranch")} />
          </SelectTrigger>
          <SelectContent>
            {mockBranches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.id === "all" ? t("common.allBranches") : branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <LanguageSwitcher />
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground">{t("roles.admin")}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              {t("auth.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
