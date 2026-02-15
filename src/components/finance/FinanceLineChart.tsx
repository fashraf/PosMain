import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface LineConfig {
  dataKey: string;
  color: string;
  name: string;
}

interface FinanceLineChartProps {
  data: Record<string, any>[];
  lines: LineConfig[];
  xAxisKey?: string;
  height?: number;
}

export function FinanceLineChart({ data, lines, xAxisKey = "date", height = 300 }: FinanceLineChartProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
          <defs>
            {lines.map((l) => (
              <linearGradient key={l.dataKey} id={`lineGrad-${l.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={l.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={l.color} stopOpacity={0.02} />
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
          {lines.map((l) => (
            <Area
              key={l.dataKey}
              type="monotone"
              dataKey={l.dataKey}
              stroke={l.color}
              strokeWidth={2.5}
              fill={`url(#lineGrad-${l.dataKey})`}
              name={l.name}
              dot={{ r: 3, fill: "white", stroke: l.color, strokeWidth: 2 }}
              activeDot={{ r: 5, stroke: l.color, strokeWidth: 2, fill: "white" }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-5 mt-3 px-1">
        {lines.map((l) => (
          <div key={l.dataKey} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-muted-foreground">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
