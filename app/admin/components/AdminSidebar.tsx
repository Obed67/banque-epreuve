"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  Menu,
  LayoutDashboard,
  ListTree,
  LogOut,
  UserCircle2,
} from "lucide-react";
import Button from "../../components/Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminSidebarProps {
  userEmail: string;
  onLogout: () => void;
}

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/documents",
    label: "Validation documents",
    icon: ClipboardCheck,
  },
  {
    href: "/admin/documents/all",
    label: "Tous les documents",
    icon: FileText,
  },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/referentiels", label: "Référentiels", icon: ListTree },
];

export default function AdminSidebar({
  userEmail,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const SidebarContent = ({ compact = false }: { compact?: boolean }) => (
    <>
      <div
        className={`rounded-2xl bg-[#0077d2] p-4 text-white ${compact ? "shadow-sm" : ""}`}
      >
        <p className="text-xs uppercase tracking-wider text-blue-100">
          Panneau admin
        </p>
        <h2 className="mt-1 text-xl font-bold">Portail d&apos;Epreuve</h2>
        <p className="mt-2 text-xs text-blue-100">
          Moderation et validation des contenus
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-[#0077d2] text-white"
                  : "border border-blue-100 bg-[#f7fbff] text-gray-700 hover:bg-blue-50"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-white" : "text-[#0077d2]"}`}
              />
              <span className={`text-sm ${isActive ? "font-medium" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="mb-3 rounded-xl border border-blue-100 bg-[#f7fbff] p-3">
          <p className="mb-1 text-xs text-gray-500">Connecté en tant que</p>
          <div className="flex items-center gap-2 text-sm text-[#0f172a]">
            <UserCircle2 className="h-4 w-4 text-[#0077d2]" />
            <span className="truncate font-medium">{userEmail || "Admin"}</span>
          </div>
        </div>
        <Button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div className="border-b border-blue-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#0077d2]">
              Panneau admin
            </p>
            <h2 className="text-base font-bold text-[#0f172a]">
              Portail d&apos;Epreuve
            </h2>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-[#f7fbff] text-[#0077d2]"
                aria-label="Ouvrir le menu admin"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[86vw] max-w-sm p-5">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu admin</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <SidebarContent compact />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <aside className="hidden h-full flex-col overflow-y-auto border-r border-blue-100 bg-white p-5 lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
