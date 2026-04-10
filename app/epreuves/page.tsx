"use client";

import { useState, useEffect } from "react";
import { Download, Calendar, BookOpen } from "lucide-react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import FilterBar from "../components/FilterBar";
import { supabase } from "@/lib/supabaseClient";

interface Epreuve {
  id: string;
  titre: string;
  filiere: string;
  ue: string;
  annee: string;
  session: string | null;
  statut: string;
  created_at: string;
  file_path: string;
}

export default function EpreuvesPage() {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [filteredEpreuves, setFilteredEpreuves] = useState<Epreuve[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpreuves();
  }, []);

  const fetchEpreuves = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('epreuves')
      .select('*')
      .eq('statut', 'Validé')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching epreuves:', error);
    } else {
      setEpreuves(data || []);
      setFilteredEpreuves(data || []);
    }
    setLoading(false);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    let filtered = [...epreuves];

    if (filters.filiere) {
      filtered = filtered.filter((e) => e.filiere === filters.filiere);
    }
    if (filters.ue) {
      filtered = filtered.filter((e) => e.ue === filters.ue);
    }
    if (filters.annee) {
      filtered = filtered.filter((e) => e.annee === filters.annee);
    }
    if (filters.session) {
      filtered = filtered.filter((e) => e.session === filters.session);
    }

    setFilteredEpreuves(filtered);
  };

  // Extract unique values for filters
  const uniqueFilieres = Array.from(new Set(epreuves.map(e => e.filiere)));
  const uniqueUEs = Array.from(new Set(epreuves.map(e => e.ue)));
  const uniqueAnnees = Array.from(new Set(epreuves.map(e => e.annee)));
  const uniqueSessions = Array.from(new Set(epreuves.map(e => e.session).filter(Boolean) as string[]));

  const filters = [
    {
      label: "Filière",
      name: "filiere",
      options: uniqueFilieres,
    },
    {
      label: "UE",
      name: "ue",
      options: uniqueUEs,
    },
    {
      label: "Année",
      name: "annee",
      options: uniqueAnnees,
    },
    {
      label: "Session",
      name: "session",
      options: uniqueSessions,
    },
  ];


  return (
    <div className="bg-gray-50 py-16 min-h-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            Banque d'Épreuves
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Accédez à toutes les épreuves des sessions précédentes pour préparer vos examens.
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077d2] mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des épreuves...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-500">
                {filteredEpreuves.length} document{filteredEpreuves.length > 1 ? 's' : ''} trouvé{filteredEpreuves.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEpreuves.map((epreuve) => (
                <div key={epreuve.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#0077d2] transition-colors line-clamp-2">
                        {epreuve.titre}
                      </h3>
                    </div>
                    <Badge
                      variant={epreuve.statut === "Validé" ? "success" : "warning"}
                      className="shrink-0"
                    >
                      {epreuve.statut}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium text-gray-400">Filière :</span>
                      <span className="font-medium text-gray-900">{epreuve.filiere}</span>
                    </div>

                    <div className="flex items-start text-sm text-gray-600">
                      <span className="w-20 font-medium text-gray-400 shrink-0">UE :</span>
                      <span className="font-medium text-gray-900 line-clamp-1">{epreuve.ue}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium text-gray-400">Année :</span>
                      <span className="font-medium text-gray-900">{epreuve.annee}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium text-gray-400">Session :</span>
                      <span className="font-medium text-gray-900">{epreuve.session}</span>
                    </div>
                  </div>

                  {epreuve.statut === "Validé" && (
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-[#0077d2] text-white font-medium rounded-lg hover:bg-[#0062b0] transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </button>
                  )}
                </div>
              ))}
            </div>

            {filteredEpreuves.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune épreuve trouvée</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
