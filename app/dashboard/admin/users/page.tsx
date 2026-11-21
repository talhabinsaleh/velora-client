"use client";

import { Ban, Eye, Mail, Phone, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ServiceCell } from "@/components/dashboard/AppointmentDetails";
import { DashHeader, FilterTabs, TableSkeleton } from "@/components/dashboard/ui";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState, Spinner } from "@/components/States";
import StatusBadge from "@/components/StatusBadge";
import { api, errorMessage } from "@/lib/api";
import { formatAppointmentDate, formatDate, formatPrice } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Appointment, Paged, UserSummary } from "@/lib/types";

type Customer = UserSummary & { appointmentCount: number };
interface CustomerDetails extends UserSummary {
  stats: { total: number; pending: number; confirmed: number; cancelled: number; payments: number; totalPaid: number };
  recent: Appointment[];
}
type Filter = "all" | "active" | "blocked";

export default function ManageUsersPage() {
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [target, setTarget] = useState<Customer | UserSummary | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(draft.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [draft]);

  const query = new URLSearchParams({ page: String(page), limit: "10" });
  if (search) query.set("search", search);
  if (filter !== "all") query.set("status", filter);
  const { data, error, loading, reload } = useApi<Paged<Customer>>(`/api/admin/users?${query}`);
  const details = useApi<CustomerDetails>(viewId ? `/api/admin/users/${viewId}` : null);

  async function toggleBlock() {
    if (!target) return;
    setBusy(true);
    try {
      const res = await api<{ message: string }>(`/api/admin/users/${target._id}/${target.isBlocked ? "unblock" : "block"}`, { method: "PATCH" });
      toast.success(res.message);
      setTarget(null);
      reload();
      if (viewId) details.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const d = details.data;

  return (
    <>
      <DashHeader title="Manage Users" text="Every registered customer. Blocked customers are signed out and can't book, pay or open their dashboard." />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterTabs<Filter>
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All customers" },
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
        />
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search by name or email…" aria-label="Search customers" className="input pl-10" />
        </div>
      </div>

      {loading && !data ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.items.length === 0 ? (
        <EmptyState title="No customers found" message={search || filter !== "all" ? "Try another search or filter." : "Customers appear here once they sign up."} />
      ) : data ? (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Appointments</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} image={u.image} size={38} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{u.name}</p>
                          <p className="truncate text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-ink-3">{u.phone || <span className="text-muted">—</span>}</td>
                    <td className="font-semibold">{u.appointmentCount}</td>
                    <td className="text-xs whitespace-nowrap text-muted">{u.createdAt ? formatDate(u.createdAt) : "—"}</td>
                    <td>
                      <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button type="button" onClick={() => setViewId(u._id)} className="btn btn-ghost btn-sm px-3">
                          <Eye className="size-4" /> View
                        </button>
                        {u.isBlocked ? (
                          <button type="button" onClick={() => setTarget(u)} className="btn btn-outline btn-sm px-3 text-emerald-700">
                            <ShieldCheck className="size-4" /> Unblock
                          </button>
                        ) : (
                          <button type="button" onClick={() => setTarget(u)} className="btn btn-sm border border-rose-200 bg-white px-3 text-rose hover:bg-rose-50">
                            <Ban className="size-4" /> Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Pagination page={data.page} pages={data.pages} total={data.total} label="customers" onChange={setPage} />
          </div>
        </div>
      ) : null}

      <Modal
        open={!!viewId}
        onClose={() => setViewId(null)}
        title="Customer details"
        size="md"
        footer={
          d && (
            <>
              <button type="button" onClick={() => setTarget(d)} className={`btn ${d.isBlocked ? "btn-outline text-emerald-700" : "btn-outline text-rose"}`}>
                {d.isBlocked ? "Unblock customer" : "Block customer"}
              </button>
              <button type="button" onClick={() => setViewId(null)} className="btn btn-dark">
                Close
              </button>
            </>
          )
        }
      >
        {details.loading && !d ? (
          <Spinner label="Loading customer…" className="py-10" />
        ) : details.error ? (
          <ErrorState message={details.error} onRetry={details.reload} />
        ) : d ? (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={d.name} image={d.image} size={64} />
              <div className="min-w-0">
                <p className="font-display text-2xl text-ink">{d.name}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Mail className="size-3.5" /> {d.email}
                </p>
                {d.phone && (
                  <p className="flex items-center gap-1.5 text-sm text-muted">
                    <Phone className="size-3.5" /> {d.phone}
                  </p>
                )}
              </div>
              <StatusBadge status={d.isBlocked ? "blocked" : "active"} className="ml-auto" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Requests", d.stats.total],
                ["Pending", d.stats.pending],
                ["Confirmed", d.stats.confirmed],
                ["Paid", formatPrice(d.stats.totalPaid)],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-2xl bg-sand/60 p-3 text-center">
                  <p className="font-display text-2xl text-ink">{value}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">Member since {d.createdAt ? formatDate(d.createdAt) : "—"}</p>
            <h3 className="mt-5 text-xs font-semibold tracking-wide text-muted uppercase">Recent appointments</h3>
            {d.recent.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No appointments yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-line">
                {d.recent.map((a) => (
                  <li key={a._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <ServiceCell appointment={a} />
                    <span className="text-xs text-muted">
                      {formatAppointmentDate(a.appointmentDate)} · {a.timeSlot}
                    </span>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={!!target}
        title={target?.isBlocked ? "Unblock this customer?" : "Block this customer?"}
        message={
          target
            ? target.isBlocked
              ? `${target.name} will be able to sign in, book and pay again.`
              : `${target.name} will be signed out immediately and won't be able to sign in, book or pay until you unblock them.`
            : ""
        }
        confirmLabel={target?.isBlocked ? "Unblock" : "Block customer"}
        cancelLabel="Cancel"
        tone={target?.isBlocked ? "default" : "danger"}
        busy={busy}
        onConfirm={toggleBlock}
        onClose={() => setTarget(null)}
      />
    </>
  );
}
