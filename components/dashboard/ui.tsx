import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function DashHeader({ title, text, actions }: { title: ReactNode; text?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="h-display text-3xl sm:text-4xl">{title}</h1>
        {text && <p className="mt-1.5 max-w-2xl text-sm text-muted sm:text-base">{text}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const TONES = {
  gold: "bg-gold-soft/60 text-gold-deep",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-700",
  ink: "bg-ink text-gold-soft",
  sky: "bg-sky-50 text-sky-700",
} as const;

export function StatCard({
  label,
  value,
  Icon,
  tone = "gold",
  hint,
}: {
  label: string;
  value: ReactNode;
  Icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string;
}) {
  return (
    <div className="card flex items-start justify-between gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="min-w-0">
        <p className="text-[12px] font-semibold tracking-wide text-muted uppercase">{label}</p>
        <p className="mt-2 font-display text-[2.1rem] leading-none font-medium text-ink">{value}</p>
        {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
      </div>
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${TONES[tone]}`}>
        <Icon className="size-5" />
      </span>
    </div>
  );
}

export function StatSkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card p-5">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton mt-3 h-9 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="table-wrap p-4" role="status" aria-label="Loading">
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-4">
            <div className="skeleton size-10 shrink-0 rounded-xl" />
            {Array.from({ length: cols - 1 }, (_, c) => (
              <div key={c} className="skeleton h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FilterTabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; count?: number }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition ${
            value === o.value ? "bg-ink text-cream" : "text-ink-3 hover:bg-sand"
          }`}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={`rounded-full px-1.5 text-[11px] ${value === o.value ? "bg-white/15" : "bg-sand"}`}>{o.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
