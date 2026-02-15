import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface FinanceBarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  layout?: "horizontal" | "vertical";
  height?: number;
  title?: string;
}

const COLORS = ["#2c8cb4", "#32c080", "#dc8c3c", "#64b4e0", "#8b5cf6", "#a09888"];

export function FinanceBarChart({ data, color, layout = "vertical", height = 300, title }: FinanceBarChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {title && <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {layout === "horizontal" ? (
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={75} />
            <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={color || COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={color || COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
