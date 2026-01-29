"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, BookOpen, Upload, Lock } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-[#0077d2] text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8" />
            <span className="text-xl font-bold">Portail d&apos;Épreuve</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/epreuves"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/epreuves") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Épreuves</span>
            </Link>

            <Link
              href="/ressources"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/ressources") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Ressources</span>
            </Link>

            <Link
              href="/soumettre"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/soumettre") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Soumettre</span>
            </Link>
          </div>

          <button className="md:hidden p-2">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
