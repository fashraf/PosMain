import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  indent?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  isOpen: controlledOpen,
  onOpenChange,
  indent = true,
  className,
}: CollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const { isRTL } = useLanguage();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const ChevronIcon = isOpen 
    ? ChevronDown 
    : (isRTL ? ChevronRight : ChevronRight);

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronIcon className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90", isRTL && !isOpen && "rotate-180")} />
        {title}
      </button>
      {isOpen && (
        <div className={cn(indent && "ps-5 border-s border-border")}>
          {children}
        </div>
      )}
    </div>
  );
}
