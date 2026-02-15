import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/hooks/useLanguage";

export function DarkModeCard() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {isDark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
          {t("profile.darkMode") || "Dark Mode"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDark ? "Dark theme active" : "Light theme active"}
            </p>
            <p className="text-xs text-muted-foreground">
              Reduces eye strain during long shifts in low-light environments.
            </p>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
