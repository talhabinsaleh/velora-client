import { Quote } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Reveal from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import { getFeaturedReviews } from "@/lib/server-api";
import SectionHeading from "./SectionHeading";

// Real reviews left by customers after a paid visit. Hidden until there are some.
export default async function Testimonials() {
  const { data } = await getFeaturedReviews();
  if (!data || data.reviews.length === 0) return null;

  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Guest reviews"
            title={
              <>
                Loved by our <em className="font-normal text-gold-deep">guests</em>
              </>
            }
            text="Every review comes from a customer who booked and paid through Velora."
            action={
              <div className="flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-soft">
                <p className="font-display text-4xl text-ink">{data.average.toFixed(1)}</p>
                <div>
                  <Stars value={data.average} />
                  <p className="mt-1 text-xs text-muted">
                    from {data.count} verified review{data.count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            }
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.reviews.slice(0, 6).map((r, i) => (
            <Reveal key={r._id} delay={(i % 3) * 90}>
              <figure className="group relative flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-7 shadow-soft transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift">
                <Quote className="size-8 text-gold-soft transition group-hover:text-gold" />
                <Stars value={r.rating} size={15} className="mt-4" />
                <blockquote className="mt-3 flex-1 font-display text-lg leading-snug text-ink">“{r.comment}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <Avatar name={r.customer.name} image={r.customer.image} size={40} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{r.customer.name}</p>
                    {r.service && (
                      <Link href={`/services/${r.service._id}`} className="block truncate text-xs text-gold-deep hover:underline">
                        {r.service.serviceName}
                      </Link>
                    )}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
