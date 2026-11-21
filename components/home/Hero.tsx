import { ArrowDown, ArrowRight, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/hero.jpg";
import backdrop from "@/public/images/interior2.jpg";
import { CATEGORIES } from "@/lib/constants";
import HeroSearch from "./HeroSearch";

// Text that runs around the slowly turning badge next to the arch
function RotatingBadge() {
  return (
    <div className="relative size-28 sm:size-32">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-spin-slow text-ink" aria-hidden>
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-current text-[10px] font-semibold uppercase">
          <textPath href="#badge-circle" textLength="286" lengthAdjust="spacing">
            Book online · Relax · Glow · Repeat ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full bg-ink text-gold-soft shadow-lift">
        <Sparkles className="size-6" />
      </span>
    </div>
  );
}

export default function Hero({ serviceCount }: { serviceCount: number | null }) {
  return (
    <section className="grain relative isolate overflow-hidden bg-cream">
      {/* Salon-themed background photo, softened so the copy stays crisp */}
      <Image src={backdrop} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-30 object-cover opacity-[0.16] saturate-[0.6]" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,var(--color-cream)_35%,rgb(251_248_244/0.82)_65%,rgb(251_248_244/0.55))]" />
      {/* soft light behind the composition */}
      <div aria-hidden className="absolute -top-40 right-[-10%] -z-10 size-[42rem] rounded-full bg-gold-soft/70 blur-[120px]" />
      <div aria-hidden className="absolute bottom-0 left-[-15%] -z-10 size-[30rem] rounded-full bg-blush blur-[110px]" />

      <div className="container-x grid items-center gap-14 pt-32 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pt-36 lg:pb-16">
        {/* Copy */}
        <div className="relative">
          <p className="inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-line bg-white/70 py-1.5 pr-4 pl-2 text-xs font-semibold text-ink-3 shadow-soft backdrop-blur">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            Now taking appointments · Banani, Dhaka
          </p>

          <h1 className="mt-7 animate-fade-up font-display text-[2.9rem] leading-[1] font-medium tracking-[-0.035em] text-ink [animation-delay:80ms] sm:text-[4.2rem] xl:text-[4.7rem]">
            <span className="block">Beauty, booked</span>
            <span className="block">
              in{" "}
              <span className="relative inline-block h-[0.8em] w-[1.75em] translate-y-[0.04em] overflow-hidden rounded-full align-baseline ring-4 ring-white shadow-lift">
                <Image src="/images/auth.jpg" alt="" fill sizes="180px" className="object-cover" />
              </span>{" "}
              a few
            </span>
            <em className="block font-normal text-gold-deep">gentle taps.</em>
          </h1>

          <p className="mt-7 max-w-lg animate-fade-up text-base leading-relaxed text-ink-3 [animation-delay:160ms] sm:text-lg">
            Hair, skin, nails and spa rituals by Velora&apos;s senior stylists. Choose a service, request a time that suits you and pay
            securely once we confirm.
          </p>

          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:240ms]">
            <Link href="/services" className="btn btn-dark btn-lg">
              Explore Salon Services <span className="btn-chip"><ArrowRight /></span>
            </Link>
            <Link href="#how-it-works" className="group inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="flex size-10 items-center justify-center rounded-full border border-line bg-white transition group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
                <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
              </span>
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                How it works
              </span>
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg animate-fade-up grid-cols-3 divide-x divide-line rounded-3xl border border-line bg-white/60 py-4 backdrop-blur [animation-delay:320ms]">
            {[
              [serviceCount ? `${serviceCount}+` : "20+", "Signature services"],
              [String(CATEGORIES.length), "Beauty categories"],
              ["10", "Time slots a day"],
            ].map(([value, label]) => (
              <div key={label} className="px-4 text-center sm:px-5">
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl text-ink">{value}</dd>
                <dd className="mt-0.5 text-[11px] font-medium text-muted sm:text-xs">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Arch composition */}
        <div className="relative mx-auto w-full max-w-[460px] animate-fade-up [animation-delay:200ms] lg:max-w-none">
          <div className="group arch relative aspect-[4/5] overflow-hidden bg-sand shadow-[0_40px_80px_-40px_rgb(31_25_21/0.55)] ring-1 ring-ink/5 sm:aspect-[5/6] lg:ml-auto lg:w-[88%]">
            <Image
              src={heroImage}
              alt="Warm, softly lit Velora salon interior with styling chairs and mirrors"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 42vw, 90vw"
              className="object-cover transition duration-[1.6s] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>

          {/* small inset arch */}
          <div className="arch absolute bottom-6 -left-2 hidden aspect-[3/4] w-[34%] animate-float-late overflow-hidden border-[6px] border-cream shadow-lift sm:block lg:-left-4">
            <Image src={CATEGORIES[3].image} alt="" fill sizes="200px" className="object-cover" />
          </div>

          <div className="absolute -top-6 right-0 sm:-right-4 lg:-top-8">
            <RotatingBadge />
          </div>

          <div className="absolute top-[18%] -left-3 animate-float rounded-2xl border border-white/60 bg-white/80 p-3.5 pr-5 shadow-lift backdrop-blur-xl sm:-left-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-gold-deep">
                <Clock3 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Open every day</p>
                <p className="text-xs text-muted">10:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>

          <div className="absolute right-3 bottom-8 animate-float-late rounded-2xl border border-white/60 bg-white/85 p-3.5 pr-5 shadow-lift backdrop-blur-xl sm:-right-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Pay after we confirm</p>
                <p className="text-xs text-muted">Secure Stripe checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="container-x relative z-10 pb-14">
        <div className="mx-auto max-w-4xl animate-fade-up [animation-delay:380ms]">
          <HeroSearch />
        </div>
      </div>

      {/* Category ribbon */}
      <div className="relative overflow-hidden border-y border-ink/10 bg-ink py-4 text-cream">
        <div className="group flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {CATEGORIES.map((c) => (
                <li key={c.slug} className="flex items-center">
                  <Link
                    href={`/services?category=${encodeURIComponent(c.name)}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="px-7 font-display text-2xl font-normal italic transition-colors hover:text-gold-soft sm:text-3xl"
                  >
                    {c.name}
                  </Link>
                  <Sparkles className="size-4 text-gold" aria-hidden />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
