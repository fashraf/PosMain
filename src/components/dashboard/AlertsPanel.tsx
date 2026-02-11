import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import type { DashboardAlert } from "./mockDashboardData";

const TEAL = "#2c8cb4";
const ORANGE = "#dc8c3c";
const MINT = "#32c080";

interface Props {
  data: DashboardAlert[];
}

export default function AlertsPanel({ data }: Props) {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: ORANGE }} />
          Alerts & Actionable Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((a, i) => {
            const isWarning = a.type === "warning";
            const isSuccess = a.type === "success";
            const isAction = a.type === "action";

            return (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                style={{
                  backgroundColor: isWarning ? `${ORANGE}0a` : isSuccess ? `${MINT}0a` : `${TEAL}0a`,
                  border: `1px solid ${isWarning ? `${ORANGE}25` : isSuccess ? `${MINT}25` : `${TEAL}25`}`,
                }}
              >
                {isWarning && <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: ORANGE }} />}
                {isSuccess && <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: MINT }} />}
                {isAction && <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />}
                <p className="text-xs text-foreground leading-relaxed">{a.message}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
