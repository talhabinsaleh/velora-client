import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BRAND, CATEGORIES, SALON } from "@/lib/constants";
import Logo from "./Logo";
import SocialIcon from "./SocialIcon";

export default function Footer({ signedIn }: { signedIn: boolean }) {
  const explore = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
    ...(signedIn
      ? [{ href: "/dashboard", label: "Dashboard" }]
      : [
          { href: "/sign-in", label: "Sign In" },
          { href: "/sign-up", label: "Sign Up" },
        ]),
    { href: "/#how-it-works", label: "How It Works" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-white/75">
      {/* soft gold glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

      <div className="container-x relative grid gap-12 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{BRAND.description}</p>
          <div className="mt-6 flex gap-2.5">
            {SALON.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Velora on ${s.label}`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-white"
              >
                <SocialIcon name={s.label} />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-gold-soft">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">Services</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/services?category=${encodeURIComponent(c.name)}`} className="transition hover:text-gold-soft">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">Visit the salon</h3>
            <a href={SALON.mapUrl} target="_blank" rel="noreferrer noopener" className="mt-5 flex gap-3 text-sm transition hover:text-gold-soft">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                {SALON.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </a>
            <div className="mt-4 flex gap-3 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
              <dl className="space-y-1">
                {SALON.hours.map((h) => (
                  <div key={h.days}>
                    <dt className="text-white/90">{h.days}</dt>
                    <dd className="text-white/60">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <a href={SALON.phoneHref} className="flex items-center gap-3 transition hover:text-gold-soft">
              <Phone className="size-4 text-gold" /> {SALON.phone}
            </a>
            <a href={`mailto:${SALON.email}`} className="flex items-center gap-3 transition hover:text-gold-soft">
              <Mail className="size-4 text-gold" /> {SALON.email}
            </a>
          </div>
        </div>
      </div>

      {/* oversized wordmark */}
      <div aria-hidden className="pointer-events-none relative -mb-[3vw] overflow-hidden select-none">
        <p className="bg-gradient-to-b from-white/[0.09] to-white/0 bg-clip-text text-center font-display text-[24vw] leading-[0.8] font-medium tracking-[-0.05em] text-transparent">
          Velora
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Velora Salon &amp; Spa. All rights reserved.</p>
          <p>Secure payments by Stripe · Made with care in Dhaka</p>
        </div>
      </div>
    </footer>
  );
}
