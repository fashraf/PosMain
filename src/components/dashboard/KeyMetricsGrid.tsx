import { Card } from "@/components/ui/card";
import { Target, Clock, Users, Smartphone, Zap, UtensilsCrossed, ArrowUp, ArrowDown } from "lucide-react";
import type { KeyMetric } from "./mockDashboardData";

const TEAL = "#2c8cb4";
const MINT = "#32c080";

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  clock: Clock,
  users: Users,
  smartphone: Smartphone,
  zap: Zap,
  utensils: UtensilsCrossed,
};

interface Props {
  data: KeyMetric[];
}

export default function KeyMetricsGrid({ data }: Props) {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: TEAL }} />
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          {data.map((m) => {
            const Icon = iconMap[m.icon] || Target;
            return (
              <div key={m.label} className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="h-3.5 w-3.5" style={{ color: TEAL }} />
                  <span className="text-[11px] text-muted-foreground truncate">{m.label}</span>
                </div>
                <p className="text-sm font-bold text-foreground">{m.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {m.trendDirection === "up" && <ArrowUp className="h-3 w-3" style={{ color: MINT }} />}
                  {m.trendDirection === "down" && <ArrowDown className="h-3 w-3" style={{ color: "#dc8c3c" }} />}
                  <span className="text-[10px] text-muted-foreground">{m.trend}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
