import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  name: string;
  color?: string | null;
  className?: string;
}

export function RoleBadge({ name, color, className }: RoleBadgeProps) {
  const bgColor = color ? `${color}20` : 'hsl(var(--muted))';
  const textColor = color || 'hsl(var(--foreground))';
  const borderColor = color ? `${color}40` : 'hsl(var(--border))';

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: borderColor,
      }}
    >
      {name}
    </span>
  );
}
