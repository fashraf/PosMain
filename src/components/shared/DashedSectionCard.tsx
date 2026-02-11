import { ReactNode } from "react";
import { LucideIcon, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorVariant = "purple" | "green" | "blue" | "amber" | "muted";

interface DashedSectionCardProps {
  title: string;
  icon?: LucideIcon;
  variant?: ColorVariant;
  rightBadge?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
  isComplete?: boolean;
}

export function DashedSectionCard({
  title,
  icon: Icon,
  variant = "purple",
  rightBadge,
  children,
  className,
  id,
  isComplete,
}: DashedSectionCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border-2 border-dashed border-gray-300/40 overflow-hidden shadow-sm scroll-mt-20",
        className
      )}
    >
      <div
        className="px-3 py-1.5 border-b border-dashed border-gray-200/50 flex items-center justify-between"
        style={{
          background: "linear-gradient(to right, #e5e7eb, white 40%, white 60%, #e5e7eb)",
        }}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />}
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {rightBadge && <div>{rightBadge}</div>}
          {isComplete !== undefined && (
            <div className="flex items-center">
              {isComplete ? (
                <Check className="h-4 w-4 text-green-600" strokeWidth={2} />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.5} />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-2 bg-white">{children}</div>
    </div>
  );
}
