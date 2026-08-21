import Link from "next/link";
import { FileQuestion, ServerCrash, Home, ArrowLeft } from "lucide-react";

type ErrorPageContentProps = {
  code: "404" | "500";
  title: string;
  description: string;
  onRetry?: () => void;
};

export default function ErrorPageContent({
  code,
  title,
  description,
  onRetry,
}: ErrorPageContentProps) {
  const Icon = code === "404" ? FileQuestion : ServerCrash;

  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="mb-6 inline-flex rounded-2xl bg-blue-50 p-4 text-[#0077d2]">
          <Icon className="h-10 w-10" aria-hidden />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#0077d2]">
          Erreur {code}
        </p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-gray-500">
          {description}
        </p>

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0077d2] px-6 text-base font-medium text-white transition-colors hover:bg-[#0062b0]"
          >
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 text-base font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Réessayer
            </button>
          ) : (
            <Link
              href="/epreuves"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 text-base font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Voir les épreuves
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
