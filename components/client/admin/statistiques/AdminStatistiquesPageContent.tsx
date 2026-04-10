'use client';

import { useMemo } from 'react';
import { BarChart3, CheckCircle, Clock, FileText } from 'lucide-react';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useAdminStats } from '@/lib/hooks/useAdminStats';

export default function AdminStatistiquesPageContent() {
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const { stats } = useAdminStats(!checkingAuth, true);
  const ratio = useMemo(
    () => (stats.total > 0 ? Math.round((stats.valides / stats.total) * 100) : 0),
    [stats.total, stats.valides]
  );

  return (
    <div className="h-screen bg-[#eef6ff]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[290px_1fr]">
        <AdminSidebar userEmail={userEmail} onLogout={logout} />
        <section className="h-full overflow-y-auto p-6 lg:p-8">
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-6">Statistiques</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"><div className="flex justify-between"><p className="text-sm text-gray-500">Total</p><FileText className="h-5 w-5 text-[#0077d2]" /></div><p className="text-3xl font-extrabold text-[#0f172a] mt-2">{stats.total}</p></div>
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"><div className="flex justify-between"><p className="text-sm text-gray-500">En attente</p><Clock className="h-5 w-5 text-[#ffa446]" /></div><p className="text-3xl font-extrabold text-[#0f172a] mt-2">{stats.enAttente}</p></div>
            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"><div className="flex justify-between"><p className="text-sm text-gray-500">Validés</p><CheckCircle className="h-5 w-5 text-[#1cb427]" /></div><p className="text-3xl font-extrabold text-[#0f172a] mt-2">{stats.valides}</p></div>
            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"><div className="flex justify-between"><p className="text-sm text-gray-500">Rejetés</p><BarChart3 className="h-5 w-5 text-red-500" /></div><p className="text-3xl font-extrabold text-[#0f172a] mt-2">{stats.rejetes}</p></div>
          </div>
          <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Taux de validation</p>
            <p className="text-4xl font-extrabold text-[#0f172a]">{ratio}%</p>
            <div className="w-full h-3 bg-blue-50 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[#0077d2]" style={{ width: `${ratio}%` }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
