import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export interface SubItemMappingItem {
  id: string;
  sub_item_id: string;
  sub_item_name: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

interface SubItemMappingListProps {
  mappings: SubItemMappingItem[];
  onChange: (mappings: SubItemMappingItem[]) => void;
  onRemove: (id: string) => void;
}

interface SortableSubItemRowProps {
  mapping: SubItemMappingItem;
  onChange: (mapping: SubItemMappingItem) => void;
  onRemove: () => void;
  t: (key: string) => string;
}

function SortableSubItemRow({
  mapping,
  onChange,
  onRemove,
  t,
}: SortableSubItemRowProps) {
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

  const subtotal = mapping.quantity * mapping.unit_price;

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

      <div className="flex-1 font-medium">{mapping.sub_item_name}</div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">×</span>
          <Input
            type="number"
            min="1"
            value={mapping.quantity}
            onChange={(e) =>
              onChange({ ...mapping, quantity: parseInt(e.target.value) || 1 })
            }
            className="w-16 h-8 text-sm"
          />
        </div>

        <div className="text-sm text-muted-foreground w-20 text-end">
          ${mapping.unit_price.toFixed(2)}
        </div>

        <div className="text-sm font-medium w-24 text-end">
          ${subtotal.toFixed(2)}
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

export function SubItemMappingList({
  mappings,
  onChange,
  onRemove,
}: SubItemMappingListProps) {
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

  const handleItemChange = (updated: SubItemMappingItem) => {
    onChange(mappings.map((m) => (m.id === updated.id ? updated : m)));
  };

  const totalSubItems = mappings.reduce(
    (sum, m) => sum + m.quantity * m.unit_price,
    0
  );

  if (mappings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
        {t("itemMapping.noSubItemsMapped")}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{t("itemMapping.dragToReorder")}</span>
          <div className="flex gap-4">
            <span className="w-20 text-end">{t("itemMapping.unitPrice")}</span>
            <span className="w-24 text-end">{t("itemMapping.subtotal")}</span>
            <span className="w-8"></span>
          </div>
        </div>
        <SortableContext items={mappings.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {mappings.map((mapping) => (
            <SortableSubItemRow
              key={mapping.id}
              mapping={mapping}
              onChange={handleItemChange}
              onRemove={() => onRemove(mapping.id)}
              t={t}
            />
          ))}
        </SortableContext>
        <div className="flex justify-end pt-3 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">{t("itemMapping.subItemsTotal")}:</span>
            <span className="font-semibold ms-2">${totalSubItems.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
