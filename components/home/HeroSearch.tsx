"use client";

import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CATEGORIES } from "@/lib/constants";

// The search card that overlaps the bottom of the hero
export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  function submit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category !== "all") params.set("category", category);
    router.push(`/services${params.size ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="grid gap-3 rounded-[1.75rem] border border-line/70 bg-white p-3 shadow-lift sm:grid-cols-[1.4fr_1fr_auto] sm:items-end sm:p-4"
    >
      <label className="block">
        <span className="mb-1.5 ml-1 block text-[11px] font-bold tracking-[0.16em] text-muted uppercase">Service</span>
        <span className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Try “balayage”, “facial” or “massage”"
            className="input h-12 bg-cream pl-10"
            aria-label="Search services by name"
          />
        </span>
      </label>
      <label className="block">
        <span className="mb-1.5 ml-1 block text-[11px] font-bold tracking-[0.16em] text-muted uppercase">Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input h-12 bg-cream" aria-label="Category">
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-dark h-12 px-6">
        <Sparkles className="size-4 text-gold-soft" /> Find services
      </button>
    </form>
  );
}
