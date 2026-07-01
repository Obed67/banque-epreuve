export type DashboardDocument = {
  id: string;
  titre: string;
  type: string;
  etablissement: string;
  filiere: string;
  ue: string;
  annee: string;
  niveau: string;
  session: string | null;
  soumis_par: string | null;
  created_at: string;
  statut: string;
  file_path: string;
  original_file_name?: string | null;
};

export type DashboardStats = {
  total: number;
  enAttente: number;
  valides: number;
};

export type DashboardNotification = {
  type: "success" | "error";
  message: string;
} | null;
