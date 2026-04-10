"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen -mx-8">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </>
  );
}
