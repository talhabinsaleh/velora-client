import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDuration, formatPrice } from "@/lib/format";
import Tilt from "@/components/fx/Tilt";
import type { Service } from "@/lib/types";

// Arch-topped card: the photo zooms, the card lifts and a round "View" badge rises on hover
export default function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  const href = `/services/${service._id}`;
  return (
    <Tilt className="h-full">
    <article
      className="group relative flex h-full flex-col rounded-[2rem] border border-line/70 bg-white p-3 shadow-soft hover:border-gold/40 hover:shadow-[0_34px_70px_-32px_rgb(19_35_30/0.5)]"
    >
      <span aria-hidden className="fx-glare" />
      <Link href={href} tabIndex={-1} aria-hidden className="arch relative block aspect-[4/4.4] overflow-hidden bg-sand">
        <span className="fx-depth absolute -inset-3 block">
        <Image
          src={service.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 transition duration-500 group-hover:from-ink/65" />


        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/30 backdrop-blur-md">
          <Clock3 className="size-3.5" /> {formatDuration(service.duration)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-2.5 pt-5 pb-2">
        <p className="text-[11px] font-bold tracking-[0.18em] text-gold-deep uppercase">{service.category}</p>
        <h3 className="mt-1.5 font-display text-[1.45rem] leading-snug font-medium text-ink">
          <Link href={href} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 outline-none group-hover:bg-[length:100%_1px] after:absolute after:inset-0 after:rounded-[2rem] focus-visible:underline">
            {service.serviceName}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{service.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p>
            <span className="block text-[10px] font-bold tracking-[0.18em] text-muted uppercase">Price</span>
            <span className="font-display text-2xl leading-none font-medium text-ink">{formatPrice(service.price)}</span>
          </p>
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
    </Tilt>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-line/70 bg-white p-3" aria-hidden>
      <div className="skeleton arch aspect-[4/4.4]" />
      <div className="space-y-3 px-2.5 pt-5 pb-2">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="flex items-center justify-between pt-3">
          <div className="skeleton h-6 w-24" />
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
