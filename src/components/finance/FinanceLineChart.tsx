import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    <div className="bg-card border border-border rounded-lg p-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11 }} stroke="hsl(240 4% 46%)" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(240 4% 46%)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 100%)",
              border: "1px solid hsl(240 6% 90%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {lines.map((l) => (
            <Line
              key={l.dataKey}
              type="monotone"
              dataKey={l.dataKey}
              stroke={l.color}
              name={l.name}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
