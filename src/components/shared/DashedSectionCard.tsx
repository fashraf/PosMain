import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorVariant = "purple" | "green" | "blue" | "amber" | "muted";

interface DashedSectionCardProps {
  title: string;
  icon?: LucideIcon;
  variant?: ColorVariant;
  children: ReactNode;
  className?: string;
}

const variants: Record<ColorVariant, {
  border: string;
  headerBg: string;
  headerBorder: string;
  iconColor: string;
  titleColor: string;
}> = {
  purple: {
    border: "border-purple-300/40",
    headerBg: "bg-purple-50",
    headerBorder: "border-purple-200/50",
    iconColor: "text-purple-600",
    titleColor: "text-purple-700",
  },
  green: {
    border: "border-green-300/40",
    headerBg: "bg-green-50",
    headerBorder: "border-green-200/50",
    iconColor: "text-green-600",
    titleColor: "text-green-700",
  },
  blue: {
    border: "border-blue-300/40",
    headerBg: "bg-blue-50",
    headerBorder: "border-blue-200/50",
    iconColor: "text-blue-600",
    titleColor: "text-blue-700",
  },
  amber: {
    border: "border-amber-300/40",
    headerBg: "bg-amber-50",
    headerBorder: "border-amber-200/50",
    iconColor: "text-amber-600",
    titleColor: "text-amber-700",
  },
  muted: {
    border: "border-gray-300/40",
    headerBg: "bg-gray-50",
    headerBorder: "border-gray-200/50",
    iconColor: "text-gray-600",
    titleColor: "text-gray-700",
  },
};

export function DashedSectionCard({
  title,
  icon: Icon,
  variant = "purple",
  children,
  className,
}: DashedSectionCardProps) {
  const colors = variants[variant];

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed overflow-hidden",
        colors.border,
        className
      )}
    >
      <div
        className={cn(
          "px-4 py-2.5 border-b border-dashed flex items-center gap-2",
          colors.headerBg,
          colors.headerBorder
        )}
      >
        {Icon && <Icon className={cn("h-4 w-4", colors.iconColor)} strokeWidth={1.5} />}
        <h3 className={cn("text-sm font-semibold", colors.titleColor)}>{title}</h3>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );
}
