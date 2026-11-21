import Link from "next/link";

interface LogoProps {
  tone?: "dark" | "light";
  className?: string;
  href?: string;
}

// A soft "V" monogram drawn as two brush strokes meeting in a leaf, next to the wordmark
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="currentColor" opacity="0.08" />
      <circle cx="20" cy="20" r="18.25" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M11.5 12.5c2.6 0 4.2 1.4 5.3 4.1L20 25l3.2-8.4c1-2.7 2.7-4.1 5.3-4.1" fill="none" stroke="#b58a54" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 25c-.9 1.9-1.2 3.4-.2 4.9 1.6-.8 2.4-2.4 1.8-4.6" fill="#b58a54" />
    </svg>
  );
}

export default function Logo({ tone = "dark", className = "", href = "/" }: LogoProps) {
  const color = tone === "light" ? "text-white" : "text-ink";
  return (
    <Link href={href} aria-label="Velora home" className={`group inline-flex items-center gap-2.5 ${color} ${className}`}>
      <LogoMark className="size-9 transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[22px] font-medium tracking-[-0.01em]">Velora</span>
        <span className={`mt-1 text-[9px] font-semibold tracking-[0.32em] uppercase ${tone === "light" ? "text-white/70" : "text-muted"}`}>
          Salon &amp; Spa
        </span>
      </span>
    </Link>
  );
}
