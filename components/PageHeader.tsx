import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

// Header band used at the top of inner pages
export default function PageHeader({
  eyebrow,
  title,
  text,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: string;
  crumbs?: { href?: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line/70 bg-[radial-gradient(ellipse_at_top_right,var(--color-gold-soft),transparent_55%),linear-gradient(var(--color-sand),var(--color-cream))]">
      <div className="container-x py-12 sm:py-16">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="h-display mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{text}</p>}
        {children}
      </div>
    </section>
  );
}
