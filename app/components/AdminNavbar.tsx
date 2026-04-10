"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/login", label: "Connexion" },
  { href: "/admin/register", label: "Inscription" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#0077d2] text-white border-b border-blue-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-white" />
            <span className="font-semibold tracking-wide">Administration</span>
          </Link>

          <div className="flex items-center gap-2">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-[#0062b0] text-white"
                      : "text-blue-50 hover:bg-[#0062b0] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="ml-2 px-3 py-2 rounded-md text-sm text-blue-50 hover:bg-[#0062b0] hover:text-white transition-colors"
            >
              Retour site
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
