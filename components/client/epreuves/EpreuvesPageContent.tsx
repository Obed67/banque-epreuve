"use client";

import { BookOpen, FileText } from "lucide-react";
import Badge from "@/app/components/Badge";
import DocumentPreviewActions from "@/app/components/DocumentPreviewActions";
import FilterBar from "@/app/components/FilterBar";
import Loader from "@/app/components/Loader";
import VerifiedBadge from "@/app/components/VerifiedBadge";
import { ListPagination } from "@/components/ui/list-pagination";
import { useEpreuvesData } from "@/lib/hooks/useEpreuvesData";
import { usePagination } from "@/lib/hooks/usePagination";
import { GRID_PAGE_SIZE } from "@/lib/pagination";

export default function EpreuvesPageContent() {
  const { loading, filteredEpreuves, filters, applyFilters } =
    useEpreuvesData();
  const {
    paginatedItems,
    totalItems,
    totalPages,
    page,
    rangeStart,
    rangeEnd,
    setPage,
    resetPage,
  } = usePagination(filteredEpreuves, GRID_PAGE_SIZE);

  const handleFilterChange = (values: Record<string, string>) => {
    applyFilters(values);
    resetPage();
  };

  return (
    <div className="bg-gray-50 py-16 min-h-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            Banque d&apos;Épreuves
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Accédez à toutes les épreuves des sessions précédentes pour préparer
            vos examens.
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <Loader message="Chargement des épreuves..." />
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-500">
                {totalItems} document
                {totalItems > 1 ? "s" : ""} trouvé
                {totalItems > 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((epreuve) => (
                <div
                  key={epreuve.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col group"
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#0077d2] transition-colors duration-200">
                      <FileText className="h-6 w-6 text-[#0077d2] group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-lg font-bold text-[#0f172a] line-clamp-2">
                          {epreuve.titre}
                        </h3>
                        <VerifiedBadge />
                      </div>
                      <Badge
                        variant="info-subtle"
                        className="text-xs font-medium"
                      >
                        {epreuve.session || "Épreuve"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium text-gray-400">
                        Filière :
                      </span>
                      <span className="font-medium text-gray-900">
                        {epreuve.filiere}
                      </span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <span className="w-20 font-medium text-gray-400 shrink-0">
                        UE :
                      </span>
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {epreuve.ue}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium text-gray-400">
                        Année :
                      </span>
                      <span className="font-medium text-gray-900">
                        {epreuve.annee}
                      </span>
                    </div>
                  </div>

                  <DocumentPreviewActions
                    filePath={epreuve.file_path}
                    downloadFileName={epreuve.original_file_name}
                    accent="blue"
                  />
                </div>
              ))}
            </div>

            <ListPagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onPageChange={setPage}
              className="mt-6 rounded-xl border border-gray-100 bg-white"
            />

            {totalItems === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Aucune épreuve trouvée
                </h3>
                <p className="text-gray-500">
                  Essayez de modifier vos filtres de recherche
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
