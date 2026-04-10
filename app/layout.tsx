import "./globals.css";
import { Inter } from "next/font/google";
import AppShell from "./components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Banque Epreuve",
  description:
    "Plateforme web de partage de documents académiques, d'epreuves et de ressources.",
  icons: {
    icon: "/icon.svg",
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
