import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function FormSectionCard({ title, icon: Icon, children, className }: FormSectionCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
