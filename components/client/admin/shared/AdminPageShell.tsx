"use client";

import AdminSidebar from "@/app/admin/components/AdminSidebar";

type AdminPageShellProps = {
  userEmail: string;
  onLogout: () => void;
  children: React.ReactNode;
};

export default function AdminPageShell({
  userEmail,
  onLogout,
  children,
}: AdminPageShellProps) {
  return (
    <div className="min-h-dvh bg-[#eef6ff]">
      <AdminSidebar userEmail={userEmail} onLogout={onLogout} />
      <main className="min-h-dvh overflow-y-auto lg:pl-[290px]">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
