import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface SlowOrder {
  time: string;
  orderNumber: string;
  total: number;
  status: string;
  duration: number;
}

interface Props {
  data: SlowOrder[];
}

export default function SlowestOrdersList({ data }: Props) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4" style={{ color: "#dc8c3c" }} />
        <h3 className="text-sm font-semibold" style={{ color: "#2c8cb4" }}>Top 50 Slowest (Pending)</h3>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No pending orders</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b">
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Time</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Order #</th>
                <th className="text-right py-2 text-xs font-medium text-muted-foreground">Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o, i) => (
                <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                  <td className="py-1.5 text-muted-foreground">{o.time}</td>
                  <td className="py-1.5 font-medium text-foreground">{o.orderNumber}</td>
                  <td className="py-1.5 text-right">
                    <span className="font-semibold" style={{ color: o.duration > 15 ? "#dc8c3c" : "#32c080" }}>
                      {o.duration} min
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
