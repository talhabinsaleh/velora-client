import { ArrowRight, Clock, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/hero.jpg";
import HeroSearch from "./HeroSearch";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pt-28 pb-40 sm:pb-44">
        <Image
          src={heroImage}
          alt="Warm, softly lit Velora salon interior with styling chairs and mirrors"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-20 scale-105 object-cover"
        />
        {/* Darker on the left so the headline stays readable */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(20_15_12/0.92)_0%,rgb(20_15_12/0.72)_45%,rgb(20_15_12/0.25)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink/70 to-transparent" />

        <div className="container-x">
          <div className="max-w-2xl text-white">
            <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pr-4 pl-1.5 text-xs font-semibold backdrop-blur-md">
              <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] tracking-wider uppercase">New</span>
              Book online · Pay after we confirm
            </p>

            <h1 className="mt-6 animate-fade-up font-display text-[2.85rem] leading-[1.02] font-medium tracking-[-0.03em] [animation-delay:80ms] sm:text-6xl lg:text-[5.25rem]">
              Where every visit
              <span className="block font-normal text-gold-soft italic">feels like a ritual.</span>
            </h1>

            <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-white/75 [animation-delay:160ms] sm:text-lg">
              Hair, skin, nails and spa care by Velora&apos;s senior stylists in Banani. Explore our menu, pick a time that suits
              you and we&apos;ll confirm your appointment within hours.
            </p>

            <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:240ms]">
              <Link href="/services" className="btn btn-gold btn-lg">
                Explore Salon Services <ArrowRight className="arrow size-4" />
              </Link>
              <Link href="#how-it-works" className="btn btn-glass btn-lg">
                How it works
              </Link>
            </div>

            <ul className="mt-12 flex animate-fade-up flex-wrap gap-x-8 gap-y-3 text-sm text-white/70 [animation-delay:320ms]">
              <li className="flex items-center gap-2">
                <Star className="size-4 fill-gold text-gold" /> Senior, certified stylists
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-gold" /> Open daily · 10 AM – 8 PM
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-gold" /> Secure Stripe checkout
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-24 sm:-mt-20">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            <HeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
