"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { CategorySummary } from "@/lib/types";

function meta(summary?: CategorySummary) {
  if (!summary) return "Explore";
  const count = `${summary.count} service${summary.count === 1 ? "" : "s"}`;
  return summary.minPrice != null ? `${count} · from ${formatPrice(summary.minPrice)}` : count;
}

// Desktop: panels that open up as you hover or focus them. Mobile: a swipeable row of cards.
export default function CategoryAccordion({ summaries }: { summaries: CategorySummary[] }) {
  const [active, setActive] = useState(0);
  const byName = new Map(summaries.map((s) => [s.name, s]));

  return (
    <>
      <div className="hidden h-[34rem] gap-3 lg:flex">
        {CATEGORIES.map((cat, i) => {
          const open = active === i;
          return (
            <Link
              key={cat.slug}
              href={`/services?category=${encodeURIComponent(cat.name)}`}
              data-cursor="Explore"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-label={`${cat.name}: ${meta(byName.get(cat.name))}`}
              className={`group relative isolate overflow-hidden rounded-[2rem] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "grow-[4.5]" : "grow"
              } basis-0`}
            >
              <Image
                src={cat.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 1px"
                className={`-z-20 object-cover transition duration-[1.2s] ease-out ${open ? "scale-100" : "scale-110 grayscale-[35%]"}`}
              />
              <div className={`absolute inset-0 -z-10 transition duration-700 ${open ? "bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" : "bg-ink/55"}`} />

              {/* collapsed: number and vertical label */}
              <div className={`absolute inset-0 flex flex-col items-center justify-between py-7 text-cream transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100 delay-200"}`}>
                <span className="font-display text-lg text-gold-soft">0{i + 1}</span>
                <span className="font-display text-xl whitespace-nowrap [writing-mode:vertical-rl] rotate-180">{cat.name}</span>
              </div>

              {/* expanded: full details */}
              <div className={`absolute inset-x-0 bottom-0 p-8 text-white transition duration-500 ${open ? "translate-y-0 opacity-100 delay-300" : "translate-y-6 opacity-0"}`}>
                <p className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">
                  0{i + 1} · {meta(byName.get(cat.name))}
                </p>
                <h3 className="mt-2 font-display text-4xl font-medium whitespace-nowrap">{cat.name}</h3>
                <p className="mt-2 max-w-xs text-sm text-white/75">{cat.blurb}</p>
                <span className="btn btn-light btn-sm mt-6">
                  Explore services <span className="btn-chip"><ArrowUpRight /></span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile and tablet */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/services?category=${encodeURIComponent(cat.name)}`}
            className="group arch relative isolate flex aspect-[3/4] w-[72%] shrink-0 snap-start flex-col justify-end overflow-hidden p-6 text-white sm:w-[40%]"
          >
            <Image src={cat.image} alt="" fill sizes="(min-width: 640px) 40vw, 72vw" className="-z-20 object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <p className="text-[11px] font-semibold tracking-[0.18em] text-gold-soft uppercase">
              0{i + 1} · {meta(byName.get(cat.name))}
            </p>
            <h3 className="mt-1.5 font-display text-2xl">{cat.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-white/75">{cat.blurb}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
