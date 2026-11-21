"use client";

import { FileText, ReceiptText } from "lucide-react";
import ReceiptModal from "@/components/dashboard/ReceiptModal";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";
import { DashHeader, TableSkeleton } from "@/components/dashboard/ui";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState } from "@/components/States";
import StatusBadge from "@/components/StatusBadge";
import { formatAppointmentDate, formatDateTime, formatPrice, shortId } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Paged, Transaction } from "@/lib/types";

export default function PaymentHistoryPage() {
  const [page, setPage] = useState(1);
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const { data: session } = useSession();
  const { data, error, loading, reload } = useApi<Paged<Transaction>>(`/api/payments/history?page=${page}&limit=10`);

  return (
    <>
      <DashHeader title="Payment History" text="Every Stripe payment linked to your appointments, recorded after Stripe verified it." />

      {loading && !data ? (
        <TableSkeleton rows={4} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.items.length === 0 ? (
        <EmptyState icon={<ReceiptText className="size-6" />} title="No payments yet" message="Once you pay for a confirmed appointment, the receipt appears here." action={{ href: "/dashboard/customer/appointments", label: "My appointments" }} />
      ) : data ? (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Appointment</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Paid on</th>
                  <th className="text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((t) => {
                  const s = t.appointmentId?.serviceId;
                  return (
                    <tr key={t._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sand">{s?.image && <Image src={s.image} alt="" fill sizes="40px" className="object-cover" />}</div>
                          <div>
                            <p className="font-semibold">{s?.serviceName ?? "Service removed"}</p>
                            <p className="text-xs text-muted">{s?.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">
                        {t.appointmentId ? (
                          <>
                            {formatAppointmentDate(t.appointmentId.appointmentDate)}
                            <span className="block text-xs text-muted">{t.appointmentId.timeSlot}</span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="font-semibold whitespace-nowrap">
                        {formatPrice(t.amount, t.currency)} <span className="text-xs font-normal text-muted uppercase">{t.currency}</span>
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="font-mono text-xs text-muted" title={t.stripeSessionId}>
                        {shortId(t.stripeSessionId, 8)}
                      </td>
                      <td className="text-xs whitespace-nowrap text-muted">{formatDateTime(t.createdAt)}</td>
                      <td className="text-right">
                        <button type="button" onClick={() => setReceipt(t)} className="btn btn-ghost btn-sm px-3">
                          <FileText className="size-4" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Pagination page={data.page} pages={data.pages} total={data.total} label="payments" onChange={setPage} />
          </div>
        </>
      ) : null}
      <ReceiptModal
        transaction={receipt}
        customer={session?.user ? { name: session.user.name, email: session.user.email } : undefined}
        onClose={() => setReceipt(null)}
      />
    </>
  );
}
