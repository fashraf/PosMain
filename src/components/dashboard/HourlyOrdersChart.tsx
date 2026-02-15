import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

export interface HourlyOrderItem {
  hour: string;
  count: number;
  yesterdayCount: number;
}

interface Props {
  data: HourlyOrderItem[];
}

export default function HourlyOrdersChart({ data }: Props) {
  // Find peak hour
  const peakHour = data.reduce((max, d) => (d.count > max.count ? d : max), data[0] || { hour: "00", count: 0 });

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Hourly Orders</h3>
        {peakHour && peakHour.count > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "hsl(199 52% 44% / 0.12)", color: "hsl(199 52% 44%)" }}>
            Peak: {peakHour.hour}:00 ({peakHour.count})
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="w-3 h-2 rounded-sm" style={{ background: "hsl(199 52% 44%)" }} />
          <span className="font-semibold text-foreground">Today</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="w-3 h-2 rounded-sm border-2 border-dashed" style={{ borderColor: "hsl(240 4% 76%)" }} />
          <span className="text-muted-foreground">Yesterday</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 93%)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: "hsl(240 4% 46%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 4% 56%)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number, name: string) => [v, name === "count" ? "Today" : "Yesterday"]}
            contentStyle={{ fontSize: "12px", borderRadius: "10px" }}
          />
          <Bar dataKey="yesterdayCount" radius={[3, 3, 0, 0]} fill="hsl(240 4% 90%)" barSize={12} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} barSize={12}>
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
