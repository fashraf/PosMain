import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, XCircle, UserCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "order_placed" | "order_cancelled" | "staff_clock_in" | "staff_clock_out";
  label: string;
  detail: string;
  timestamp: string;
  timeAgo: string;
}

interface Props {
  data: ActivityItem[];
}

const TYPE_CONFIG = {
  order_placed: { icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
  order_cancelled: { icon: XCircle, color: "text-orange-600", bg: "bg-orange-50" },
  staff_clock_in: { icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
  staff_clock_out: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted/30" },
};

export default function RecentActivityFeed({ data }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <div className="max-h-[300px] overflow-y-auto space-y-0">
          {data.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-4 text-center">No recent activity</p>
          )}
          {data.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type];
            const Icon = cfg.icon;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 py-2.5",
                  i < data.length - 1 && "border-b border-dotted border-muted"
                )}
              >
                <div className={cn("mt-0.5 p-1.5 rounded-md", cfg.bg)}>
                  <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{item.timeAgo}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
