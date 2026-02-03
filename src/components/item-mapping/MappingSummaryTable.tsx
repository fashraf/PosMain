import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, GripVertical, Edit, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MappingExpandedRow } from "./MappingExpandedRow";
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

export interface ItemWithMappings {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  item_type: "edible" | "non_edible";
  is_combo: boolean;
  base_cost: number;
  sort_order: number;
  ingredient_count: number;
  sub_item_count: number;
  ingredients?: IngredientMapping[];
  sub_items?: SubItemMapping[];
}

export interface IngredientMapping {
  id: string;
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  can_remove: boolean;
  can_add_extra: boolean;
  extra_cost: number | null;
  cost: number;
}

export interface SubItemMapping {
  id: string;
  sub_item_id: string;
  sub_item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  sort_order: number;
}

interface MappingSummaryTableProps {
  items: ItemWithMappings[];
  onReorder: (items: ItemWithMappings[]) => void;
}

interface SortableRowProps {
  item: ItemWithMappings;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  getLocalizedName: (item: { name_en: string; name_ar: string; name_ur: string }) => string;
  t: (key: string) => string;
}

function SortableRow({
  item,
  isExpanded,
  onToggleExpand,
  onEdit,
  getLocalizedName,
  t,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const canShowMapping = item.item_type === "edible";

  return (
    <>
      <TableRow
        ref={setNodeRef}
        style={style}
        className={cn(
          "group",
          isDragging && "opacity-50 bg-muted",
          isExpanded && "bg-muted/30"
        )}
      >
        <TableCell className="w-10">
          <button
            className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </TableCell>
        <TableCell>
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 hover:text-primary transition-colors"
            disabled={!canShowMapping}
          >
            {canShowMapping ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4" />
            )}
            <span className="font-medium">{getLocalizedName(item)}</span>
            {item.is_combo && (
              <Badge variant="secondary" className="text-xs">
                <Package className="h-3 w-3 me-1" />
                {t("itemMapping.combo")}
              </Badge>
            )}
          </button>
        </TableCell>
        <TableCell>
          <Badge variant={item.item_type === "edible" ? "default" : "outline"}>
            {item.item_type === "edible" ? t("items.edible") : t("items.nonEdible")}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          {canShowMapping ? (
            <span className="font-medium">{item.ingredient_count}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell className="text-center">
          {item.is_combo ? (
            <span className="font-medium">{item.sub_item_count}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell>
          {canShowMapping && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </TableCell>
      </TableRow>
      {isExpanded && canShowMapping && (
        <TableRow className="bg-muted/20 hover:bg-muted/20">
          <TableCell colSpan={6} className="p-0">
            <MappingExpandedRow item={item} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function MappingSummaryTable({ items, onReorder }: MappingSummaryTableProps) {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getLocalizedName = (item: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof item;
    return item[key] || item.name_en;
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        sort_order: index + 1,
      }));
      onReorder(newItems);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead>{t("common.name")}</TableHead>
            <TableHead>{t("common.type")}</TableHead>
            <TableHead className="text-center">{t("itemMapping.ingredientCount")}</TableHead>
            <TableHead className="text-center">{t("itemMapping.subItemCount")}</TableHead>
            <TableHead className="w-16">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableRow
                key={item.id}
                item={item}
                isExpanded={expandedIds.has(item.id)}
                onToggleExpand={() => toggleExpand(item.id)}
                onEdit={() => navigate(`/item-ingredient-mapping/${item.id}/edit`)}
                getLocalizedName={getLocalizedName}
                t={t}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
