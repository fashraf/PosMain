import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import type { HourlyRevenue } from "./mockDashboardData";

const TEAL = "hsl(199 52% 44%)";
const CYAN = "hsl(193 80% 70%)";

interface Props {
  data: HourlyRevenue[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xl text-xs">
      <p className="font-bold text-foreground mb-1">{label}:00</p>
      <p className="font-semibold" style={{ color: TEAL }}>Today: SAR {payload[0]?.value?.toLocaleString()}</p>
      {payload[1] && (
        <p className="text-muted-foreground">Yesterday: SAR {payload[1]?.value?.toLocaleString()}</p>
      )}
    </div>
  );
};

export default function RevenueTrendChart({ data }: Props) {
  const hasData = data.some((d) => d.revenue > 0 || d.yesterday > 0);
  const peak = data.reduce((max, d) => (d.revenue > max.revenue ? d : max), data[0]);

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full" style={{ background: `linear-gradient(to bottom, ${TEAL}, ${CYAN})` }} />
          <h3 className="text-sm font-bold text-foreground">Revenue Trend</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="w-3 h-1.5 rounded-full" style={{ background: TEAL }} />
            <span className="font-semibold text-foreground">Today</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="w-3 h-1.5 rounded-full border-2 border-dashed" style={{ borderColor: CYAN }} />
            <span className="text-muted-foreground">Yesterday</span>
          </div>
        </div>
      </div>
      <div className="h-[220px]">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No revenue data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TEAL} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={TEAL} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(240 4% 46%)", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="yesterday" name="Yesterday" stroke={CYAN} strokeWidth={1.5} strokeDasharray="6 4" fill="none" />
              <Area type="monotone" dataKey="revenue" name="Today" stroke={TEAL} strokeWidth={2.5} fill="url(#revGradNew)" />
              {peak.revenue > 0 && (
                <ReferenceDot x={peak.hour} y={peak.revenue} r={5} fill="hsl(33 65% 55%)" stroke="white" strokeWidth={2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      {hasData && peak.revenue > 0 && (
        <p className="text-[10px] mt-2 font-semibold px-2 py-1 rounded-full inline-block"
          style={{ color: "hsl(33 65% 55%)", background: "hsl(33 65% 55% / 0.1)" }}>
          Peak at {peak.hour}:00 · SAR {peak.revenue.toFixed(2)}
        </p>
      )}
    </div>
  );
}
