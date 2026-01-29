"use client";

import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function SoumettreDocumentPage() {
  const [formData, setFormData] = useState({
    typeDocument: "",
    filiere: "",
    ue: "",
    annee: "",
    session: "",
    titre: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        typeDocument: "",
        filiere: "",
        ue: "",
        annee: "",
        session: "",
        titre: "",
      });
      setSelectedFile(null);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#1cb427] w-16 h-16 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Document soumis avec succès !
          </h2>
          <p className="text-gray-600 mb-4">
            Votre document a été envoyé et sera examiné par l'administration.
            Vous recevrez une notification une fois validé.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              <strong>Titre:</strong> {formData.titre}
            </p>
            <p className="text-sm text-green-800">
              <strong>Type:</strong> {formData.typeDocument}
            </p>
            <p className="text-sm text-green-800">
              <strong>Filière:</strong> {formData.filiere}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Soumettre un document
          </h1>
          <p className="text-gray-600">
            Partagez vos épreuves et ressources avec la communauté
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 md:p-8 lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="typeDocument"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type de document *
              </label>
              <select
                id="typeDocument"
                name="typeDocument"
                value={formData.typeDocument}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent"
              >
                <option value="">Sélectionner un type</option>
                <option value="Épreuve">Épreuve</option>
                <option value="Cours">Cours</option>
                <option value="TD">TD</option>
                <option value="Mémoire">Mémoire</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="titre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Titre du document *
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                placeholder="Ex: Épreuve de Mathématiques"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="filiere"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Filière *
                </label>
                <select
                  id="filiere"
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Télécom">Télécom</option>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Physique">Physique</option>
                  <option value="Chimie">Chimie</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="annee"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Année *
                </label>
                <select
                  id="annee"
                  name="annee"
                  value={formData.annee}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="ue"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                UE (Unité d'Enseignement)
              </label>
              <input
                type="text"
                id="ue"
                name="ue"
                value={formData.ue}
                onChange={handleChange}
                placeholder="Ex: Bases de Données"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent"
              />
            </div>

            {formData.typeDocument === "Épreuve" && (
              <div>
                <label
                  htmlFor="session"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Session
                </label>
                <select
                  id="session"
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="Normale">Normale</option>
                  <option value="Rattrapage">Rattrapage</option>
                  <option value="Reprise">Reprise</option>
                </select>
              </div>
            )}

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fichier *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0077d2] transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <label
                  htmlFor="file"
                  className="cursor-pointer text-[#0077d2] font-medium hover:underline"
                >
                  Cliquer pour choisir un fichier
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <p className="text-sm text-gray-500 mt-2">
                  PDF, DOC, DOCX (Max 10MB)
                </p>
                {selectedFile && (
                  <p className="text-sm text-[#1cb427] mt-2 font-medium">
                    Fichier sélectionné: {selectedFile}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Tous les documents soumis seront vérifiés
                par l'administration avant d'être publiés. Assurez-vous que
                votre document respecte les directives de la plateforme.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="w-full text-white">
                Soumettre le document
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0077d2] text-white text-2xl mb-2">
                ℹ️
              </div>
              <h3 className="text-base font-semibold text-[#0077d2] mb-3">
                Processus de validation
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0077d2] text-white flex items-center justify-center mr-3 font-bold text-xs">1</span>
                <span>Soumission du document</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0077d2] text-white flex items-center justify-center mr-3 font-bold text-xs">2</span>
                <span>Vérification par l'équipe</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1cb427] text-white flex items-center justify-center mr-3 font-bold text-xs">3</span>
                <span>Publication (24-48h)</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1cb427] text-white text-2xl mb-2">
                ✓
              </div>
              <h3 className="text-base font-semibold text-[#1cb427] mb-3">
                Formats acceptés
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span className="font-medium">📄 PDF</span>
                <span className="text-xs bg-green-200 px-2 py-1 rounded">Recommandé</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span className="font-medium">📝 DOC/DOCX</span>
                <span className="text-xs bg-green-200 px-2 py-1 rounded">Accepté</span>
              </div>
              <div className="border-t border-green-200 pt-3 mt-3">
                <p className="text-xs text-gray-600 text-center">
                  Taille maximale: <strong>10 MB</strong>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white text-2xl mb-2">
                🎯
              </div>
              <h3 className="text-base font-semibold text-purple-600 mb-3">
                Impact de votre contribution
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start text-sm text-gray-700">
                <span className="text-purple-600 mr-2">👥</span>
                <span>500+ étudiants bénéficieront de votre document</span>
              </div>
              <div className="flex items-start text-sm text-gray-700">
                <span className="text-purple-600 mr-2">🏆</span>
                <span>Contribuez au succès académique</span>
              </div>
              <div className="flex items-start text-sm text-gray-700">
                <span className="text-purple-600 mr-2">💡</span>
                <span>Partagez vos connaissances</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-orange-50 border-orange-200">
            <h3 className="text-base font-semibold text-orange-600 mb-4">
              📋 Directives importantes
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-[#1cb427] mr-2 font-bold flex-shrink-0">✓</span>
                <span>Document lisible et de bonne qualité</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1cb427] mr-2 font-bold flex-shrink-0">✓</span>
                <span>Informations exactes et complètes</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1cb427] mr-2 font-bold flex-shrink-0">✓</span>
                <span>Pas de contenu confidentiel</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1cb427] mr-2 font-bold flex-shrink-0">✓</span>
                <span>Nom du fichier descriptif</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1cb427] mr-2 font-bold flex-shrink-0">✓</span>
                <span>Respecter les droits d'auteur</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-orange-200">
              <p className="text-xs text-gray-600">
                ⚠️ Les documents non conformes seront rejetés
              </p>
            </div>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}
