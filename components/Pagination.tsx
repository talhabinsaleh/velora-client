"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pages: number;
  total?: number;
  onChange: (page: number) => void;
  label?: string;
}

function range(page: number, pages: number) {
  const out: (number | "…")[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) out.push(p);
    else if (out[out.length - 1] !== "…") out.push("…");
  }
  return out;
}

export default function Pagination({ page, pages, total, onChange, label = "results" }: PaginationProps) {
  if (pages <= 1) {
    return total !== undefined ? (
      <p className="pt-2 text-center text-xs text-muted">
        Showing all {total} {label}
      </p>
    ) : null;
  }
  return (
    <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
      {total !== undefined && (
        <p className="text-xs text-muted">
          Page {page} of {pages} · {total} {label}
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        {range(page, pages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition ${
                p === page ? "bg-ink text-cream" : "text-ink-3 hover:bg-sand"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
