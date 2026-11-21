import { ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// Full-width photo banner used at the top of the About and Contact pages
export default function PageBanner({
  image,
  alt,
  eyebrow,
  title,
  text,
  crumb,
  children,
}: {
  image: StaticImageData;
  alt: string;
  eyebrow: string;
  title: ReactNode;
  text: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink pt-32 pb-16 text-white sm:pb-20">
      <Image src={image} alt={alt} fill priority placeholder="blur" quality={88} sizes="100vw" className="-z-20 animate-[kenburns_14s_ease-out_both] object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(12_24_20/0.9)_0%,rgb(12_24_20/0.6)_50%,rgb(12_24_20/0.25)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/60 to-transparent" />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="flex animate-fade-up items-center gap-1.5 text-xs font-medium text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-white">{crumb}</span>
        </nav>
        <p className="mt-6 inline-flex animate-fade-up items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-gold-soft uppercase [animation-delay:60ms]">
          <span className="h-px w-6 bg-gold-soft" /> {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] font-medium tracking-[-0.03em] sm:text-7xl">
          <span className="line-mask line-in">
            <span>{title}</span>
          </span>
        </h1>
        <p className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-white/75 [animation-delay:200ms] sm:text-lg">{text}</p>
        {children}
      </div>
    </section>
  );
}
