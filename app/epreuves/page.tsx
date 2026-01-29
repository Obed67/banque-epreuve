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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Épreuves
          </h1>
          <p className="text-gray-600">
            Consultez et téléchargez les épreuves passées
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        <div className="mb-4 text-sm text-gray-600">
          {filteredEpreuves.length} épreuve(s) trouvée(s)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEpreuves.map((epreuve) => (
            <Card key={epreuve.id} hover className="p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex-1">
                  {epreuve.titre}
                </h3>
                <Badge
                  variant={epreuve.statut === "Validé" ? "success" : "warning"}
                >
                  {epreuve.statut}
                </Badge>
              </div>

              <div className="space-y-2 mb-4 flex-grow">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 text-[#0077d2]" />
                  <span className="font-medium">Filière:</span>
                  <span className="ml-2">{epreuve.filiere}</span>
                </div>

                <div className="flex items-start text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-[#0077d2]" />
                  <div className="flex-1">
                    <span className="font-medium">UE:</span>
                    <span className="ml-2">{epreuve.ue}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-[#0077d2]" />
                  <span className="font-medium">Année:</span>
                  <span className="ml-2">{epreuve.annee}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Session:</span>
                  <span className="ml-2">{epreuve.session}</span>
                </div>
              </div>

              {epreuve.statut === "Validé" && (
                <button className="w-full flex items-center justify-center px-4 py-2 bg-[#0077d2] text-white rounded-lg hover:bg-[#0066b8] transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </button>
              )}
            </Card>
          ))}
        </div>

        {filteredEpreuves.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune épreuve trouvée avec ces critères
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
