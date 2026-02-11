import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Award } from "lucide-react";
import type { StaffMetrics } from "./mockDashboardData";

const TEAL = "#2c8cb4";
const MINT = "#32c080";
const ORANGE = "#dc8c3c";

interface Props {
  data: StaffMetrics;
}

export default function StaffAttendanceCard({ data }: Props) {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: TEAL }} />
          Staff Attendance & Productivity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Attendance gauge */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Attendance Adherence</span>
            <span className="text-sm font-bold" style={{ color: data.attendance >= 90 ? MINT : ORANGE }}>
              {data.attendance}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${data.attendance}%`, background: `linear-gradient(90deg, ${TEAL}, ${MINT})` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Scheduled", value: `${data.scheduled} hrs` },
            { label: "Clocked", value: `${data.clocked} hrs (+1.7%)` },
            { label: "Overtime", value: `${data.overtime} hrs` },
            { label: "Absenteeism", value: `${data.absenteeism}%` },
          ].map((s) => (
            <div key={s.label} className="text-center rounded-lg py-2 bg-muted/50">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" style={{ color: MINT }} />
            <span className="text-xs text-muted-foreground">
              Sales/Server Hour: <strong className="text-foreground">SAR {data.salesPerHour}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" style={{ color: ORANGE }} />
            <span className="text-xs text-muted-foreground">
              Top: <strong className="text-foreground">{data.topBranch}</strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
