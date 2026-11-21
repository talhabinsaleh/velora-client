import { Compass } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream px-6 text-center">
      <div aria-hidden className="absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-gold-soft/60 blur-3xl" />
      <div className="relative">
        <Link href="/" aria-label="Velora home" className="inline-block text-ink">
          <LogoMark className="size-14" />
        </Link>
        <p className="mt-8 font-display text-[7rem] leading-none font-medium text-ink sm:text-[9rem]">
          4<span className="text-gold italic">0</span>4
        </p>
        <h1 className="h-display mt-2 text-3xl">This page took the day off</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to something beautiful.</p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/" className="btn btn-dark">
            Back to home
          </Link>
          <Link href="/services" className="btn btn-outline">
            <Compass className="size-4" /> Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
