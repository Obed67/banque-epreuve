"use client";

import { FileText, BookOpen, GraduationCap } from "lucide-react";
import Badge from "@/app/components/Badge";
import DocumentPreviewActions from "@/app/components/DocumentPreviewActions";
import FilterBar from "@/app/components/FilterBar";
import Loader from "@/app/components/Loader";
import { useRessourcesData } from "@/lib/hooks/useRessourcesData";

const typeIcons = {
  Cours: BookOpen,
  TD: FileText,
  Mémoire: GraduationCap,
  Support: FileText,
};

export default function RessourcesPageContent() {
  const { loading, filteredRessources, filters, applyFilters } =
    useRessourcesData();

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
                {filteredRessources.length} ressource
                {filteredRessources.length > 1 ? "s" : ""} trouvée
                {filteredRessources.length > 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRessources.map((ressource) => {
                const Icon =
                  typeIcons[ressource.type as keyof typeof typeIcons];
                return (
                  <div
                    key={ressource.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col group"
                  >
                    <div className="flex items-start mb-4">
                      <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#1cb427] transition-colors duration-200">
                        <Icon className="h-6 w-6 text-[#1cb427] group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0f172a] mb-1 line-clamp-2">
                          {ressource.titre}
                        </h3>
                        <Badge
                          variant="info-subtle"
                          className="text-xs font-medium"
                        >
                          {ressource.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 pt-4 border-t border-gray-50">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-20 font-medium text-gray-400">
                          Filière :
                        </span>
                        <span className="font-medium text-gray-900">
                          {ressource.filiere}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-20 font-medium text-gray-400">
                          Année :
                        </span>
                        <span className="font-medium text-gray-900">
                          {ressource.annee}
                        </span>
                      </div>
                    </div>

                    <DocumentPreviewActions
                      filePath={ressource.file_path}
                      accent="green"
                    />
                  </div>
                );
              })}
            </div>

            {filteredRessources.length === 0 && (
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
