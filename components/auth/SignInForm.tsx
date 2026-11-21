"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { landingFor, safeRedirect } from "@/lib/return-path";
import { emailProblem } from "@/lib/validation";
import GoogleButton, { Divider } from "./GoogleButton";
import PasswordInput from "./PasswordInput";

const OAUTH_ERRORS: Record<string, string> = {
  google: "Google sign-in didn't finish. Please try again.",
  account_not_linked: "This email already has an account. Sign in with your password first.",
  blocked: "Your account has been blocked. Please contact the salon for help.",
  unable_to_create_session: "We couldn't sign you in. If your account has been blocked, please contact the salon.",
};

export async function finishSignIn(redirect: string | null) {
  // Issue the API token now, then do a full page load so every page sees the new session
  const res = await fetch("/api/session-token", { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? "Could not start your session. Please try again.");
  window.location.assign(landingFor(data.role, redirect));
}

export default function SignInForm() {
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  // An error passed back in the URL (for example from Google) is shown until the form is used
  const code = params.get("error");
  const urlError = code ? (OAUTH_ERRORS[code] ?? (code.toLowerCase().includes("block") ? OAUTH_ERRORS.blocked : OAUTH_ERRORS.google)) : null;
  const formError = errors.form ?? (Object.keys(errors).length === 0 ? urlError : null);

  useEffect(() => {
    if (urlError) toast.error(urlError, { id: "signin-error" });
    else if (redirect) toast.info("Please sign in to continue.", { id: "signin-needed" });
  }, [urlError, redirect]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next = {
      email: emailProblem(email) ?? undefined,
      password: password ? undefined : "Please enter your password.",
    };
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    const { error } = await signIn.email({ email: email.trim(), password });
    if (error) {
      const msg =
        error.status === 403
          ? (error.message ?? OAUTH_ERRORS.blocked)
          : error.code === "INVALID_EMAIL_OR_PASSWORD"
            ? "Incorrect email or password. Please try again."
            : (error.message ?? "Sign in failed. Please try again.");
      setErrors({ form: msg });
      toast.error(msg);
      setLoading(false);
      return;
    }
    try {
      toast.success("Welcome back!");
      await finishSignIn(redirect);
    } catch (err) {
      toast.error((err as Error).message);
      setErrors({ form: (err as Error).message });
      setLoading(false);
    }
  }

  return (
    <>
      <GoogleButton redirect={redirect} />
      <Divider />
      <form onSubmit={submit} noValidate className="space-y-5">
        {formError && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {formError}
          </p>
        )}
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email || undefined}
            placeholder="you@example.com"
            className="input h-12"
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password || undefined}
            placeholder="Your password"
            className="h-12"
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn btn-dark btn-lg w-full">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Signing in…" : "Sign In"}
          {!loading && <span className="btn-chip"><ArrowRight /></span>}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        New to Velora?{" "}
        <Link href={`/sign-up${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-semibold text-gold-deep hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
