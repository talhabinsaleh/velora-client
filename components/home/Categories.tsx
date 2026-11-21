import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { getCategorySummaries } from "@/lib/server-api";
import SectionHeading from "./SectionHeading";

// Tile sizes for a 4-column bento grid on large screens
const LAYOUT = [
  "lg:col-span-2 lg:row-span-2",
  "",
  "",
  "",
  "",
  "lg:col-span-2",
  "lg:col-span-2",
];

export default async function Categories() {
  const { data } = await getCategorySummaries();
  const byName = new Map((data ?? []).map((c) => [c.name, c]));

  return (
    <section className="bg-sand/60 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          center
          eyebrow="Service categories"
          title={
            <>
              Explore by <em className="font-normal text-gold-deep">what you need</em>
            </>
          }
          text="From a quick fringe trim to a full bridal look, find the right care in seven categories."
        />

        <div className="mt-12 grid auto-rows-[200px] gap-4 sm:grid-cols-2 sm:auto-rows-[230px] lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const summary = byName.get(cat.name);
            const big = i === 0;
            return (
              <Link
                key={cat.slug}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-xl2 p-5 text-white shadow-soft sm:p-6 ${LAYOUT[i]} ${big ? "sm:col-span-2 sm:row-span-2" : ""}`}
              >
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                  className="-z-20 object-cover transition duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/5 transition group-hover:from-ink/90" />
                <span className="absolute top-4 right-4 inline-flex size-10 translate-y-1 items-center justify-center rounded-full bg-white/15 opacity-0 backdrop-blur-md transition group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="size-5" />
                </span>

                <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-soft uppercase">
                  {summary ? `${summary.count} service${summary.count === 1 ? "" : "s"}` : "Explore"}
                  {summary?.minPrice != null && ` · from ${formatPrice(summary.minPrice)}`}
                </p>
                <h3 className={`mt-1.5 font-display font-medium ${big ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{cat.name}</h3>
                <p className={`mt-1 text-sm text-white/75 ${big ? "max-w-sm" : "line-clamp-1"}`}>{cat.blurb}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
