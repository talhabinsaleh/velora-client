"use client";

import { CalendarDays, CheckCircle2, Clock3, Loader2, ReceiptText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { formatAppointmentDate, formatPrice, shortId } from "@/lib/format";
import type { Appointment, Transaction } from "@/lib/types";

interface SessionStatus {
  stripeStatus: "paid" | "unpaid" | "no_payment_required";
  recorded: boolean;
  amount: number;
  currency: string;
  transaction: Transaction | null;
  appointment: Appointment | null;
}

// Stripe sends the customer here right after paying. The page only reads: the appointment is
// marked as paid by the verified webhook, so we wait (briefly) until that record exists.
function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [error, setError] = useState<string | null>(sessionId ? null : "This page needs a payment session. Open it from Stripe checkout.");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let stop = false;
    let tries = 0;
    async function poll() {
      try {
        const data = await api<SessionStatus>(`/api/payments/session/${encodeURIComponent(sessionId!)}`);
        if (stop) return;
        setStatus(data);
        if (data.recorded) return;
        if (++tries >= 15) {
          setTimedOut(true);
          return;
        }
        setTimeout(poll, 2000);
      } catch (err) {
        if (!stop) setError(errorMessage(err, "We couldn't check this payment."));
      }
    }
    poll();
    return () => {
      stop = true;
    };
  }, [sessionId]);

  if (error) {
    return (
      <Card>
        <h1 className="h-display text-3xl">We couldn&apos;t find this payment</h1>
        <p className="mt-2 text-muted">{error}</p>
        <Link href="/dashboard/customer/appointments" className="btn btn-dark mt-6">
          Go to my appointments
        </Link>
      </Card>
    );
  }

  if (!status || (!status.recorded && !timedOut)) {
    return (
      <Card>
        <Loader2 className="mx-auto size-10 animate-spin text-gold" />
        <h1 className="h-display mt-5 text-3xl">Confirming your payment…</h1>
        <p className="mt-2 text-muted">We&apos;re waiting for Stripe&apos;s secure confirmation. This usually takes a few seconds, please keep this page open.</p>
      </Card>
    );
  }

  if (!status.recorded) {
    return (
      <Card>
        <Clock3 className="mx-auto size-10 text-gold" />
        <h1 className="h-display mt-5 text-3xl">{status.stripeStatus === "paid" ? "Payment received" : "Payment is processing"}</h1>
        <p className="mt-2 text-muted">
          {status.stripeStatus === "paid"
            ? "Stripe has your payment. Your appointment will show as paid as soon as Stripe's confirmation reaches us, usually within a minute."
            : "Stripe hasn't confirmed this payment yet. You'll see the update in your dashboard once it's complete."}
        </p>
        <Link href="/dashboard/customer/appointments" className="btn btn-dark mt-6">
          Go to my appointments
        </Link>
      </Card>
    );
  }

  const a = status.appointment;
  return (
    <Card>
      <span className="mx-auto flex size-20 animate-fade-up items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
        <CheckCircle2 className="size-10" />
      </span>
      <p className="mt-6 text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase">Payment successful</p>
      <h1 className="h-display mt-2 text-4xl">You&apos;re all set!</h1>
      <p className="mt-2 text-muted">Thank you. Your payment was verified by Stripe and your appointment is fully booked.</p>

      {a && (
        <div className="mt-8 rounded-2xl border border-line bg-cream p-5 text-left">
          <div className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">{a.serviceId?.image && <Image src={a.serviceId.image} alt="" fill sizes="64px" className="object-cover" />}</div>
            <div>
              <p className="font-display text-xl text-ink">{a.serviceId?.serviceName ?? "Salon appointment"}</p>
              <p className="text-sm text-muted">{a.serviceId?.category}</p>
            </div>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-gold" />
              <dt className="sr-only">Date</dt>
              <dd>{formatAppointmentDate(a.appointmentDate, "long")}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-gold" />
              <dt className="sr-only">Time</dt>
              <dd>{a.timeSlot}</dd>
            </div>
            <div className="flex items-center gap-2">
              <ReceiptText className="size-4 text-gold" />
              <dt className="sr-only">Amount</dt>
              <dd className="font-semibold">
                {formatPrice(status.amount, status.currency)} <span className="font-normal text-muted uppercase">{status.currency}</span>
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold" />
              <dt className="sr-only">Reference</dt>
              <dd className="font-mono text-xs text-muted">{status.transaction ? shortId(status.transaction.stripeSessionId, 10) : ""}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href="/dashboard/customer/appointments" className="btn btn-dark">
          View my appointments
        </Link>
        <Link href="/dashboard/customer/payments" className="btn btn-outline">
          Payment history
        </Link>
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x py-16 sm:py-24">
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-12">{children}</div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Card><Loader2 className="mx-auto size-10 animate-spin text-gold" /></Card>}>
      <PaymentSuccess />
    </Suspense>
  );
}
