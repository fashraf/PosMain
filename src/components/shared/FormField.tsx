import { ReactNode } from "react";
import { TooltipInfo } from "@/components/shared/TooltipInfo";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
  tooltip?: string;
  required?: boolean;
}

export function FormField({ label, children, className, tooltip, required }: FormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
          {required && <span className="text-destructive ms-0.5">*</span>}
        </span>
        {tooltip && <TooltipInfo content={tooltip} />}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
