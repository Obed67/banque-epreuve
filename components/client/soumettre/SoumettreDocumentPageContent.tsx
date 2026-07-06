"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  buildStorageObjectKey,
  formatFileSize,
  getDocumentTitleFromFile,
  getOriginalFileName,
  MAX_SUBMISSION_FILE_SIZE_BYTES,
  MAX_SUBMISSION_FILE_SIZE_MB,
  uploadSubmissionFile,
} from "../../../lib/fileUpload";
import { getSubmissionFieldErrors } from "../../../lib/submissionValidation";
import { notifyAdminOfSubmission } from "../../../lib/notifySubmission";
import { trackSubmission } from "../../../lib/analytics";
import { checkDocumentDuplicate } from "@/lib/checkDocumentDuplicate";
import {
  computeContentHash,
  computeDocumentFingerprint,
} from "@/lib/documentFingerprint";
import type { ReferentielDocumentField } from "../../../lib/referenceLabels";
import { suggestReferentielValuesFromClient } from "../../../lib/suggestReferentielClient";
import { useSubmissionOptions } from "../../../lib/hooks/useSubmissionOptions";
import SubmissionForm from "./SubmissionForm";
import SubmissionInfoCard from "./SubmissionInfoCard";
import SubmissionSuccessDialog from "./SubmissionSuccessDialog";
import SubmissionDuplicateAlertDialog from "./SubmissionDuplicateAlertDialog";
import type {
  SubmissionFieldKey,
  SubmissionFormData,
  SubmissionDuplicateInfo,
  SubmittedInfo,
  SubmissionStatus,
  SubmissionUploadProgress,
} from "./types";

const INITIAL_FORM: SubmissionFormData = {
  typeDocument: "",
  customTypeDocument: "",
  etablissement: "",
  customEtablissement: "",
  filiere: "",
  customFiliere: "",
  ue: "",
  customUe: "",
  annee: "",
  customAnnee: "",
  niveau: "",
  customNiveau: "",
  session: "",
  wantsFollowUp: false,
  contributorName: "",
  contributorEmail: "",
};

export default function SoumettreDocumentPageContent() {
  const {
    options,
    loading: optionsLoading,
    isReady,
    error: optionsError,
    reloadOptions,
  } = useSubmissionOptions();
  const [formData, setFormData] = useState<SubmissionFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [uploadProgress, setUploadProgress] =
    useState<SubmissionUploadProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [duplicateAlertOpen, setDuplicateAlertOpen] = useState(false);
  const [duplicateAlertInfo, setDuplicateAlertInfo] =
    useState<SubmissionDuplicateInfo | null>(null);
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
    setUploadProgress(null);
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

    if (selected.size > MAX_SUBMISSION_FILE_SIZE_BYTES) {
      setStatus("error");
      setErrorMessage(
        `Le fichier dépasse la taille maximale de ${MAX_SUBMISSION_FILE_SIZE_MB} Mo.`,
      );
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

  const onCheckboxChange = (
    field: keyof SubmissionFormData,
    value: boolean,
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "wantsFollowUp" && !value) {
        next.contributorName = "";
        next.contributorEmail = "";
      }
      return next;
    });
    if (field === "wantsFollowUp" && !value) {
      clearFieldError("contributorEmail");
    }
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
    const resolvedEtablissement =
      formData.etablissement === "Autre (à préciser)"
        ? formData.customEtablissement.trim()
        : formData.etablissement;
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
    const resolvedNiveau =
      formData.niveau === "Autre (à préciser)"
        ? formData.customNiveau.trim()
        : formData.niveau;

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
    setUploadProgress({ percent: 2, label: "Préparation du fichier…" });

    if (!file) return;

    try {
      const originalFileName = getOriginalFileName(file);
      const titre = getDocumentTitleFromFile(file);
      const storageKey = buildStorageObjectKey(file);

      setUploadProgress({ percent: 5, label: "Analyse du fichier…" });

      const [contentHash, fingerprint] = await Promise.all([
        computeContentHash(file),
        computeDocumentFingerprint({
          type: resolvedType,
          etablissement: resolvedEtablissement,
          filiere: resolvedFiliere,
          ue: resolvedUe,
          annee: resolvedAnnee,
          niveau: resolvedNiveau,
          session: formData.session || null,
        }),
      ]);

      setUploadProgress({ percent: 12, label: "Vérification des doublons…" });

      const duplicateCheck = await checkDocumentDuplicate(
        contentHash,
        fingerprint,
      );

      await uploadSubmissionFile(file, storageKey, {
        originalFileName,
        onProgress: (loaded, total) => {
          const ratio = total > 0 ? loaded / total : 0;
          const percent = 15 + Math.round(ratio * 75);
          const label =
            total > 0
              ? `Envoi du fichier… (${formatFileSize(loaded)} / ${formatFileSize(total)})`
              : "Envoi du fichier…";
          setUploadProgress({ percent, label });
        },
      });

      setUploadProgress({ percent: 92, label: "Enregistrement en base…" });

      const trimmedContributorName = formData.contributorName.trim();
      const trimmedContributorEmail = formData.contributorEmail.trim();
      const displayName =
        formData.wantsFollowUp && trimmedContributorName
          ? trimmedContributorName
          : "Anonyme";

      const { data: insertedDocument, error: dbError } = await supabase
        .from("epreuves")
        .insert([
          {
            titre,
            etablissement: resolvedEtablissement,
            filiere: resolvedFiliere,
            ue: resolvedUe,
            annee: resolvedAnnee,
            niveau: resolvedNiveau,
            session: formData.session || null,
            type: resolvedType,
            file_path: storageKey,
            original_file_name: originalFileName,
            soumis_par: displayName,
            statut: "En attente",
            content_hash: contentHash,
            fingerprint,
            duplicate_of_id: duplicateCheck.existingId ?? null,
            duplicate_match_type: duplicateCheck.matchType ?? null,
          },
        ])
        .select("id")
        .single();
      if (dbError) throw dbError;

      if (insertedDocument?.id) {
        trackSubmission(insertedDocument.id);
      }

      if (
        formData.wantsFollowUp &&
        trimmedContributorEmail &&
        insertedDocument?.id
      ) {
        const { error: contactError } = await supabase
          .from("submission_contacts")
          .insert([
            {
              document_id: insertedDocument.id,
              contributor_name: trimmedContributorName || null,
              contributor_email: trimmedContributorEmail,
              notify_contributor: true,
            },
          ]);
        if (contactError) {
          console.warn(
            "[submission] impossible d'enregistrer le contact",
            contactError,
          );
        }
      }

      setSubmittedInfo({
        titre,
        typeDocument: resolvedType,
        etablissement: resolvedEtablissement,
        filiere: resolvedFiliere,
        annee: resolvedAnnee,
        niveau: resolvedNiveau,
      });
      resetForm();

      if (duplicateCheck.isDuplicate && duplicateCheck.matchType) {
        setDuplicateAlertInfo({
          matchType: duplicateCheck.matchType,
          existingTitre: duplicateCheck.existingTitre,
        });
        setDuplicateAlertOpen(true);
      } else {
        setSuccessPopupOpen(true);
      }

      void notifyAdminOfSubmission({
        documentId: insertedDocument?.id,
        titre,
        type: resolvedType,
        etablissement: resolvedEtablissement,
        filiere: resolvedFiliere,
        ue: resolvedUe,
        annee: resolvedAnnee,
        niveau: resolvedNiveau,
        session: formData.session || null,
        fileName: originalFileName,
      });

      const customReferentielValues: {
        field: ReferentielDocumentField;
        label: string;
      }[] = [];

      if (formData.typeDocument === "Autre (à préciser)") {
        customReferentielValues.push({ field: "type", label: resolvedType });
      }
      if (formData.etablissement === "Autre (à préciser)") {
        customReferentielValues.push({
          field: "etablissement",
          label: resolvedEtablissement,
        });
      }
      if (formData.filiere === "Autre (à préciser)") {
        customReferentielValues.push({ field: "filiere", label: resolvedFiliere });
      }
      if (formData.ue === "Autre (à préciser)") {
        customReferentielValues.push({ field: "ue", label: resolvedUe });
      }
      if (formData.annee === "Autre (à préciser)") {
        customReferentielValues.push({ field: "annee", label: resolvedAnnee });
      }
      if (formData.niveau === "Autre (à préciser)") {
        customReferentielValues.push({ field: "niveau", label: resolvedNiveau });
      }

      if (insertedDocument?.id && customReferentielValues.length > 0) {
        void suggestReferentielValuesFromClient({
          documentId: insertedDocument.id,
          values: customReferentielValues,
        }).then(() => reloadOptions());
      }

      setUploadProgress(null);
    } catch (error: any) {
      setUploadProgress(null);
      setStatus("error");
      setErrorMessage(
        error.message || "Une erreur est survenue lors de l'envoi.",
      );
    }
  };

  return (
    <div className="py-8">
      <SubmissionDuplicateAlertDialog
        open={duplicateAlertOpen}
        onOpenChange={setDuplicateAlertOpen}
        duplicateInfo={duplicateAlertInfo}
      />
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-start">
          <SubmissionForm
            key={formKey}
            formData={formData}
            options={options}
            file={file}
            status={status}
            uploadProgress={uploadProgress}
            errorMessage={errorMessage}
            onInputChange={onInputChange}
            onFileChange={onFileChange}
            onFileSelect={handleFileSelect}
            onSelectChange={onSelectChange}
            onCheckboxChange={onCheckboxChange}
            onSubmit={onSubmit}
            disabled={!isReady || optionsLoading}
            globalError={!isReady ? optionsError : ""}
            fieldErrors={fieldErrors}
          />
          <div className="space-y-6 xl:sticky xl:top-24">
            <SubmissionInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
