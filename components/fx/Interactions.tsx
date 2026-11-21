"use client";

import { useEffect, useRef } from "react";

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * One small client component that powers the site-wide micro-interactions:
 * - a gold cursor ring that eases after the pointer and morphs into a label over [data-cursor]
 * - magnetic pull on [data-magnetic] elements
 * - the liquid fill of .btn (CSS reads --fx / --fy, the point where the pointer entered)
 * - a reading-progress line at the top of the page
 */
export default function Interactions() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReduced();
    const fine = finePointer();
    let raf = 0;
    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100;
    let magnet: HTMLElement | null = null;

    document.documentElement.classList.toggle("has-cursor", fine && !reduced);

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as HTMLElement | null;

      // cursor state
      if (ring.current && label.current) {
        const labelled = target?.closest<HTMLElement>("[data-cursor]");
        const interactive = target?.closest("a, button, [role=button], input, select, textarea, label");
        ring.current.dataset.state = labelled ? "label" : interactive ? "hover" : "idle";
        label.current.textContent = labelled?.dataset.cursor ?? "";
      }

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
      if (ring.current) ring.current.dataset.state = "hidden";
      if (magnet) magnet.style.transform = "";
    };

    const tick = () => {
      // the ring eases after the pointer for a soft, weighted feel
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (fine && !reduced) raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-deep via-gold to-gold-soft" />
      </div>
      <div ref={ring} aria-hidden data-state="hidden" className="fx-cursor">
        <span ref={label} className="fx-cursor-label" />
      </div>
    </>
  );
}
