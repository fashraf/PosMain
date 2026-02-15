import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface HourlyOrderItem {
  hour: string;
  count: number;
  yesterdayCount: number;
}

interface Props {
  data: HourlyOrderItem[];
}

export default function HourlyOrdersChart({ data }: Props) {
  const peakHour = data.reduce((max, d) => (d.count > max.count ? d : max), data[0] || { hour: "00", count: 0 });

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full" style={{ background: "linear-gradient(to bottom, hsl(199 52% 44%), hsl(153 58% 47%))" }} />
          <h3 className="text-sm font-bold text-foreground">Hourly Orders</h3>
        </div>
        {peakHour && peakHour.count > 0 && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "hsl(153 58% 47% / 0.12)", color: "hsl(153 58% 47%)" }}>
            ⚡ Peak: {peakHour.hour}:00 ({peakHour.count})
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="w-3 h-2.5 rounded-sm" style={{ background: "hsl(199 52% 44%)" }} />
          <span className="font-bold text-foreground">Today</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="w-3 h-2.5 rounded-sm" style={{ background: "hsl(240 4% 88%)" }} />
          <span className="text-muted-foreground font-medium">Yesterday</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: "hsl(240 4% 46%)", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number, name: string) => [v, name === "count" ? "Today" : "Yesterday"]}
            contentStyle={{ fontSize: "12px", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid hsl(240 6% 90%)" }}
          />
          <Bar dataKey="yesterdayCount" radius={[4, 4, 0, 0]} fill="hsl(240 4% 88%)" barSize={12} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={12}>
            {data.map((entry) => (
              <Cell
                key={entry.hour}
                fill={entry.hour === peakHour?.hour ? "hsl(153 58% 47%)" : "hsl(199 52% 44%)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
