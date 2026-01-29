"use client";

import { useState } from "react";
import { Download, Calendar, BookOpen } from "lucide-react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import FilterBar from "../components/FilterBar";

const mockEpreuves = [
  {
    id: 1,
    titre: "Épreuve de Mathématiques",
    filiere: "Informatique",
    ue: "Mathématiques Appliquées",
    annee: "2023",
    session: "Normale",
    statut: "Validé",
    date: "2023-06-15",
  },
  {
    id: 2,
    titre: "Épreuve de Bases de Données",
    filiere: "Informatique",
    ue: "Bases de Données",
    annee: "2023",
    session: "Rattrapage",
    statut: "Validé",
    date: "2023-09-10",
  },
  {
    id: 3,
    titre: "Épreuve d'Algorithmique",
    filiere: "Informatique",
    ue: "Algorithmique Avancée",
    annee: "2022",
    session: "Normale",
    statut: "Validé",
    date: "2022-06-20",
  },
  {
    id: 4,
    titre: "Épreuve de Réseaux",
    filiere: "Télécom",
    ue: "Réseaux et Télécommunications",
    annee: "2023",
    session: "Normale",
    statut: "En attente",
    date: "2023-06-18",
  },
  {
    id: 5,
    titre: "Épreuve d'Analyse",
    filiere: "Mathématiques",
    ue: "Analyse Numérique",
    annee: "2023",
    session: "Reprise",
    statut: "Validé",
    date: "2023-09-05",
  },
  {
    id: 6,
    titre: "Épreuve de Programmation Web",
    filiere: "Informatique",
    ue: "Développement Web",
    annee: "2023",
    session: "Normale",
    statut: "Validé",
    date: "2023-06-22",
  },
];

export default function EpreuvesPage() {
  const [filteredEpreuves, setFilteredEpreuves] = useState(mockEpreuves);

  const handleFilterChange = (filters: Record<string, string>) => {
    let filtered = [...mockEpreuves];

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

  const filters = [
    {
      label: "Filière",
      name: "filiere",
      options: ["Informatique", "Télécom", "Mathématiques"],
    },
    {
      label: "UE",
      name: "ue",
      options: [
        "Mathématiques Appliquées",
        "Bases de Données",
        "Algorithmique Avancée",
        "Réseaux et Télécommunications",
        "Analyse Numérique",
        "Développement Web",
      ],
    },
    {
      label: "Année",
      name: "annee",
      options: ["2023", "2022", "2021"],
    },
    {
      label: "Session",
      name: "session",
      options: ["Normale", "Rattrapage", "Reprise"],
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
      </div>
    </div>
  );
}
