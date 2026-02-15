import { TrendingUp, TrendingDown, Minus, ShoppingCart, Clock, XCircle, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface BranchInsight {
  branchId: string;
  branchName: string;
  totalOrders: number;
  lastPlacedAt: string | null;
  cancellations: number;
  cancellationChange: number;
  staffOnDuty: number;
  totalStaff: number;
  revenue: number;
  revenueChange: number;
  orderTypeBreakdown: { type: string; pct: number }[];
}

interface Props {
  data: BranchInsight;
  onClick: (branchId: string) => void;
}

function relativeTime(iso: string | null): { text: string; color: string } {
  if (!iso) return { text: "No orders", color: "text-muted-foreground" };
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return { text: "Just now", color: "text-emerald-600" };
  if (diff < 10) return { text: `${diff}m ago`, color: "text-emerald-600" };
  if (diff < 30) return { text: `${diff}m ago`, color: "text-amber-600" };
  if (diff < 60) return { text: `${diff}m ago`, color: "text-orange-600" };
  const hrs = Math.floor(diff / 60);
  return { text: `${hrs}h ${diff % 60}m ago`, color: "text-red-500" };
}

function TrendBadge({ value, invert }: { value: number; invert?: boolean }) {
  const isUp = value > 0;
  const isDown = value < 0;
  const isGood = invert ? isDown : isUp;
  const Icon = value === 0 ? Minus : isUp ? TrendingUp : TrendingDown;
  const color = value === 0 ? "text-muted-foreground" : isGood ? "text-emerald-600" : "text-orange-600";

  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", color)}>
      <Icon className="h-3 w-3" />
      {value > 0 ? "+" : ""}{value.toFixed(0)}%
    </span>
  );
}

export default function BranchInsightCard({ data, onClick }: Props) {
  const lastOrder = relativeTime(data.lastPlacedAt);

  return (
    <TooltipProvider>
      <Card
        className="cursor-pointer transition-all duration-200 hover:shadow-lg border border-border"
        onClick={() => onClick(data.branchId)}
      >
        {/* Header */}
        <div className="px-4 py-2.5 rounded-t-lg" style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--primary)/0.03))" }}>
          <h3 className="text-sm font-bold text-foreground tracking-tight">{data.branchName}</h3>
        </div>

        {/* Metrics */}
        <div className="px-4 py-3 space-y-0">
          <Row icon={<ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />} label="Total Orders" value={String(data.totalOrders)} />
          <DottedDivider />
          <Row icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />} label="Last Placed" value={<span className={lastOrder.color}>{lastOrder.text}</span>} />
          <DottedDivider />
          <Row icon={<XCircle className="h-3.5 w-3.5 text-muted-foreground" />} label="Cancellations" value={
            <span className="flex items-center gap-1.5">
              {data.cancellations}
              <TrendBadge value={data.cancellationChange} invert />
            </span>
          } />
          <DottedDivider />
          <Row icon={<Users className="h-3.5 w-3.5 text-muted-foreground" />} label="Staff On Duty" value={`${data.staffOnDuty} / ${data.totalStaff}`} />
          <DottedDivider />
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Row icon={<DollarSign className="h-3.5 w-3.5 text-muted-foreground" />} label="Revenue" value={`SAR ${data.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {data.orderTypeBreakdown.length > 0
                ? data.orderTypeBreakdown.map((t) => `${t.type}: ${t.pct}%`).join(" · ")
                : "No breakdown available"}
            </TooltipContent>
          </Tooltip>
          <DottedDivider />
          <Row label="vs Yesterday" value={<TrendBadge value={data.revenueChange} />} />
        </div>
      </Card>
    </TooltipProvider>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function DottedDivider() {
  return <div className="border-t border-dotted border-muted" />;
}
