import { AlertCircle, Loader2, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  message,
  action,
  icon,
}: {
  title: string;
  message?: string;
  action?: { href: string; label: string } | ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl2 border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-sand text-gold">{icon ?? <Sparkles className="size-6" />}</div>
      <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{message}</p>}
      {action && (
        <div className="mt-6">
          {typeof action === "object" && action !== null && "href" in action ? (
            <Link href={action.href} className="btn btn-dark btn-sm">
              {action.label}
            </Link>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl2 border border-rose-200 bg-rose-50/60 px-6 py-12 text-center">
      <AlertCircle className="size-8 text-rose" />
      <h3 className="mt-3 font-display text-xl text-ink">We couldn&apos;t load this</h3>
      <p className="mt-1 max-w-md text-sm text-ink-3">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-outline btn-sm mt-5">
          <RotateCcw className="size-4" /> Try again
        </button>
      )}
    </div>
  );
}

export function Spinner({ label = "Loading…", className = "" }: { label?: string; className?: string }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 py-16 text-sm font-medium text-muted ${className}`}>
      <Loader2 className="size-5 animate-spin text-gold" />
      {label}
    </div>
  );
}
