export type SubmissionFieldKey =
  | "typeDocument"
  | "customTypeDocument"
  | "etablissement"
  | "customEtablissement"
  | "filiere"
  | "customFiliere"
  | "annee"
  | "customAnnee"
  | "niveau"
  | "customNiveau"
  | "ue"
  | "customUe"
  | "file"
  | "contributorEmail";

export type SubmissionFormData = {
  typeDocument: string;
  customTypeDocument: string;
  etablissement: string;
  customEtablissement: string;
  filiere: string;
  customFiliere: string;
  annee: string;
  customAnnee: string;
  niveau: string;
  customNiveau: string;
  ue: string;
  customUe: string;
  session: string;
  wantsFollowUp: boolean;
  contributorName: string;
  contributorEmail: string;
};

export type SubmissionStatus = "idle" | "uploading" | "error";

export type SubmissionUploadProgress = {
  percent: number;
  label: string;
};

export type SubmittedInfo = {
  titre: string;
  typeDocument: string;
  etablissement: string;
  filiere: string;
  annee: string;
  niveau: string;
};

export type SubmissionDuplicateInfo = {
  matchType: "exact" | "logical";
  existingTitre?: string;
};
