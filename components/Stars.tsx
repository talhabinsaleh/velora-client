"use client";

import { Star } from "lucide-react";
import { useState } from "react";

// Read-only stars, with half-step precision shown by clipping the filled layer
export function Stars({ value, size = 16, className = "" }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`relative inline-flex ${className}`} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className="flex gap-0.5 text-line">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} style={{ width: size, height: size }} className="fill-current" />
        ))}
      </span>
      <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400" style={{ width: `${(value / 5) * 100}%` }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} style={{ width: size, height: size }} className="shrink-0 fill-current" />
        ))}
      </span>
    </span>
  );
}

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

// Keyboard and mouse friendly rating picker
export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Rating" className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className="cursor-pointer rounded-md p-0.5 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-gold"
          >
            <Star className={`size-8 transition ${n <= shown ? "fill-amber-400 text-amber-400" : "fill-sand-2 text-sand-2"}`} />
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold text-ink-3">{LABELS[shown]}</span>
    </div>
  );
}
