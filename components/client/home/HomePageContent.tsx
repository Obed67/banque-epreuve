import Link from "next/link";
import {
  FileText,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Search,
} from "lucide-react";
import Button from "@/app/components/Button";

export default function HomePageContent() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <section className="border-b border-gray-100 pt-10 pb-12 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20">
        <div className="container mx-auto px-0 sm:px-2 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[#0f172a] sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl">
              La référence pour{" "}
              <span className="block sm:inline">
                <span className="text-[#0077d2]">vos ressources académiques.</span>
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl px-1 text-base leading-relaxed text-gray-500 sm:mb-10 sm:text-lg md:text-xl">
              Accédez à une base de données collaborative d&apos;épreuves, cours
              et travaux dirigés. Une plateforme conçue par des étudiants, pour
              les étudiants.
            </p>
            <div className="flex flex-col gap-3 px-1 sm:flex-row sm:justify-center sm:gap-5">
              <Link href="/epreuves" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full px-6 text-base font-medium rounded-xl bg-[#0077d2] text-white shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] hover:bg-[#0062b0] sm:h-14 sm:px-8 sm:text-lg"
                >
                  Explorer le catalogue
                </Button>
              </Link>
              <Link href="/soumettre" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full px-6 text-base font-medium rounded-xl border-2 border-gray-300 text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-50 sm:h-14 sm:px-8 sm:text-lg"
                >
                  Partager un document
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-0 sm:px-2">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-[#0f172a] sm:text-3xl">
              Ce que nous proposons
            </h2>
            <div className="mx-auto h-1 w-20 bg-[#0077d2]"></div>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:gap-16">
            <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-0 sm:border-0 sm:bg-transparent sm:shadow-none">
              <div className="mb-5 inline-flex rounded-lg bg-blue-50 p-3 text-[#0077d2] sm:mb-6">
                <FileText className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#0f172a] transition-colors group-hover:text-[#0077d2] sm:text-xl">
                Banque d&apos;Épreuves
              </h3>
              <p className="mb-4 leading-relaxed text-gray-500">
                Retrouvez les sujets d&apos;examens des années précédentes,
                classés par filière et unité d&apos;enseignement pour cibler vos
                révisions.
              </p>
              <Link
                href="/epreuves"
                className="inline-flex items-center font-semibold text-[#0077d2] hover:text-[#0062b0]"
              >
                Consulter <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-0 sm:border-0 sm:bg-transparent sm:shadow-none">
              <div className="mb-5 inline-flex rounded-lg bg-green-50 p-3 text-[#1cb427] sm:mb-6">
                <BookOpen className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#0f172a] transition-colors group-hover:text-[#1cb427] sm:text-xl">
                Ressources Pédagogiques
              </h3>
              <p className="mb-4 leading-relaxed text-gray-500">
                Une collection de cours magistraux, fiches de synthèse et
                supports de TD pour compléter votre apprentissage.
              </p>
              <Link
                href="/ressources"
                className="inline-flex items-center font-semibold text-[#1cb427] hover:text-[#158f1f]"
              >
                Découvrir <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-0 sm:border-0 sm:bg-transparent sm:shadow-none md:col-span-1">
              <div className="mb-5 inline-flex rounded-lg bg-orange-50 p-3 text-[#f59e0b] sm:mb-6">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#0f172a] transition-colors group-hover:text-[#f59e0b] sm:text-xl">
                Contribution Libre
              </h3>
              <p className="mb-4 leading-relaxed text-gray-500">
                La force de la communauté réside dans le partage. Ajoutez vos
                documents et aidez les promotions futures.
              </p>
              <Link
                href="/soumettre"
                className="inline-flex items-center font-semibold text-[#f59e0b] hover:text-[#d97706]"
              >
                Contribuer <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-0 sm:px-2">
          <div className="grid grid-cols-2 gap-6 text-center sm:gap-8 md:grid-cols-4">
            <div>
              <div className="mb-1 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:mb-2 sm:text-4xl md:text-5xl">
                250+
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-sm">
                Épreuves
              </div>
            </div>
            <div>
              <div className="mb-1 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:mb-2 sm:text-4xl md:text-5xl">
                500+
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-sm">
                Étudiants
              </div>
            </div>
            <div>
              <div className="mb-1 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:mb-2 sm:text-4xl md:text-5xl">
                15
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-sm">
                Filières
              </div>
            </div>
            <div>
              <div className="mb-1 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:mb-2 sm:text-4xl md:text-5xl">
                100%
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-sm">
                Gratuit
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-0 sm:px-2">
          <div className="mx-auto flex max-w-2xl flex-col items-center px-1 text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-50 p-4 sm:mb-8">
              <Search className="h-6 w-6 text-[#0077d2]" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-[#0f172a] sm:mb-6 sm:text-3xl">
              Ne perdez plus de temps à chercher
            </h2>
            <p className="mb-8 text-base text-gray-500 sm:mb-10 sm:text-lg">
              Tout ce dont vous avez besoin pour réussir votre année est à
              portée de clic.
            </p>
            <Link href="/epreuves" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-12 w-full rounded-lg bg-[#0f172a] px-8 font-medium text-white hover:bg-gray-800 sm:h-12 sm:w-auto"
              >
                Accéder aux ressources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
