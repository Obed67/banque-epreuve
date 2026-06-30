"use client";

import { useEffect, useMemo, useState } from "react";
import { getTotalPages } from "@/lib/pagination";

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const totalItems = items.length;
  const totalPages = getTotalPages(totalItems, pageSize);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  const goToPage = (nextPage: number) => {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  };

  const resetPage = () => {
    setPage(1);
  };

  return {
    page,
    totalPages,
    totalItems,
    pageSize,
    paginatedItems,
    rangeStart,
    rangeEnd,
    setPage: goToPage,
    resetPage,
  };
}
