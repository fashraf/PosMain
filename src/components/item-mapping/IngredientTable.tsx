import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Trash2, Pencil, GripVertical, Carrot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { IngredientMappingItem } from "./IngredientMappingList";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IngredientTableProps {
  mappings: IngredientMappingItem[];
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
  onReorder?: (mappings: IngredientMappingItem[]) => void;
}

function SortableRow({
  mapping,
  index,
  onRemove,
  onEdit,
  t,
}: {
  mapping: IngredientMappingItem;
  index: number;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
  t: (key: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mapping.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "h-11 border-b border-border/50 transition-all duration-200",
        index % 2 === 0 ? "bg-background" : "bg-muted/30",
        "hover:bg-primary/5 hover:shadow-sm",
        isDragging && "opacity-50 bg-primary/10 shadow-lg z-50"
      )}
    >
      <td className="px-1 w-8">
        <button
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>
      <td className="px-3 font-medium text-sm">{mapping.ingredient_name}</td>
      <td className="px-3 text-center text-sm">
        {mapping.quantity} {mapping.unit}
      </td>
      <td className="px-3 text-center">
        {mapping.can_add_extra ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
            Yes
          </span>
        ) : (
          <span className="text-[12px] text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 text-right text-sm">
        {mapping.can_add_extra && mapping.extra_cost != null && mapping.extra_cost > 0 ? (
          <span className="text-green-600 font-medium">SAR {mapping.extra_cost.toFixed(2)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 text-center">
        {mapping.can_remove ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
            Yes
          </span>
        ) : (
          <span className="text-[12px] text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 text-center">
        <div className="flex items-center justify-center gap-1">
          {onEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onEdit(mapping.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("common.edit")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onRemove(mapping.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("common.remove")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>
    </tr>
  );
}

export function IngredientTable({
  mappings,
  onRemove,
  onEdit,
  onReorder,
}: IngredientTableProps) {
  const { t } = useLanguage();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = mappings.findIndex((m) => m.id === active.id);
      const newIndex = mappings.findIndex((m) => m.id === over.id);
      const reordered = arrayMove(mappings, oldIndex, newIndex).map((m, i) => ({
        ...m,
        sort_order: i + 1,
      }));
      onReorder?.(reordered);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="h-9 w-8 px-1" />
              <th className="h-9 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("common.name")}
              </th>
              <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("itemMapping.quantity")}
              </th>
              <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("itemMapping.canAddExtra") || "Can Add"}
              </th>
              <th className="h-9 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("itemMapping.extraCost") || "Extra Cost"}
              </th>
              <th className="h-9 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("itemMapping.canRemove") || "Can Remove"}
              </th>
              <th className="h-9 w-20 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {mappings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-6 text-sm">
                  {t("itemMapping.noIngredientsMapped")}
                </td>
              </tr>
            ) : (
              <SortableContext items={mappings.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                {mappings.map((mapping, index) => (
                  <SortableRow
                    key={mapping.id}
                    mapping={mapping}
                    index={index}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    t={t}
                  />
                ))}
              </SortableContext>
            )}
          </tbody>
        </table>
    </DndContext>
  );
}
