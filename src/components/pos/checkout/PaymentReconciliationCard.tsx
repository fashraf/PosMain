import { TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";

interface PaymentReconciliationCardProps {
  previousTotal: number;
  currentTotal: number;
}

export function PaymentReconciliationCard({ previousTotal, currentTotal }: PaymentReconciliationCardProps) {
  const diff = currentTotal - previousTotal;
  const absDiff = Math.abs(diff);

  if (diff > 0.01) {
    return (
      <div className="rounded-2xl border-2 border-orange-300/70 bg-orange-50/40 p-5 flex items-center gap-4">
        <div className="rounded-full bg-orange-100 p-3 shrink-0">
          <TrendingUp className="h-7 w-7 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-orange-700/80">Additional Payment Required</p>
          <p className="text-2xl font-bold text-orange-700">
            Collect {absDiff.toFixed(2)} SAR
          </p>
        </div>
      </div>
    );
  }

  if (diff < -0.01) {
    return (
      <div className="rounded-2xl border-2 border-emerald-300/70 bg-emerald-50/40 p-5 flex items-center gap-4">
        <div className="rounded-full bg-emerald-100 p-3 shrink-0">
          <TrendingDown className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-700/80">Refund to Customer</p>
          <p className="text-2xl font-bold text-emerald-700">
            Return {absDiff.toFixed(2)} SAR
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-violet-200/60 bg-violet-50/20 p-5 flex items-center gap-4">
      <div className="rounded-full bg-violet-100 p-3 shrink-0">
        <CheckCircle2 className="h-7 w-7 text-violet-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground/60">No Payment Action Needed</p>
        <p className="text-lg font-semibold text-foreground/70">Totals match — no change required</p>
      </div>
    </div>
  );
}
