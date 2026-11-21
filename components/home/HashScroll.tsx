"use client";

import { useEffect } from "react";

// When the home page is opened from another page with a #section in the address, the sections
// above it are still streaming in and push it down. Keep the target section in place until the
// layout settles (or the visitor scrolls on their own).
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let stopped = false;
    const stop = () => (stopped = true);
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchmove", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });

    const align = () => {
      const el = document.getElementById(id);
      if (!el || stopped) return;
      const offset = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
      if (Math.abs(offset) > 2) window.scrollBy({ top: offset, behavior: "auto" });
    };
    const timers = [0, 150, 400, 800, 1300, 2000, 3000].map((ms) => setTimeout(align, ms));
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);

  return null;
}
