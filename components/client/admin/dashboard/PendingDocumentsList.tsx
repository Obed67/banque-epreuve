import { CheckCircle, ExternalLink, FileText, XCircle } from "lucide-react";
import Badge from "@/app/components/Badge";
import Loader from "@/app/components/Loader";
import type { DashboardDocument } from "./types";

type PendingDocumentsListProps = {
  loading: boolean;
  documents: DashboardDocument[];
  processingId: string | null;
  onOpenDocument: (filePath: string) => void;
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
};

export default function PendingDocumentsList({
  loading,
  documents,
  processingId,
  onOpenDocument,
  onValidate,
  onReject,
}: PendingDocumentsListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white">
        <Loader message="Chargement des documents..." className="py-14" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-14 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-[#1cb427]" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-800">
          Tout est a jour
        </h3>
        <p className="text-gray-500">
          Aucun document en attente de validation pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div className="flex flex-col gap-5 xl:flex-row">
            <div className="flex flex-1 items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-[#0077d2]" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="mb-2 text-lg font-bold text-[#0f172a]">
                    {doc.titre}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info-subtle">{doc.type || "N/A"}</Badge>
                    <Badge variant="warning-subtle">{doc.statut}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Meta label="Filiere" value={doc.filiere} />
                  <Meta label="UE" value={doc.ue} />
                  <Meta
                    label="Soumis par"
                    value={doc.soumis_par || "Anonyme"}
                  />
                  <Meta
                    label="Date"
                    value={new Date(doc.created_at).toLocaleDateString("fr-FR")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2.5 xl:w-52 xl:flex-col xl:border-l xl:border-blue-100 xl:pl-5">
              <ActionButton
                text="Voir le fichier"
                icon={<ExternalLink className="mr-2 h-4 w-4" />}
                className="bg-blue-50 text-[#0077d2] hover:bg-blue-100"
                onClick={() => onOpenDocument(doc.file_path)}
              />
              <ActionButton
                text="Valider"
                icon={<CheckCircle className="mr-2 h-4 w-4" />}
                className="bg-[#1cb427] text-white hover:bg-[#158f1f] disabled:opacity-60"
                disabled={processingId === doc.id}
                onClick={() => onValidate(doc.id)}
              />
              <ActionButton
                text="Rejeter"
                icon={<XCircle className="mr-2 h-4 w-4" />}
                className="border border-gray-200 bg-white text-gray-600 hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                disabled={processingId === doc.id}
                onClick={() => onReject(doc.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

type ActionButtonProps = {
  text: string;
  icon: React.ReactNode;
  className: string;
  disabled?: boolean;
  onClick: () => void;
};

function ActionButton({
  text,
  icon,
  className,
  disabled,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${className}`}
    >
      <span className="flex items-center justify-center">
        {icon}
        {text}
      </span>
    </button>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <p className="mb-0.5 text-xs font-medium uppercase text-gray-400">
        {label}
      </p>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}
