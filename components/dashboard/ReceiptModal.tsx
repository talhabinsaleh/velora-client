"use client";

import { Printer } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import Modal from "@/components/Modal";
import { BRAND, SALON } from "@/lib/constants";
import { formatAppointmentDate, formatDateTime, formatPrice } from "@/lib/format";
import type { Transaction } from "@/lib/types";

// A clean receipt for one payment, printable or saveable as PDF from the browser
export default function ReceiptModal({ transaction, customer, onClose }: { transaction: Transaction | null; customer?: { name: string; email: string }; onClose: () => void }) {
  const t = transaction;
  return (
    <Modal
      open={!!t}
      onClose={onClose}
      title="Payment receipt"
      size="md"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-outline">
            Close
          </button>
          <button type="button" onClick={() => window.print()} className="btn btn-dark">
            <Printer className="size-4" /> Print or save as PDF
          </button>
        </>
      }
    >
      {t && (
        <div className="print-area rounded-2xl border border-line bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 text-ink">
              <LogoMark className="size-10" />
              <div>
                <p className="font-display text-xl">{BRAND.name}</p>
                <p className="text-xs text-muted">{SALON.address.join(", ")}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${t.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{t.status}</span>
          </div>
          <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">Billed to</dt>
              <dd className="font-medium text-ink">{customer?.name ?? t.customerId?.name ?? "Customer"}</dd>
              <dd className="text-xs text-muted">{customer?.email ?? t.customerId?.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Paid on</dt>
              <dd className="font-medium text-ink">{formatDateTime(t.createdAt)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">Reference</dt>
              <dd className="font-mono text-xs break-all text-ink-3">{t.stripeSessionId}</dd>
            </div>
          </dl>
          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted uppercase">
                <th className="py-2 font-semibold">Service</th>
                <th className="py-2 font-semibold">Appointment</th>
                <th className="py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="py-3 font-medium text-ink">{t.appointmentId?.serviceId?.serviceName ?? "Salon service"}</td>
                <td className="py-3 text-ink-3">{t.appointmentId ? `${formatAppointmentDate(t.appointmentId.appointmentDate)} · ${t.appointmentId.timeSlot}` : "—"}</td>
                <td className="py-3 text-right font-medium">{formatPrice(t.amount, t.currency)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <p className="text-right">
              <span className="block text-xs text-muted">Total paid ({t.currency.toUpperCase()})</span>
              <span className="font-display text-3xl text-ink">{formatPrice(t.amount, t.currency)}</span>
            </p>
          </div>
          <p className="mt-6 border-t border-line pt-4 text-center text-xs text-muted">
            Paid securely with Stripe · Thank you for visiting {BRAND.name} · {SALON.phone}
          </p>
        </div>
      )}
    </Modal>
  );
}
