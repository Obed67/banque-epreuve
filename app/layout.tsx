import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppShell from "./components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portail d'Épreuve",
  description:
    "Plateforme de gestion et de partage d'épreuves et de ressources académiques",
  openGraph: {
    images: [
      {
        url: "https://bolt.new/static/og_default.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://bolt.new/static/og_default.png",
      },
    ],
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
