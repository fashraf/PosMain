import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

export interface PaymentMethodItem {
  method: string;
  count: number;
  amount: number;
}

interface Props {
  data: PaymentMethodItem[];
}

const METHOD_COLORS: Record<string, string> = {
  cash: "hsl(153 58% 47%)",
  card: "hsl(199 52% 44%)",
  both: "hsl(258 60% 63%)",
  pay_later: "hsl(33 65% 55%)",
};

const fmtLabel = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0));

export default function PaymentMethodChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  const chartData = data.map((d) => ({
    ...d,
    label: d.method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    pct: total > 0 ? Math.round((d.amount / total) * 100) : 0,
  }));

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Payment Methods</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 50, bottom: 0, left: 70 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="label"
            type="category"
            tick={{ fontSize: 12, fill: "hsl(240 4% 36%)", fontWeight: 600 }}
            width={65}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: number) => [`SAR ${v.toLocaleString()}`, "Amount"]}
            contentStyle={{ fontSize: "12px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          />
          <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={24}>
            {chartData.map((entry) => (
              <Cell
                key={entry.method}
                fill={METHOD_COLORS[entry.method] || "hsl(240 4% 66%)"}
              />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: 11, fill: "hsl(240 4% 36%)", fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-dotted border-muted">
        {chartData.map((d) => (
          <div key={d.method} className="flex items-center gap-1.5 text-[11px]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: METHOD_COLORS[d.method] || "hsl(240 4% 66%)" }}
            />
            <span className="font-semibold text-foreground">{d.count}</span>
            <span className="text-muted-foreground">orders</span>
          </div>
        ))}
      </div>
    </div>
  );
}
