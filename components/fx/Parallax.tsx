"use client";

import { ReactNode, useRef } from "react";

// Moves children marked with data-depth at different speeds as the pointer moves over the area
export default function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
        const d = Number(layer.dataset.depth) || 0;
        layer.style.translate = `${x * d}px ${y * d}px`;
      });
    });
  }

  function reset() {
    ref.current?.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => (layer.style.translate = ""));
  }

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={reset} className={className}>
      {children}
    </div>
  );
}
