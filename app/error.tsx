"use client";

import { useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ErrorPageContent from "@/components/client/errors/ErrorPageContent";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="flex flex-grow flex-col px-4 pt-16 sm:px-6 lg:px-8">
        <ErrorPageContent
          code="500"
          title="Une erreur est survenue"
          description="Un problème inattendu empêche d'afficher cette page. Vous pouvez réessayer, ou revenir à l'accueil."
          onRetry={reset}
        />
      </main>
      <Footer />
    </>
  );
}
