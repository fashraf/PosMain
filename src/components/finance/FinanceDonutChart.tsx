import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FinanceDonutChartProps {
  data: { name: string; value: number }[];
  height?: number;
  title?: string;
}

const COLORS = ["#2c8cb4", "#32c080", "#dc8c3c", "#64b4e0", "#8b5cf6", "#a09888"];

export function FinanceDonutChart({ data, height = 300, title }: FinanceDonutChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {title && <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
