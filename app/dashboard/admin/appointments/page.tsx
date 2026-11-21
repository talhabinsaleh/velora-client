"use client";

import { CheckCircle2, Eye, MessageSquareText, Search, XCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { RequestBadge } from "@/components/dashboard/CustomerModals";
import Modal from "@/components/Modal";
import AppointmentDetails, { ServiceCell } from "@/components/dashboard/AppointmentDetails";
import { DashHeader, FilterTabs, TableSkeleton } from "@/components/dashboard/ui";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState } from "@/components/States";
import StatusBadge from "@/components/StatusBadge";
import { api, errorMessage } from "@/lib/api";
import { formatAppointmentDate, formatDate, formatPrice } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Appointment, Paged, UserSummary } from "@/lib/types";

type Status = "all" | "pending" | "confirmed" | "cancelled" | "requests";
type Payment = "all" | "paid" | "unpaid";
type Action = { kind: "confirm" | "cancel"; appointment: Appointment };

function customerOf(a: Appointment) {
  return typeof a.customerId === "object" ? (a.customerId as UserSummary | null) : null;
}

function ManageAppointments() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const status = (
    params.get("request") === "open" ? "requests" : ["pending", "confirmed", "cancelled"].includes(params.get("status") ?? "") ? params.get("status") : "all"
  ) as Status;
  const payment = (["paid", "unpaid"].includes(params.get("payment") ?? "") ? params.get("payment") : "all") as Payment;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("search") ?? "";
  const [draft, setDraft] = useState(search);

  const query = new URLSearchParams({ page: String(page), limit: "10" });
  if (status === "requests") query.set("request", "open");
  else if (status !== "all") query.set("status", status);
  if (payment !== "all") query.set("payment", payment);
  if (search) query.set("search", search);
  const { data, error, loading, reload } = useApi<Paged<Appointment>>(`/api/admin/appointments?${query}`);

  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const [declining, setDeclining] = useState<Appointment | null>(null);
  const [note, setNote] = useState("");

  async function decline() {
    if (!declining) return;
    setBusy(true);
    try {
      const res = await api<{ message: string }>(`/api/admin/appointments/${declining._id}/cancel-request/decline`, { method: "PATCH", body: { note: note.trim() } });
      toast.success(res.message);
      setDeclining(null);
      setViewing(null);
      setNote("");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function setParam(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v && v !== "all" && !(k === "page" && v === "1")) next.set(k, v);
      else next.delete(k);
    }
    if (!("page" in changes)) next.delete("page");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }

  useEffect(() => {
    if (draft.trim() === search) return;
    const t = setTimeout(() => setParam({ search: draft.trim() || null }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  async function run() {
    if (!action) return;
    setBusy(true);
    try {
      const res = await api<{ message: string }>(`/api/admin/appointments/${action.appointment._id}/${action.kind}`, { method: "PATCH" });
      toast.success(res.message);
      setAction(null);
      setViewing(null);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
      reload();
    } finally {
      setBusy(false);
    }
  }

  const canCancel = (a: Appointment) => a.status !== "cancelled" && a.paymentStatus === "unpaid";

  function buttons(a: Appointment) {
    return (
      <div className="flex justify-end gap-1.5">
        <button type="button" onClick={() => setViewing(a)} className="btn btn-ghost btn-sm px-2.5" aria-label="View details">
          <Eye className="size-4" />
        </button>
        {a.status === "pending" && (
          <button type="button" onClick={() => setAction({ kind: "confirm", appointment: a })} className="btn btn-sm bg-emerald-600 px-3 text-white hover:bg-emerald-700">
            <CheckCircle2 className="size-4" /> Confirm
          </button>
        )}
        {canCancel(a) && (
          <button type="button" onClick={() => setAction({ kind: "cancel", appointment: a })} className="btn btn-sm border border-rose-200 bg-white px-3 text-rose hover:bg-rose-50">
            <XCircle className="size-4" /> Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <DashHeader title="Manage Appointments" text="Review every request. Confirm pending ones so customers can pay, or cancel when a slot can't be honoured." />

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <FilterTabs<Status>
          value={status}
          onChange={(v) => (v === "requests" ? setParam({ status: null, request: "open" }) : setParam({ status: v, request: null }))}
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "cancelled", label: "Cancelled" },
            { value: "requests", label: "Cancel requests" },
          ]}
        />
        <select value={payment} onChange={(e) => setParam({ payment: e.target.value })} aria-label="Filter by payment" className="input xl:w-44">
          <option value="all">Any payment</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search customer name, email or service…" aria-label="Search appointments" className="input pl-10" />
        </div>
      </div>

      {loading && !data ? (
        <TableSkeleton rows={6} cols={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.items.length === 0 ? (
        <EmptyState title="No appointments found" message={status === "all" && !search ? "Appointment requests from customers will appear here." : "Try another filter or search."} />
      ) : data ? (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="table-wrap">
            <table className="table min-w-[900px]">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service · Message</th>
                  <th>Date &amp; time</th>
                  <th>Price</th>
                  <th>Status · Payment</th>
                  <th>Requested</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((a) => {
                  const c = customerOf(a);
                  return (
                    <tr key={a._id}>
                      <td className="max-w-[190px]">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c?.name} image={c?.image} size={34} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{c?.name ?? "Deleted user"}</p>
                            <p className="truncate text-xs text-muted">{c?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[200px]">
                        <ServiceCell appointment={a} />
                        {a.message && (
                          <p className="mt-1.5 flex max-w-[200px] items-start gap-1 text-xs text-muted" title={a.message}>
                            <MessageSquareText className="mt-px size-3.5 shrink-0 text-gold" />
                            <span className="truncate italic">“{a.message}”</span>
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <p className="font-medium">{formatAppointmentDate(a.appointmentDate)}</p>
                        <p className="text-xs text-muted">{a.timeSlot}</p>
                      </td>
                      <td className="font-semibold">{formatPrice(a.servicePrice)}</td>
                      <td>
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={a.status} />
                          <StatusBadge status={a.paymentStatus} />
                          <RequestBadge appointment={a} />
                        </div>
                      </td>
                      <td className="text-xs whitespace-nowrap text-muted">{formatDate(a.createdAt)}</td>
                      <td>{buttons(a)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Pagination page={data.page} pages={data.pages} total={data.total} label="appointments" onChange={(p) => setParam({ page: String(p) })} />
          </div>
        </div>
      ) : null}

      <AppointmentDetails
        appointment={viewing}
        onClose={() => setViewing(null)}
        showCustomer
        footer={
          viewing && (
            <>
              {viewing.cancelRequest?.status === "open" && (
                <button type="button" onClick={() => setDeclining(viewing)} className="btn btn-outline">
                  Decline request
                </button>
              )}
              {canCancel(viewing) && (
                <button type="button" onClick={() => setAction({ kind: "cancel", appointment: viewing })} className="btn btn-outline text-rose">
                  {viewing.cancelRequest?.status === "open" ? "Approve & cancel" : "Cancel appointment"}
                </button>
              )}
              {viewing.status === "pending" && (
                <button type="button" onClick={() => setAction({ kind: "confirm", appointment: viewing })} className="btn bg-emerald-600 text-white hover:bg-emerald-700">
                  <CheckCircle2 className="size-4" /> Confirm appointment
                </button>
              )}
              <button type="button" onClick={() => setViewing(null)} className="btn btn-dark">
                Close
              </button>
            </>
          )
        }
      />

      <Modal
        open={!!declining}
        onClose={() => setDeclining(null)}
        locked={busy}
        title="Decline cancellation request?"
        description="The appointment stays confirmed. Your reply is shown to the customer."
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setDeclining(null)} disabled={busy}>
              Go back
            </button>
            <button type="button" className="btn btn-dark" onClick={decline} disabled={busy}>
              Decline request
            </button>
          </>
        }
      >
        {declining?.cancelRequest && <p className="rounded-2xl bg-sand/70 p-4 text-sm text-ink-3">“{declining.cancelRequest.reason}”</p>}
        <label htmlFor="decline-note" className="label mt-4">
          Reply to the customer <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id="decline-note" rows={3} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} className="input" placeholder="e.g. We can move you to another day instead, please call us." />
      </Modal>

      <ConfirmDialog
        open={!!action}
        title={action?.kind === "confirm" ? "Confirm this appointment?" : "Cancel this appointment?"}
        message={
          action
            ? `${customerOf(action.appointment)?.name ?? "The customer"} · ${action.appointment.serviceId?.serviceName ?? "service"} on ${formatAppointmentDate(action.appointment.appointmentDate)} at ${action.appointment.timeSlot}. ${
                action.kind === "confirm" ? "The customer will be able to pay for it from their dashboard." : "The time slot will be released and the customer will see it as cancelled."
              }`
            : ""
        }
        confirmLabel={action?.kind === "confirm" ? "Yes, confirm" : "Yes, cancel"}
        cancelLabel="Go back"
        tone={action?.kind === "cancel" ? "danger" : "default"}
        busy={busy}
        onConfirm={run}
        onClose={() => setAction(null)}
      />
    </>
  );
}

export default function ManageAppointmentsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={6} cols={8} />}>
      <ManageAppointments />
    </Suspense>
  );
}
