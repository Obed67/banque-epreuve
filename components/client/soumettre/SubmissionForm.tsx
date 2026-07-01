"use client";

import { useRef, useState, type ReactNode } from "react";
import { AlertCircle, Upload } from "lucide-react";
import Card from "../../../app/components/Card";
import Button from "../../../app/components/Button";
import { formLabelErrorClass } from "@/lib/form-styles";
import { cn } from "@/lib/utils";
import { FieldInput, FieldSelect } from "./SubmissionFormFields";
import type { SubmissionFieldKey, SubmissionFormData, SubmissionStatus } from "./types";

import { isEpreuveType } from "@/lib/documentType";

const AUTRE = "Autre (à préciser)";

type SubmissionFormProps = {
  formData: SubmissionFormData;
  options: {
    types: string[];
    etablissements: string[];
    filieres: string[];
    ues: string[];
    annees: string[];
    niveaux: string[];
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

function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4 md:p-5">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h2 className="text-sm font-semibold text-[#0f172a]">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-gray-500">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 flex-col gap-3">{children}</div>;
}

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
  const isEpreuve = isEpreuveType(formData.typeDocument);

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
    <Card className="p-5 shadow-md md:p-6 xl:col-span-2">
      <form onSubmit={onSubmit} className="space-y-5">
        {globalError && (
          <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{globalError}</p>
          </div>
        )}

        <FormSection title="Document" hint="Type de ressource et session d'examen le cas échéant.">
          <div
            className={cn(
              "grid grid-cols-1 gap-4",
              isEpreuve ? "md:grid-cols-2" : "md:grid-cols-1",
            )}
          >
            <FieldGroup>
              <FieldSelect
                id="typeDocument"
                label="Type de document *"
                placeholder="Sélectionner"
                value={formData.typeDocument}
                onValueChange={(value) => onSelectChange("typeDocument", value)}
                items={options.types}
                hasError={!!fieldErrors.typeDocument}
              />
              {formData.typeDocument === AUTRE && (
                <FieldInput
                  id="customTypeDocument"
                  label="Préciser le type *"
                  value={formData.customTypeDocument}
                  onChange={onInputChange}
                  placeholder="Ex : Corrigé"
                  hasError={!!fieldErrors.customTypeDocument}
                />
              )}
            </FieldGroup>

            {isEpreuve && (
              <FieldSelect
                id="session"
                label="Session"
                placeholder="Sélectionner"
                value={formData.session}
                onValueChange={(value) => onSelectChange("session", value)}
                items={options.sessions}
              />
            )}
          </div>
        </FormSection>

        <FormSection
          title="Établissement et parcours"
          hint="Où et pour quelle année / quel niveau d'études."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FieldGroup>
              <FieldSelect
                id="etablissement"
                label="Établissement *"
                placeholder="École / université"
                value={formData.etablissement}
                onValueChange={(value) => onSelectChange("etablissement", value)}
                items={options.etablissements}
                hasError={!!fieldErrors.etablissement}
              />
              {formData.etablissement === AUTRE && (
                <FieldInput
                  id="customEtablissement"
                  label="Préciser l'établissement *"
                  value={formData.customEtablissement}
                  onChange={onInputChange}
                  placeholder="Ex : Université de Lomé"
                  hasError={!!fieldErrors.customEtablissement}
                />
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldSelect
                id="annee"
                label="Année *"
                placeholder="Ex : 2025"
                value={formData.annee}
                onValueChange={(value) => onSelectChange("annee", value)}
                items={options.annees}
                hasError={!!fieldErrors.annee}
              />
              {formData.annee === AUTRE && (
                <FieldInput
                  id="customAnnee"
                  label="Préciser l'année *"
                  value={formData.customAnnee}
                  onChange={onInputChange}
                  placeholder="Ex : 2025"
                  hasError={!!fieldErrors.customAnnee}
                />
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldSelect
                id="niveau"
                label="Niveau d'études *"
                placeholder="Ex : Licence 1, Première année"
                value={formData.niveau}
                onValueChange={(value) => onSelectChange("niveau", value)}
                items={options.niveaux}
                hasError={!!fieldErrors.niveau}
              />
              {formData.niveau === AUTRE && (
                <FieldInput
                  id="customNiveau"
                  label="Préciser le niveau *"
                  value={formData.customNiveau}
                  onChange={onInputChange}
                  placeholder="Ex : Licence 1, Première année"
                  hasError={!!fieldErrors.customNiveau}
                />
              )}
            </FieldGroup>
          </div>
        </FormSection>

        <FormSection title="Formation" hint="Filière et unité d'enseignement concernées.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldGroup>
              <FieldSelect
                id="filiere"
                label="Filière *"
                placeholder="Sélectionner"
                value={formData.filiere}
                onValueChange={(value) => onSelectChange("filiere", value)}
                items={options.filieres}
                hasError={!!fieldErrors.filiere}
              />
              {formData.filiere === AUTRE && (
                <FieldInput
                  id="customFiliere"
                  label="Préciser la filière *"
                  value={formData.customFiliere}
                  onChange={onInputChange}
                  placeholder="Ex : Data Science"
                  hasError={!!fieldErrors.customFiliere}
                />
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldSelect
                id="ue"
                label="UE *"
                placeholder="Unité d'enseignement"
                value={formData.ue}
                onValueChange={(value) => onSelectChange("ue", value)}
                items={options.ues}
                hasError={!!fieldErrors.ue}
              />
              {formData.ue === AUTRE && (
                <FieldInput
                  id="customUe"
                  label="Préciser l'UE *"
                  value={formData.customUe}
                  onChange={onInputChange}
                  placeholder="Ex : Bases de données"
                  hasError={!!fieldErrors.customUe}
                />
              )}
            </FieldGroup>
          </div>
        </FormSection>

        <FormSection title="Fichier" hint="PDF, DOC ou DOCX (10 Mo maximum).">
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
              "rounded-lg border-2 border-dashed p-5 text-center transition-colors cursor-pointer md:p-6",
              fieldErrors.file
                ? "border-red-500 bg-red-50"
                : isDragging
                  ? "border-[#0077d2] bg-blue-50"
                  : "border-gray-200 bg-gray-50/80 hover:border-[#0077d2]",
              (isUploading || disabled) && "cursor-not-allowed opacity-60",
            )}
          >
            <Upload
              className={cn(
                "mx-auto mb-3 h-10 w-10 transition-colors md:h-12 md:w-12",
                isDragging ? "text-[#0077d2]" : "text-gray-400",
              )}
            />
            <p className="font-medium text-[#0077d2]">
              {isDragging
                ? "Déposez le fichier ici"
                : "Glissez-déposez ou cliquez pour choisir"}
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
            <p className="mt-1.5 text-sm text-gray-500">PDF, DOC, DOCX (max 10 Mo)</p>
            {file && (
              <p className="mt-3 text-sm font-medium text-[#1cb427]">{file.name}</p>
            )}
          </div>
          {fieldErrors.file && (
            <p className={cn("mt-2 text-sm", formLabelErrorClass)}>
              Veuillez joindre un fichier.
            </p>
          )}
        </FormSection>

        {status === "error" && (
          <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-800">
          <p>
            <span className="font-semibold">Vérification :</span> chaque document est
            relu avant publication.
          </p>
          <Button
            type="submit"
            size="lg"
            className="w-full shrink-0 bg-[#0077d2] text-white hover:bg-[#0062b0] sm:w-auto sm:min-w-[200px]"
            disabled={status === "uploading" || disabled}
          >
            {status === "uploading" ? "Envoi en cours..." : "Soumettre"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
