"use client";

import { ArrowRight, BadgeDollarSign, CalendarCheck2, CalendarClock, CalendarDays, PlusCircle, Scissors, Users } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { DashHeader, StatCard, StatSkeletons } from "@/components/dashboard/ui";
import { EmptyState, ErrorState } from "@/components/States";
import StatusBadge from "@/components/StatusBadge";
import { formatAppointmentDate, formatPrice, timeAgo } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { AdminStats, UserSummary } from "@/lib/types";

export default function AdminOverview() {
  const { data, error, loading, reload } = useApi<AdminStats>("/api/admin/stats");
  const maxDay = Math.max(1, ...(data?.requestsByDay.map((d) => d.count) ?? [1]));
  const maxCat = Math.max(1, ...(data?.byCategory.map((c) => c.count) ?? [1]));

  return (
    <>
      <DashHeader
        title="Salon overview"
        text="Customers, services, appointment requests and payments at a glance."
        actions={
          <>
            <Link href="/dashboard/admin/appointments?status=pending" className="btn btn-outline">
              Review pending
            </Link>
            <Link href="/dashboard/admin/services/new" className="btn btn-dark">
              <PlusCircle className="size-4" /> Add service
            </Link>
          </>
        }
      />

      {loading && !data ? (
        <StatSkeletons count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Registered customers" value={data.totalCustomers} Icon={Users} tone="ink" />
            <StatCard label="Active services" value={data.activeServices} Icon={Scissors} tone="gold" hint="Visible on Browse Services" />
            <StatCard label="Appointment requests" value={data.totalAppointments} Icon={CalendarDays} tone="sky" hint={`${data.cancelled} cancelled`} />
            <StatCard label="Pending" value={data.pending} Icon={CalendarClock} tone="amber" hint="Waiting for your review" />
            <StatCard label="Confirmed" value={data.confirmed} Icon={CalendarCheck2} tone="emerald" />
            <StatCard label="Successful payments" value={data.successfulPayments} Icon={BadgeDollarSign} tone="emerald" hint={`${formatPrice(data.revenue)} collected`} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <section className="card p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl text-ink">Requests, last 14 days</h2>
                <p className="text-xs text-muted">{data.requestsByDay.reduce((s, d) => s + d.count, 0)} total</p>
              </div>
              <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-2" role="img" aria-label="Bar chart of appointment requests per day">
                {data.requestsByDay.map((d) => (
                  <div key={d.date} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-[10px] font-semibold text-ink-3 opacity-0 transition group-hover:opacity-100">{d.count}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-gold-deep to-gold transition-all group-hover:from-ink group-hover:to-ink-3"
                      style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%`, opacity: d.count ? 1 : 0.25 }}
                      title={`${formatAppointmentDate(`${d.date}T00:00:00Z`)}: ${d.count}`}
                    />
                    <span className="text-[10px] text-muted">{Number(d.date.slice(8))}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-5 sm:p-6">
              <h2 className="font-display text-xl text-ink">Requests by category</h2>
              {data.byCategory.length === 0 ? (
                <p className="mt-6 text-sm text-muted">No requests yet.</p>
              ) : (
                <ul className="mt-5 space-y-3.5">
                  {data.byCategory.map((c) => (
                    <li key={c.category}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-ink-3">{c.category}</span>
                        <span className="font-semibold">{c.count}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="card mt-6 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Latest requests</h2>
              <Link href="/dashboard/admin/appointments" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-deep hover:underline">
                Manage all <ArrowRight className="size-4" />
              </Link>
            </div>
            {data.recent.length === 0 ? (
              <div className="mt-5">
                <EmptyState title="No requests yet" message="New appointment requests will appear here." />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {data.recent.map((a) => {
                  const c = typeof a.customerId === "object" ? (a.customerId as UserSummary | null) : null;
                  return (
                    <li key={a._id} className="flex flex-wrap items-center gap-3 py-3.5">
                      <Avatar name={c?.name} image={c?.image} size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          <strong className="text-ink">{c?.name ?? "Deleted user"}</strong>
                          <span className="text-muted"> requested </span>
                          <strong className="text-ink">{a.serviceId?.serviceName ?? "a removed service"}</strong>
                        </p>
                        <p className="text-xs text-muted">
                          {formatAppointmentDate(a.appointmentDate)} · {a.timeSlot} · {timeAgo(a.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </>
  );
}
