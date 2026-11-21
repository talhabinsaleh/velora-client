"use client";

import { CalendarDays, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import ImageUploader from "@/components/ImageUploader";
import { ErrorState, Spinner } from "@/components/States";
import { api, errorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import { DashHeader } from "./ui";

interface Profile {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  role: "customer" | "admin";
  createdAt: string;
}

export default function ProfileForm() {
  const { data, error, loading, reload, setData } = useApi<Profile>("/api/profile");

  if (loading && !data) return <Spinner label="Loading your profile…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;
  return <Editor key={data._id} profile={data} onSaved={setData} />;
}

function Editor({ profile, onSaved }: { profile: Profile; onSaved: (p: Profile) => void }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [image, setImage] = useState(profile.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const dirty = name !== profile.name || phone !== (profile.phone ?? "") || image !== (profile.image ?? "");

  async function save(e: FormEvent) {
    e.preventDefault();
    const next = {
      name: name.trim().length < 2 ? "Name must be at least 2 characters." : undefined,
      phone: phone.trim() && !/^\+?[0-9\s-]{7,20}$/.test(phone.trim()) ? "Use digits, spaces or dashes, e.g. +880 1711-000000." : undefined,
    };
    setErrors(next);
    if (next.name || next.phone) return;

    setSaving(true);
    try {
      const res = await api<{ message: string; user: Profile }>("/api/profile", {
        method: "PATCH",
        body: { name: name.trim(), phone: phone.trim(), image: image || "" },
      });
      onSaved(res.user);
      toast.success(res.message);
      // Refresh the signed-in session so the navbar and sidebar show the new name and photo
      await authClient.getSession({ query: { disableCookieCache: true } });
      authClient.$store.notify("$sessionSignal");
    } catch (err) {
      toast.error(errorMessage(err, "Could not update your profile."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DashHeader title="My Profile" text="Update how you appear at Velora. Your email and account type are managed by the salon." />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="card h-fit overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-ink via-ink-2 to-gold-deep" />
          <div className="-mt-12 px-6 pb-6 text-center">
            <Avatar name={name} image={image} size={96} className="mx-auto ring-4" />
            <p className="mt-3 font-display text-2xl text-ink">{name || profile.name}</p>
            <p className="text-sm text-muted">{profile.email}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold tracking-wider text-gold-deep uppercase">
              <ShieldCheck className="size-3.5" /> {profile.role}
            </span>
            <div className="mt-5 space-y-2 border-t border-line pt-5 text-left text-sm text-ink-3">
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-gold" /> {profile.email}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-gold" /> Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </aside>

        <form onSubmit={save} noValidate className="card space-y-6 p-6 sm:p-8">
          <div>
            <span className="label">Profile photo</span>
            <ImageUploader value={image} onChange={setImage} onUploadingChange={setUploading} mode="both" shape="round" label="Upload photo" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name || undefined} className="input" />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="label">
                Phone number <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={!!errors.phone || undefined}
                placeholder="+880 1711-000000"
                className="input"
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="label flex items-center gap-1.5">
                Email <Lock className="size-3.5 text-muted" />
              </span>
              <input value={profile.email} disabled className="input" aria-label="Email (cannot be changed)" />
            </div>
            <div>
              <span className="label flex items-center gap-1.5">
                Account type <Lock className="size-3.5 text-muted" />
              </span>
              <input value={profile.role === "admin" ? "Admin" : "Customer"} disabled className="input" aria-label="Account type (cannot be changed)" />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-line pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => {
                setName(profile.name);
                setPhone(profile.phone ?? "");
                setImage(profile.image ?? "");
                setErrors({});
              }}
              className="btn btn-outline"
            >
              Discard changes
            </button>
            <button type="submit" disabled={!dirty || saving || uploading} className="btn btn-dark">
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
