import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
  blink?: boolean;
}

export function OrderStatusBadge({ status, blink }: OrderStatusBadgeProps) {
  const config: Record<string, { label: string; className: string }> = {
    paid: {
      label: "Paid",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    pending: {
      label: "Unpaid",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-500 border-gray-200",
    },
    both: {
      label: "Split",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        c.className,
        (status === "pending" || blink) && "animate-pulse-red"
      )}
    >
      {c.label}
    </span>
  );
}
