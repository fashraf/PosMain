import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SeriesConfig {
  dataKey: string;
  color: string;
  name: string;
}

interface FinanceStackedAreaChartProps {
  data: Record<string, any>[];
  series: SeriesConfig[];
  xAxisKey?: string;
  height?: number;
  title?: string;
}

const PALETTE = ["#7c3aed", "#6366f1", "#00d4ff", "#a78bfa", "#60a5fa"];

export function FinanceStackedAreaChart({ data, series, xAxisKey = "date", height = 300, title }: FinanceStackedAreaChartProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {title && <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.dataKey} id={`stackGrad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color || PALETTE[i % PALETTE.length]} stopOpacity={0.4} />
                <stop offset="100%" stopColor={s.color || PALETTE[i % PALETTE.length]} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 93%)" vertical={false} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 100%)",
              border: "1px solid hsl(240 6% 90%)",
              borderRadius: "10px",
              fontSize: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />
          {series.map((s, i) => (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              stackId="1"
              stroke={s.color || PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              fill={`url(#stackGrad-${s.dataKey})`}
              name={s.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center gap-5 mt-3 px-1">
        {series.map((s, i) => (
          <div key={s.dataKey} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color || PALETTE[i % PALETTE.length] }} />
            <span className="text-xs text-muted-foreground">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
