import { CalendarCheck2, CreditCard, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import interior from "@/public/images/interior2.jpg";
import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";

const STEPS = [
  { Icon: Search, title: "Choose your service", text: "Browse the menu, filter by category and compare prices and durations." },
  { Icon: CalendarCheck2, title: "Request a time", text: "Pick a date and an open time slot. Add a note for your stylist if you like." },
  { Icon: Sparkles, title: "We confirm it", text: "The salon reviews your request and confirms it, usually within a few hours." },
  { Icon: CreditCard, title: "Pay securely", text: "Pay online with Stripe from your dashboard once your slot is confirmed." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Booked in four <em className="font-normal text-gold-deep">easy steps</em>
              </>
            }
            text="No phone calls, no waiting. You only pay after we confirm, so there's never a surprise."
          />
          <ol className="mt-10 space-y-3">
            {STEPS.map(({ Icon, title, text }, i) => (
              <li key={title} className="group flex gap-4 rounded-2xl border border-transparent p-4 transition hover:border-line hover:bg-white hover:shadow-soft">
                <div className="relative">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-ink text-gold-soft transition group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  {i < STEPS.length - 1 && <span aria-hidden className="absolute top-14 left-1/2 h-6 w-px -translate-x-1/2 bg-line" />}
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-gold-deep">STEP 0{i + 1}</p>
                  <h3 className="mt-0.5 font-display text-xl text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="group arch relative aspect-[4/5] overflow-hidden shadow-lift sm:aspect-[5/5.4]">
            <Image src={interior} alt="Velora's warm salon floor with styling stations" fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-[1.4s] ease-out group-hover:scale-105" />
          </div>
          <div className="absolute -bottom-6 left-4 max-w-[17rem] rounded-2xl border border-line bg-white p-4 shadow-lift sm:-left-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <CalendarCheck2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Appointment confirmed</p>
                <p className="text-xs text-muted">Hydra Glow Facial · Sat, 3:00 PM</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-5 right-4 hidden rounded-2xl bg-ink px-5 py-4 text-white shadow-lift sm:block">
            <p className="font-display text-3xl text-gold-soft">10</p>
            <p className="text-xs text-white/70">time slots every day</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
