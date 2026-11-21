import { CircleSlash } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-x py-16 sm:py-24">
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-12">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/60">
          <CircleSlash className="size-10" />
        </span>
        <p className="mt-6 text-sm font-bold tracking-[0.2em] text-amber-700 uppercase">Payment cancelled</p>
        <h1 className="h-display mt-2 text-4xl">No payment was taken</h1>
        <p className="mt-3 text-muted">
          You left Stripe checkout before paying, so you haven&apos;t been charged. Your appointment is still confirmed and waiting for payment, you can
          try again any time from your dashboard.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/dashboard/customer/appointments?status=confirmed" className="btn btn-dark">
            Try paying again
          </Link>
          <Link href="/services" className="btn btn-outline">
            Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
