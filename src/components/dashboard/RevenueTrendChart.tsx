import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HourlyRevenue } from "./mockDashboardData";

const TEAL = "#2c8cb4";
const CYAN = "#64b4e0";

interface Props {
  data: HourlyRevenue[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-foreground">{label}:00</p>
      <p style={{ color: TEAL }}>Revenue: SAR {payload[0]?.value?.toLocaleString()}</p>
      {payload[1] && (
        <p className="text-muted-foreground">Target: SAR {payload[1]?.value?.toLocaleString()}</p>
      )}
    </div>
  );
};

export default function RevenueTrendChart({ data }: Props) {
  // Find peak
  const peak = data.reduce((max, d) => (d.revenue > max.revenue ? d : max), data[0]);

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: TEAL }} />
          Revenue Trend (Today – Hourly)
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={TEAL} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#a09888" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a09888" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke={TEAL} strokeWidth={2.5} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="target" stroke={CYAN} strokeWidth={1.5} strokeDasharray="5 5" fill="none" />
              <ReferenceDot x={peak.hour} y={peak.revenue} r={5} fill="#dc8c3c" stroke="white" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] mt-2" style={{ color: "#a09888" }}>
          Peak at {peak.hour}:00 · Lunch peak strong – dinner buildup expected
        </p>
      </CardContent>
    </Card>
  );
}
