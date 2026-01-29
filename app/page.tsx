import Link from "next/link";
import {
  FileText,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Search,
} from "lucide-react";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Centered & Impactful */}
      <section className="pt-24 pb-20 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#0f172a] mb-8 tracking-tight leading-tight">
              La référence pour <br />
              <span className="text-[#0077d2]">vos ressources académiques.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Accédez à une base de données collaborative d'épreuves, cours et travaux dirigés. 
              Une plateforme conçue par des étudiants, pour les étudiants.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/epreuves">
                <Button size="lg" className="h-14 px-8 text-lg font-medium bg-[#0077d2] hover:bg-[#0062b0] text-white rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02]">
                  Explorer le catalogue
                </Button>
              </Link>
              <Link href="/soumettre">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-2 border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                  Partager un document
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimal Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Ce que nous proposons</h2>
            <div className="h-1 w-20 bg-[#0077d2] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="group">
              <div className="mb-6 inline-flex p-3 rounded-lg bg-blue-50 text-[#0077d2]">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#0077d2] transition-colors">
                Banque d'Épreuves
              </h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                Retrouvez les sujets d'examens des années précédentes, classés par filière et unité d'enseignement pour cibler vos révisions.
              </p>
              <Link href="/epreuves" className="inline-flex items-center font-semibold text-[#0077d2] hover:text-[#0062b0]">
                Consulter <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="group">
              <div className="mb-6 inline-flex p-3 rounded-lg bg-green-50 text-[#1cb427]">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#1cb427] transition-colors">
                Ressources Pédagogiques
              </h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                Une collection de cours magistraux, fiches de synthèse et supports de TD pour compléter votre apprentissage.
              </p>
              <Link href="/ressources" className="inline-flex items-center font-semibold text-[#1cb427] hover:text-[#158f1f]">
                Découvrir <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="group">
              <div className="mb-6 inline-flex p-3 rounded-lg bg-orange-50 text-[#f59e0b]">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#f59e0b] transition-colors">
                Contribution Libre
              </h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                La force de la communauté réside dans le partage. Ajoutez vos documents et aidez les promotions futures.
              </p>
              <Link href="/soumettre" className="inline-flex items-center font-semibold text-[#f59e0b] hover:text-[#d97706]">
                Contribuer <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Data Focused (Centered) */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-2 tracking-tight">250+</div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Épreuves</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-2 tracking-tight">500+</div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Étudiants</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-2 tracking-tight">15</div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Filières</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-2 tracking-tight">100%</div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Gratuit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
             <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-8">
                <Search className="h-6 w-6 text-[#0077d2]" />
             </div>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-6">
              Ne perdez plus de temps à chercher
            </h2>
            <p className="text-lg text-gray-500 mb-10">
              Tout ce dont vous avez besoin pour réussir votre année est à portée de clic.
            </p>
            <Link href="/epreuves">
              <Button size="lg" className="h-12 px-8 bg-[#0f172a] text-white hover:bg-gray-800 rounded-lg font-medium">
                Accéder aux ressources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
