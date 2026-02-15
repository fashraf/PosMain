import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

export interface OrderTypeItem {
  type: string;
  count: number;
  amount: number;
}

interface Props {
  data: OrderTypeItem[];
}

const fmtLabel = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0));

export default function OrderTypeBarChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: d.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Order Types</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 20, right: 10, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="orderTypeGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="hsl(258 60% 63%)" />
              <stop offset="100%" stopColor="hsl(193 80% 70%)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 93%)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(240 4% 36%)", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number, name: string) => [
              name === "amount" ? `SAR ${v.toLocaleString()}` : v,
              name === "amount" ? "Revenue" : "Orders",
            ]}
            contentStyle={{ fontSize: "12px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="url(#orderTypeGrad)" barSize={36}>
            <LabelList
              dataKey="amount"
              position="top"
              formatter={fmtLabel}
              style={{ fontSize: 10, fill: "hsl(240 4% 36%)", fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-dotted border-muted">
        {chartData.map((d) => (
          <div key={d.type} className="text-[11px]">
            <span className="font-bold text-foreground">{d.count}</span>{" "}
            <span className="text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
