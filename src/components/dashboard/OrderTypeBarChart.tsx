import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";

export interface OrderTypeItem {
  type: string;
  count: number;
  amount: number;
}

interface Props {
  data: OrderTypeItem[];
}

const TYPE_COLORS = [
  "hsl(258 60% 63%)",
  "hsl(199 52% 44%)",
  "hsl(153 58% 47%)",
  "hsl(33 65% 55%)",
  "hsl(340 75% 55%)",
];

const fmtLabel = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0));

export default function OrderTypeBarChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: d.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded-full" style={{ background: "linear-gradient(to bottom, hsl(258 60% 63%), hsl(193 80% 70%))" }} />
        <h3 className="text-sm font-bold text-foreground">Order Types</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 25, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(240 4% 36%)", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number, name: string) => [
              name === "amount" ? `SAR ${v.toLocaleString()}` : v,
              name === "amount" ? "Revenue" : "Orders",
            ]}
            contentStyle={{ fontSize: "12px", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid hsl(240 6% 90%)" }}
          />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
            ))}
            <LabelList
              dataKey="amount"
              position="top"
              formatter={fmtLabel}
              style={{ fontSize: 11, fill: "hsl(240 4% 26%)", fontWeight: 800 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-dotted border-muted">
        {chartData.map((d, i) => (
          <div key={d.type} className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-md" style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
            <span className="font-extrabold text-foreground">{d.count}</span>
            <span className="text-muted-foreground font-medium">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
