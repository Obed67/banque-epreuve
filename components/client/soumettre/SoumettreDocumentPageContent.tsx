"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  buildStorageObjectKey,
  getDocumentTitleFromFile,
  getOriginalFileName,
} from "../../../lib/fileUpload";
import { getSubmissionFieldErrors } from "../../../lib/submissionValidation";
import { notifyAdminOfSubmission } from "../../../lib/notifySubmission";
import { trackSubmission } from "../../../lib/analytics";
import { useSubmissionOptions } from "../../../lib/hooks/useSubmissionOptions";
import SubmissionForm from "./SubmissionForm";
import SubmissionInfoCard from "./SubmissionInfoCard";
import SubmissionSuccessDialog from "./SubmissionSuccessDialog";
import type {
  SubmissionFieldKey,
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
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<SubmissionFieldKey, boolean>>
  >({});
  const [formKey, setFormKey] = useState(0);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setFile(null);
    setFieldErrors({});
    setErrorMessage("");
    setStatus("idle");
    setFormKey((current) => current + 1);
  };

  const clearFieldError = (field: SubmissionFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    clearFieldError(e.target.name as SubmissionFieldKey);
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleFileSelect = (selected: File) => {
    const extension = selected.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx"];

    if (!extension || !allowedExtensions.includes(extension)) {
      setStatus("error");
      setErrorMessage("Format non accepté. Utilisez PDF, DOC ou DOCX.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("Le fichier dépasse la taille maximale de 10 Mo.");
      return;
    }

    setStatus("idle");
    setErrorMessage("");
    setFile(selected);
    clearFieldError("file");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  };

  const onSelectChange = (field: keyof SubmissionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field as SubmissionFieldKey);
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
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

    const validationErrors = getSubmissionFieldErrors(formData, file);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setStatus("error");
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setFieldErrors({});
    setStatus("uploading");
    setErrorMessage("");

    if (!file) return;

    try {
      const originalFileName = getOriginalFileName(file);
      const titre = getDocumentTitleFromFile(file);
      const storageKey = buildStorageObjectKey(file);

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storageKey, file, {
          upsert: false,
          contentType: file.type,
          metadata: { originalFileName },
        });
      if (uploadError) {
        if (
          uploadError.message?.toLowerCase().includes("already exists") ||
          uploadError.message?.toLowerCase().includes("duplicate")
        ) {
          throw new Error(
            "Un fichier avec ce nom existe déjà. Renommez votre fichier et réessayez.",
          );
        }
        if (uploadError.message?.toLowerCase().includes("invalid key")) {
          throw new Error(
            "Impossible d'enregistrer ce fichier. Réessayez ou contactez l'administrateur.",
          );
        }
        throw uploadError;
      }

      const { data: insertedDocument, error: dbError } = await supabase
        .from("epreuves")
        .insert([
          {
            titre,
            filiere: resolvedFiliere,
            ue: resolvedUe,
            annee: resolvedAnnee,
            session: formData.session || null,
            type: resolvedType,
            file_path: storageKey,
            original_file_name: originalFileName,
            soumis_par: "Anonyme",
            statut: "En attente",
          },
        ])
        .select("id")
        .single();
      if (dbError) throw dbError;

      if (insertedDocument?.id) {
        trackSubmission(insertedDocument.id);
      }

      void notifyAdminOfSubmission({
        documentId: insertedDocument?.id,
        titre,
        type: resolvedType,
        filiere: resolvedFiliere,
        ue: resolvedUe,
        annee: resolvedAnnee,
        session: formData.session || null,
        fileName: originalFileName,
      });

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
        titre,
        typeDocument: resolvedType,
        filiere: resolvedFiliere,
      });
      setSuccessPopupOpen(true);
      resetForm();
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
            key={formKey}
            formData={formData}
            options={options}
            file={file}
            status={status}
            errorMessage={errorMessage}
            onInputChange={onInputChange}
            onFileChange={onFileChange}
            onFileSelect={handleFileSelect}
            onSelectChange={onSelectChange}
            onSubmit={onSubmit}
            disabled={!isReady || optionsLoading}
            globalError={!isReady ? optionsError : ""}
            fieldErrors={fieldErrors}
          />
          <div className="space-y-6">
            <SubmissionInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
