import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function RoleCard() {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {t("profile.role") || "Role & Permissions"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-sm px-3 py-1">Admin</Badge>
          <span className="text-sm text-muted-foreground">Full system access</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Granted Permissions</p>
          <div className="flex flex-wrap gap-1.5">
            {["Dashboard", "Orders", "Menu", "Inventory", "Finance", "Staff", "Settings"].map((perm) => (
              <Badge key={perm} variant="secondary" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                {perm}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic">
          Contact your administrator to modify role assignments.
        </p>
      </CardContent>
    </Card>
  );
}
