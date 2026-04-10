"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { supabase } from "../../lib/supabaseClient";

export default function SoumettreDocumentPage() {
  const [formData, setFormData] = useState({
    typeDocument: "",
    filiere: "",
    ue: "",
    annee: "",
    session: "",
    titre: "",
  });

  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Veuillez sélectionner un fichier.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      // 1. Upload File
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert Record
      const { error: dbError } = await supabase
        .from('epreuves')
        .insert([
          {
            titre: formData.titre,
            filiere: formData.filiere,
            ue: formData.ue,
            annee: formData.annee,
            session: formData.session || null,
            type: formData.typeDocument,
            file_path: filePath,
            soumis_par: 'Anonyme',
            statut: 'En attente',
          }
        ]);

      if (dbError) throw dbError;

      setStatus("success");
      setFormData({
        typeDocument: "",
        filiere: "",
        ue: "",
        annee: "",
        session: "",
        titre: "",
      });
      setFile(null);

    } catch (error: any) {
      console.error("Error submitting:", error);
      setStatus("error");
      setErrorMessage(error.message || "Une erreur est survenue lors de l'envoi.");
    }
  };

  if (status === "success") {
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
          <Card className="p-6 md:p-8 lg:col-span-2 shadow-md">
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
                  required
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
                    disabled={status === "uploading"}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, DOC, DOCX (Max 10MB)
                  </p>
                  {file && (
                    <p className="text-sm text-[#1cb427] mt-2 font-medium">
                      Fichier sélectionné: {file.name}
                    </p>
                  )}
                </div>
              </div>

              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Tous les documents soumis seront vérifiés
                  par l'administration avant d'être publiés. Assurez-vous que
                  votre document respecte les directives de la plateforme.
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="w-full text-white bg-[#0077d2] hover:bg-[#0062b0]" disabled={status === "uploading"}>
                  {status === "uploading" ? "Envoi en cours..." : "Soumettre le document"}
                </Button>
              </div>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-0 overflow-hidden border-0 shadow-lg ring-1 ring-black/5">
              {/* Header Unified */}
              <div className="bg-[#0077d2] p-6 text-white text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm text-2xl mb-3">
                  📝
                </div>
                <h3 className="text-xl font-bold">Informations Clés</h3>
                <p className="text-blue-100 text-sm mt-1">Guide pour une soumission réussie</p>
              </div>

              {/* Content Sections */}
              <div className="divide-y divide-gray-100">

                {/* Section Impact */}
                <div className="p-6 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-4">
                    <h4 className="font-bold text-gray-800">Impact de la contribution</h4>
                  </div>
                  <div className="space-y-3 pl-11">
                    <div className="flex items-start text-sm text-gray-600">
                      <span className="text-purple-600 mr-2 font-bold">•</span>
                      <span>Aide pour <strong className="text-gray-900">500+ étudiants</strong></span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <span className="text-purple-600 mr-2 font-bold">•</span>
                      <span>Succès académique commun</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <span className="text-purple-600 mr-2 font-bold">•</span>
                      <span>Partage de connaissances</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Directives */}
              <div className="p-6 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-4">
                  <h4 className="font-bold text-gray-800">Directives à suivre</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-600 pl-11">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Document lisible & net</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Contenu exact & complet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Nom de fichier descriptif</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Format PDF</span>
                  </li>
                  <li className="flex items-start text-orange-600">
                    <span className="mr-2">✗</span>
                    <span>Rejet si non conforme</span>
                  </li>
                </ul>
              </div>

              {/* Section Processus */}
              <div className="p-6 bg-blue-50/50">
                <div className="flex items-center mb-4">
                  <h4 className="font-bold text-gray-800">Validation</h4>
                </div>
                <div className="flex items-center justify-between relative px-2">

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0077d2] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm">
                      1
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 mt-1 uppercase tracking-tight">Envoi</span>
                  </div>

                  {/* Connector 1-2 */}
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2 relative top-[-10px]"></div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0077d2] text-[#0077d2] flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm">
                      2
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 mt-1 uppercase tracking-tight">Verif</span>
                  </div>

                  {/* Connector 2-3 */}
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2 relative top-[-10px]"></div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1cb427] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm">
                      3
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 mt-1 uppercase tracking-tight">Publié</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
