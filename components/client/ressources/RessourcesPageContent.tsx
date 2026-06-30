"use client";

import { FileText, BookOpen, GraduationCap, type LucideIcon } from "lucide-react";
import FilterBar from "@/app/components/FilterBar";
import Loader from "@/app/components/Loader";
import CatalogDocumentCard from "@/components/client/catalog/CatalogDocumentCard";
import { ListPagination } from "@/components/ui/list-pagination";
import { useRessourcesData } from "@/lib/hooks/useRessourcesData";

const normalizeType = (value: string) =>
  value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function getTypeIcon(type: string): LucideIcon {
  switch (normalizeType(type)) {
    case "cours":
      return BookOpen;
    case "td":
      return FileText;
    case "memoire":
      return GraduationCap;
    case "support":
      return FileText;
    default:
      return FileText;
  }
}

export default function RessourcesPageContent() {
  const {
    loading,
    filteredRessources,
    filters,
    applyFilters,
    page,
    setPage,
    totalCount,
    totalPages,
    rangeStart,
    rangeEnd,
  } = useRessourcesData();

  return (
    <div className="bg-gray-50 py-16 min-h-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            Ressources Pédagogiques
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Accédez à des cours, TD, mémoires et autres documents pédagogiques
            pour enrichir vos connaissances.
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={applyFilters} />

        {loading ? (
          <Loader message="Chargement des ressources..." color="green" />
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-500">
                {totalCount} ressource
                {totalCount > 1 ? "s" : ""} trouvée
                {totalCount > 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredRessources.map((ressource) => (
                <CatalogDocumentCard
                  key={ressource.id}
                  documentId={ressource.id}
                  titre={ressource.titre}
                  badgeLabel={ressource.type}
                  meta={[
                    { label: "Filière", value: ressource.filiere },
                    { label: "Année", value: ressource.annee },
                  ]}
                  filePath={ressource.file_path}
                  downloadFileName={ressource.original_file_name}
                  accent="green"
                  icon={getTypeIcon(ressource.type)}
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
                  Aucune ressource trouvée
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
