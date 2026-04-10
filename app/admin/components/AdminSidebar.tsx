'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  UserCircle2,
} from 'lucide-react';
import Button from '../../components/Button';

interface AdminSidebarProps {
  userEmail: string;
  onLogout: () => void;
}

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/documents', label: 'Validation documents', icon: ClipboardCheck },
  { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
];

export default function AdminSidebar({ userEmail, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-full overflow-y-auto border-r border-blue-100 bg-white p-5 flex flex-col">
      <div className="rounded-2xl bg-gradient-to-br from-[#0077d2] to-[#0062b0] p-4 text-white">
        <p className="text-xs uppercase tracking-wider text-blue-100">Panneau admin</p>
        <h2 className="text-xl font-bold mt-1">Portail d&apos;Epreuve</h2>
        <p className="text-xs mt-2 text-blue-100">Moderation et validation des contenus</p>
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
                  ? 'bg-[#0077d2] text-white'
                  : 'text-gray-700 bg-[#f7fbff] border border-blue-100 hover:bg-blue-50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#0077d2]'}`} />
              <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-blue-100 bg-[#f7fbff] p-3 mb-3">
          <p className="text-xs text-gray-500 mb-1">Connecté en tant que</p>
          <div className="flex items-center gap-2 text-sm text-[#0f172a]">
            <UserCircle2 className="h-4 w-4 text-[#0077d2]" />
            <span className="truncate font-medium">{userEmail || 'Admin'}</span>
          </div>
        </div>
        <Button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
