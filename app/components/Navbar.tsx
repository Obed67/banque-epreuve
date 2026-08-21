"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ContactDialog from "@/components/client/contact/ContactDialog";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-[#0077d2] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <span className="truncate text-base font-bold sm:text-xl">
              Portail d&apos;Épreuve
            </span>
          </Link>

          <div className="hidden items-center space-x-1 md:flex">
            <Link
              href="/epreuves"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                isActive("/epreuves") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span>Épreuves</span>
            </Link>

            <Link
              href="/ressources"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                isActive("/ressources") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span>Ressources</span>
            </Link>

            <Link
              href="/soumettre"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                isActive("/soumettre") ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span>Soumettre</span>
            </Link>

            <ContactDialog triggerClassName="flex items-center space-x-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-white/10">
              Contact
            </ContactDialog>
          </div>

          <button
            className="rounded-lg p-2 transition-colors hover:bg-white/10 focus:outline-none md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#006bbd] md:hidden">
          <div className="container mx-auto space-y-2 px-4 py-4">
            <Link
              href="/epreuves"
              onClick={closeMenu}
              className={`block rounded-lg px-4 py-3 transition-colors ${
                isActive("/epreuves")
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10"
              }`}
            >
              Épreuves
            </Link>
            <Link
              href="/ressources"
              onClick={closeMenu}
              className={`block rounded-lg px-4 py-3 transition-colors ${
                isActive("/ressources")
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10"
              }`}
            >
              Ressources
            </Link>
            <Link
              href="/soumettre"
              onClick={closeMenu}
              className={`block rounded-lg px-4 py-3 transition-colors ${
                isActive("/soumettre")
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10"
              }`}
            >
              Soumettre
            </Link>
            <ContactDialog triggerClassName="block w-full rounded-lg px-4 py-3 text-left text-white transition-colors hover:bg-white/10">
              Contact
            </ContactDialog>
          </div>
        </div>
      )}
    </nav>
  );
}
