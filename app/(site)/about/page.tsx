import { ArrowRight, BadgeCheck, CalendarCheck2, Droplets, Leaf, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HowItWorks from "@/components/home/HowItWorks";
import SectionHeading from "@/components/home/SectionHeading";
import { CallToAction } from "@/components/home/VisitUs";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { CATEGORIES, PROMISES } from "@/lib/constants";
import { getCategorySummaries } from "@/lib/server-api";
import aboutHero from "@/public/images/about-hero.jpg";
import about from "@/public/images/about.jpg";
import g1 from "@/public/images/gallery-1.jpg";
import g2 from "@/public/images/gallery-2.jpg";
import g3 from "@/public/images/gallery-3.jpg";
import steps from "@/public/images/steps.jpg";
import team from "@/public/images/team.jpg";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Velora Salon & Spa in Banani, our promises and how online booking works.",
};

export const dynamic = "force-dynamic";

const ICONS = [BadgeCheck, Wallet, Droplets, Leaf];

const GALLERY = [
  { src: g1, alt: "Styling floor with natural light", className: "row-span-2" },
  { src: steps, alt: "Stylist adding soft waves", className: "" },
  { src: g2, alt: "Quiet lounge for guests", className: "" },
  { src: about, alt: "Reception with arched mirror", className: "col-span-2 sm:col-span-1" },
  { src: g3, alt: "Relaxation corner with a stone bath", className: "" },
];

export default async function AboutPage() {
  const { data } = await getCategorySummaries();
  const services = data ? data.reduce((n, c) => n + c.count, 0) : null;

  return (
    <>
      <PageBanner
        image={aboutHero}
        alt="Bright Velora salon floor with styling stations"
        eyebrow="Our story"
        crumb="About"
        title={
          <>
            Crafted for calm, <em className="font-normal text-gold-soft">built for confidence.</em>
          </>
        }
        text="Velora is a modern salon and spa in Banani where unhurried care, honest prices and online booking come together."
      />

      {/* Story */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2 className="h-display mt-3 text-[2.2rem] leading-[1.08] sm:text-5xl">
              A salon that treats your time <em className="font-normal text-gold-deep">like it matters</em>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-3">
              <p>
                We started Velora with one simple idea: a salon visit should feel like a pause in your week, not another thing to
                manage. No waiting on the phone, no guessing what it will cost, no rushing out of the chair.
              </p>
              <p>
                Our senior stylists, colourists, aestheticians and therapists work side by side, so you can book a cut, a facial and a
                massage in one place, and trust that each one gets the same attention.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                [services ? `${services}+` : "20+", "Services"],
                [String(CATEGORIES.length), "Categories"],
                ["10", "Daily time slots"],
                ["7", "Days a week"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-line bg-white p-4 text-center shadow-soft">
                  <dd className="font-display text-3xl text-ink">{v}</dd>
                  <dt className="mt-1 text-xs font-medium text-muted">{l}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120} className="relative">
            <div className="img-reveal arch relative aspect-[4/5] overflow-hidden shadow-lift">
              <Image src={team} alt="Velora stylists in the salon" fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-lift sm:-left-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gold-soft text-gold-deep">
                <CalendarCheck2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Book online in a minute</p>
                <p className="text-xs text-muted">Pay only after we confirm</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink py-20 text-white sm:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-gold-soft before:bg-gold-soft">The Velora promise</p>
            <h2 className="mt-3 max-w-2xl font-display text-[2.2rem] leading-[1.08] font-medium tracking-[-0.02em] sm:text-5xl">
              Four things we never <em className="font-normal text-gold-soft">compromise on</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal key={p.title} delay={i * 80}>
                  <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.07]">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-gold/15 text-gold-soft transition group-hover:bg-gold group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-6 font-display text-sm text-gold-soft">0{i + 1}</p>
                    <h3 className="mt-1 font-display text-2xl">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{p.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Inside Velora"
              title={
                <>
                  A space designed to <em className="font-normal text-gold-deep">slow you down</em>
                </>
              }
              text="Natural light, soft materials and quiet corners. Here's a look around before your first visit."
              action={
                <Link href="/contact" className="btn btn-outline shrink-0">
                  Plan your visit <span className="btn-chip"><ArrowRight /></span>
                </Link>
              }
            />
          </Reveal>
          <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-3">
            {GALLERY.map((g, i) => (
              <Reveal key={g.alt} delay={i * 70} className={g.className}>
                <figure className="group relative h-full overflow-hidden rounded-[1.75rem]">
                  <Image src={g.src} alt={g.alt} fill placeholder="blur" sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]" />
                  <figcaption className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold text-ink opacity-0 backdrop-blur transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {g.alt}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-sand/50">
        <HowItWorks />
      </div>
      <CallToAction />
    </>
  );
}
