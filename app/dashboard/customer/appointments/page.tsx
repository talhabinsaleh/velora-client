"use client";

import { CalendarPlus, CreditCard, Eye, Loader2, RotateCcw, Star, Undo2, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import AppointmentDetails, { ServiceCell } from "@/components/dashboard/AppointmentDetails";
import { CancelRequestModal, RequestBadge, ReviewModal } from "@/components/dashboard/CustomerModals";
import { Stars } from "@/components/Stars";
import { DashHeader, FilterTabs, TableSkeleton } from "@/components/dashboard/ui";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState } from "@/components/States";
import StatusBadge from "@/components/StatusBadge";
import { api, errorMessage } from "@/lib/api";
import { formatAppointmentDate, formatDate, formatPrice } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Appointment, Paged } from "@/lib/types";

type Filter = "all" | "pending" | "confirmed" | "cancelled";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

function MyAppointments() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const status = (FILTERS.some((f) => f.value === params.get("status")) ? params.get("status") : "all") as Filter;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const query = new URLSearchParams({ page: String(page), limit: "8" });
  if (status !== "all") query.set("status", status);
  const { data, error, loading, reload } = useApi<Paged<Appointment>>(`/api/appointments/mine?${query}`);

  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<Appointment | null>(null);
  const [requesting, setRequesting] = useState<Appointment | null>(null);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all" && !(key === "page" && value === "1")) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }

  async function cancel() {
    if (!cancelling) return;
    setBusy(true);
    try {
      const res = await api<{ message: string }>(`/api/appointments/${cancelling._id}/cancel`, { method: "PATCH" });
      toast.success(res.message);
      setCancelling(null);
      setViewing(null);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function pay(a: Appointment) {
    setPaying(a._id);
    try {
      const { url } = await api<{ url: string }>("/api/payments/checkout", { method: "POST", body: { appointmentId: a._id } });
      toast.loading("Taking you to secure Stripe checkout…", { id: "stripe" });
      window.location.assign(url);
    } catch (err) {
      toast.error(errorMessage(err, "Could not start the payment. Please try again."));
      setPaying(null);
    }
  }

  function actions(a: Appointment, compact = false) {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "" : "justify-end"}`}>
        <button type="button" onClick={() => setViewing(a)} className="btn btn-ghost btn-sm px-3" aria-label="View appointment details">
          <Eye className="size-4" /> View
        </button>
        {a.status === "pending" && (
          <button type="button" onClick={() => setCancelling(a)} className="btn btn-sm border border-rose-200 bg-white px-3 text-rose hover:bg-rose-50">
            <XCircle className="size-4" /> Cancel
          </button>
        )}
        {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
          <button type="button" onClick={() => pay(a)} disabled={paying !== null} className="btn btn-gold btn-sm px-3.5">
            {paying === a._id ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
            {paying === a._id ? "Redirecting…" : "Pay Now"}
          </button>
        )}
        {a.status === "confirmed" && a.paymentStatus === "unpaid" && a.cancelRequest?.status !== "open" && (
          <button type="button" onClick={() => setRequesting(a)} className="btn btn-ghost btn-sm px-3 text-rose" title="Ask the salon to cancel">
            <Undo2 className="size-4" /> Request cancel
          </button>
        )}
        {a.paymentStatus === "paid" && !a.review && (
          <button type="button" onClick={() => setReviewing(a)} className="btn btn-outline btn-sm px-3">
            <Star className="size-4 text-amber-500" /> Rate visit
          </button>
        )}
        {(a.status === "cancelled" || a.paymentStatus === "paid") && a.serviceId?.status === "active" && (
          <Link href={`/services/${a.serviceId._id}`} className="btn btn-ghost btn-sm px-3" title="Book this service again">
            <RotateCcw className="size-4" /> Book again
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <DashHeader
        title="My Appointments"
        text="Every appointment request you've made. Cancel while pending, pay once the salon confirms, and rate your visit afterwards."
        actions={
          <Link href="/services" className="btn btn-dark">
            <CalendarPlus className="size-4" /> New appointment
          </Link>
        }
      />

      <div className="mb-5">
        <FilterTabs value={status} options={FILTERS} onChange={(v) => setParam("status", v)} />
      </div>

      {loading && !data ? (
        <TableSkeleton rows={5} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title={status === "all" ? "No appointments yet" : `No ${status} appointments`}
          message={status === "all" ? "When you request an appointment it will show up here." : "Try another filter."}
          action={status === "all" ? { href: "/services", label: "Browse services" } : undefined}
        />
      ) : data ? (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {/* Desktop table */}
          <div className="table-wrap hidden md:block">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date &amp; time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Requested</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((a) => (
                  <tr key={a._id}>
                    <td className="max-w-[240px]">
                      <ServiceCell appointment={a} />
                    </td>
                    <td className="whitespace-nowrap">
                      <p className="font-medium text-ink">{formatAppointmentDate(a.appointmentDate)}</p>
                      <p className="text-xs text-muted">{a.timeSlot}</p>
                    </td>
                    <td className="font-semibold whitespace-nowrap">{formatPrice(a.servicePrice)}</td>
                    <td>
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={a.status} />
                        <RequestBadge appointment={a} />
                        {a.review && <Stars value={a.review.rating} size={12} />}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={a.paymentStatus} />
                    </td>
                    <td className="text-xs whitespace-nowrap text-muted">{formatDate(a.createdAt)}</td>
                    <td>{actions(a)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {data.items.map((a) => (
              <li key={a._id} className="card p-4">
                <ServiceCell appointment={a} />
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="block text-xs text-muted">Date</span>
                    {formatAppointmentDate(a.appointmentDate)}
                  </p>
                  <p>
                    <span className="block text-xs text-muted">Time</span>
                    {a.timeSlot}
                  </p>
                  <p>
                    <span className="block text-xs text-muted">Price</span>
                    <strong>{formatPrice(a.servicePrice)}</strong>
                  </p>
                  <p>
                    <span className="block text-xs text-muted">Requested</span>
                    {formatDate(a.createdAt)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={a.status} />
                  <StatusBadge status={a.paymentStatus} />
                  <RequestBadge appointment={a} />
                  {a.review && <Stars value={a.review.rating} size={12} />}
                </div>
                <div className="mt-3 border-t border-line pt-3">{actions(a, true)}</div>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Pagination page={data.page} pages={data.pages} total={data.total} label="appointments" onChange={(p) => setParam("page", String(p))} />
          </div>
        </div>
      ) : null}

      <AppointmentDetails
        appointment={viewing}
        onClose={() => setViewing(null)}
        footer={
          viewing && (
            <>
              {viewing.status === "pending" && (
                <button type="button" onClick={() => setCancelling(viewing)} className="btn btn-outline text-rose">
                  Cancel request
                </button>
              )}
              {viewing.status === "confirmed" && viewing.paymentStatus === "unpaid" && (
                <button type="button" onClick={() => pay(viewing)} disabled={paying !== null} className="btn btn-gold">
                  {paying ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />} Pay {formatPrice(viewing.servicePrice)} now
                </button>
              )}
              <button type="button" onClick={() => setViewing(null)} className="btn btn-dark">
                Close
              </button>
            </>
          )
        }
      />

      <ReviewModal
        appointment={reviewing}
        onClose={() => setReviewing(null)}
        onDone={() => {
          setReviewing(null);
          reload();
        }}
      />
      <CancelRequestModal
        appointment={requesting}
        onClose={() => setRequesting(null)}
        onDone={() => {
          setRequesting(null);
          reload();
        }}
      />

      <ConfirmDialog
        open={!!cancelling}
        title="Cancel this request?"
        message={
          cancelling
            ? `Your request for ${cancelling.serviceId?.serviceName ?? "this service"} on ${formatAppointmentDate(cancelling.appointmentDate)} at ${cancelling.timeSlot} will be cancelled and the time slot released.`
            : ""
        }
        confirmLabel="Yes, cancel it"
        tone="danger"
        busy={busy}
        onConfirm={cancel}
        onClose={() => setCancelling(null)}
      />
    </>
  );
}

export default function MyAppointmentsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={5} cols={7} />}>
      <MyAppointments />
    </Suspense>
  );
}
