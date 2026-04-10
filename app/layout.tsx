import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppShell from "./components/AppShell";

const inter = Inter({ subsets: ["latin"] });

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
