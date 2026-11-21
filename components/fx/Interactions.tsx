"use client";

import { useEffect, useRef } from "react";

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * One small client component that powers the site-wide micro-interactions:
 * - magnetic pull on [data-magnetic] elements
 * - the liquid fill of .btn (CSS reads --fx / --fy, the point where the pointer entered)
 * - a reading-progress line at the top of the page
 */
export default function Interactions() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReduced();
    const fine = finePointer();
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;

      // liquid fill origin for buttons
      const btn = target?.closest<HTMLElement>(".btn");
      if (btn) {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--fx", `${e.clientX - r.left}px`);
        btn.style.setProperty("--fy", `${e.clientY - r.top}px`);
      }

      // magnetic elements
      if (!reduced && fine) {
        const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (magnet && magnet !== m) magnet.style.transform = "";
        magnet = m;
        if (m) {
          const r = m.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          m.style.transform = `translate3d(${dx * 0.22}px, ${dy * 0.3}px, 0)`;
        }
      }
    };

    const onLeaveWindow = () => {
      if (magnet) magnet.style.transform = "";
    };

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-deep via-gold to-gold-soft" />
      </div>
    </>
  );
}
