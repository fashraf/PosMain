import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ShoppingCart, ClipboardList, ChefHat, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const links = [
  { icon: LayoutDashboard, label: "Dashboard", url: "/", color: "bg-blue-500/10 text-blue-600" },
  { icon: ShoppingCart, label: "New Order", url: "/pos", color: "bg-green-500/10 text-green-600" },
  { icon: ClipboardList, label: "Order List", url: "/pos/orders", color: "bg-orange-500/10 text-orange-600" },
  { icon: ChefHat, label: "Kitchen", url: "/pos/kitchen", color: "bg-purple-500/10 text-purple-600" },
];

export function QuickLinksCard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          {t("profile.quickLinks") || "Quick Links"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {links.map((link) => (
            <button
              key={link.url}
              onClick={() => navigate(link.url)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${link.color}`}>
                <link.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">{link.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
