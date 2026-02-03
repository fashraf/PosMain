import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface GridActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function GridActionButtons({
  onView,
  onEdit,
  onDelete,
  className,
}: GridActionButtonsProps) {
  const { t } = useLanguage();

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex items-center justify-end gap-2", className)}>
        {onView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onView}
                className="grid-action-btn"
                aria-label={t("common.view")}
              >
                <Eye size={16} strokeWidth={1.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {t("common.view")}
            </TooltipContent>
          </Tooltip>
        )}

        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onEdit}
                className="grid-action-btn"
                aria-label={t("common.edit")}
              >
                <Pencil size={16} strokeWidth={1.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {t("common.edit")}
            </TooltipContent>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDelete}
                className="grid-action-btn danger"
                aria-label={t("common.delete")}
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {t("common.delete")}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
