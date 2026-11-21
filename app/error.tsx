"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { LogoMark } from "@/components/Logo";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center bg-cream px-6 py-20 text-center">
      <LogoMark className="size-12 text-ink" />
      <h1 className="h-display mt-6 text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">An unexpected error happened while loading this page. Please try again, or head back home.</p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-dark">
          <RotateCcw className="size-4" /> Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
