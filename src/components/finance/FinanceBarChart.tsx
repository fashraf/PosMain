import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface FinanceBarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  layout?: "horizontal" | "vertical";
  height?: number;
  title?: string;
}

const fmtLabel = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0));

export function FinanceBarChart({ data, color, layout = "vertical", height = 300, title }: FinanceBarChartProps) {
  const gradId = "barGrad-legacy";

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {title && <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {layout === "horizontal" ? (
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 80 }}>
            <defs>
              <linearGradient id={gradId + "-h"} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 93%)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(240 4% 56%)" }} width={75} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={color || `url(#${gradId}-h)`}>
              <LabelList dataKey="value" position="right" formatter={fmtLabel} style={{ fontSize: 10, fill: "hsl(240 4% 46%)", fontWeight: 600 }} />
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 93%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={color || `url(#${gradId})`}>
              <LabelList dataKey="value" position="top" formatter={fmtLabel} style={{ fontSize: 10, fill: "hsl(240 4% 46%)", fontWeight: 600 }} />
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
