import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UtensilsCrossed, 
  Carrot, 
  Store, 
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for dashboard stats
const mockStats = {
  totalItems: 45,
  totalIngredients: 78,
  activeChannels: 4,
  lowStockAlerts: 3,
};

export default function Dashboard() {
  const { t, isRTL } = useLanguage();

  const statCards = [
    {
      titleKey: "dashboard.totalItems",
      value: mockStats.totalItems,
      icon: UtensilsCrossed,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      titleKey: "dashboard.totalIngredients",
      value: mockStats.totalIngredients,
      icon: Carrot,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      titleKey: "dashboard.activeChannels",
      value: mockStats.activeChannels,
      icon: Store,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
    {
      titleKey: "dashboard.lowStockAlerts",
      value: mockStats.lowStockAlerts,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("dashboard.welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className={cn(
        "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
        isRTL && "direction-rtl"
      )}>
        {statCards.map((stat) => (
          <Card key={stat.titleKey} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className={cn(
              "flex flex-row items-center justify-between pb-2",
              isRTL && "flex-row-reverse"
            )}>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(stat.titleKey)}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>{t("dashboard.overview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to your POS Admin dashboard. Use the sidebar to navigate to different modules.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
