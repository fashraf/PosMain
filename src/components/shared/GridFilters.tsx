import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
}

interface GridFiltersProps {
  title?: string;
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  actionButton?: React.ReactNode;
  className?: string;
}

export function GridFilters({
  title,
  filters = [],
  filterValues = {},
  onFilterChange,
  searchPlaceholder,
  searchValue = "",
  onSearch,
  actionButton,
  className,
}: GridFiltersProps) {
  const { t } = useLanguage();
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  // Sync external search value
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearch?.("");
  };

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-[16px] font-semibold text-[#111827]">{title}</h1>
        )}
      </div>

      {/* Right: Filters + Search + Action */}
      <div className="flex items-center gap-3">
        {/* Dropdown Filters */}
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filterValues[filter.key] || filter.defaultValue || "all"}
            onValueChange={(value) => onFilterChange?.(filter.key, value)}
          >
            <SelectTrigger className="w-[140px] h-9 text-[13px] border-[#E5E7EB] bg-white">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-[13px]"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Search Input */}
        {onSearch && (
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <Input
              type="text"
              placeholder={searchPlaceholder || t("grid.searchPlaceholder")}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-[280px] h-9 pl-9 pr-8 text-[13px] border-[#E5E7EB] bg-white focus-visible:ring-[#8B5CF6]"
            />
            {localSearch && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}

        {/* Action Button */}
        {actionButton}
      </div>
    </div>
  );
}
