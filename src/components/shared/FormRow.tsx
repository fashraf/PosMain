import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormRowProps {
  columns?: 2 | 3 | 4;
  children: ReactNode;
  divider?: boolean;
  className?: string;
}

export function FormRow({ columns = 2, children, divider = false, className }: FormRowProps) {
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  };

  return (
    <div className={cn(divider && "border-t pt-3 mt-3", className)}>
      <div className={cn("grid gap-3", gridClasses[columns])}>{children}</div>
    </div>
  );
}
