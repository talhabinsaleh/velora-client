import { ArrowRight, Clock3, Mail, MapPin, Phone, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import SocialIcon from "@/components/SocialIcon";
import { FAQS, SALON } from "@/lib/constants";
import contactHero from "@/public/images/contact-hero.jpg";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, email or visit Velora Salon & Spa in Banani, Dhaka. Opening hours, directions and answers to common questions.",
};

const CARDS = [
  { Icon: Phone, title: "Call us", lines: [SALON.phone], action: { href: SALON.phoneHref, label: "Call now" } },
  { Icon: Mail, title: "Email", lines: [SALON.email], action: { href: `mailto:${SALON.email}`, label: "Write an email" } },
  { Icon: MapPin, title: "Visit", lines: SALON.address.slice(0, 2), action: { href: SALON.mapUrl, label: "Get directions" } },
  { Icon: Clock3, title: "Opening hours", lines: SALON.hours.map((h) => `${h.days}: ${h.time}`), action: { href: "/services", label: "Book a time" } },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner
        image={contactHero}
        alt="Calm Velora styling suite with arched mirrors"
        eyebrow="Get in touch"
        crumb="Contact"
        title={
          <>
            We&apos;d love to <em className="font-normal text-gold-soft">see you.</em>
          </>
        }
        text="Questions about a service, a bridal booking or a payment? Call, write or drop by. Our front desk is here every day."
      />

      <section className="relative z-10 -mt-12">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ Icon, title, lines, action }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="card group flex h-full flex-col p-6 transition duration-500 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-ink text-gold-soft transition group-hover:bg-gold group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-xl text-ink">{title}</h2>
                <div className="mt-1.5 flex-1 space-y-0.5 text-sm text-ink-3">
                  {lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
                <a
                  href={action.href}
                  {...(action.href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep"
                >
                  {action.label} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-4">
            <div className="relative min-h-[340px] flex-1 overflow-hidden rounded-[1.75rem] border border-line shadow-soft">
              <iframe
                title="Map showing Velora Salon & Spa in Banani, Dhaka"
                src="https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sRoad+11,+Banani,+Dhaka+1213!6i15"
                className="absolute inset-0 size-full grayscale-[25%]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-lg text-ink">Follow our latest looks</p>
                <p className="text-sm text-muted">New colour work and bridal looks every week.</p>
              </div>
              <div className="flex gap-2">
                {SALON.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Velora on ${s.label}`}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-3 transition hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-cream"
                  >
                    <SocialIcon name={s.label} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand/60 py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">Good to know</p>
            <h2 className="h-display mt-3 text-[2.2rem] leading-[1.08] sm:text-5xl">
              Questions, <em className="font-normal text-gold-deep">answered</em>
            </h2>
            <p className="mt-4 text-muted">Can&apos;t find what you need? Give us a call and we&apos;ll sort it out together.</p>
            <Link href="/services" className="btn btn-dark mt-8">
              Browse services <span className="btn-chip"><ArrowRight /></span>
            </Link>
          </Reveal>
          <Reveal delay={100} className="divide-y divide-line rounded-[1.75rem] border border-line bg-white px-6 shadow-soft">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink">
                  {f.q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-cream">
                    <Plus className="size-4" />
                  </span>
                </summary>
                <p className="mt-3 pr-10 text-sm leading-relaxed text-ink-3">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
