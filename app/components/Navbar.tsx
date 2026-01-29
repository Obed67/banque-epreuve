"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#0077d2] text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-xl font-bold">Portail d&apos;Épreuve</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/epreuves"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/epreuves") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span>Épreuves</span>
            </Link>

            <Link
              href="/ressources"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/ressources") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span>Ressources</span>
            </Link>

            <Link
              href="/soumettre"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/soumettre") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span>Soumettre</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-[#006bbd] border-t border-white/10">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/epreuves"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive("/epreuves") ? "bg-white/20 font-medium" : "hover:bg-white/10"
              }`}
            >
              Épreuves
            </Link>
            <Link
              href="/ressources"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive("/ressources") ? "bg-white/20 font-medium" : "hover:bg-white/10"
              }`}
            >
              Ressources
            </Link>
            <Link
              href="/soumettre"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive("/soumettre") ? "bg-white/20 font-medium" : "hover:bg-white/10"
              }`}
            >
              Soumettre
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
