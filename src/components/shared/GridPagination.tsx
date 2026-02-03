import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface GridPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function GridPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: GridPaginationProps) {
  const { t } = useLanguage();

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("ellipsis");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-2 py-3",
        className
      )}
      aria-label="Pagination"
    >
      <p className="text-[13px] text-[#6B7280]">
        {t("grid.showingOf", { start: startItem, end: endItem, total: totalItems })}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded transition-colors",
            currentPage === 1
              ? "text-[#D1D5DB] cursor-not-allowed"
              : "text-[#6B7280] hover:bg-[#F3F0FF] hover:text-[#8B5CF6]"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>

        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="w-8 h-8 flex items-center justify-center text-[#6B7280] text-[13px]"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded text-[13px] font-medium transition-colors",
                currentPage === page
                  ? "bg-[#8B5CF6] text-white"
                  : "text-[#6B7280] hover:bg-[#F3F0FF] hover:text-[#8B5CF6]"
              )}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded transition-colors",
            currentPage === totalPages
              ? "text-[#D1D5DB] cursor-not-allowed"
              : "text-[#6B7280] hover:bg-[#F3F0FF] hover:text-[#8B5CF6]"
          )}
          aria-label="Next page"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
