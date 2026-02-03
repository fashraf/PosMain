import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

export interface IngredientMappingItem {
  id: string;
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  can_remove: boolean;
  can_add_extra: boolean;
  extra_cost: number | null;
  sort_order: number;
}

interface IngredientMappingListProps {
  mappings: IngredientMappingItem[];
  onChange: (mappings: IngredientMappingItem[]) => void;
  onRemove: (id: string) => void;
}

interface SortableIngredientRowProps {
  mapping: IngredientMappingItem;
  onChange: (mapping: IngredientMappingItem) => void;
  onRemove: () => void;
  t: (key: string) => string;
}

function SortableIngredientRow({
  mapping,
  onChange,
  onRemove,
  t,
}: SortableIngredientRowProps) {
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
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-card border rounded-lg group",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 font-medium">{mapping.ingredient_name}</div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={mapping.quantity}
            onChange={(e) =>
              onChange({ ...mapping, quantity: parseFloat(e.target.value) || 0 })
            }
            className="w-20 h-8 text-sm"
          />
          <span className="text-sm text-muted-foreground w-12">{mapping.unit}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Checkbox
              id={`remove-${mapping.id}`}
              checked={mapping.can_remove}
              onCheckedChange={(checked) =>
                onChange({ ...mapping, can_remove: checked as boolean })
              }
            />
            <label
              htmlFor={`remove-${mapping.id}`}
              className="text-xs text-muted-foreground cursor-pointer"
            >
              {t("itemMapping.remove")}
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <Checkbox
              id={`extra-${mapping.id}`}
              checked={mapping.can_add_extra}
              onCheckedChange={(checked) =>
                onChange({
                  ...mapping,
                  can_add_extra: checked as boolean,
                  extra_cost: checked ? mapping.extra_cost || 0 : null,
                })
              }
            />
            <label
              htmlFor={`extra-${mapping.id}`}
              className="text-xs text-muted-foreground cursor-pointer"
            >
              {t("itemMapping.extra")}
            </label>
          </div>

          {mapping.can_add_extra && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">$</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={mapping.extra_cost || ""}
                onChange={(e) =>
                  onChange({
                    ...mapping,
                    extra_cost: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-16 h-8 text-sm"
                placeholder="0.00"
              />
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function IngredientMappingList({
  mappings,
  onChange,
  onRemove,
}: IngredientMappingListProps) {
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
      const newMappings = arrayMove(mappings, oldIndex, newIndex).map((m, index) => ({
        ...m,
        sort_order: index + 1,
      }));
      onChange(newMappings);
    }
  };

  const handleItemChange = (updated: IngredientMappingItem) => {
    onChange(mappings.map((m) => (m.id === updated.id ? updated : m)));
  };

  if (mappings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
        {t("itemMapping.noIngredientsMapped")}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground mb-3">
          {t("itemMapping.dragToReorder")}
        </p>
        <SortableContext items={mappings.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {mappings.map((mapping) => (
            <SortableIngredientRow
              key={mapping.id}
              mapping={mapping}
              onChange={handleItemChange}
              onRemove={() => onRemove(mapping.id)}
              t={t}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
