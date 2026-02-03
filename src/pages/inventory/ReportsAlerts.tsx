import { BarChart3, AlertTriangle, Calendar, Package, FileText, TrendingDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function ReportsAlerts() {
  const { t } = useLanguage();

  const lowStockItems = [
    { name: "Chicken", qty: 5, unit: "Kg" },
    { name: "Onions", qty: 8, unit: "Kg" },
    { name: "Eggs", qty: 12, unit: "pcs" },
  ];

  const nearExpiryItems = [
    { name: "Milk", days: 2 },
    { name: "Yogurt", days: 5 },
    { name: "Tomatoes", days: 7 },
  ];

  const recentAlerts = [
    { time: "10:30 AM", message: "Chicken stock below reorder level (5 Kg)", type: "warning" },
    { time: "09:15 AM", message: "Milk batch B-002 expires in 2 days", type: "warning" },
    { time: "08:00 AM", message: "Transfer TRF-001 received at Kitchen", type: "success" },
  ];

  const quickReports = [
    { titleKey: "inventory.stockValuation", icon: Package },
    { titleKey: "inventory.movementReport", icon: TrendingDown },
    { titleKey: "inventory.wastageReport", icon: AlertTriangle },
    { titleKey: "inventory.expiryReport", icon: Calendar },
    { titleKey: "inventory.consumptionAnalysis", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t("inventory.reportsAlerts")}</h1>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Low Stock Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-destructive">🔴</span>
              {t("inventory.lowStockItems")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <span>{item.name}</span>
                  <span className="font-medium text-destructive">{item.qty} {item.unit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Near Expiry Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning" />
              {t("inventory.nearExpiryItems")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nearExpiryItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <span>{item.name}</span>
                  <span className={cn(
                    "font-medium",
                    item.days <= 3 ? "text-destructive" : "text-warning"
                  )}>
                    {item.days} {t("inventory.days")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("inventory.quickReports")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickReports.map((report, index) => (
              <Button key={index} variant="outline" className="gap-2">
                <report.icon className="h-4 w-4" />
                {t(report.titleKey)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t("inventory.recentAlerts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <span className={cn(
                  alert.type === "warning" ? "text-warning" : "text-success"
                )}>
                  {alert.type === "warning" ? "⚠️" : "✅"}
                </span>
                <div className="flex-1">
                  <span className="text-muted-foreground">{alert.time} - </span>
                  <span>{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
