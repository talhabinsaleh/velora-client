import { Quote } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import authImage from "@/public/images/auth.jpg";

export default function AuthShell({ title, subtitle, children }: { title: ReactNode; subtitle: ReactNode; children: ReactNode }) {
  return (
    <section className="container-x py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-line/80 bg-white shadow-lift lg:grid-cols-[1.05fr_1fr]">
        <div className="px-5 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto max-w-md">
            <h1 className="h-display text-4xl leading-tight sm:text-[2.75rem]">{title}</h1>
            <p className="mt-2.5 text-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>

        <div className="relative hidden min-h-[640px] lg:block">
          <Image src={authImage} alt="Calm Velora styling suite with neutral chairs and arched mirrors" fill placeholder="blur" sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <figure className="absolute inset-x-8 bottom-8 rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-xl">
            <Quote className="size-7 text-gold-soft" />
            <blockquote className="mt-3 font-display text-2xl leading-snug">
              Beauty begins the moment you decide to take a little time for yourself.
            </blockquote>
            <figcaption className="mt-4 text-sm text-white/70">The Velora team · Banani, Dhaka</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
