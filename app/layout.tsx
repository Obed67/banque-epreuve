import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppShell from "./components/AppShell";

const inter = Inter({ subsets: ["latin"] });
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://banque-epreuve.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Portail d'Épreuve",
  description:
    "Plateforme de gestion et de partage d'épreuves et de ressources académiques",
  openGraph: {
    title: "Portail d'Épreuve",
    description:
      "Plateforme de gestion et de partage d'épreuves et de ressources académiques",
    url: siteUrl,
    siteName: "Portail d'Épreuve",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex flex-col min-h-screen mx-8`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
