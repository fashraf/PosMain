import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

interface AreaConfig {
  dataKey: string;
  color: string;
  name: string;
}

interface FinanceAreaChartProps {
  data: Record<string, any>[];
  areas: AreaConfig[];
  xAxisKey?: string;
  height?: number;
  title?: string;
  showLabels?: boolean;
}

const CustomLabel = ({ x, y, value, color }: any) => {
  if (!value || value === 0) return null;
  return (
    <g>
      <rect x={x - 18} y={y - 22} width={36} height={18} rx={9} fill={color} opacity={0.15} />
      <text x={x} y={y - 10} textAnchor="middle" fill={color} fontSize={10} fontWeight={600}>
        {typeof value === "number" ? (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)) : value}
      </text>
    </g>
  );
};

export function FinanceAreaChart({ data, areas, xAxisKey = "date", height = 300, title, showLabels = false }: FinanceAreaChartProps) {
  // Find peak indices for labels
  const peakIndices = areas.map((a) => {
    let maxIdx = 0;
    let maxVal = -Infinity;
    data.forEach((d, i) => {
      if (Number(d[a.dataKey] || 0) > maxVal) {
        maxVal = Number(d[a.dataKey] || 0);
        maxIdx = i;
      }
    });
    return maxIdx;
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {title && <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
          <defs>
            {areas.map((a) => (
              <linearGradient key={a.dataKey} id={`areaGrad-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={a.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={a.color} stopOpacity={0.02} />
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
          {areas.map((a, aIdx) => (
            <Area
              key={a.dataKey}
              type="monotone"
              dataKey={a.dataKey}
              stroke={a.color}
              strokeWidth={2.5}
              fill={`url(#areaGrad-${a.dataKey})`}
              name={a.name}
              dot={(props: any) => {
                const { cx, cy, index } = props;
                const isPeak = showLabels && index === peakIndices[aIdx];
                return (
                  <g key={index}>
                    <circle cx={cx} cy={cy} r={isPeak ? 5 : 3} fill="white" stroke={a.color} strokeWidth={2} />
                    {isPeak && <CustomLabel x={cx} y={cy} value={props.value} color={a.color} />}
                  </g>
                );
              }}
              activeDot={{ r: 5, stroke: a.color, strokeWidth: 2, fill: "white" }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 px-1">
        {areas.map((a) => (
          <div key={a.dataKey} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
            <span className="text-xs text-muted-foreground">{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
