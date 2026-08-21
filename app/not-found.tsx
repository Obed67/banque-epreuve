import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ErrorPageContent from "@/components/client/errors/ErrorPageContent";

export const metadata: Metadata = {
  title: "Page introuvable | Banque Epreuve",
  description: "La page demandée n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-grow flex-col px-4 pt-16 sm:px-6 lg:px-8">
        <ErrorPageContent
          code="404"
          title="Page introuvable"
          description="Désolé, cette page n'existe pas ou a été déplacée. Vérifiez l'adresse ou retournez à l'accueil pour continuer."
        />
      </main>
      <Footer />
    </>
  );
}
