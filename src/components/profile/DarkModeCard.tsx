import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/hooks/useLanguage";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DarkModeCard() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors duration-300",
            isDark ? "bg-indigo-500/20" : "bg-amber-500/20"
          )}>
            {isDark ? (
              <Moon className="h-4 w-4 text-indigo-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}
          </div>
          {t("profile.darkMode")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Preview */}
        <div className="flex gap-3">
          {/* Light preview */}
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex-1 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer",
              !isDark
                ? "border-primary ring-2 ring-primary/20 shadow-sm"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <div className="rounded-lg bg-white border border-gray-200 p-2.5 space-y-1.5">
              <div className="h-2 w-3/4 rounded bg-gray-800" />
              <div className="h-1.5 w-full rounded bg-gray-200" />
              <div className="h-1.5 w-2/3 rounded bg-gray-200" />
              <div className="flex gap-1 mt-2">
                <div className="h-3 w-3 rounded bg-blue-500" />
                <div className="h-3 flex-1 rounded bg-gray-100" />
              </div>
            </div>
            <p className="text-xs font-medium text-center mt-2 text-muted-foreground">Light</p>
          </button>

          {/* Dark preview */}
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex-1 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer",
              isDark
                ? "border-primary ring-2 ring-primary/20 shadow-sm"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <div className="rounded-lg bg-gray-900 border border-gray-700 p-2.5 space-y-1.5">
              <div className="h-2 w-3/4 rounded bg-gray-100" />
              <div className="h-1.5 w-full rounded bg-gray-700" />
              <div className="h-1.5 w-2/3 rounded bg-gray-700" />
              <div className="flex gap-1 mt-2">
                <div className="h-3 w-3 rounded bg-indigo-500" />
                <div className="h-3 flex-1 rounded bg-gray-800" />
              </div>
            </div>
            <p className="text-xs font-medium text-center mt-2 text-muted-foreground">Dark</p>
          </button>
        </div>

        {/* Status + Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                isDark ? "bg-indigo-500/15 text-indigo-400" : "bg-amber-500/15 text-amber-600"
              )}
            >
              {isDark ? <Moon className="h-3 w-3 mr-1" /> : <Sun className="h-3 w-3 mr-1" />}
              {isDark ? "Dark Theme" : "Light Theme"}
            </Badge>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>

        {/* System hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
          <Monitor className="h-3.5 w-3.5" />
          <span>Auto (follow system) — coming soon</span>
        </div>
      </CardContent>
    </Card>
  );
}
