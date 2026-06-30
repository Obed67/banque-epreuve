"use client";

import { useCatalogDocuments } from "@/lib/hooks/useCatalogDocuments";

export type { CatalogDocument as Ressource } from "@/lib/hooks/useCatalogDocuments";

export function useRessourcesData() {
  const catalog = useCatalogDocuments("ressources");

  return {
    loading: catalog.loading,
    filteredRessources: catalog.documents,
    filters: catalog.filters,
    applyFilters: catalog.applyFilters,
    page: catalog.page,
    setPage: catalog.setPage,
    totalCount: catalog.totalCount,
    totalPages: catalog.totalPages,
    rangeStart: catalog.rangeStart,
    rangeEnd: catalog.rangeEnd,
  };
}
