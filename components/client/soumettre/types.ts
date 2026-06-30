export type SubmissionFieldKey =
  | "typeDocument"
  | "customTypeDocument"
  | "filiere"
  | "customFiliere"
  | "ue"
  | "customUe"
  | "annee"
  | "customAnnee"
  | "file";

export type SubmissionFormData = {
  typeDocument: string;
  customTypeDocument: string;
  filiere: string;
  customFiliere: string;
  ue: string;
  customUe: string;
  annee: string;
  customAnnee: string;
  session: string;
};

export type SubmissionStatus = "idle" | "uploading" | "error";

export type SubmittedInfo = {
  titre: string;
  typeDocument: string;
  filiere: string;
};
