import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, LogIn, ShoppingCart, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const mockActivities = [
  { icon: LogIn, label: "Logged in", time: "Today, 10:15 AM", color: "text-green-500" },
  { icon: ShoppingCart, label: "Processed Order #4567", time: "Today, 10:42 AM", color: "text-primary" },
  { icon: ShoppingCart, label: "Processed Order #4568", time: "Today, 11:05 AM", color: "text-primary" },
  { icon: Clock, label: "Clocked in for shift", time: "Today, 09:00 AM", color: "text-blue-500" },
  { icon: LogIn, label: "Logged in", time: "Yesterday, 08:55 AM", color: "text-green-500" },
  { icon: ShoppingCart, label: "Processed Order #4552", time: "Yesterday, 09:30 AM", color: "text-primary" },
];

export function ActivitiesCard() {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {t("profile.activities") || "Recent Activities"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {mockActivities.map((act, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5">
                <act.icon className={`h-4 w-4 ${act.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{act.label}</p>
                <p className="text-xs text-muted-foreground">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
