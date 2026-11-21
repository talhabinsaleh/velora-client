"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { signOutEverywhere, signUp } from "@/lib/auth-client";
import { hardNavigate } from "@/lib/navigation";
import { safeRedirect } from "@/lib/return-path";
import { emailProblem, passwordProblem, PASSWORD_RULES } from "@/lib/validation";
import GoogleButton, { Divider } from "./GoogleButton";
import PasswordInput from "./PasswordInput";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
}

export default function SignUpForm() {
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {
      name: name.trim().length < 2 ? "Please enter your full name." : undefined,
      email: emailProblem(email) ?? undefined,
      password: passwordProblem(password) ?? undefined,
    };
    setErrors(next);
    if (next.name || next.email || next.password) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (uploading) {
      toast.info("Please wait for the photo to finish uploading.");
      return;
    }

    setLoading(true);
    const { error } = await signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: image || undefined,
    });
    if (error) {
      const msg =
        error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
          ? "An account with this email already exists. Please sign in instead."
          : (error.message ?? "Registration failed. Please try again.");
      setErrors({ form: msg });
      toast.error(msg);
      setLoading(false);
      return;
    }
    // The account is created, but you sign in yourself afterwards (Better Auth opens a session on
    // sign-up, so end it). Sign In opens with your email filled in and a confirmation message.
    await signOutEverywhere();
    toast.success("Account created! Please sign in to continue.");
    const params2 = new URLSearchParams({ registered: "1", email: email.trim() });
    if (redirect) params2.set("redirect", redirect);
    hardNavigate(`/sign-in?${params2}`);
  }

  return (
    <>
      <GoogleButton redirect={redirect} label="Sign up with Google" />
      <Divider />
      <form onSubmit={submit} noValidate className="space-y-5">
        {errors.form && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {errors.form}{" "}
            {errors.form.includes("already exists") && (
              <Link href="/sign-in" className="font-semibold underline">
                Sign in
              </Link>
            )}
          </p>
        )}

        <div>
          <span className="label">
            Profile photo <span className="font-normal text-muted">(optional)</span>
          </span>
          <ImageUploader value={image} onChange={setImage} onUploadingChange={setUploading} mode="both" shape="round" label="Upload photo" />
        </div>

        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name || undefined}
            placeholder="e.g. Nadia Rahman"
            className="input h-12"
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password || undefined}
            aria-describedby="password-rules"
            placeholder="Create a password"
            className="h-12"
          />
          <ul id="password-rules" className="mt-2.5 grid gap-1.5 sm:grid-cols-3">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(password);
              return (
                <li key={rule.id} className={`flex items-center gap-1.5 text-xs font-medium transition ${ok ? "text-emerald-700" : "text-muted"}`}>
                  <span className={`flex size-4 items-center justify-center rounded-full ${ok ? "bg-emerald-600 text-white" : "bg-sand-2"}`}>
                    {ok && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading || uploading} className="btn btn-dark btn-lg w-full">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Creating your account…" : "Create account"}
          {!loading && <span className="btn-chip"><ArrowRight /></span>}
        </button>
        <p className="text-center text-xs leading-relaxed text-muted">New accounts are customer accounts. Salon staff access is set up by the salon.</p>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/sign-in${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-semibold text-gold-deep hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
