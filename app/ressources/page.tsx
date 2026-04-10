"use client";

import { useState, useEffect } from "react";
import { Download, FileText, BookOpen, GraduationCap } from "lucide-react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import FilterBar from "../components/FilterBar";
import { supabase } from "@/lib/supabaseClient";

interface Ressource {
  id: string;
  titre: string;
  type: string;
  filiere: string;
  annee: string;
  ue: string;
  statut: string;
  created_at: string;
  file_path: string;
}

const typeIcons = {
  Cours: BookOpen,
  TD: FileText,
  Mémoire: GraduationCap,
  Support: FileText,
};

export default function RessourcesPage() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [filteredRessources, setFilteredRessources] = useState<Ressource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRessources();
  }, []);

  const fetchRessources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('epreuves')
      .select('*')
      .eq('statut', 'Validé')
      .neq('type', 'Épreuve')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ressources:', error);
    } else {
      setRessources(data || []);
      setFilteredRessources(data || []);
    }
    setLoading(false);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    let filtered = [...ressources];

    if (filters.type) {
      filtered = filtered.filter((r) => r.type === filters.type);
    }
    if (filters.filiere) {
      filtered = filtered.filter((r) => r.filiere === filters.filiere);
    }
    if (filters.annee) {
      filtered = filtered.filter((r) => r.annee === filters.annee);
    }

    setFilteredRessources(filtered);
  };

  // Extract unique values for filters
  const uniqueTypes = Array.from(new Set(ressources.map(r => r.type).filter(Boolean)));
  const uniqueFilieres = Array.from(new Set(ressources.map(r => r.filiere)));
  const uniqueAnnees = Array.from(new Set(ressources.map(r => r.annee)));

  const filters = [
    {
      label: "Type",
      name: "type",
      options: uniqueTypes,
    },
    {
      label: "Filière",
      name: "filiere",
      options: uniqueFilieres,
    },
    {
      label: "Année",
      name: "annee",
      options: uniqueAnnees,
    },
  ];

  return (
    <div className="bg-gray-50 py-16 min-h-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            Ressources Pédagogiques
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Accédez à des cours, TD, mémoires et autres documents pédagogiques pour enrichir vos connaissances.
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1cb427] mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des ressources...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-500">
                {filteredRessources.length} ressource{filteredRessources.length > 1 ? 's' : ''} trouvée{filteredRessources.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRessources.map((ressource) => {
                const Icon = typeIcons[ressource.type as keyof typeof typeIcons];
                return (
                  <div key={ressource.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col group">
                    <div className="flex items-start mb-4">
                      <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#1cb427] transition-colors duration-200">
                        <Icon className="h-6 w-6 text-[#1cb427] group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0f172a] mb-1 line-clamp-2">
                          {ressource.titre}
                        </h3>
                        <Badge variant="info-subtle" className="text-xs font-medium">
                          {ressource.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 pt-4 border-t border-gray-50">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-20 font-medium text-gray-400">Filière :</span>
                        <span className="font-medium text-gray-900">{ressource.filiere}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-20 font-medium text-gray-400">Année :</span>
                        <span className="font-medium text-gray-900">{ressource.annee}</span>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center px-4 py-3 bg-[#1cb427] text-white font-medium rounded-lg hover:bg-[#158f1f] transition-colors shadow-sm shadow-green-900/5">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredRessources.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune ressource trouvée</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
