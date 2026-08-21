"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorPageContent from "@/components/client/errors/ErrorPageContent";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        className={`${inter.className} flex min-h-screen flex-col overflow-x-hidden bg-white`}
      >
        <main className="flex flex-grow flex-col">
          <ErrorPageContent
            code="500"
            title="Erreur serveur"
            description="Le service rencontre un problème temporaire. Réessayez dans un instant ou revenez plus tard."
            onRetry={reset}
          />
        </main>
      </body>
    </html>
  );
}
