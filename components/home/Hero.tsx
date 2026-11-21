import { ArrowRight, ArrowUpRight, Clock3, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import slide1 from "@/public/images/hero-1.jpg";
import slide2 from "@/public/images/hero-2.jpg";
import slide3 from "@/public/images/hero-3.jpg";
import { CATEGORIES } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Service } from "@/lib/types";
import SmartLink from "@/components/SmartLink";
import HeroSearch from "./HeroSearch";
import HeroSlides from "./HeroSlides";

const SLIDES = [
  { src: slide1, alt: "Bright Velora styling floor with arched mirrors and marble", label: "The salon" },
  { src: slide2, alt: "Stylist finishing a blow-dry for a guest", label: "Hair" },
  { src: slide3, alt: "Calm reception with an arched doorway", label: "Welcome" },
];

export default function Hero({ serviceCount, popular }: { serviceCount: number | null; popular: Service[] }) {
  return (
    <section className="relative isolate">
      <div className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink text-white">
        <HeroSlides slides={SLIDES} />
        {/* cinematic grade: deep emerald on the left for the copy, clear on the right for the photo */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(12_24_20/0.9)_0%,rgb(12_24_20/0.68)_42%,rgb(12_24_20/0.18)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/60 to-transparent" />

        <div className="container-x grid w-full items-center gap-12 pt-32 pb-48 lg:grid-cols-[1.25fr_0.75fr] lg:pb-52">
          <div className="max-w-2xl">
            <p className="inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pr-4 pl-2 text-xs font-semibold backdrop-blur-md">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
              Now taking appointments · Banani, Dhaka
            </p>

            <h1 className="mt-7 font-display text-[3rem] leading-[1] font-medium tracking-[-0.035em] sm:text-7xl xl:text-[5.4rem]">
              <span className="line-mask line-in">
                <span>Where every visit</span>
              </span>
              <span className="line-mask line-in [&>span]:[animation-delay:140ms]">
                <em className="font-normal text-gold-soft">feels like a ritual.</em>
              </span>
            </h1>

            <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-white/75 [animation-delay:200ms] sm:text-lg">
              Hair, skin, nails and spa care by Velora&apos;s senior stylists. Explore the menu, request a time that suits you and pay
              securely once we confirm.
            </p>

            <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:280ms]">
              <Link href="/services" data-magnetic className="btn btn-gold btn-lg">
                Explore Salon Services <span className="btn-chip"><ArrowRight /></span>
              </Link>
              <SmartLink href="/#how-it-works" className="btn btn-glass btn-lg">
                How it works
              </SmartLink>
            </div>

            <dl className="mt-12 flex animate-fade-up flex-wrap gap-x-10 gap-y-5 [animation-delay:360ms]">
              {[
                [serviceCount ? `${serviceCount}+` : "20+", "Signature services"],
                [String(CATEGORIES.length), "Beauty categories"],
                ["10", "Time slots every day"],
              ].map(([value, label]) => (
                <div key={label} className="border-l border-white/20 pl-4">
                  <dd className="font-display text-4xl text-white">{value}</dd>
                  <dt className="mt-1 text-xs font-medium tracking-wide text-white/60 uppercase">{label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Live glass card: services straight from the database */}
          {popular.length > 0 && (
            <aside className="hidden animate-fade-up rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.7)] backdrop-blur-2xl [animation-delay:420ms] lg:block">
              <div className="flex items-center justify-between px-2 pt-1 pb-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">Popular right now</p>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                  <Star className="size-3.5 fill-gold-soft text-gold-soft" /> Velora picks
                </span>
              </div>
              <ul className="space-y-1.5">
                {popular.slice(0, 3).map((s) => (
                  <li key={s._id}>
                    <Link href={`/services/${s._id}`} className="group flex items-center gap-4 rounded-2xl p-2.5 transition hover:bg-white/10">
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                        <Image src={s.image} alt="" fill sizes="64px" className="object-cover transition duration-700 group-hover:scale-110" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-lg leading-tight">{s.serviceName}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                          {s.category} · <Clock3 className="size-3" /> {formatDuration(s.duration)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block font-display text-lg">{formatPrice(s.price)}</span>
                        <ArrowUpRight className="ml-auto size-4 text-gold-soft transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/40 px-4 py-3 text-sm text-white/75">
                <ShieldCheck className="size-5 shrink-0 text-emerald-300" />
                Request now, pay securely after the salon confirms.
              </div>
            </aside>
          )}
        </div>
      </div>

      <div className="relative z-10 -mt-24">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            <HeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
