"use client";

import { ArrowDownUp, Search, SearchX, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "@/components/Pagination";
import ServiceCard, { ServiceGridSkeleton } from "@/components/ServiceCard";
import { EmptyState, ErrorState } from "@/components/States";
import { api, errorMessage } from "@/lib/api";
import { CATEGORY_NAMES, SORT_OPTIONS } from "@/lib/constants";
import type { Paged, Service } from "@/lib/types";

const PAGE_SIZE = 9;

export default function ServiceBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = params.get("search") ?? "";
  const category = CATEGORY_NAMES.includes(params.get("category") ?? "") ? (params.get("category") as string) : "all";
  const sort = SORT_OPTIONS.some((o) => o.value === params.get("sort")) ? (params.get("sort") as string) : "newest";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [draft, setDraft] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  const [reload, setReload] = useState(0);
  const requestKey = `${reload}|${search}|${category}|${sort}|${page}`;
  const [state, setState] = useState<{ key: string; result: Paged<Service> | null; error: string | null }>({ key: "", result: null, error: null });
  const result = state.result;
  const loading = state.key !== requestKey;
  const error = loading ? null : state.error;
  const topRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "" || value === "all" || (key === "sort" && value === "newest") || (key === "page" && value === "1")) {
          next.delete(key);
        } else next.set(key, value);
      }
      if (!("page" in changes)) next.delete("page");
      router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
    },
    [params, pathname, router],
  );

  // Keep the box in sync when the URL changes from elsewhere (back button, category links)
  if (syncedSearch !== search) {
    setSyncedSearch(search);
    setDraft(search);
  }

  // Debounced search while typing
  useEffect(() => {
    if (draft.trim() === search) return;
    const timer = setTimeout(() => update({ search: draft.trim() }), 350);
    return () => clearTimeout(timer);
  }, [draft, search, update]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE), sort });
    if (search) query.set("search", search);
    if (category !== "all") query.set("category", category);

    api<Paged<Service>>(`/api/services?${query}`, { signal: controller.signal })
      .then((data) => setState({ key: requestKey, result: data, error: null }))
      .catch((err) => {
        if ((err as Error).name !== "AbortError") {
          setState((s) => ({ key: requestKey, result: s.result, error: errorMessage(err, "Could not load services.") }));
        }
      });
    return () => controller.abort();
  }, [search, category, sort, page, requestKey]);

  const hasFilters = search !== "" || category !== "all";

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Toolbar */}
      <div className="sticky top-[4.6rem] z-30 -mx-4 border-b border-line/70 bg-cream/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && update({ search: draft.trim() })}
              placeholder="Search services by name…"
              aria-label="Search services by name"
              className="input pr-10 pl-10"
            />
            {draft && (
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  update({ search: null });
                }}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-sand"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <label className="relative flex items-center lg:w-60">
            <ArrowDownUp className="pointer-events-none absolute left-3.5 size-4 text-muted" />
            <select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort services" className="input pl-10">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-0.5" role="tablist" aria-label="Filter by category">
          {["all", ...CATEGORY_NAMES].map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              data-active={category === c}
              onClick={() => update({ category: c })}
              className="chip"
            >
              {c === "all" ? "All services" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <p aria-live="polite">
            {loading
              ? "Finding services…"
              : result
                ? `${result.total} service${result.total === 1 ? "" : "s"}${category !== "all" ? ` in ${category}` : ""}${search ? ` matching “${search}”` : ""}`
                : ""}
          </p>
          {hasFilters && (
            <button type="button" onClick={() => update({ search: null, category: null })} className="inline-flex cursor-pointer items-center gap-1 font-semibold text-gold-deep hover:underline">
              <X className="size-3.5" /> Clear filters
            </button>
          )}
        </div>

        {loading && !result ? (
          <ServiceGridSkeleton count={PAGE_SIZE} />
        ) : error && !loading ? (
          <ErrorState message={error} onRetry={() => setReload((n) => n + 1)} />
        ) : result && result.items.length === 0 ? (
          <EmptyState
            icon={<SearchX className="size-6" />}
            title="No services found"
            message={hasFilters ? "Try another name or category. Only services currently available for booking are shown." : "There are no services available right now."}
            action={
              hasFilters ? (
                <button type="button" onClick={() => update({ search: null, category: null })} className="btn btn-dark btn-sm">
                  Show all services
                </button>
              ) : undefined
            }
          />
        ) : result ? (
          <div className={`transition-opacity duration-200 ${loading ? "pointer-events-none opacity-50" : ""}`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((service, i) => (
                <ServiceCard key={service._id} service={service} priority={i < 3} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination
                page={result.page}
                pages={result.pages}
                total={result.total}
                label="services"
                onChange={(p) => {
                  update({ page: String(p) });
                  topRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
