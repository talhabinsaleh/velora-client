import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Service } from "@/lib/types";

export default function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  const href = `/services/${service._id}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl2 border border-line/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-sand" tabIndex={-1} aria-hidden>
        <Image
          src={service.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">
          {service.category}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          <Clock3 className="size-3.5" /> {formatDuration(service.duration)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.3rem] leading-snug font-medium text-ink">
          <Link href={href} className="outline-none after:absolute after:inset-0 focus-visible:underline">
            {service.serviceName}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{service.description}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Price</p>
            <p className="font-display text-2xl font-medium text-ink">{formatPrice(service.price)}</p>
          </div>
          <Link
            href={href}
            aria-label={`View details for ${service.serviceName}`}
            className="btn btn-sm btn-outline relative z-10 group-hover:border-ink/40 group-hover:[&_.btn-chip]:bg-gold group-hover:[&_svg]:-rotate-45"
          >
            View Details <span className="btn-chip"><ArrowUpRight /></span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-line/80 bg-white shadow-soft" aria-hidden>
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex items-end justify-between pt-4">
          <div className="skeleton h-8 w-20" />
          <div className="skeleton h-9 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading services" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading services…</span>
    </div>
  );
}
