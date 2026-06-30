"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-dvh w-full">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow px-4 pt-16 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </>
  );
}
