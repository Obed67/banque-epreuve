"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisit } from "@/lib/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    trackVisit(pathname);
  }, [pathname]);

  return null;
}
