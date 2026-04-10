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
  titre: string;
};

export type SubmissionStatus = "idle" | "uploading" | "error";

export type SubmittedInfo = {
  titre: string;
  typeDocument: string;
  filiere: string;
};
