import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FinanceLegendList } from "./FinanceLegendList";

interface FinanceDonutChartProps {
  data: { name: string; value: number }[];
  height?: number;
  title?: string;
  centerLabel?: string;
}

const COLORS = ["#00d4ff", "#7c3aed", "#ec4899", "#6366f1", "#60a5fa", "#a78bfa"];

export function FinanceDonutChart({ data, height = 300, title, centerLabel }: FinanceDonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const displayCenter = centerLabel || (total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total.toFixed(0));

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {title && <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
          {/* Center label */}
          <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground" style={{ fontSize: "22px", fontWeight: 700 }}>
            {displayCenter}
          </text>
          <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground" style={{ fontSize: "11px" }}>
            Total
          </text>
        </PieChart>
      </ResponsiveContainer>
      <FinanceLegendList
        items={data.map((d, i) => ({
          label: d.name,
          value: d.value,
          color: COLORS[i % COLORS.length],
        }))}
      />
    </div>
  );
}
