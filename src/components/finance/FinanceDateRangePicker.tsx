import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

export interface DateRange {
  from: string;
  to: string;
}

interface FinanceDateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets = [
  { label: "Today", getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: "This Week", getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 0 }), to: endOfDay(new Date()) }) },
  { label: "This Month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfDay(new Date()) }) },
  { label: "This Year", getValue: () => ({ from: startOfYear(new Date()), to: endOfDay(new Date()) }) },
];

export function FinanceDateRangePicker({ value, onChange }: FinanceDateRangePickerProps) {
  const [activePreset, setActivePreset] = useState("This Month");
  const [customOpen, setCustomOpen] = useState(false);

  const handlePreset = (label: string, getValue: () => { from: Date; to: Date }) => {
    setActivePreset(label);
    const { from, to } = getValue();
    onChange({ from: from.toISOString(), to: to.toISOString() });
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {presets.map((p) => (
        <Button
          key={p.label}
          variant={activePreset === p.label ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
          onClick={() => handlePreset(p.label, p.getValue)}
        >
          {p.label}
        </Button>
      ))}
      <Popover open={customOpen} onOpenChange={setCustomOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={activePreset === "Custom" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs gap-1"
          >
            <CalendarIcon className="h-3 w-3" />
            Custom
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: new Date(value.from),
              to: new Date(value.to),
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setActivePreset("Custom");
                onChange({
                  from: startOfDay(range.from).toISOString(),
                  to: endOfDay(range.to).toISOString(),
                });
                setCustomOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <span className="text-xs text-muted-foreground ml-2">
        {format(new Date(value.from), "MMM d")} – {format(new Date(value.to), "MMM d, yyyy")}
      </span>
    </div>
  );
}
