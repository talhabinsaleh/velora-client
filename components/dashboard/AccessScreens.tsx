"use client";

import { Ban, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { signOutEverywhere } from "@/lib/auth-client";
import { LogoMark } from "@/components/Logo";
import { SALON } from "@/lib/constants";

export function AccessDenied({ home }: { home: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose">
        <ShieldAlert className="size-8" />
      </span>
      <p className="mt-6 text-sm font-bold tracking-[0.2em] text-rose uppercase">403 · Access denied</p>
      <h1 className="h-display mt-2 text-4xl">This area isn&apos;t for your account</h1>
      <p className="mt-3 text-muted">
        Each role has its own dashboard. Your account doesn&apos;t have permission to open this page, so nothing here was loaded.
      </p>
      <Link href={home} className="btn btn-dark mt-8">
        Go to my dashboard
      </Link>
    </div>
  );
}

export function BlockedScreen() {
  async function leave() {
    await signOutEverywhere();
    window.location.assign("/");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <LogoMark className="size-14 text-ink" />
      <span className="mt-8 flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose">
        <Ban className="size-8" />
      </span>
      <h1 className="h-display mt-6 text-4xl">Your account is blocked</h1>
      <p className="mt-3 max-w-md text-muted">
        You can&apos;t use bookings or the dashboard right now. If you think this is a mistake, please call us on{" "}
        <a href={SALON.phoneHref} className="font-semibold text-ink underline">
          {SALON.phone}
        </a>
        .
      </p>
      <button type="button" onClick={leave} className="btn btn-dark mt-8">
        Sign out
      </button>
    </div>
  );
}
