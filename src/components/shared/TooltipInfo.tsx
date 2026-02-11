import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipInfoProps {
  content?: string;
  richContent?: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function TooltipInfo({ content, richContent, side = "top", className }: TooltipInfoProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center h-4 w-4 rounded-full text-muted-foreground hover:text-foreground transition-colors",
            className
          )}
        >
          <Info className="h-3.5 w-3.5" />
          <span className="sr-only">Info</span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        className={cn(
          richContent ? "max-w-[400px] p-3" : "max-w-[250px]"
        )}
      >
        {richContent || <p className="text-sm">{content}</p>}
      </TooltipContent>
    </Tooltip>
  );
}
