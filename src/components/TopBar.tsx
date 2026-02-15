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
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User, LogOut, KeyRound, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

export function TopBar() {
  const { t, isRTL } = useLanguage();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className={cn(
      "h-14 border-b border-border bg-card px-4 flex items-center justify-between gap-4",
      isRTL && "flex-row-reverse"
    )}>
      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>

      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <LanguageSwitcher />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-green-400 ring-offset-1 ring-offset-background">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="hidden md:flex flex-col items-start text-xs leading-tight">
                <span className="font-semibold text-foreground">{displayName}</span>
                <span className="text-muted-foreground">{displayEmail}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-60">
            <DropdownMenuLabel className="font-normal pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => navigate("/profile")}>
              <User className="h-4 w-4" />
              {t("nav.myProfile") || "My Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => navigate("/profile#password")}>
              <KeyRound className="h-4 w-4" />
              {t("auth.changePassword") || "Change Password"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onSelect={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span>{t("profile.darkMode") || "Dark Mode"}</span>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  className="scale-75"
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {t("auth.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
