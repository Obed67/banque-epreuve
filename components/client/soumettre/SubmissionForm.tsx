"use client";

import { useRef, useState } from "react";
import { AlertCircle, Upload } from "lucide-react";
import Card from "../../../app/components/Card";
import Button from "../../../app/components/Button";
import { formLabelClass, formLabelErrorClass } from "@/lib/form-styles";
import { cn } from "@/lib/utils";
import { FieldInput, FieldSelect } from "./SubmissionFormFields";
import type { SubmissionFieldKey, SubmissionFormData, SubmissionStatus } from "./types";

type SubmissionFormProps = {
  formData: SubmissionFormData;
  options: {
    types: string[];
    filieres: string[];
    ues: string[];
    annees: string[];
    sessions: string[];
  };
  file: File | null;
  status: SubmissionStatus;
  errorMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect: (file: File) => void;
  onSelectChange: (field: keyof SubmissionFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  globalError?: string;
  fieldErrors?: Partial<Record<SubmissionFieldKey, boolean>>;
};

export default function SubmissionForm({
  formData,
  options,
  file,
  status,
  errorMessage,
  onInputChange,
  onFileChange,
  onFileSelect,
  onSelectChange,
  onSubmit,
  disabled = false,
  globalError = "",
  fieldErrors = {},
}: SubmissionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isUploading = status === "uploading";

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading && !disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading || disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  return (
    <Card className="p-6 shadow-md md:p-8 lg:col-span-2">
      <form onSubmit={onSubmit} className="space-y-6">
        {globalError && (
          <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mr-2 mt-0.5 h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{globalError}</p>
          </div>
        )}

        <FieldSelect
          id="typeDocument"
          label="Type de document *"
          placeholder="Sélectionner un type"
          value={formData.typeDocument}
          onValueChange={(value) => onSelectChange("typeDocument", value)}
          items={options.types}
          hasError={!!fieldErrors.typeDocument}
        />
        {formData.typeDocument === "Autre (à préciser)" && (
          <FieldInput
            id="customTypeDocument"
            label="Nouveau type de document *"
            value={formData.customTypeDocument}
            onChange={onInputChange}
            placeholder="Ex: Corrigé"
            hasError={!!fieldErrors.customTypeDocument}
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldSelect
            id="filiere"
            label="Filiere *"
            placeholder="Sélectionner"
            value={formData.filiere}
            onValueChange={(value) => onSelectChange("filiere", value)}
            items={options.filieres}
            hasError={!!fieldErrors.filiere}
          />
          {formData.filiere === "Autre (à préciser)" && (
            <FieldInput
              id="customFiliere"
              label="Nouvelle filière *"
              value={formData.customFiliere}
              onChange={onInputChange}
              placeholder="Ex: Data Science"
              hasError={!!fieldErrors.customFiliere}
            />
          )}
          <FieldSelect
            id="annee"
            label="Annee *"
            placeholder="Sélectionner"
            value={formData.annee}
            onValueChange={(value) => onSelectChange("annee", value)}
            items={options.annees}
            hasError={!!fieldErrors.annee}
          />
          {formData.annee === "Autre (à préciser)" && (
            <FieldInput
              id="customAnnee"
              label="Nouvelle année *"
              value={formData.customAnnee}
              onChange={onInputChange}
              placeholder="Ex: 2025"
              hasError={!!fieldErrors.customAnnee}
            />
          )}
        </div>

        <FieldSelect
          id="ue"
          label="UE (Unite d'Enseignement) *"
          placeholder="Sélectionner"
          value={formData.ue}
          onValueChange={(value) => onSelectChange("ue", value)}
          items={options.ues}
          hasError={!!fieldErrors.ue}
        />
        {formData.ue === "Autre (à préciser)" && (
          <FieldInput
            id="customUe"
            label="Nouvelle UE *"
            value={formData.customUe}
            onChange={onInputChange}
            placeholder="Ex: IA Avancée"
            hasError={!!fieldErrors.customUe}
          />
        )}

        {formData.typeDocument === "Epreuve" && (
          <FieldSelect
            id="session"
            label="Session"
            placeholder="Sélectionner"
            value={formData.session}
            onValueChange={(value) => onSelectChange("session", value)}
            items={options.sessions}
          />
        )}

        <div>
          <label
            htmlFor="file"
            className={cn(formLabelClass, fieldErrors.file && formLabelErrorClass)}
          >
            Fichier *
          </label>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onClick={() => {
              if (!isUploading && !disabled) fileInputRef.current?.click();
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
              fieldErrors.file
                ? "border-red-500 bg-red-50"
                : isDragging
                  ? "border-[#0077d2] bg-blue-50"
                  : "border-gray-300 hover:border-[#0077d2]",
              (isUploading || disabled) && "cursor-not-allowed opacity-60",
            )}
          >
            <Upload
              className={cn(
                "mx-auto mb-4 h-12 w-12 transition-colors",
                isDragging ? "text-[#0077d2]" : "text-gray-400",
              )}
            />
            <p className="font-medium text-[#0077d2]">
              {isDragging
                ? "Déposez le fichier ici"
                : "Glissez-déposez ou cliquez pour choisir un fichier"}
            </p>
            <input
              ref={fileInputRef}
              id="file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              disabled={isUploading || disabled}
              onChange={onFileChange}
            />
            <p className="mt-2 text-sm text-gray-500">
              PDF, DOC, DOCX (max 10MB)
            </p>
            {file && (
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-medium text-[#1cb427]">Fichier : {file.name}</p>
                <p className="text-gray-600">
                  Ce nom sera utilisé comme titre du document.
                </p>
              </div>
            )}
          </div>
        </div>

        {status === "error" && (
          <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mr-2 mt-0.5 h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <strong>Note:</strong> Les documents soumis seront verifiés avant
          publication.
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#0077d2] text-white hover:bg-[#0062b0]"
          disabled={status === "uploading" || disabled}
        >
          {status === "uploading"
            ? "Envoi en cours..."
            : "Soumettre le document"}
        </Button>
      </form>
    </Card>
  );
}
