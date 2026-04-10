"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useSubmissionOptions } from "../../../lib/hooks/useSubmissionOptions";
import SubmissionForm from "./SubmissionForm";
import SubmissionInfoCard from "./SubmissionInfoCard";
import SubmissionSuccessDialog from "./SubmissionSuccessDialog";
import type {
  SubmissionFormData,
  SubmittedInfo,
  SubmissionStatus,
} from "./types";

const INITIAL_FORM: SubmissionFormData = {
  typeDocument: "",
  customTypeDocument: "",
  filiere: "",
  customFiliere: "",
  ue: "",
  customUe: "",
  annee: "",
  customAnnee: "",
  session: "",
  titre: "",
};

export default function SoumettreDocumentPageContent() {
  const {
    options,
    ensureCustomValue,
    loading: optionsLoading,
    isReady,
    error: optionsError,
  } = useSubmissionOptions();
  const [formData, setFormData] = useState<SubmissionFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState<SubmittedInfo | null>(
    null,
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const onSelectChange = (field: keyof SubmissionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedType =
      formData.typeDocument === "Autre (à préciser)"
        ? formData.customTypeDocument.trim()
        : formData.typeDocument;
    const resolvedFiliere =
      formData.filiere === "Autre (à préciser)"
        ? formData.customFiliere.trim()
        : formData.filiere;
    const resolvedUe =
      formData.ue === "Autre (à préciser)"
        ? formData.customUe.trim()
        : formData.ue;
    const resolvedAnnee =
      formData.annee === "Autre (à préciser)"
        ? formData.customAnnee.trim()
        : formData.annee;

    if (
      !resolvedType ||
      !formData.titre.trim() ||
      !resolvedFiliere ||
      !resolvedAnnee ||
      !resolvedUe
    ) {
      setStatus("error");
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!file) {
      setStatus("error");
      setErrorMessage("Veuillez Sélectionner un fichier.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("epreuves").insert([
        {
          titre: formData.titre,
          filiere: resolvedFiliere,
          ue: resolvedUe,
          annee: resolvedAnnee,
          session: formData.session || null,
          type: resolvedType,
          file_path: fileName,
          soumis_par: "Anonyme",
          statut: "En attente",
        },
      ]);
      if (dbError) throw dbError;

      // Try to enrich reference tables with user-added values (if policies allow).
      if (formData.typeDocument === "Autre (à préciser)") {
        await ensureCustomValue("document_types", resolvedType);
      }
      if (formData.filiere === "Autre (à préciser)") {
        await ensureCustomValue("filieres", resolvedFiliere);
      }
      if (formData.ue === "Autre (à préciser)") {
        await ensureCustomValue("ues", resolvedUe);
      }
      if (formData.annee === "Autre (à préciser)") {
        await ensureCustomValue("annees", resolvedAnnee);
      }

      setSubmittedInfo({
        titre: formData.titre,
        typeDocument: resolvedType,
        filiere: resolvedFiliere,
      });
      setSuccessPopupOpen(true);
      setStatus("idle");
      setFormData(INITIAL_FORM);
      setFile(null);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error.message || "Une erreur est survenue lors de l'envoi.",
      );
    }
  };

  return (
    <div className="py-8">
      <SubmissionSuccessDialog
        open={successPopupOpen}
        onOpenChange={setSuccessPopupOpen}
        submittedInfo={submittedInfo}
      />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Soumettre un document
          </h1>
          <p className="text-gray-600">
            Partagez vos epreuves et ressources avec la communaute
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <SubmissionForm
            formData={formData}
            options={options}
            file={file}
            status={status}
            errorMessage={errorMessage}
            onInputChange={onInputChange}
            onFileChange={onFileChange}
            onSelectChange={onSelectChange}
            onSubmit={onSubmit}
            disabled={!isReady || optionsLoading}
            globalError={!isReady ? optionsError : ""}
          />
          <div className="space-y-6">
            <SubmissionInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
