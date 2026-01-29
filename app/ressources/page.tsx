"use client";

import { useState } from "react";
import { Download, FileText, BookOpen, GraduationCap } from "lucide-react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import FilterBar from "../components/FilterBar";

const mockRessources = [
  {
    id: 1,
    titre: "Cours de Programmation Orientée Objet",
    type: "Cours",
    filiere: "Informatique",
    annee: "2023",
    description: "Support de cours complet sur la POO en Java",
  },
  {
    id: 2,
    titre: "TD de Bases de Données",
    type: "TD",
    filiere: "Informatique",
    annee: "2023",
    description: "Exercices pratiques sur SQL et modélisation",
  },
  {
    id: 3,
    titre: "Mémoire: Intelligence Artificielle",
    type: "Mémoire",
    filiere: "Informatique",
    annee: "2022",
    description: "Application du Machine Learning dans le diagnostic médical",
  },
  {
    id: 4,
    titre: "Cours de Réseaux TCP/IP",
    type: "Cours",
    filiere: "Télécom",
    annee: "2023",
    description: "Introduction aux protocoles de communication",
  },
  {
    id: 5,
    titre: "TD d'Analyse Numérique",
    type: "TD",
    filiere: "Mathématiques",
    annee: "2023",
    description: "Exercices sur les méthodes numériques",
  },
  {
    id: 6,
    titre: "Support: Git et GitHub",
    type: "Support",
    filiere: "Informatique",
    annee: "2023",
    description: "Guide pratique pour la gestion de versions",
  },
];

const typeIcons = {
  Cours: BookOpen,
  TD: FileText,
  Mémoire: GraduationCap,
  Support: FileText,
};

export default function RessourcesPage() {
  const [filteredRessources, setFilteredRessources] = useState(mockRessources);

  const handleFilterChange = (filters: Record<string, string>) => {
    let filtered = [...mockRessources];

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

  const filters = [
    {
      label: "Type",
      name: "type",
      options: ["Cours", "TD", "Mémoire", "Support"],
    },
    {
      label: "Filière",
      name: "filiere",
      options: ["Informatique", "Télécom", "Mathématiques"],
    },
    {
      label: "Année",
      name: "annee",
      options: ["2023", "2022", "2021"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Ressources
          </h1>
          <p className="text-gray-600">
            Accédez à des cours, TD, mémoires et autres documents pédagogiques
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        <div className="mb-4 text-sm text-gray-600">
          {filteredRessources.length} ressource(s) trouvée(s)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRessources.map((ressource) => {
            const Icon = typeIcons[ressource.type as keyof typeof typeIcons];
            return (
              <Card key={ressource.id} hover className="p-6 flex flex-col">
                <div className="flex items-start mb-4">
                  <div className="bg-[#1cb427] w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {ressource.titre}
                    </h3>
                    <Badge variant="info" className="text-xs">
                      {ressource.type}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  {ressource.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Filière:</span>
                    <span className="ml-2">{ressource.filiere}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Année:</span>
                    <span className="ml-2">{ressource.annee}</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center px-4 py-2 bg-[#1cb427] text-white rounded-lg hover:bg-[#18991f] transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </button>
              </Card>
            );
          })}
        </div>

        {filteredRessources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune ressource trouvée avec ces critères
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
