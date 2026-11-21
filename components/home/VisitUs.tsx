import { ArrowRight, BadgeCheck, Clock, Droplets, Leaf, MapPin, Phone, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SALON } from "@/lib/constants";
import about from "@/public/images/about.jpg";
import SectionHeading from "./SectionHeading";

const PROMISES = [
  { Icon: BadgeCheck, title: "Certified stylists", text: "Every artist has at least five years of salon experience." },
  { Icon: Wallet, title: "Honest pricing", text: "The price you see is the price you pay. No hidden extras." },
  { Icon: Droplets, title: "Hygiene first", text: "Tools are sterilised after every guest, towels are single use." },
  { Icon: Leaf, title: "Gentle products", text: "Salon-grade, cruelty-free brands chosen for every hair and skin type." },
];

// Extra home page section: why Velora, plus where to find the salon and when it is open
export default function VisitUs() {
  return (
    <section className="bg-ink py-20 text-white sm:py-28">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-gold-soft before:bg-gold-soft">The Velora promise</p>
            <h2 className="mt-3 font-display text-[2.1rem] leading-[1.08] font-medium tracking-[-0.02em] sm:text-5xl">
              A salon that treats your time <em className="font-normal text-gold-soft">like it matters</em>
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {PROMISES.map(({ Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-gold/40 hover:bg-white/[0.07]">
                  <Icon className="size-6 text-gold" />
                  <h3 className="mt-4 font-display text-xl">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white text-ink">
            <div className="relative aspect-[16/10]">
              <Image src={about} alt="Bright reception and styling area at Velora" fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow">Visit the salon</p>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>{SALON.address.join(", ")}</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>
                    {SALON.hours.map((h) => (
                      <span key={h.days} className="block">
                        <span className="font-semibold">{h.days}:</span> {h.time}
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-gold" />
                  <a href={SALON.phoneHref} className="hover:text-gold-deep">
                    {SALON.phone}
                  </a>
                </li>
              </ul>
              <div className="mt-7 flex flex-wrap gap-2">
                <Link href="/services" className="btn btn-dark">
                  Book an appointment <span className="btn-chip"><ArrowRight /></span>
                </Link>
                <a href={SALON.mapUrl} target="_blank" rel="noreferrer noopener" className="btn btn-outline">
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CallToAction() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold-soft via-sand to-blush px-6 py-14 text-center sm:px-12 sm:py-16">
          <div aria-hidden className="absolute -top-20 -right-16 -z-10 size-72 rounded-full bg-white/50 blur-2xl" />
          <div aria-hidden className="absolute -bottom-24 -left-10 -z-10 size-72 rounded-full bg-gold/20 blur-3xl" />
          <SectionHeading
            center
            eyebrow="Your chair is waiting"
            title={
              <>
                Ready for your next <em className="font-normal text-gold-deep">glow-up?</em>
              </>
            }
            text="Create a free account in seconds, request a slot and we'll take it from there."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/services" data-magnetic className="btn btn-dark btn-lg">
              Explore Salon Services <span className="btn-chip"><ArrowRight /></span>
            </Link>
            <Link href="/sign-up" className="btn btn-outline btn-lg">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
