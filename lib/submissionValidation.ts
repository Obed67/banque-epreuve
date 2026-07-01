import type { SubmissionFieldKey, SubmissionFormData } from "@/components/client/soumettre/types";

export function getSubmissionFieldErrors(
  formData: SubmissionFormData,
  file: File | null,
): Partial<Record<SubmissionFieldKey, boolean>> {
  const errors: Partial<Record<SubmissionFieldKey, boolean>> = {};

  if (!formData.typeDocument) {
    errors.typeDocument = true;
  } else if (
    formData.typeDocument === "Autre (à préciser)" &&
    !formData.customTypeDocument.trim()
  ) {
    errors.customTypeDocument = true;
  }

  if (!formData.etablissement) {
    errors.etablissement = true;
  } else if (
    formData.etablissement === "Autre (à préciser)" &&
    !formData.customEtablissement.trim()
  ) {
    errors.customEtablissement = true;
  }

  if (!formData.filiere) {
    errors.filiere = true;
  } else if (
    formData.filiere === "Autre (à préciser)" &&
    !formData.customFiliere.trim()
  ) {
    errors.customFiliere = true;
  }

  if (!formData.annee) {
    errors.annee = true;
  } else if (
    formData.annee === "Autre (à préciser)" &&
    !formData.customAnnee.trim()
  ) {
    errors.customAnnee = true;
  }

  if (!formData.niveau) {
    errors.niveau = true;
  } else if (
    formData.niveau === "Autre (à préciser)" &&
    !formData.customNiveau.trim()
  ) {
    errors.customNiveau = true;
  }

  if (!formData.ue) {
    errors.ue = true;
  } else if (
    formData.ue === "Autre (à préciser)" &&
    !formData.customUe.trim()
  ) {
    errors.customUe = true;
  }

  if (!file) {
    errors.file = true;
  }

  return errors;
}
