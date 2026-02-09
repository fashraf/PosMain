import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
  blink?: boolean;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config: Record<string, { label: string; className: string }> = {
    paid: {
      label: "Paid",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    pending: {
      label: "Unpaid",
      className: "bg-red-50 text-red-600 border-red-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-slate-50 text-slate-400 border-slate-200",
    },
    both: {
      label: "Split",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
        c.className
      )}
    >
      {c.label}
    </span>
  );
}
