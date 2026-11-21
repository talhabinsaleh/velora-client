"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

const DURATION = 7000;

// Full-bleed background photos that crossfade with a slow zoom. Shows numbered progress bars.
export default function HeroSlides({ slides }: { slides: { src: StaticImageData; alt: string; label: string }[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), DURATION);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-20">
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              placeholder="blur"
              quality={88}
              sizes="100vw"
              className={`object-cover transition-transform ease-out ${i === active ? "scale-100 duration-[8000ms]" : "scale-[1.12] duration-0"}`}
            />
          </div>
        ))}
      </div>

      <div className="absolute right-4 bottom-32 z-10 hidden items-end gap-5 sm:right-8 md:flex lg:right-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show photo ${i + 1}: ${slide.label}`}
            aria-current={i === active}
            className="group w-32 cursor-pointer text-left"
          >
            <span className={`block text-[11px] font-semibold tracking-[0.16em] whitespace-nowrap uppercase transition ${i === active ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
              0{i + 1} · {slide.label}
            </span>
            <span className="mt-2 block h-[2px] overflow-hidden rounded-full bg-white/25">
              <span
                key={i === active ? `on-${active}` : "off"}
                className={`block h-full origin-left bg-gold-soft ${i === active ? "animate-[grow_7s_linear_forwards]" : "scale-x-0"}`}
              />
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
