import Link from "next/link";
import {
  FileText,
  BookOpen,
  Upload,
  Award,
  Users,
  TrendingUp,
} from "lucide-react";
import Button from "./components/Button";
import Card from "./components/Card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-[#0077d2] to-[#0066b8] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bienvenue sur le Portail d'Épreuve
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Accédez à une bibliothèque complète d'épreuves et de ressources
              académiques. Partagez et consultez des documents pour réussir vos
              études.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/epreuves" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Voir les épreuves
                </Button>
              </Link>
              <Link href="/soumettre" className="w-full sm:w-auto">
                <Button size="lg" variant="success" className="w-full">
                  Soumettre un document
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Fonctionnalités principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-6">
              <div className="bg-[#0077d2] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Épreuves
              </h3>
              <p className="text-gray-600 mb-4">
                Consultez une large collection d'épreuves passées classées par
                filière, UE et année.
              </p>
              <Link
                href="/epreuves"
                className="text-[#0077d2] font-medium hover:underline"
              >
                Explorer les épreuves →
              </Link>
            </Card>

            <Card hover className="p-6">
              <div className="bg-[#1cb427] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Ressources
              </h3>
              <p className="text-gray-600 mb-4">
                Accédez à des cours, TD, mémoires et autres documents
                pédagogiques utiles.
              </p>
              <Link
                href="/ressources"
                className="text-[#1cb427] font-medium hover:underline"
              >
                Voir les ressources →
              </Link>
            </Card>

            <Card hover className="p-6">
              <div className="bg-[#ffa446] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Contribution
              </h3>
              <p className="text-gray-600 mb-4">
                Partagez vos propres documents et contribuez à enrichir la
                plateforme.
              </p>
              <Link
                href="/soumettre"
                className="text-[#ffa446] font-medium hover:underline"
              >
                Soumettre un document →
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Statistiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#0077d2] w-16 h-16 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-[#0077d2] mb-2">250+</div>
              <div className="text-gray-600">Épreuves disponibles</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#1cb427] w-16 h-16 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-[#1cb427] mb-2">500+</div>
              <div className="text-gray-600">Étudiants actifs</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#ffa446] w-16 h-16 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-[#ffa446] mb-2">15+</div>
              <div className="text-gray-600">Filières couvertes</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explorez notre collection de documents ou partagez les vôtres pour
            aider la communauté étudiante.
          </p>
          <Link href="/epreuves">
            <Button size="lg" variant="primary">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
