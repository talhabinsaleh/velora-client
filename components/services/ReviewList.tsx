import { MessageSquareQuote } from "lucide-react";
import Avatar from "@/components/Avatar";
import { Stars } from "@/components/Stars";
import { timeAgo } from "@/lib/format";
import type { PublicReview } from "@/lib/types";

// Reviews from customers who paid for this service
export default function ReviewList({ reviews, rating, count }: { reviews: PublicReview[]; rating: number; count: number }) {
  return (
    <section id="reviews" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Guest reviews</h2>
        {count > 0 && (
          <p className="flex items-center gap-2 text-sm text-ink-3">
            <Stars value={rating} /> <strong className="text-ink">{rating.toFixed(1)}</strong> from {count} verified visit{count === 1 ? "" : "s"}
          </p>
        )}
      </div>
      {reviews.length === 0 ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-line bg-white/60 p-5 text-sm text-muted">
          <MessageSquareQuote className="size-5 text-gold" />
          No reviews yet. Guests can review this service after a paid visit.
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <li key={r._id} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={r.customer.name} image={r.customer.image} size={36} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.customer.name}</p>
                    <p className="text-xs text-muted">Verified visit{r.createdAt ? ` · ${timeAgo(r.createdAt)}` : ""}</p>
                  </div>
                </div>
                <Stars value={r.rating} size={14} />
              </div>
              {r.comment && <p className="mt-3 text-sm leading-relaxed text-ink-3">“{r.comment}”</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
