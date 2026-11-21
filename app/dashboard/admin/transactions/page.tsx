"use client";

import { BadgeDollarSign, Copy, Lock, ReceiptText, Search, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import { DashHeader, FilterTabs, StatCard, TableSkeleton } from "@/components/dashboard/ui";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState } from "@/components/States";
import StatusBadge from "@/components/StatusBadge";
import { formatAppointmentDate, formatDateTime, formatPrice, shortId } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Paged, Transaction } from "@/lib/types";

type Filter = "all" | "paid" | "failed";
type Result = Paged<Transaction> & { summary: Partial<Record<"paid" | "failed", { amount: number; count: number }>> };

export default function TransactionsPage() {
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

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
  const { data, error, loading, reload } = useApi<Result>(`/api/admin/transactions?${query}`);

  async function copy(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Stripe session ID copied.");
    } catch {
      toast.error("Couldn't copy. Select the ID manually.");
    }
  }

  return (
    <>
      <DashHeader title="Transactions" text="Stripe payments recorded by the verified webhook." />

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm text-ink-3">
        <Lock className="mt-0.5 size-4 shrink-0 text-gold" />
        <p>
          Payment records are read-only. They are created only when Stripe sends a signed webhook, so nobody (admins included) can mark an unsuccessful payment as paid.
        </p>
      </div>

      {data && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Collected" value={formatPrice(data.summary.paid?.amount ?? 0)} Icon={BadgeDollarSign} tone="emerald" />
          <StatCard label="Successful payments" value={data.summary.paid?.count ?? 0} Icon={ReceiptText} tone="gold" />
          <StatCard label="Failed / expired" value={data.summary.failed?.count ?? 0} Icon={XCircle} tone="rose" />
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterTabs<Filter>
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "paid", label: "Paid" },
            { value: "failed", label: "Failed" },
          ]}
        />
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search customer, email or Stripe session ID…" aria-label="Search transactions" className="input pl-10" />
        </div>
      </div>

      {loading && !data ? (
        <TableSkeleton rows={6} cols={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.items.length === 0 ? (
        <EmptyState icon={<ReceiptText className="size-6" />} title="No transactions yet" message="Payments appear here after customers pay for confirmed appointments." />
      ) : data ? (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="table-wrap">
            <table className="table min-w-[1080px]">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Appointment date</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Stripe session</th>
                  <th>Status</th>
                  <th>Transaction date</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((t) => {
                  const s = t.appointmentId?.serviceId;
                  return (
                    <tr key={t._id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={t.customerId?.name} image={t.customerId?.image} size={34} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{t.customerId?.name ?? "Deleted user"}</p>
                            <p className="truncate text-xs text-muted">{t.customerId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-sand">{s?.image && <Image src={s.image} alt="" fill sizes="36px" className="object-cover" />}</div>
                          <span className="font-medium">{s?.serviceName ?? "Service removed"}</span>
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
                      <td className="font-semibold whitespace-nowrap">{formatPrice(t.amount, t.currency)}</td>
                      <td className="text-xs font-semibold text-muted uppercase">{t.currency}</td>
                      <td>
                        <button type="button" onClick={() => copy(t.stripeSessionId)} title={t.stripeSessionId} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-sand px-2 py-1 font-mono text-xs text-ink-3 hover:bg-sand-2">
                          {shortId(t.stripeSessionId, 10)} <Copy className="size-3.5" />
                        </button>
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="text-xs whitespace-nowrap text-muted">{formatDateTime(t.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Pagination page={data.page} pages={data.pages} total={data.total} label="transactions" onChange={setPage} />
          </div>
        </div>
      ) : null}
    </>
  );
}
