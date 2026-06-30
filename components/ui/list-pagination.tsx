"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVisiblePages } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type ListPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function ListPagination({
  page,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
  className,
}: ListPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-blue-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-gray-500">
        Affichage {rangeStart}–{rangeEnd} sur {totalItems} résultat
        {totalItems > 1 ? "s" : ""}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg border-blue-100"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Précédent
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-gray-400"
                aria-hidden
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <Button
                key={item}
                type="button"
                variant={item === page ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg",
                  item === page && "bg-[#0077d2] hover:bg-[#0066b8]",
                )}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            ),
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg border-blue-100"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Suivant
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}
