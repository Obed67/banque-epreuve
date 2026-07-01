"use client";

import { useCatalogDocuments } from "@/lib/hooks/useCatalogDocuments";

export type { CatalogDocument as Epreuve } from "@/lib/hooks/useCatalogDocuments";

export function useEpreuvesData() {
  const catalog = useCatalogDocuments("epreuves");

  return {
    loading: catalog.loading,
    filteredEpreuves: catalog.documents,
    filters: catalog.filters,
    applyFilters: catalog.applyFilters,
    searchInput: catalog.searchInput,
    setSearchInput: catalog.setSearchInput,
    page: catalog.page,
    setPage: catalog.setPage,
    totalCount: catalog.totalCount,
    totalPages: catalog.totalPages,
    rangeStart: catalog.rangeStart,
    rangeEnd: catalog.rangeEnd,
  };
}
