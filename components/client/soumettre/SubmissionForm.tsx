"use client";

import { AlertCircle, Upload } from "lucide-react";
import Card from "../../../app/components/Card";
import Button from "../../../app/components/Button";
import { Label } from "../../ui/label";
import { FieldInput, FieldSelect } from "./SubmissionFormFields";
import type { SubmissionFormData, SubmissionStatus } from "./types";

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
  onSelectChange: (field: keyof SubmissionFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  globalError?: string;
};

export default function SubmissionForm({
  formData,
  options,
  file,
  status,
  errorMessage,
  onInputChange,
  onFileChange,
  onSelectChange,
  onSubmit,
  disabled = false,
  globalError = "",
}: SubmissionFormProps) {
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
        />
        {formData.typeDocument === "Autre (à préciser)" && (
          <FieldInput
            id="customTypeDocument"
            label="Nouveau type de document *"
            value={formData.customTypeDocument}
            onChange={onInputChange}
            placeholder="Ex: Corrigé"
          />
        )}

        <FieldInput
          id="titre"
          label="Titre du document *"
          value={formData.titre}
          onChange={onInputChange}
          placeholder="Ex: Epreuve de Mathematiques"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldSelect
            id="filiere"
            label="Filiere *"
            placeholder="Sélectionner"
            value={formData.filiere}
            onValueChange={(value) => onSelectChange("filiere", value)}
            items={options.filieres}
          />
          {formData.filiere === "Autre (à préciser)" && (
            <FieldInput
              id="customFiliere"
              label="Nouvelle filière *"
              value={formData.customFiliere}
              onChange={onInputChange}
              placeholder="Ex: Data Science"
            />
          )}
          <FieldSelect
            id="annee"
            label="Annee *"
            placeholder="Sélectionner"
            value={formData.annee}
            onValueChange={(value) => onSelectChange("annee", value)}
            items={options.annees}
          />
          {formData.annee === "Autre (à préciser)" && (
            <FieldInput
              id="customAnnee"
              label="Nouvelle année *"
              value={formData.customAnnee}
              onChange={onInputChange}
              placeholder="Ex: 2025"
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
        />
        {formData.ue === "Autre (à préciser)" && (
          <FieldInput
            id="customUe"
            label="Nouvelle UE *"
            value={formData.customUe}
            onChange={onInputChange}
            placeholder="Ex: IA Avancée"
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
          <Label htmlFor="file" className="mb-2 block text-sm text-gray-700">
            Fichier *
          </Label>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-[#0077d2]">
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <Label
              htmlFor="file"
              className="cursor-pointer font-medium text-[#0077d2] hover:underline"
            >
              Cliquer pour choisir un fichier
            </Label>
            <input
              id="file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              disabled={status === "uploading"}
              onChange={onFileChange}
            />
            <p className="mt-2 text-sm text-gray-500">
              PDF, DOC, DOCX (max 10MB)
            </p>
            {file && (
              <p className="mt-2 text-sm font-medium text-[#1cb427]">
                Fichier: {file.name}
              </p>
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
