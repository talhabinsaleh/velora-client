"use client";

import { ReactNode, useRef } from "react";

// Tilts its child in 3D toward the pointer and moves a soft glare with it (desktop only)
export default function Tilt({ children, max = 6, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
      el.style.setProperty("--px", `${(px - 0.5) * -14}px`);
      el.style.setProperty("--py", `${(py - 0.5) * -14}px`);
    });
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    ["--rx", "--ry", "--px", "--py"].forEach((v) => el.style.setProperty(v, v.startsWith("--r") ? "0deg" : "0px"));
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`fx-tilt ${className}`}>
      {children}
    </div>
  );
}
