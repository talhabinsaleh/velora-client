"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { LogoMark } from "@/components/Logo";
import { landingFor } from "@/lib/return-path";

// Google sends people back here. Issue the API token, then go to the right dashboard.
function Continue() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/session-token", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok) {
        toast.error(data?.message ?? "Google sign-in didn't finish. Please try again.");
        router.replace(res.status === 403 ? "/sign-in?error=blocked" : "/sign-in?error=google");
        return;
      }
      toast.success(params.get("welcome") ? "Welcome to Velora! Your account is ready." : "Welcome back!");
      window.location.replace(landingFor(data.role, params.get("redirect")));
    })();
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return null;
}

export default function ContinuePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream text-ink">
      <LogoMark className="size-14 text-ink" />
      <p className="flex items-center gap-2 text-sm font-medium text-muted">
        <Loader2 className="size-4 animate-spin text-gold" /> Signing you in…
      </p>
      <Suspense>
        <Continue />
      </Suspense>
    </div>
  );
}
