export type DashboardDocument = {
  id: string;
  titre: string;
  type: string;
  filiere: string;
  ue: string;
  annee: string;
  session: string | null;
  soumis_par: string | null;
  created_at: string;
  statut: string;
  file_path: string;
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
