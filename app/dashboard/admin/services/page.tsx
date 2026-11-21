"use client";

import { ArrowDownUp, ExternalLink, Pencil, PlusCircle, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { DashHeader, FilterTabs, TableSkeleton } from "@/components/dashboard/ui";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState } from "@/components/States";
import { api, errorMessage } from "@/lib/api";
import { CATEGORY_NAMES, SORT_OPTIONS } from "@/lib/constants";
import { formatDate, formatDuration, formatPrice } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Paged, Service } from "@/lib/types";

type StatusFilter = "all" | "active" | "inactive";

export default function ManageServicesPage() {
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(draft.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [draft]);

  const query = new URLSearchParams({ page: String(page), limit: "10", sort });
  if (search) query.set("search", search);
  if (status !== "all") query.set("status", status);
  if (category !== "all") query.set("category", category);
  const { data, error, loading, reload, setData } = useApi<Paged<Service>>(`/api/admin/services?${query}`);

  async function toggle(service: Service) {
    const next = service.status === "active" ? "inactive" : "active";
    setToggling(service._id);
    try {
      const res = await api<{ message: string; service: Service }>(`/api/admin/services/${service._id}/status`, { method: "PATCH", body: { status: next } });
      toast.success(res.message);
      setData((d) => (d ? { ...d, items: d.items.map((s) => (s._id === service._id ? res.service : s)) } : d));
      if (status !== "all") reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setToggling(null);
    }
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      const res = await api<{ message: string }>(`/api/admin/services/${deleting._id}`, { method: "DELETE" });
      toast.success(res.message);
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DashHeader
        title="Manage Services"
        text="Add, update, hide or remove services. Only active services appear on the public site and can be booked."
        actions={
          <Link href="/dashboard/admin/services/new" className="btn btn-dark">
            <PlusCircle className="size-4" /> Add service
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <FilterTabs<StatusFilter>
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search by service name…" aria-label="Search services" className="input pl-10" />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
          className="input xl:w-52"
        >
          <option value="all">All categories</option>
          {CATEGORY_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="relative xl:w-52">
          <ArrowDownUp className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            aria-label="Sort services"
            className="input pl-10"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && !data ? (
        <TableSkeleton rows={6} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title={search || status !== "all" || category !== "all" ? "No services match" : "No services yet"}
          message={search || status !== "all" || category !== "all" ? "Try a different search or filter." : "Add your first service to start taking bookings."}
          action={{ href: "/dashboard/admin/services/new", label: "Add a service" }}
        />
      ) : data ? (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((s) => (
                  <tr key={s._id}>
                    <td className="max-w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                          <Image src={s.image} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <p className="truncate font-semibold text-ink">{s.serviceName}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-ink-3">{s.category}</td>
                    <td className="font-semibold">{formatPrice(s.price)}</td>
                    <td className="whitespace-nowrap text-ink-3">{formatDuration(s.duration)}</td>
                    <td>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={s.status === "active"}
                        aria-label={`${s.status === "active" ? "Deactivate" : "Activate"} ${s.serviceName}`}
                        onClick={() => toggle(s)}
                        disabled={toggling === s._id}
                        className="group inline-flex cursor-pointer items-center gap-2 disabled:opacity-60"
                      >
                        <span className={`relative h-6 w-11 rounded-full transition ${s.status === "active" ? "bg-emerald-500" : "bg-stone-300"}`}>
                          <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${s.status === "active" ? "left-[22px]" : "left-0.5"}`} />
                        </span>
                        <span className={`text-xs font-semibold ${s.status === "active" ? "text-emerald-700" : "text-muted"}`}>{s.status === "active" ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="text-xs whitespace-nowrap text-muted">{formatDate(s.createdAt)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {s.status === "active" && (
                          <Link href={`/services/${s._id}`} className="btn btn-ghost btn-sm px-2.5" title="View on site" aria-label={`View ${s.serviceName} on the site`}>
                            <ExternalLink className="size-4" />
                          </Link>
                        )}
                        <Link href={`/dashboard/admin/services/${s._id}/edit`} className="btn btn-outline btn-sm px-3">
                          <Pencil className="size-4" /> Edit
                        </Link>
                        <button type="button" onClick={() => setDeleting(s)} className="btn btn-sm border border-rose-200 bg-white px-3 text-rose hover:bg-rose-50" aria-label={`Delete ${s.serviceName}`}>
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Pagination page={data.page} pages={data.pages} total={data.total} label="services" onChange={setPage} />
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={!!deleting}
        title="Delete this service?"
        message={deleting ? `"${deleting.serviceName}" will be removed permanently. Past appointments keep their records. If you only want to hide it, deactivate it instead.` : ""}
        confirmLabel="Delete service"
        cancelLabel="Cancel"
        tone="danger"
        busy={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
