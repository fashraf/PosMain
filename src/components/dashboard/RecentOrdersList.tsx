import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import type { OrderListItem } from "./mockDashboardData";

const STATUS_COLORS: Record<string, string> = {
  paid: "#32c080",
  pending: "#dc8c3c",
  cancelled: "#ef4444",
};

interface Props {
  data: OrderListItem[];
}

export default function RecentOrdersList({ data }: Props) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="h-4 w-4" style={{ color: "#2c8cb4" }} />
        <h3 className="text-sm font-semibold" style={{ color: "#2c8cb4" }}>Latest 50 Orders</h3>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No orders yet</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b">
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Time</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Order #</th>
                <th className="text-right py-2 text-xs font-medium text-muted-foreground">Total (SAR)</th>
                <th className="text-right py-2 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o, i) => (
                <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                  <td className="py-1.5 text-muted-foreground">{o.time}</td>
                  <td className="py-1.5 font-medium text-foreground">{o.orderNumber}</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{o.total.toFixed(2)}</td>
                  <td className="py-1.5 text-right">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: STATUS_COLORS[o.status] || "#a09888" }}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
