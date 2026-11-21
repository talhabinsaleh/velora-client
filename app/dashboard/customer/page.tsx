"use client";

import { ArrowRight, CalendarCheck2, CalendarClock, CalendarDays, CalendarX2, CreditCard, Sparkles, Wallet } from "lucide-react";
import Link from "next/link";
import { ServiceCell } from "@/components/dashboard/AppointmentDetails";
import { DashHeader, StatCard, StatSkeletons } from "@/components/dashboard/ui";
import { EmptyState, ErrorState } from "@/components/States";
import StatusBadge from "@/components/StatusBadge";
import { useSession } from "@/lib/auth-client";
import { formatAppointmentDate, formatPrice } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { CustomerStats } from "@/lib/types";

export default function CustomerOverview() {
  const { data: session } = useSession();
  const { data, error, loading, reload } = useApi<CustomerStats>("/api/appointments/stats");
  const firstName = session?.user.name?.split(" ")[0];

  return (
    <>
      <DashHeader
        title={<>Hello{firstName ? `, ${firstName}` : ""} <span className="font-normal text-gold">✦</span></>}
        text="Here's a quick look at your appointment requests and payments."
        actions={
          <Link href="/services" className="btn btn-gold">
            <Sparkles className="size-4" /> Book a service
          </Link>
        }
      />

      {loading && !data ? (
        <StatSkeletons count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total requests" value={data.total} Icon={CalendarDays} tone="ink" hint="All appointment requests" />
            <StatCard label="Pending" value={data.pending} Icon={CalendarClock} tone="amber" hint="Waiting for the salon" />
            <StatCard label="Confirmed" value={data.confirmed} Icon={CalendarCheck2} tone="emerald" hint="Booked and approved" />
            <StatCard label="Cancelled" value={data.cancelled} Icon={CalendarX2} tone="rose" hint="Cancelled requests" />
          </div>

          {data.awaitingPayment > 0 && (
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold-soft/70 to-sand p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-gold-deep">
                  <CreditCard className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-ink">
                    {data.awaitingPayment} confirmed appointment{data.awaitingPayment > 1 ? "s are" : " is"} waiting for payment
                  </p>
                  <p className="text-sm text-ink-3">Pay securely with Stripe to complete your booking.</p>
                </div>
              </div>
              <Link href="/dashboard/customer/appointments?status=confirmed" className="btn btn-dark btn-sm">
                Pay now <span className="btn-chip"><ArrowRight /></span>
              </Link>
            </div>
          )}

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
            <section className="card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-ink">Upcoming appointments</h2>
                <Link href="/dashboard/customer/appointments" className="text-sm font-semibold text-gold-deep hover:underline">
                  View all
                </Link>
              </div>
              {data.upcoming.length === 0 ? (
                <div className="mt-5">
                  <EmptyState title="Nothing scheduled yet" message="Find a service you love and request a time that suits you." action={{ href: "/services", label: "Browse services" }} />
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-line">
                  {data.upcoming.map((a) => (
                    <li key={a._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <ServiceCell appointment={a} />
                      <div className="text-sm text-ink-3">
                        {formatAppointmentDate(a.appointmentDate)} · {a.timeSlot}
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge status={a.status} />
                        <StatusBadge status={a.paymentStatus} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <aside className="space-y-4">
              <div className="card bg-ink p-6 text-white">
                <Wallet className="size-6 text-gold" />
                <p className="mt-4 text-xs font-semibold tracking-wide text-white/60 uppercase">Total paid</p>
                <p className="mt-1 font-display text-4xl">{formatPrice(data.totalSpent)}</p>
                <Link href="/dashboard/customer/payments" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-soft hover:underline">
                  Payment history <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="card p-6">
                <p className="font-display text-xl text-ink">How payment works</p>
                <ol className="mt-3 space-y-2 text-sm text-ink-3">
                  <li>1. You request an appointment (pending).</li>
                  <li>2. The salon confirms it.</li>
                  <li>3. You pay online with Stripe.</li>
                </ol>
              </div>
            </aside>
          </div>
        </>
      ) : null}
    </>
  );
}
