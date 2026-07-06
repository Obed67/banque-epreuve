"use client";

import { BookOpen, FileText } from "lucide-react";
import FilterBar from "@/app/components/FilterBar";
import CatalogSearchBar from "@/app/components/CatalogSearchBar";
import Loader from "@/app/components/Loader";
import CatalogDocumentCard from "@/components/client/catalog/CatalogDocumentCard";
import { ListPagination } from "@/components/ui/list-pagination";
import { useEpreuvesData } from "@/lib/hooks/useEpreuvesData";

export default function EpreuvesPageContent() {
  const {
    loading,
    filteredEpreuves,
    filters,
    applyFilters,
    searchInput,
    setSearchInput,
    page,
    setPage,
    totalCount,
    totalPages,
    rangeStart,
    rangeEnd,
  } = useEpreuvesData();

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

        <CatalogSearchBar
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Rechercher une épreuve (titre, UE, filière…)"
        />

        <FilterBar filters={filters} onFilterChange={applyFilters} />

        {loading ? (
          <Loader message="Chargement des épreuves..." />
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-500">
                {totalCount} document
                {totalCount > 1 ? "s" : ""} trouvé
                {totalCount > 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredEpreuves.map((epreuve) => (
                <CatalogDocumentCard
                  key={epreuve.id}
                  documentId={epreuve.id}
                  titre={epreuve.titre}
                  badgeLabel={epreuve.session || epreuve.type || "Épreuve"}
                  meta={[
                    { label: "Établissement", value: epreuve.etablissement },
                    { label: "Filière", value: epreuve.filiere },
                    { label: "UE", value: epreuve.ue },
                    { label: "Année", value: epreuve.annee },
                    { label: "Niveau", value: epreuve.niveau },
                  ]}
                  filePath={epreuve.file_path}
                  downloadFileName={epreuve.original_file_name}
                  accent="blue"
                  icon={FileText}
                />
              ))}
            </div>

            <ListPagination
              page={page}
              totalPages={totalPages}
              totalItems={totalCount}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onPageChange={setPage}
              className="mt-6 rounded-xl border border-gray-100 bg-white"
            />

            {totalCount === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Aucune épreuve trouvée
                </h3>
                <p className="text-gray-500">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
