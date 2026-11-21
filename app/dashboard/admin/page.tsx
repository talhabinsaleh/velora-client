"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  PlusCircle,
  Scissors,
  Undo2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { AreaChart, ColumnChart, type Point } from "@/components/dashboard/charts";
import { DashHeader, FilterTabs, StatCard, StatSkeletons } from "@/components/dashboard/ui";
import { EmptyState, ErrorState } from "@/components/States";
import { Stars } from "@/components/Stars";
import StatusBadge from "@/components/StatusBadge";
import { formatPrice, timeAgo, formatAppointmentDate } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { AdminStats, UserSummary } from "@/lib/types";

type Range = "7" | "30" | "90" | "365";
const RANGES: { value: Range; label: string }[] = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "12 months" },
];

function label(key: string, monthly: boolean) {
  const d = new Date(`${monthly ? `${key}-01` : key}T00:00:00Z`);
  return monthly
    ? d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {Math.abs(value)}%
    </span>
  );
}

const money = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : formatPrice(v));

export default function AdminOverview() {
  const [range, setRange] = useState<Range>("30");
  const { data, error, loading, reload } = useApi<AdminStats>(`/api/admin/stats?days=${range}`);
  const monthly = data?.range.monthly ?? false;
  const revenueSeries: Point[] = (data?.series ?? []).map((s) => ({ key: s.key, label: label(s.key, monthly), value: s.revenue }));
  const bookingSeries: Point[] = (data?.series ?? []).map((s) => ({ key: s.key, label: label(s.key, monthly), value: s.bookings }));
  const maxCat = Math.max(1, ...(data?.byCategory.map((c) => c.count) ?? [1]));
  const rangeLabel = RANGES.find((r) => r.value === range)?.label.replace("12 months", "12 months") ?? "";

  return (
    <>
      <DashHeader
        title="Salon overview"
        text="Customers, services, appointment requests, earnings and feedback at a glance."
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
          {/* The six figures the brief asks for */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Registered customers" value={data.totalCustomers} Icon={Users} tone="ink" hint={`+${data.range.newCustomers} in the last ${rangeLabel}`} />
            <StatCard label="Active services" value={data.activeServices} Icon={Scissors} tone="gold" hint="Visible on Browse Services" />
            <StatCard label="Appointment requests" value={data.totalAppointments} Icon={CalendarDays} tone="sky" hint={`${data.cancelled} cancelled`} />
            <StatCard label="Pending" value={data.pending} Icon={CalendarClock} tone="amber" hint="Waiting for your review" />
            <StatCard label="Confirmed" value={data.confirmed} Icon={CalendarCheck2} tone="emerald" />
            <StatCard label="Successful payments" value={data.successfulPayments} Icon={BadgeDollarSign} tone="emerald" hint={`${formatPrice(data.revenue)} collected in total`} />
          </div>

          {data.openCancelRequests > 0 && (
            <Link
              href="/dashboard/admin/appointments?request=open"
              className="group mt-6 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 transition hover:shadow-soft"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-white text-amber-700">
                <Undo2 className="size-5" />
              </span>
              <p className="flex-1 text-sm">
                <strong className="text-ink">
                  {data.openCancelRequests} cancellation request{data.openCancelRequests > 1 ? "s" : ""}
                </strong>{" "}
                <span className="text-ink-3">waiting for your decision</span>
              </p>
              <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1" />
            </Link>
          )}

          {/* Earnings and bookings by date */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl text-ink">Performance</h2>
            <FilterTabs<Range> value={range} options={RANGES} onChange={setRange} />
          </div>
          <div className={`mt-4 grid gap-6 xl:grid-cols-[1.5fr_1fr] ${loading ? "opacity-60 transition-opacity" : ""}`}>
            <section className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase">Earnings · last {rangeLabel}</p>
                  <p className="mt-1 flex items-center gap-3 font-display text-4xl text-ink">
                    {formatPrice(data.range.revenue)} <Delta value={data.range.revenueChange} />
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {data.range.payments} verified Stripe payment{data.range.payments === 1 ? "" : "s"} · vs the previous {rangeLabel}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <AreaChart data={revenueSeries} format={money} valueLabel="Earnings" />
              </div>
            </section>
            <section className="card p-5 sm:p-6">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Appointment requests · last {rangeLabel}</p>
              <p className="mt-1 flex items-center gap-3 font-display text-4xl text-ink">
                {data.range.bookings} <Delta value={data.range.bookingsChange} />
              </p>
              <p className="mt-1 text-xs text-muted">New requests by the day they were made</p>
              <div className="mt-4">
                <ColumnChart data={bookingSeries} valueLabel="Requests" />
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Top services */}
            <section className="card p-5 sm:p-6 xl:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-ink">Top services · last {rangeLabel}</h2>
                <Link href="/dashboard/admin/services" className="text-sm font-semibold text-gold-deep hover:underline">
                  All services
                </Link>
              </div>
              {data.topServices.length === 0 ? (
                <p className="mt-6 text-sm text-muted">No bookings in this period yet.</p>
              ) : (
                <table className="mt-4 w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[11px] tracking-wider text-muted uppercase">
                      <th className="py-2 font-semibold">Service</th>
                      <th className="py-2 text-right font-semibold">Bookings</th>
                      <th className="py-2 text-right font-semibold">Paid revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topServices.map((s, i) => (
                      <tr key={String(s._id)} className="border-b border-line/60 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="w-4 font-display text-muted">{i + 1}</span>
                            <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sand">
                              <Image src={s.image} alt="" fill sizes="40px" className="object-cover" />
                            </span>
                            <span>
                              <span className="block font-semibold text-ink">{s.name}</span>
                              <span className="text-xs text-muted">{s.category}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-right font-semibold">{s.bookings}</td>
                        <td className="py-3 text-right">{formatPrice(s.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Rating */}
            <section className="card flex flex-col p-5 sm:p-6">
              <h2 className="font-display text-xl text-ink">Guest rating</h2>
              {data.rating.count === 0 ? (
                <p className="mt-4 text-sm text-muted">No reviews yet. Customers can rate a visit after paying.</p>
              ) : (
                <>
                  <p className="mt-4 font-display text-5xl text-ink">{data.rating.average.toFixed(1)}</p>
                  <Stars value={data.rating.average} className="mt-2" />
                  <p className="mt-2 text-sm text-muted">
                    from {data.rating.count} review{data.rating.count === 1 ? "" : "s"}
                  </p>
                </>
              )}
              <p className="mt-auto pt-4 text-xs text-muted">Reviews come only from customers who paid for their visit.</p>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Today */}
            <section className="card p-5 sm:p-6">
              <h2 className="font-display text-xl text-ink">Today&apos;s schedule</h2>
              {data.today.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No appointments booked for today.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.today.map((a) => {
                    const c = typeof a.customerId === "object" ? (a.customerId as UserSummary | null) : null;
                    return (
                      <li key={a._id} className="flex items-center gap-3 rounded-xl bg-sand/50 p-3">
                        <span className="w-16 shrink-0 font-display text-sm text-ink">{a.timeSlot}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{a.serviceId?.serviceName}</span>
                          <span className="block truncate text-xs text-muted">{c?.name}</span>
                        </span>
                        <StatusBadge status={a.status} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Categories */}
            <section className="card p-5 sm:p-6">
              <h2 className="font-display text-xl text-ink">Requests by category</h2>
              {data.byCategory.length === 0 ? (
                <p className="mt-6 text-sm text-muted">No requests in this period.</p>
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

            {/* Latest */}
            <section className="card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-ink">Latest requests</h2>
                <Link href="/dashboard/admin/appointments" className="text-sm font-semibold text-gold-deep hover:underline">
                  Manage all
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
                      <li key={a._id} className="flex items-center gap-3 py-3">
                        <Avatar name={c?.name} image={c?.image} size={34} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">
                            <strong className="text-ink">{c?.name ?? "Deleted user"}</strong>
                          </p>
                          <p className="truncate text-xs text-muted">
                            {a.serviceId?.serviceName ?? "Removed service"} · {formatAppointmentDate(a.appointmentDate)} · {timeAgo(a.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={a.status} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </>
      ) : null}
    </>
  );
}
