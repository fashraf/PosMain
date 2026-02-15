import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const alertOptions = [
  { key: "open_order", label: "Order not closed for 30+ min", defaultOn: true },
  { key: "shift_assign", label: "New shift assignment", defaultOn: true },
  { key: "low_stock", label: "Low stock on popular items", defaultOn: false },
  { key: "system_maintenance", label: "System maintenance notices", defaultOn: false },
];

export function AlertsCard() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Record<string, boolean>>(
    Object.fromEntries(alertOptions.map((a) => [a.key, a.defaultOn]))
  );

  const toggle = (key: string) => setAlerts((p) => ({ ...p, [key]: !p[key] }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {t("profile.alerts") || "Alerts & Notifications"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alertOptions.map((opt) => (
            <div key={opt.key} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{opt.label}</span>
              <Switch checked={alerts[opt.key]} onCheckedChange={() => toggle(opt.key)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
