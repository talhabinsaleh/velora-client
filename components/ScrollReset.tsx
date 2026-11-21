"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Every new page starts at the very top (Next.js would otherwise stop just below the fixed navbar
// spacer). Links to a #section are left alone.
export default function ScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.location.hash) return;
    const id = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
}
