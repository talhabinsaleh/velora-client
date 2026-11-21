"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { api, errorMessage } from "@/lib/api";
import { CATEGORY_NAMES } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Service, ServiceStatus } from "@/lib/types";
import { DashHeader } from "./ui";

type Errors = Partial<Record<"serviceName" | "category" | "description" | "price" | "duration" | "image", string>>;

export default function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const editing = !!service;
  const [serviceName, setServiceName] = useState(service?.serviceName ?? "");
  const [category, setCategory] = useState(service?.category ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service ? String(service.price) : "");
  const [duration, setDuration] = useState(service ? String(service.duration) : "");
  const [image, setImage] = useState(service?.image ?? "");
  const [status, setStatus] = useState<ServiceStatus>(service?.status ?? "active");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const p = Number(price);
    const d = Number(duration);
    return {
      serviceName: serviceName.trim().length < 3 ? "Service name must be at least 3 characters." : undefined,
      category: CATEGORY_NAMES.includes(category) ? undefined : "Please choose a category.",
      description: description.trim().length < 20 ? "Description must be at least 20 characters." : undefined,
      price: !price || !Number.isFinite(p) || p <= 0 ? "Price must be a positive number." : undefined,
      duration: !duration || !Number.isInteger(d) || d <= 0 ? "Duration must be a positive whole number of minutes." : undefined,
      image: image ? undefined : "Please upload a service image.",
    };
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (uploading) return;

    setSaving(true);
    const body = {
      serviceName: serviceName.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      duration: Number(duration),
      image,
      status,
    };
    try {
      const res = await api<{ message: string }>(editing ? `/api/admin/services/${service._id}` : "/api/admin/services", {
        method: editing ? "PATCH" : "POST",
        body,
      });
      toast.success(res.message);
      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (err) {
      toast.error(errorMessage(err, "Could not save the service."));
      setSaving(false);
    }
  }

  return (
    <>
      <DashHeader
        title={editing ? "Update service" : "Add a new service"}
        text={editing ? "Changes appear on the public site straight away." : "New services are active by default and appear on Browse Services."}
        actions={
          <Link href="/dashboard/admin/services" className="btn btn-outline">
            <ArrowLeft className="size-4" /> Back to services
          </Link>
        }
      />

      <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="card space-y-6 p-6 sm:p-8">
          <div>
            <label htmlFor="serviceName" className="label">
              Service name
            </label>
            <input
              id="serviceName"
              value={serviceName}
              maxLength={80}
              onChange={(e) => setServiceName(e.target.value)}
              aria-invalid={!!errors.serviceName || undefined}
              placeholder="e.g. Hydra Glow Facial"
              className="input"
            />
            {errors.serviceName && <p className="field-error">{errors.serviceName}</p>}
          </div>

          <div>
            <label htmlFor="category" className="label">
              Service category
            </label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} aria-invalid={!!errors.category || undefined} className="input">
              <option value="" disabled>
                Choose a category
              </option>
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="field-error">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="description" className="label flex justify-between">
              Description <span className="text-xs font-normal text-muted">{description.length}/2000</span>
            </label>
            <textarea
              id="description"
              value={description}
              maxLength={2000}
              rows={6}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description || undefined}
              placeholder="What's included, who it's for and how customers will feel afterwards."
              className="input"
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="label">
                Price (USD)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">$</span>
                <input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  aria-invalid={!!errors.price || undefined}
                  placeholder="45"
                  className="input pl-7"
                />
              </div>
              {errors.price && <p className="field-error">{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="duration" className="label">
                Estimated duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                aria-invalid={!!errors.duration || undefined}
                placeholder="60"
                className="input"
              />
              {errors.duration && <p className="field-error">{errors.duration}</p>}
            </div>
          </div>

          <fieldset>
            <legend className="label">Service status</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["active", "inactive"] as const).map((s) => (
                <label
                  key={s}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${status === s ? "border-ink bg-sand/50" : "border-line hover:border-ink/30"}`}
                >
                  <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="mt-1 accent-[#1f1915]" />
                  <span>
                    <span className="block font-semibold capitalize">{s}</span>
                    <span className="text-xs text-muted">{s === "active" ? "Shown to customers and bookable" : "Hidden from customers, can't be booked"}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <span className="label">Service image</span>
            <ImageUploader value={image} onChange={setImage} onUploadingChange={setUploading} mode="upload" invalid={!!errors.image} />
            {errors.image && <p className="field-error">{errors.image}</p>}
            <p className="mt-3 text-xs text-muted">Images are uploaded to ImgBB. A wide 4:3 photo looks best on cards.</p>
          </div>

          <div className="card p-6">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Preview</p>
            <p className="mt-2 font-display text-xl text-ink">{serviceName || "Service name"}</p>
            <p className="text-sm text-muted">{category || "Category"}</p>
            <div className="mt-3 flex gap-4 text-sm font-semibold">
              <span>{Number(price) > 0 ? formatPrice(Number(price)) : "$—"}</span>
              <span className="text-muted">{Number(duration) > 0 ? formatDuration(Number(duration)) : "— min"}</span>
            </div>
          </div>

          <button type="submit" disabled={saving || uploading} className="btn btn-gold btn-lg w-full">
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving ? "Saving…" : editing ? "Save changes" : "Add service"}
          </button>
        </div>
      </form>
    </>
  );
}
